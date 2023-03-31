let isDev = true
let url_prod = "https://dive-server.shubhambawner.repl.co/"
let url_dev = "http://localhost:3000/"
let serverUrl = isDev ? url_dev : url_prod

export { serverUrl }
