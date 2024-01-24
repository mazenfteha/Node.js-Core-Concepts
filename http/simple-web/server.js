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

    // JSON Routes
    if (request.url === "/login" && request.method === "POST") {
        response.setHeader("Content-Type", "application/json");
        response.statusCode = 200

        body = {
            message: 'Logging you in...'
        }

        response.end(JSON.stringify(body))
    }

    if (request.url === "/user" && request.method === "PUT") {
        response.setHeader("Content-Type", "application/json");
        response.statusCode = 200

        body = {
            message: 'Updating your info...'
        }

        response.end(JSON.stringify(body))
    }

    // Upload route
    if(request.url === '/upload' && request.method === 'PUT') {
        const fileHandle = await fs.open('./data/image.jpg', "w");
        const fileStream = fileHandle.createWriteStream();
        response.setHeader("Content-Type", "application/json");
    
        request.pipe(fileStream);
    
        request.on("end", () => {
            response.end(
                JSON.stringify({ message: "File was uploaded successfully!" })
            );
        })
    }
})

server.listen(9000, () => {
    console.log(`web seever is live at http://localhost:9000`)
})