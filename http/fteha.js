// Our little mini-Express framework, fteha is my family name (;
const http = require('node:http');
const fs = require('node:fs/promises')

class Fteha {
    constructor() {
        this.server = http.createServer()
        this.routes = {}
        this.middleware = [];

        this.server.on('request', (req, res) => {

            // Send a file back to the client
            res.sendFile = async (path, mime) => {
                const fileHandle = await fs.open(path, 'r')
                const fileStream = fileHandle.createReadStream()

                res.setHeader('Content-Type', mime)

                fileStream.pipe(res)
            };
            
            // set the status code of the response and json
            res.status = (code) => {
                res.statusCode = code;
                return res;
            }

            res.json = (data) => {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(data))
            }


            // Run all the midddleware functions before we run routes
            // this.middleware[0](req, res, () => {
            //     this.middleware[1](req, res, () => {
            //         this.middleware[2](req, res, () => {
            //             this.routes[req.method.toLowerCase() + req.url](req, res)
            //         })
            //     })
            // })


            // Run all the middleware functions before we run the corresponding route
            const runMiddleware = (req, res, middleware, index) => {
                // Out exit point...
                if (index === middleware.length) {
                    // If the routes object does not have a key of req.method + req.url, return 404
                    if (!this.routes[req.method.toLocaleLowerCase() + req.url]) {
                        return res
                            .status(404)
                            .json({ error: `Cannot ${req.method} ${req.url}` });
                    }

                    this.routes[req.method.toLowerCase() + req.url](req, res);
                } else {
                    middleware[index](req, res, () => {
                        runMiddleware(req, res, middleware, index + 1);
                    });
                }
            };

            runMiddleware(req, res, this.middleware, 0);
        })
    }


    route(method, path, cb){
        this.routes[method + path] = cb
    }

    beforeEach(cb) {
        this.middleware.push(cb)
    }

    listen (port, cb) {
        this.server.listen(port, () => {
            cb()
        })
    }
}

module.exports = Fteha;