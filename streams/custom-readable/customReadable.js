const { Readable } = require('node:stream');
const fs = require('node:fs')

class FileReadStream extends Readable {
    constructor({highWaterMark, fileName}) {
        super({ highWaterMark })

        this.fileName = fileName;
        this.fd = null
    }

    _construct(callback) {
        fs.open(this.fileName, 'r', (err, fd)=> {
            if(err) {
                callback(err)
            } else {
                this.fd = fd
                // no arg means it was successful
                callback()
            }
        })
    }

    _read(size) {
        const buff = Buffer.alloc(size)
        fs.read(this.fd, buff, 0, size, null, (err, bytesRead) => {
            if(err) return this.destroy(err)
            //null to indicate the end of the stream
            this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null)
        })
    }

    _destroy(error, callback) {
        if(this.fd) {
            fs.close(this.fd, (err) => callback || error)
        } else{
            callback(error)
        }
    }
}



const stream = new FileReadStream({ fileName: './test.txt' })

stream.on('data', (chunk) => {
    console.log(chunk.toString('utf-8'))
})

stream.on('end', () => {
    console.log('Stream done reading')
})

