const Fteha = require('../fteha')

const USERS = [
    { id:1 , name:"Kanye West", username: "ye", password:"string"},
    { id:1 , name:"Travis Scott", username: "jack", password:"string"},
    { id:1 , name:"21 savage", username: "21", password:"string"}
]

const POSTS = [
    {
        id: 1,
        title:"hip hop trend",
        body: "A kanye west Album drops in January 24, 2024 with features include teavis and 21 savage and more!",
        userId: 1,
    }
]

const PORT = 9001;

const server = new Fteha();

//---------------Files Routes-------//
server.route('get', '/', (req, res) => {
    console.log('server-1 is now handling this request')
    res.sendFile('./public/index.html', "text/html")
})

server.route('get', '/login', (req, res) => {
    res.sendFile('./public/index.html', "text/html")
})

server.route('get', '/styles.css', (req, res) => {
    res.sendFile('./public/styles.css', "text/css")
})

server.route('get', '/scripts.js', (req, res) => {
    res.sendFile('./public/scripts.js', "text/javascript")
})

//---------------JSON Routes-------//
server.route('get', '/api/posts', (req, res) => {
    const posts = POSTS.map((post) => {
        const user = USERS.find((user) => user.id === post.userId)
        post.author = user.name;
        return post;
    })
    res.status(200).json(posts)
})

server.route('post', '/api/login', (req, res) => {
    let body = "";
    req.on('data', (chunk) => {
        body += chunk.toString('utf-8')
    })
    req.on('end', () => {
        body = JSON.parse(body);
        
        const username = body.username
        const password = body.password

        // Check if the user exists
        const user = USERS.find((user) => user.username === username)
        if(user && user.password === password) {
            res.status(200).json({ message: "Logged in successfuly" })
        } else {
            res.status(401).json({ error: "Invalid username or password" })
        }
    })
})


server.listen(PORT, () => {
    console.log(`server running on fteha framework on port ${PORT}`)
})