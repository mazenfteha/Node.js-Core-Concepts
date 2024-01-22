//here we are going to set up a simple TCP server.
const net = require('node:net')

const server = net.createServer((socket) => {
    socket.on('data', (data)=> {
        console.log(data.toString('utf-8'))
    })
    const response = Buffer.from( // this response will emmit after a request from postman
        "485454502f312e3120323030204f4b0d0a436f6e74656e742d547970653a206170706c69636174696f6e2f6a736f6e0d0a446174653a205765642c203231204a756e20323032332032313a30303a353820474d540d0a436f6e6e656374696f6e3a206b6565702d616c6976650d0a4b6565702d416c6976653a2074696d656f75743d350d0a5472616e736665722d456e636f64696e673a206368756e6b65640d0a0d0a34310d0a7b226d657373616765223a22506f73742077697468207469746c65205469746c65206f66206d7920706f7374207761732063726561746564206279204a6f65227d0d0a300d0a0d0a",
        "hex"
    );

    socket.write(response);
});

server.listen(8050, "127.0.0.1", () => {
    console.log("opend server on", server.address())
})