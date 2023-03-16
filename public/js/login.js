document.querySelector("button#login").onclick = async function () {
  let email = document.querySelector(".login-form #email").value
  let password = document.querySelector(".login-form #password").value
  console.log(email, password);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("email", email);
  urlencoded.append("password", password);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'manual'
  };

  fetch("https://dive-server.shubhambawner.repl.co/login", requestOptions)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}
