const net = require('node:net')

const server = net.createServer()

//an array of client sockets
const clients = []

server.on('connection', (socket)=> { //socket here mean your endpoint
    console.log('A new coonection to the server')

    socket.on('data', (data) => {
        //console.log(data.toString('utf-8'));
        //socket.write(data)
        clients.map((s) => {
            s.write(data)
        })
    })

    clients.push(socket)
})

//close connection
process.on('SIGINT', () => {
    console.log('Server shutting down...');
    
    // Close all client connections gracefully
    clients.forEach((client) => {
        client.end();
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
