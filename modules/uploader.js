require('dotenv').config();

module.exports = {

    base64ToBuffer(base64, filename) {
        const fs = require('fs');
        const Stream = require('stream');
        imgBuffer = Buffer.from(base64, 'base64');

        let s = new Stream.Readable();
        s.push(imgBuffer);
        s.push(null);
        s.pipe(fs.createWriteStream(filename));
        return s;
    },

    async sendImageToAzure(stream, folder, filename) {
        const { BlockBlobClient } = require('@azure/storage-blob'),
            azureStorageConnectionString = process.env.CONNECTION,
            containerName = process.env.CONTAINER + folder,
            blobService = new BlockBlobClient(azureStorageConnectionString, containerName, filename);

        blobService.uploadStream(stream, stream.length).then(() => {
            console.log("File Uploaded!");
        }
        ).catch((err) => {
            console.log(err);
        })
    },

    async sendImage(base64Img, folder, filename) {
        return await this.sendImageToAzure(this.base64ToBuffer(base64Img, filename), folder, filename);
    }

}