const net = require('node:net')

const server = net.createServer()

//an array of client sockets
const clients = []

server.on('connection', (socket)=> { //socket here mean your endpoint
    console.log('A new coonection to the server')
    
    const clientId = clients.length + 1

    //when somebody joins the chat
    clients.map((client) => {
        client.socket.write(`User ${clientId} joined!`)
    })

    socket.write(`id-${clientId}`);

    socket.on('data', (data) => {
    const dataString = data.toString("utf-8");
    const id = dataString.substring(0, dataString.indexOf("-"));
    const message = dataString.substring(dataString.indexOf("-message-") + 9);
        clients.map((client) => {
            client.socket.write(`> User ${id}: ${message}`);
        })
    })

    //when somebody leave
    socket.on("error", () => {
        clients.map((client) => {
            client.socket.write(`User ${clientId} left!`);
        });
    });

    clients.push({id : clientId.toString(), socket})
})

//close connection
process.on('SIGINT', () => {
    console.log('Server shutting down...');
    
    // Close all client connections gracefully
    clients.forEach((client) => {
        client.socket.end();
    });

    // Close the server after all clients have disconnected
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

server.listen(3008, "127.0.0.1", ()=> {
    console.log("opend server on", server.address())
})
