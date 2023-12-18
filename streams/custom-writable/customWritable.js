const { Writable } = require('node:stream');
const fs = require('node:fs');


class FileWriteStream extends Writable {
    constructor({highWaterMark, fileName}) {
        super({ highWaterMark })

        this.fileName = fileName;
        this.fd = null
        this.chunks = []
        this.chunksSize = 0
        this.writesCount = 0
    }

    //This will run the constructor, and it will put off all calling thr other
    //methods until we call the callback function
    _construct(callback) {
        fs.open(this.fileName, 'w', (err, fd)=> {
            if(err) {
                callback(err)
            } else {
                this.fd = fd
                // no arg means it was successful
                callback()
            }
        })
    }



    _write(chunk, encoding, callback) {
        this.chunks.push(chunk);
        this.chunksSize += chunk.length;

        if (this.chunksSize > this.writableHighWaterMark) {
            fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
                if (err) {
                    return callback(err);
                }
                this.chunks = [];
                this.chunksSize = 0;
                ++this.writesCount;
                callback();
            });
        } else {
            // when we're done, we should call the callback function
            callback();
        }
    }

    _final(callback) {
        fs.write(this.fd, Buffer.concat(this.chunks), (err) =>{
            if(err) {
                return callback(err)
            }
            this.chunks = [];
            callback()
        })

    }

    _destroy(error, callback) {
        console.log("Number of wirtes: ", this.writesCount)
        if(this.fs) {
            fs.close(this.fd, (err) => {
                callback(err || error)
            })
        } else {
            callback(error)
        }
    }
}

// const stream = new FileWriteStream({highWaterMark: 1800, fileName:'./text.txt'});
// stream.write(Buffer.from("this is some string."))
// stream.end(Buffer.from("our last wirte."))

// stream.on('finish', () => {
//     console.log('stream was finished')
// })


//write writeMany test but with our writable stream :
(async () => {
    console.time("writeMany");

    const stream = new FileWriteStream({
        fileName: './test.txt',
    });

    let i = 0;

    const numberOfWrites = 100000;

    const writeMany = () => {
        while (i < numberOfWrites) {
            const buff = Buffer.from(` ${i} `, "utf-8");

            // this is our last write
            if (i === numberOfWrites - 1) {
                return stream.end(buff);
            }

            // if stream.write returns false, stop the loop
            if (!stream.write(buff)) break;

            i++;
        }
    };

    writeMany();

    let d = 0;
    // resume our loop once our stream's internal buffer is emptied
    stream.on("drain", () => {
        ++d;
        writeMany();
    });

    stream.on("finish", () => {
        console.log("Number of drains:", d);
        console.timeEnd("writeMany");
    });
})();
