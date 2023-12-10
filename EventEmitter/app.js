// work with our EvntEmiiter that we build
const EventEmiiter = require('./events')

class Emitter extends EventEmiiter {}

const myE = new Emitter()

myE.on("greeting", () => {
    console.log("Hello, world!")
})

myE.emit("greeting")