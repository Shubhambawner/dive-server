let url_prod = "https://dive-server.shubhambawner.repl.co/"
let url_dev = "http://localhost:3000/"
let token = localStorage.getItem(`authentication`)

const tableBody = document.querySelector("#dataTable tbody");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const logoutButton = document.querySelector("#logout");
let currentPage = 1;
let totalPages = 0;


let verifyProfile = () => {

  if (!token) {
    window.location.pathname = `/pages/login`
  }

  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token)

  var formdata = new FormData();

  var requestOptions = {
    method: `GET`,
    headers: myHeaders,
    // body: formdata, //! GET can not have body !!
    redirect: `manual`
  };


  fetch(url_dev + `profile`, requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result)
      if (result.role != `admin`) {
        alert(`this page is only for admins`)
        window.location.pathname = `/pages/`
      } else {
        console.log(`welcome admin`);
        localStorage.setItem(`profile`, JSON.stringify(result))
      }
    })
    .catch(error => {
      console.log(`error`, error)
      alert(`unexpected error while fetching`)

      window.location.pathname = `/pages/`

    });
}

let logout = () => {
  localStorage.clear()
  window.location.reload()
}

logoutButton.onclick = logout


const activateVisitor = (user) => {
  updateRole(user, 'user', (result) => {
    console.log(result);
    window.location.reload()
  })
}
const deactivateUser = (user) => {
  updateRole(user, 'visitor', (result) => {
    console.log(result);
    window.location.reload()
  })
}
const deleteUser = (user) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);

  var formdata = new FormData();

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: formdata,
    redirect: 'manual'
  };

  fetch(url_dev + "users/" + user._id, requestOptions)
    .then(response => response.text())
    .then(result => { console.log(result); window.location.reload() })
    .catch(error => console.log('error', error));
  console.log(user);
}

const updateRole = (user, role = "user", callbackFn) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer 4fcf3f78138f61fe6273dbd1d6c05f15e30496d7a085919bbcdcf11f271dcecfb564cd09ae8877ede8f0b29ede2a1cbfdadcfaa5941cade30d7da165a884f3cb4b395e8bd3c68a92757ff7e2ade2d23cb98a0dc6f040e42bc05a6b4304f212deea871e72933df531118f26a4800d482fd5df238d02767fe2dd4b2938222a16455462ef294cb14c3af17a7b0223034afa464326184fe925682780241db8f976762362703cc78640a93754531d753e8fd1eee511814d4d63dbc95dfa0027af978b");
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  let { name, email, phone, city, country } = user

  var urlencoded = new URLSearchParams();
  urlencoded.append("name", name);
  urlencoded.append("email", email);
  urlencoded.append("role", role);
  urlencoded.append("phone", phone || "999999999");
  urlencoded.append("city", city || "city");
  urlencoded.append("country", country || "country");

  var requestOptions = {
    method: 'PATCH',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'manual'
  };

  fetch(url_dev + "users/" + user._id, requestOptions)
    .then(response => response.json())
    .then(result => callbackFn(result))
    .catch(error => console.log('error', error));
}

function updateTable(data) {
  tableBody.innerHTML = "";
  data.docs.forEach((doc) => {

    if (doc.role == `admin`) {
      return;
    }
    let isUser = doc.role == `user`

    const row = document.createElement("tr");
    const cell1 = document.createElement("td");
    const cell2 = document.createElement("td");
    const cell3 = document.createElement("td");
    const cell4 = document.createElement("td");
    const cell5 = document.createElement("td");

    cell1.textContent = doc.name;
    cell2.textContent = doc.email;
    cell3.textContent = doc.createdAt;
    cell4.textContent = doc.role;



    const btn1 = document.createElement('button')
    btn1.onclick = () => { activateVisitor(doc) }
    btn1.innerText = "activate Visitor"
    const btn = document.createElement('button')
    btn.onclick = () => { deactivateUser(doc) }
    btn.innerText = "deactivate user"
    const btn2 = document.createElement('button')
    btn2.onclick = () => { deleteUser(doc) }
    btn2.innerText = "delete user"

    cell5.appendChild(isUser ? btn : btn1)
    cell5.appendChild(btn2)

    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);
    row.appendChild(cell4);
    row.appendChild(cell5);

    tableBody.appendChild(row);
  });
}

function updatePagination(data) {
  currentPage = data.page;
  totalPages = data.totalPages;
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}

function fetchData(page) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token)


  var requestOptions = {
    method: `GET`,
    headers: myHeaders,
    redirect: `manual`
  };

  fetch(`${url_dev + `users`}?page=${page}&limit=10&sort=createdAt&order=-1`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      updateTable(data);
      updatePagination(data);
    })
    .catch((error) => console.error(error));
}

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    fetchData(currentPage - 1);
  }
});

nextButton.addEventListener("click", () => {
  if (currentPage < totalPages) {
    fetchData(currentPage + 1);
  }
});

verifyProfile()
// Initial data fetch
fetchData(currentPage);
