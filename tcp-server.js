const net = require('net');
const fs = require('fs');
const childProcess = require('child_process');
const port = 8124;

let seed = 0;
let workers = [];

const server = net.createServer((client) => {
    client.setEncoding('utf8');

    client.on('data', hand);
    function hand(data, err) {
        console.log(data);
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
                        startedOn : Date.now(),
                        file : file
                    };
                    workers.push(worker);                       
                    let res = {
                        id : worker.id,
                        startedOn : worker.startedOn,
                        meta : 'add'
                    }
                    console.log(res);
                    client.write(JSON.stringify(res));
                }
                    break;
                case 'get' :
                let w = [];
                for(let i = 0; i < workers.length; i++){
                    let numb = fs.readFileSync(workers[i].file);
                    let obj = {
                        id : workers[i].id,
                        startedOn : workers[i].startedOn,
                        numbers : numb
                    }
                    w.push(obj);
                }
                let res = {
                    meta: 'get',
                    workers : w
                }                
                client.write(JSON.stringify(res));
                break;
                case 'remove' :
                if(req.id !== undefined){
                    let ind = workers.findIndex(worker => worker.id == req.id);
                    console.log(ind);
                    let numb = fs.readFileSync(workers[ind].file);
                    let res = {
                        meta : 'remove',
                        id :  workers[ind].id,
                        startedOn : workers[ind].startedOn,
                        numbers : numb
                    }
                    client.write(JSON.stringify(res));
                    fs.appendFile(workers[ind].file, "]");
                    process.kill(workers[ind].proc.pid);
                    workers.splice(ind, 1);
                }
                break;
            }
        }
    };
/*
async function getWorkers() {
    return new Promise(async (resolve) =>{
        let res = [];
        for(let i = 0; i < workers.length; i++){
            let numb = await getNumbers(workers[i]);
            res.push({
                "pid" : workers[i].pid,
                "startedOn" : workers[i].startedOn,
                "numbers": numb
            });
        }
        resolve(res);
    })
}

function getNumbers(worker){
    return new Promise((resolve, reject) => {
        fs.readFile(worker.file, (err, data) => {
            if(!err){
                resolve(data+']');
            }
            else{
                reject(err);
            }
        })
    })
}
*/
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