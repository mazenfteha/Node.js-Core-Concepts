# Node File Handler
 A Node.js app that reads commands associated with creating, appending, deleting, and renaming files from a file and executes them.

The application watches a file named "command.txt" for changes, and every time a change happens, it will read the file's content and do what the user specified.

For instance, if a user writes "create a file text.txt" in the command.txt file and saves it, a file named file.txt will be created in the working directory. We could also specify absolute paths.

### We have these available operations:
- creating a file
- deleting a file
- renaming a file
- appending to a file


### And we should write the commands in the following formats in the command.txt file:
- create a file path
- delete the file path
- rename the file path to new-path
- add to the file path this content: content

## Steps of implemntation 
- we gonna watch this file (command.txt) and lock for events
- first of all we need to watch the file
- after this we ready to read the contents of this file and acually do something with it (create - rename - add to file - delete)
- now tryna to read the content of that file when we change that file and to read from a file first we need to open first then read 
- "r" flag mean iam only going to read 
- but before we read we need to know the file size to allocate it and we should always be reading from the first character of the file 
- look for a custom event "change" and we going to emit the change emit (every time we make change on command.txt)

- so now it's time for read the content of file but all we get now just 0's and 1's and we need to run these zeros and ones through a decoder so that we have some meaningful data
// decoder 01 => meaningful

- start create a file : create a file path and then create function to create a file with path as a paramenter
- in this finction  we want to check whether or not we already have that file and if we do not have it we will create a new file and always we close the file after open or created it
- and now we able to create any file in place in our hard drive (just give the absolute path)
- our second function delete the file by using fs.unlink(path)
- our theird function rename the file by using fs.rename(oldPath, newPath)
- finally function is add to file by using open() and write fs methods 
-"a" flag stands for opening a file and appending

#### to run the app
```
node app.js
```