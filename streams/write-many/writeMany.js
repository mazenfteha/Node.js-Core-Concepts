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

// const fs = require("fs/promises");
// (async () => {
//     console.time("writeMany")

//     const fileHandle = await fs.open("./test.txt", "w")

//     const stream = fileHandle.createWriteStream()

//     for(let i = 0; i < 100000 ; i++) {
//         const buff = Buffer.from(` ${i} `, "utf-8")
//         stream.write(buff)
//     } 
//     console.timeEnd("writeMany")
// })()


//fixing the memory issue
const fs = require("fs/promises");
(async () => {
    console.time("writeMany")

    const fileHandle = await fs.open("./test.txt", "w")

    const stream = fileHandle.createWriteStream()

    // console.log(stream.writableHighWaterMark)

    // //create a buffer that have same size as HighWaterMark (16kb)
    // const buff = Buffer.alloc(16383, 10);
    // console.log(stream.write(buff)) //everytime this fun return false means the internal buffer is full
    // console.log(stream.write(Buffer.alloc(1, "a"))) //now it's full

    // //we need to let the stream empty (listen to event drain)
    // //and in the callback fun we write more and more once we know that the internal buffer is full
    // stream.on("drain", () => {
    //     console.log(stream.write(Buffer.alloc(1, "a")))
    //     console.log("we are now safe to write more")
    // })

    let i = 0;

    const writeMany = () => {
        while(i < 100000) {
            const buff = Buffer.from(` ${i} `, "utf-8")
            
            //this is our last write
            if (i === 99999) {
                return stream.end(buff)
            }
            //we need now to check for stream value if returns false means we need to stop the loop and listen for drain event
            if(!stream.write(buff)) break;
            i++
        } 
    }
    writeMany();
    // resume our loop once our stream's internal byffer is empty
    stream.on("drain", () => {
        writeMany()
    })

    stream.on("finish", () => {
        console.timeEnd("writeMany")
        fileHandle.close()
    })
})()
