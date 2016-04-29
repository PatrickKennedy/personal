var connect = require('connect');
var http = require('http');
var serveStatic = require('serve-static');

var app = connect();

// respond to all requests
app.use(serveStatic('release', {'index': ['index.html']}));

//create node.js http server and listen on port
http.createServer(app).listen(80);
