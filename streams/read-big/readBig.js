const fs = require("fs/promises");

(async () => {
    const fileHandleRead = await fs.open("src.txt", "r") // copied from test.txt
    const fileHandleWrite = await fs.open("dest.txt", "w")

    const streamRead = fileHandleRead.createReadStream({
        highWaterMark: 64 * 1024
    })
    const streamWrite = fileHandleWrite.createWriteStream()

    //this make memory issue and will crach the ps
    // streamRead.on("data", (chunk) => {
    //     streamWrite.write(chunk)
    // })

    streamRead.on("data", (chunk) => {
        if(!streamWrite.write(chunk)) {
            streamRead.pause()
        }
    })


    streamWrite.on("drain", () => {
        streamRead.resume();
    })

})()