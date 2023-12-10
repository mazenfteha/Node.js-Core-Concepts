const EventEmitter = require('events');

class Emitter extends EventEmitter {}

const myE = new Emitter()

myE.on("greeting", () => {
    console.log("Hello, world!")
})

myE.emit("greeting")

//How EventEmitter Works Behind the Scenes?
/*
nothing hard we not doing any thing asynchronously we're jest adding 
functions to an object and then we're looping through that using emit method

{
    foo () =>{...}
    foo () =>{...}
    foo (x) =>{...}
    bar () =>{...}
}

object.emit("eventName")
object.emit("eventName", parameter)
*/

myE.on("foo", () => {
    console.log('an event occurred 1.')
})

myE.on("foo", () => {
    console.log('an event occurred 2.')
})

myE.on("foo", (x) => {
    console.log('an event with parameter occurred')
    console.log(x)
})

myE.emit("foo")
myE.emit("foo", "some text")
