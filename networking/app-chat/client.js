const net = require('node:net')
const readline = require('node:readline');
const util = require('node:util');

//by using this read line we can ask a question from the client
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

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

const question = util.promisify(rl.question).bind(rl);

let id;

const socket = net.createConnection({ host: "127.0.0.1", port:3008 },async () => { //three way handshake 
    console.log('Connected to the server!')

    const ask = async () => {
        const message =await question("Enter a message > ")
        // move the cursor one line up
        await moveCursor(0, -1)
        // clear the current line that the cursor is in
        await clearLine(0)
        // send the message to the server
        socket.write(`${id}-message-${message}`)
    }

    ask()

    socket.on('data', async (data) => {
        console.log();
        await moveCursor(0, -1)
        await clearLine(0)
        if(data.toString('utf-8').substring(0, 2) === "id") {
            // when we are getting the id
            id = data.toString('utf-8').substring(3)
            console.log(`Your id is ${id}! \n`)
        } else {
            // when we are getting the message
            console.log(data.toString('utf-8'))
        }
        ask()
    })
}) 


socket.on('end', () => {
    console.log('Connection was gracefully ended by the server');
});

socket.on('close', () => {
    console.log('Connection was fully closed');
});