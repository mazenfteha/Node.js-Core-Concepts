const net = require('net')
const fs = require("fs/promises");

const server = net.createServer(() => {})

let fileHandle, fileWriteStream

server.on('connection', (socket) => {
    console.log("New connection!")

    socket.on("data", async (data) => {
        if(!fileHandle) {     // If file handle doesn't exist, create one and start writing to a file
            socket.pause()

            // extract the file name from client socket
            const indexOfDriver = data.indexOf("-------")
            const fileName = data.subarray(10, indexOfDriver).toString('utf-8')


            fileHandle = await fs.open(`storage/${fileName}`, "w")
            fileWriteStream = fileHandle.createWriteStream() //stream to write to
    
            // Writing to our dest file
            fileWriteStream.write(data.subarray(indexOfDriver + 7))

            socket.resume(); // resume receiving data from the client
            fileWriteStream.on('drain', () => {
                socket.resume();
            });
        }else {     // If file handle exists, continue writing to the existing file
            if (!fileWriteStream.write(data)) {
                socket.pause();
            }
        }
    })
    // This end event happens when the client.js file ends the socket
    socket.on('end', () => {
        fileHandle.close();
        fileHandle = undefined;
        fileWriteStream = undefined;
        console.log('connection endedd!')
    })
})

server.listen(5050, "::1", () => {
    console.log("Uploader server opened on", server.address())
})