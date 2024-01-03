const net = require('net')
const fs = require("fs/promises");

const server = net.createServer(() => {})

let fileHandle, fileStream

server.on('connection', (socket) => {
    console.log("New connection!")

    socket.on("data", async (data) => {
        fileHandle = await fs.open(`storage/test.txt`, "w")
        fileStream = fileHandle.createWriteStream()

        // Writing to our dest file
        fileStream.write(data)
    })

    socket.on('end', () => {
        console.log('connection endedd!')
        fileHandle.close()
    })
})

server.listen(5050, "::1", () => {
    console.log("Uploader server opened on", server.address())
})