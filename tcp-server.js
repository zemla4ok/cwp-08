const net = require('net');
const fs = require('fs');
const childProcess = require('child_process');
const port = 8124;

let seed = 0;
let workers = [];

const server = net.createServer((client) => {
    client.setEncoding('utf8');

    client.on('data', (data) => {

    });

    client.on('end', () => {
        console.log(`Client ${client.id} disconnected`);
    });
});

function startWorker(interval) {
    let id = getUniqID();
    let file = `./files/${Date.now() + seed++}.json`;
    let worker = childProcess.spawn('node', ['worker.js', file, `${interval}`]);
    let date = new Date();
    worker.startedOn = date.toISOString();
    worker.file = file;
    worker.push(worker);
}

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});

function getUniqID() {
    return Date.now() + seed++;
}