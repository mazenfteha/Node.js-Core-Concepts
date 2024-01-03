const net = require('net')
const fs = require("fs/promises");


const socket = net.createConnection({host: "::1", port:5050}, async () => {
    const filePath = "./text.txt"
    const fileHandle = await fs.open(filePath, "r")
    const fileStream = fileHandle.createReadStream()

    // Reading from the source file 
    fileStream.on('data', (deta) => {
        socket.write(deta)
    })

    // end the connection after uploaded 
    fileStream.on('end', () => {
        console.log('The file was successfuly uploaded')
        socket.end();
    })
})