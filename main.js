const faker = require('./MovementFaker.js');
const http = require('http');
const { URL } = require('url');
const port = 5889;

http.createServer(function (request, response) {
    try {
        const { host } = request.headers;
        const parseUrl = new URL(request.url, `http://${host}`);
        const url = parseUrl.pathname;
        if (url == '/log') {
            let body = faker.getBody();
            response.writeHead(200, {
                'Content-Type': 'application/json'
            });
            body.then(item => {
                response.end(JSON.stringify(item));
            });
        } else if (url == '/batchLog') {
            let count = parseInt(parseUrl.searchParams.get('count') || 1);
            let bodyArray = faker.getBodyArray(count);
            response.writeHead(200, {
                'Content-Type': 'application/json'
            });
            Promise.all(bodyArray).then(values => {
                response.end(JSON.stringify(values));
            });
        } else {
            response.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            response.end('hello world');
        }
    } catch (err) {
        console.error(err);
    }

}).listen(port);

console.log('Server running at http://127.0.0.1:' + port + '/');