const http = require('http');
const fs = require('fs');


const hostname = '127.0.0.1';
const port = 3000;

const handlers = {
   '/workers' : workers,
   '/workers/add' : add,
   '/workers/remove' : remove
}

function workers(req, res, payload, cb){

}

function add(req, res, payload, cb){
    
}

function remove(req, res, payload, cb){

}

const server = http.createServer((req, res) => {
    parseBodyJson(req, (err, payload) => {
        const handler = getHandler(req.url);
        handler(req, res, payload, (err, result, header) => {
            if (err) {
                res.statusCode = err.code;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(err));
                return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', header);
            if(header === 'application/json'){
                changeArticles();
                res.end(JSON.stringify(result));
            }
            else
                res.end(result);
        })
    })
});

function parseBodyJson(req, cb) {
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        let params;
        if (body !== "") {
            params = JSON.parse(body);
        }
        cb(null, params);
    })
}

function getHandler(url) {
    console.log(url);
    return handlers[url] || notFound;
}

function notFound(req, res, payload, cb) {
    cb({ code: 404, message: 'Not found'});
}

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});