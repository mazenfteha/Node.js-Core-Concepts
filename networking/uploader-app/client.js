const net = require('net')
const fs = require("fs/promises");
const path = require('path');


const clearLine = (dir) => {
    return new Promise((resolve, reject) => {
        process.stdout.clearLine(dir, () => {
            resolve()
        })
    })
}

const moveCursor = (dx, dy) => {
    return new Promise((resolve, reject) => {
        process.stdout.moveCursor(dx, dy, () => {
            resolve()
        })
    })

}


const socket = net.createConnection({host: "::1", port:5050}, async () => {
    const filePath = process.argv[2]
    const fileName = path.basename(filePath)
    const fileHandle = await fs.open(filePath, "r")
    const fileReadStream = fileHandle.createReadStream() // the stream to read from
    const fileSize = (await fileHandle.stat()).size;

    // for showing the upload progress
    let uploadedPrecentage = 0;
    let bytesUploaded = 0

    socket.write(`fileName: ${fileName}-------`)

    console.log() // for uploading percentage

    // Reading from the source file 
    fileReadStream.on('data', async (data) => {
        if (!socket.write(data)) {
            fileReadStream.pause();
        }

        bytesUploaded += data.length //add the number of bytes to the var
        let newPrecentage = Math.floor((bytesUploaded / fileSize) * 100)

        if(newPrecentage !== uploadedPrecentage) {
            uploadedPrecentage = newPrecentage
            await moveCursor(0, -1)
            await clearLine(0)
            console.log(`Uploading...${uploadedPrecentage}%`)

        }
    })

    // On each chunk of data read from the file, attempt to write it to the socket. 
    //If the socket's buffer is full, 
    // pause the read stream until the "drain" event is triggered.

    socket.on("drain", () => {
        fileReadStream.resume();
    });
    

    // end the connection after uploaded 
    fileReadStream.on('end', () => {
        console.log('The file was successfuly uploaded')
        socket.end();
    })
})