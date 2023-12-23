const net = require('node:net')
const readline = require('node:readline');
const util = require('node:util');

//by using this read line we can ask a question from the client
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const question = util.promisify(rl.question).bind(rl);

const socket = net.createConnection({ host: "127.0.0.1", port:3008 },async () => { //three way handshake 
    console.log('Connected to the server!')

    const message =await question("Enter a message > ")

    // send the message to the server
    socket.write(message)
}) 

socket.on('data',(data) => {
    console.log(data.toString('utf-8'))
})

socket.on('end', () => {
    console.log('Connection was gracefully ended by the server');
});

socket.on('close', () => {
    console.log('Connection was fully closed');
});