const { Storage } = require('@google-cloud/storage')
const path = require('path')
const serviceKey = path.join(__dirname, './gkeys.json')


class CloudStorageFileService {

    constructor() {
        this.storage = new Storage({
            projectId: 'mymoney-12',
            keyFilename: serviceKey
        })
    }

    async downloadFile(bucketName, fileName) {
        return await this.storage
            .bucket(bucketName)
            .file(fileName)
            .createReadStream()
    }

    async uploadFile(bucketName, destFileName) {
        return await this.storage
            .bucket(bucketName)
            .file(destFileName)
            .createWriteStream()
    }
}

module.exports = CloudStorageFileService