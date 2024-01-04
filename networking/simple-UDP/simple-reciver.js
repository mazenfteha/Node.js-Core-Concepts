const dgram = require('dgram')

const receiver = dgram.createSocket('udp4');

receiver.on('message', (message, remotInfo)=> {
    console.log(`Server got: ${message} from ${remotInfo.address} :${remotInfo.port}`)
})


receiver.bind({address: "127.0.0.1", port: 8000})

receiver.on('listening', () => {
    console.log(`Server listening:`)
    console.log(receiver.address())
})