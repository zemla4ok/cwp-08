const fs = require('fs');
const path = process.argv[2];
const x = parseInt(process.argv[3]) * 1000;

setInterval(() => {
    fs.appendFile((path, fs.existsSync(path) ?
        ',' + JSON.stringify(Math.round(Math.random() * 1000), null, '\t') :
        '[' + JSON.stringify(Math.round(Math.random() * 1000), null, '\t',
        (err) => {
            if(err){
                console.error(err);
            }
        })))
}, x)