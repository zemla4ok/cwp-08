const net = require('net');
const fs = require('fs');
const childProcess = require('child_process');
const port = 8124;

let seed = 0;
let workers = [];

const server = net.createServer((client) => {
    client.setEncoding('utf8');

    client.on('data', (data, err) => {
        let req = JSON.parse(data);
        if (req.key === 'worker' && req.method !== undefined){
            switch(req.method){
                case 'start':
                if(req.interval !== undefined){
                    let interval = req.interval;
                    let id = getUniqID();
                    let file = `./files/${id}.json`;
                    let proc = childProcess.spawn('node', ['worker.js', file, interval], {detached: true});
                    let worker = {
                        proc : proc,
                        id : id,
                        statedOn : Date.now()
                    };
                    workers.push(worker);
                }
                    break;
                case 'get' :
                    client.write(JSON.stringify(workers));
                break;
                case 'remove' :
                if(req.id !== undefined){
                    let id = parseInt(req.id);
                    let client = clients.get(id);
                    process.kill(client.proc);
                }
                break;
            }
        }
    });

    client.on('end', () => {
        console.log(`Client ${client.id} disconnected`);
    });
});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});

function getUniqID() {
    return Date.now() + seed++;
}