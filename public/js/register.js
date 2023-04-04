let serverUrl = window.config.FRONTEND_URL


document.querySelector("button#register").onclick = async function () {
  let email = document.querySelector(".register-form #email").value
  let password = document.querySelector(".register-form #password").value
  let name = document.querySelector(".register-form #name").value
  console.log(email, password);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("email", email);
  urlencoded.append("password", password);
  urlencoded.append("name", name);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'manual'
  };


  fetch(serverUrl + 'register', requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result);
      let errors = []
      // result.message?.forEach(errorMsg => {
      //   let sentence = `message: ${msg} in value "${value}" as parameter ${param}`
      // });
      if (result.errors?.msg && !Array.isArray(result.errors.msg)) {
        result.errors.msg = [JSON.parse(JSON.stringify(result.errors))]
      }


      result.errors?.msg.forEach(errorMsg => {
        let { msg, value, param } = errorMsg
        let sentence = `error message: ${param || ''} ${msg || ''} , given value: ${value || ''}`
        errors.push(sentence)
      });

      if (errors.length) {
        alert(JSON.stringify(errors))
      }else{
        localStorage.setItem('authentication', result.token)
        localStorage.setItem('user', JSON.stringify(result.user))

        if(result.user.role=='admin')window.location.pathname = '/pages/admin'
        if(result.user.role=='user')window.location.pathname = '/pages/profile'
        if(result.user.role=='visitor')window.location.pathname = '/pages/profile'
      }



    })
    .catch(error => {

      if (error.errors?.msg && !Array.isArray(error.errors.msg)) {
        error.errors.msg = [JSON.parse(JSON.stringify(error.errors))]
      }
      console.log('error', error)
      let errors = []
      // result.message?.forEach(errorMsg => {
      //   let sentence = `message: ${msg} in value "${value}" as parameter ${param}`
      // });
      error.errors?.msg.forEach(errorMsg => {
        let { msg, value, param } = errorMsg
        let sentence = `error: ${msg} in value "${value}" as parameter ${param}`
        errors.push(sentence)
      });
      alert(JSON.stringify(errors))
    }
    );
}
