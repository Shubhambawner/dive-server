code base from: https://github.com/davellanedam/node-express-mongodb-jwt-rest-api-skeleton

API doc: https://thunder-.postman.co/workspace/9349defe-dd7f-44ec-8767-1e094383a4fa/collection/18809855-81b83611-6eff-47c3-a824-97a9d6daece9?action=share&creator=18809855

linking frontend with process.env: use of EJS
* script src tag in html actually hits a get request on our server
* this req can be handled via router.get
* ejs:
*  .js.ejs files are compiled to .js at compile time by render engine.
*  for tht view engine has to be set to ejs for files of extension .ejs
*  at the compilation, ejs has access to servers node env

socket.io :
