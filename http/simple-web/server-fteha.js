const Fteha = require('../fteha')

const server = new Fteha();

server.route('get', '/', (req, res) => {
    res.sendFile('./public/index.html', "text/html")
})

server.route('get', '/styles.css', (req, res) => {
    res.sendFile('./public/styles.css', "text/css")
})

server.route('get', '/scripts.js', (req, res) => {
    res.sendFile('./public/scripts.js', "text/javascript")
})


const PORT = 4060

server.listen(PORT, () => {
    console.log(`server running on fteha framework on port ${PORT}`)
})