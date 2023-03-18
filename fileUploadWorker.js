const {
  isMainThread, parentPort, workerData
} = require('node:worker_threads');
const path = require('path')
const { pipeline } = require('stream/promises')
const { createReadStream } = require('fs')
const CloudStorageFileService = require('./cloudStorageFileService');

class FileUploadWorker {
  constructor() {
    this.storage = new CloudStorageFileService()
    this.filePath = path.join(__dirname, '/content/', workerData.file)
    this.fileName = workerData.file
  }
  async upload() {
    if (!isMainThread) {
      await pipeline(createReadStream(this.filePath), await this.storage.uploadFile('myfileuploads', this.fileName))
    }
  }
}
;
(async () => {
  const fileUploader = new FileUploadWorker()
  await fileUploader.upload()
})()

