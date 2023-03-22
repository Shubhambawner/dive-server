SO, technically socket.io and rest apis are using same port right ?

Yes, technically both the Socket.io server and the REST API server will be using the same port. In the example I provided, the HTTP server created using http.createServer() is used to listen to a specific port. This same server is then passed to the Socket.io constructor to initialize the Socket.io server.

When the client connects to the server, it sends an HTTP upgrade request to upgrade the connection to a WebSocket connection. The Socket.io server listens for this request and upgrades the connection to a WebSocket connection. After the upgrade, both the Socket.io and REST API requests will be handled by the same HTTP server on the same port.

Note that when you use the http module to create a server, it creates an HTTP server and not an HTTPS server. If you want to use HTTPS instead of HTTP, you will need to create an HTTPS server instead.
