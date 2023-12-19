const { Transform } = require('node:stream');
const fs = require("node:fs/promises");

class Decrypt extends Transform {
    _transform(chunk, encoding, callback) {
        // <57 - 1, ff - 1, a6 - 1, 12 - 1 , 22 - 1...> subtract 1 to our encryption Buffer to decrypt it
        for(let i = 0; i < chunk.length ; ++i) {
            if(chunk[i] !== 255) {
                chunk[i] = chunk[i] - 1
            }
        }
        callback(null, chunk)
    }
}


(async() => {
    const readFileHandle = await fs.open('./write.txt', 'r')
    const writeFileHandle = await fs.open('./decrypted.txt', 'w')

    const readStream = readFileHandle.createReadStream()
    const writeStream = writeFileHandle.createWriteStream()

    const decrypt = new Decrypt();

    readStream.pipe(decrypt).pipe(writeStream)

})()
