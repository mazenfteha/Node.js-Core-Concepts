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

//Middlewares
// For authentication
server.beforeEach((req, res, next) => {
    const routesToAuthenticate = [
        "GET /api/user",
        "PUT /api/user",
        "POST /api/posts",
        "DELETE /api/logout",
    ];

    if (routesToAuthenticate.indexOf(req.method + " " + req.url) !== -1) {
        // If we have a token cookie, then save the userId to the req object
        if (req.headers.cookie) {
            const token = req.headers.cookie.split("=")[1];

            const session = SESSTIONS.find((session) => session.token === token);
            if (session) {
                req.userId = session.userId;
                return next();
            }
        }

        return res.status(401).json({ error: "Unauthorized" });
    } else {
        next();
    }
});


const parseJSON = (req, res, next) => {
    // This is only good for bodies that their size is less than the highWaterMark value
    if (req.headers["content-type"] === "application/json") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString("utf-8");
        });

        req.on("end", () => {
            body = JSON.parse(body);
            req.body = body;
            return next();
        });
    } else {
        next();
    }
};

// For parsing JSON body
server.beforeEach(parseJSON);

// For different routes that need the index.html file
server.beforeEach((req, res, next) => {
    const routes = ["/", "/login", "/profile", "/new-post"];

    if (routes.indexOf(req.url) !== -1 && req.method === "GET") {
        return res.status(200).sendFile("./public/index.html", "text/html");
    } else {
        next();
    }
});

//---------------Files Routes-------//

server.route('get', '/styles.css', (req, res) => {
    res.sendFile('./public/styles.css', "text/css")
})

server.route('get', '/scripts.js', (req, res) => {
    res.sendFile('./public/scripts.js', "text/javascript")
})

//---------------JSON Routes-------//

// Log a users in and give them a token
server.route("post", "/api/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if the user exists
    const user = USERS.find((user) => user.username === username);

    // Check the password if the user was found
    if (user && user.password === password) {
        // At this point, we know that the client is who they say they are

        // Generate a random 10 digit token
        const token = Math.floor(Math.random() * 10000000000).toString();

        // Save the generated token
        SESSTIONS.push({ userId: user.id, token: token });

        res.setHeader("Set-Cookie", `token=${token}; Path=/;`);
        res.status(200).json({ message: "Logged in successfully!" });
    } else {
        res.status(401).json({ error: "Invalid username or password." });
    }
});

// Log a user out
server.route('delete', '/api/logout', (req, res) => {})

// Send user info
server.route('get', '/api/user', (req, res) => {
    const user = USERS.find((user) => user.id === req.userId);
    res.json({ username: user.username, name: user.name });
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