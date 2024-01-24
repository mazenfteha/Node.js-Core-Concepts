const http = require('node:http');
const fs = require('node:fs/promises')

const server = http.createServer();

server.on('request', async (request, response) => {
    // this is what happend in background in express.static()
    if(request.url === '/' && request.method === 'GET') {
        response.setHeader("Content-Type", "text/html");

        const fileHandle = await fs.open('./public/index.html', 'r')
        const fileStream = fileHandle.createReadStream();
        fileStream.pipe(response)
    }

    if(request.url === '/styles.css' && request.method === 'GET') {
        response.setHeader("Content-Type", "text/css");

        const fileHandle = await fs.open('./public/styles.css', 'r')
        const fileStream = fileHandle.createReadStream();
        fileStream.pipe(response)
    }

    if (request.url === "/scripts.js" && request.method === "GET") {
        response.setHeader("Content-Type", "text/javascript");
    
        const fileHandle = await fs.open("./public/scripts.js", "r");
        const fileStream = fileHandle.createReadStream();
    
        fileStream.pipe(response);
    }
})

server.listen(9000, () => {
    console.log(`web seever is live at http://localhost:9000`)
})