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
// { userId:1 , token: 2165416}
const SESSTIONS = []

const PORT = 9000;

const server = new Fteha();

//---------------Files Routes-------//
server.route('get', '/', (req, res) => {
    res.sendFile('./public/index.html', "text/html")
})

server.route('get', '/login', (req, res) => {
    res.sendFile('./public/index.html', "text/html")
})

server.route('get', '/profile', (req, res) => {
    res.sendFile('./public/index.html', "text/html")
})

server.route('get', '/styles.css', (req, res) => {
    res.sendFile('./public/styles.css', "text/css")
})

server.route('get', '/scripts.js', (req, res) => {
    res.sendFile('./public/scripts.js', "text/javascript")
})

//---------------JSON Routes-------//

// Log a users in and give them a token
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

            const token = Math.floor(Math.random() * 10000000).toString()
            res.setHeader("Set-cookie", `token=${token}; Path=/;`)
            // Save the generated token
            SESSTIONS.push({userId:user.id, token:token})
            console.log(SESSTIONS)

            res.status(200).json({ message: "Logged in successfuly" })
        } else {
            res.status(401).json({ error: "Invalid username or password" })
        }
    })
})

// Log a user out
server.route('delete', '/api/logout', (req, res) => {})

// Send user info
server.route('get', '/api/user', (req, res) => {
    const token = req.headers.cookie.split("=")[1];
    const session = SESSTIONS.find((session) => session.token === token)
    if(session) {
        // Send the user's profile info
        const user = USERS.find((user) => user.id === session.userId)
        res.json({ username: user.name, name: user.name })
    }else {
        res.status(401).json({ error: "Unauthoized" })
    }
})

// update a profile
server.route('put', '/api/user', (req, res) => {})

// create a post
server.route('post', '/api/posts', (req, res) => {})

server.route('get', '/api/posts', (req, res) => {
    const posts = POSTS.map((post) => {
        const user = USERS.find((user) => user.id === post.userId)
        post.author = user.name;
        return post;
    })
    res.status(200).json(posts)
})

server.listen(PORT, () => {
    console.log(`server running on fteha framework on port ${PORT}`)
})