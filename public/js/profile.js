
let data = JSON.parse(localStorage.getItem('user') || {error:'no user logged in'})
document.querySelector('#root').innerText = JSON.stringify(data)
