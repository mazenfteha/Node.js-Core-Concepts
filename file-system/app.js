const fs = require("fs/promises");

(async() => {
    //comands
    const CREATE_FILE ="create a file"
    const DELETE_FILE = "delete the file"
    const RENAME_FILE = "rename the file"
    const ADD_TO_FILE = "add to the file"


    const createFile = async (path) => {
        try {
            // we want to check whether or not we already have that file
            const existingFileHandle = await fs.open(path, "r")
            existingFileHandle.close()
            // we already have that file
            return console.log(`the file ${path} already exists`)
        } catch (e) {
            //we dont have the file, now we should create it
            const newFileHandle = await fs.open(path, "w")
            console.log("A new file was successfully created.")
            newFileHandle.close()
        }
    }

    const deleteFile = async (path) => {
        try {
            await fs.unlink(path)
            console.log('file was successfully deleted')
        } catch (e) {
            if(e.code === "ENDENT") {
                console.log("No file at this path to remove.")
            } else {
                console.log("An error occured while removing the file")
                console.log(e)
            }
        }
    }

    const renameFile = async (oldPath, newPath) => {
        try {
            await fs.rename(oldPath, newPath)
            console.log('file was successfully renamed')
        } catch (error) {
            if(e.code === "ENDENT") {
                console.log("No file at this path to rename, or the destination doesn't exist")
            } else {
                console.log("An error occured while rename the file")
                console.log(e)
            }
        }
        
    }
    let addedContent;

    const addToFile = async (path, content) => {
        if(addedContent === content) return;
        try {
            const fileHandle = await fs.open(path, "a")
            fileHandle.write(content)
            addedContent = content
            console.log('content was successfully added')
        } catch (error) {
            console.log("An error occured while adding to the file")
            console.log(e)
        }
    }

    const commandFileHandler = await fs.open("./command.txt", "r")

    commandFileHandler.on("change", async () => {

        //get the size of our file
        const size = (await commandFileHandler.stat()).size;
        //allocate our buffer with size
        const buff = Buffer.alloc(size)
        // the location at which we want to start filling our buffer
        const offset = 0;
        // how many bytes we want to read
        const length = buff.byteLength;
        // the position that we want start reading the file from
        const position = 0;

        //we always want to read the whole content
        await commandFileHandler.read(buff, offset, length, position)
        const command = buff.toString("utf-8")

        //create a file
        //create a file <path>
        if(command.includes(CREATE_FILE)) {
            const filePath = command.substring(CREATE_FILE.length + 1)
            createFile(filePath)
        }

        //delete a file
        //delte the file <path>
        if(command.includes(DELETE_FILE)) {
            const filePath = command.substring(DELETE_FILE.length + 1).trim();
            deleteFile(filePath)
        }

        //rename file
        //rename the file <path> to <new-path>
        if(command.includes(RENAME_FILE)) {
            const _idx = command.indexOf(" to ")
            const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx)
            const newFilePath = command.substring(_idx + 4)

            renameFile(oldFilePath, newFilePath)
        }


        //add to file
        //add to the file <path> this content: <content>
        if(command.includes(ADD_TO_FILE)){
            const _idx = command.indexOf(" this content: ")
            const filePath = command.substring(ADD_TO_FILE.length + 1, _idx)
            const content = command.substring(_idx + 15)

            addToFile(filePath, content)
        }
    })


    //our watcher
    const watcher = fs.watch("./command.txt")
    
    for await (const event of watcher) {
        if(event.eventType === "change") {
            commandFileHandler.emit("change")
        }
    }
})();