const faker = require('./MovementFaker.js');
const http = require('http');
const port = 5889;

http.createServer(function (request, response) {

    const url = request.url;

    if (url == '/log') {
        let body = faker.getBody();
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });
        body.then(item => {
            response.end(item);
        });
    } else {
        response.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        response.end('hello world');
    }

}).listen(port);

console.log('Server running at http://127.0.0.1:' + port + '/');