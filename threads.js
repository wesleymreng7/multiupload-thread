const {
    Worker
  } = require('node:worker_threads');
const { readdir } = require('fs/promises')
const path = require('path')
const { cpus } = require('os');
// const cluster = require('cluster');


//const numCPUs = cpus().length
const numCPUs = 1
const numberThreads = 2



const loadFiles = async () => {
    return await readdir(path.join(__dirname, '/content'))
}

const uploadFile = async (file) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./fileUploader.js', {
            workerData: {
                file
            }
        });
        //worker.once('message', resolve);
        worker.once('error', reject);
        worker.on('exit', (code) => {
            resolve(file)
            console.log(code)
        });
    })
    
}

const process = async () => {
    const init = performance.now()
    const files = await loadFiles()
    let threadsNumber = 2
    let promises = []
    let count = 0
    while(count < files.length) {
        for(let i = count; i < count + threadsNumber; i++) {
            promises.push(uploadFile(files[i]))
        }
        const result = await Promise.all(promises)
        promises = []
        count += threadsNumber
    }
    const end = performance.now()
    console.log(end - init)

    
}

/*const run = () => {
    try {
        if(cluster.isPrimary) {
            let p
            for (let i = 0; i < numCPUs; i++) {
                p = cluster.fork();
            }
            cluster.on('exit', (worker, code, signal) => {
                console.log(`worker ${worker.process.pid} died`);
            });
            if(p) {
                p.on('message', (message) => {
                    //console.log(message)
                })
            }
            console.log('generating process')
        } else {
            generateThreads()
        }
    } catch (e) {
        console.log(e)
    }
}*/


//run()
module.exports = process