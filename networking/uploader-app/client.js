const net = require('net')
const fs = require("fs/promises");
const path = require('path');


const socket = net.createConnection({host: "::1", port:5050}, async () => {
    const filePath = process.argv[2]
    const fileName = path.basename(filePath)
    const fileHandle = await fs.open(filePath, "r")
    const fileReadStream = fileHandle.createReadStream() // the stream to read from

    socket.write(`fileName: ${fileName}-------`)

    // Reading from the source file 
    fileReadStream.on('data', (deta) => {
        if (!socket.write(deta)) {
            fileReadStream.pause();
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