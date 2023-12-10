# Node.js under the hood
## What is Node.js
- Node.js is an asynchronous (event-driven) ?! javaScript (runtime) ?! or it is a javaScript runtime build on Chrome's V8( javaScript Engine) ?!

### hold on that is not make any sense 
- let's understand the hole proccess when we run a node.js command

![Alt text](/Node.js-Under-The-Hood/image.png)

- when you running JS you giving instracture to your computer to do something, so we need away to convert our code to a machine code [011000..] in this case we use javaScript Engine ===> V8

### V8 (first important dependinces)
- is library provides Node.js with a javaScript engine, which controls via the v8 C++ api
- V8 compiler builds code and creates an executable file in the 'out' folder.
- allows running JavaScript and binding new functionalities to JavaScript in C++ applications.
- Node.js depends on V8 and libuv as crucial dependencies for its functionality.


so i run js code bit actually behinde= the sense am calling C++ code to have access with my OS

so the clear definition for Node.js it's a C++ application that have v8 emoedded into to it

### lipuv (second and most important dependinces)
think of Node as a server-side language but server-side needs to be able to do some things that js couldint do so it's need to ablw to deal with CPU

- libuv is a library that provides event-driven, non-blocking I/O with a focus on asynchronous I/O. It is used by Node.js to handle asynchronous operations such as file (file system) I/O, networking, timers, DNS, signal handling , polling and streaming


## What really happen when start a node process (run some code)


![Alt text](/Node.js-Under-The-Hood/image-1.png)



- Node.js uses hardware like CPU, RAM, storage, and network card to run processes.
- The operating system controls resource allocation and communication between programs and hardware.
- Node.js relies on the V8 engine and libuv package to handle file system and network operations.
- Node.js can execute code asynchronously, allowing for non-blocking operations.
- Event loop and libuv enable asynchronous execution in Node.js.
- Using set timeout function allows for delayed execution of code.