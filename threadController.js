const {
    Worker
} = require('node:worker_threads');
const { readdir } = require('fs/promises')
const path = require('path')


class ThreadController {
    constructor(threadsNumber) {
        this.files = []
        this.threadsNumber = threadsNumber
        this.count = 0
    }

    async loadFiles() {
        this.files = await readdir(path.join(__dirname, '/content'))
    }

    async uploadThread(filePath) {
        return new Promise((resolve, reject) => {
            const worker = new Worker('./fileUploadWorker.js', {
                workerData: {
                    file: filePath
                }
            });
            worker.once('error', reject);
            worker.on('exit', (code) => {
                resolve(filePath)
            });
        })
    }

    async execute() {
        const init = performance.now()

        await this.loadFiles()

        let promises = []

        while (this.count < this.files.length) {

            for (let i = this.count; i < this.count + this.threadsNumber; i++) {
                if (this.files[i]) {
                    promises.push(this.uploadThread(this.files[i]))
                }
            }

            const result = await Promise.all(promises)

            promises = []
            this.count += this.threadsNumber

            console.log(result)
        }

        const end = performance.now()
        console.log(end - init)
    }
}

module.exports = ThreadController