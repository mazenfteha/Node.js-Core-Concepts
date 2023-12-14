// in this file we are going to write some code that 
//is associated writing some thing with a file many times


//using promises
//Exection time : 5s
//CPU Usage: 100% (one core)
//Memory Usage : 50MB

//const fs = require("fs/promises");
// (async () => {
//     console.time("writeMany")

//     const fileHandle = await fs.open("./test.txt", "w")

//     for(let i = 0; i < 100000 ; i++) {
//         await fileHandle.write(` ${i} `)
//     } 
//     console.timeEnd("writeMany")
// })()


//using synchronous and buffers to make it more faster
//Exection time :1s
//CPU Usage: 100% (one core)
//Memory Usage : 50MB
// const fs = require("node:fs");

// (async () => {
//     console.time("writeMany")
//     fs.open("./test.txt", "w", (err, fd) => {
//         for(let i = 0; i < 100000 ; i++) {
//             const buff = Buffer.from(` ${i} `, "utf-8")
//             fs.writeSync(fd, buff)
//         }
//         console.timeEnd("writeMany")
//     })
// })()


//this time with streams to make the code extremly faster
//Exection time : 100 ms
//CPU Usage: 100% (one core)
//Memory Usage : 200mb (bad practice) (DON'T DO IT THIS WAY!!!)

const fs = require("fs/promises");
(async () => {
    console.time("writeMany")

    const fileHandle = await fs.open("./test.txt", "w")

    const stream = fileHandle.createWriteStream()

    for(let i = 0; i < 100000 ; i++) {
        const buff = Buffer.from(` ${i} `, "utf-8")
        stream.write(buff)
    } 
    console.timeEnd("writeMany")
})()

