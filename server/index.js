import express from "express";
import {Server} from "socket.io"
import http from "http"
import cors from 'cors'

const app = express();
const port = 3000;

app.use(cors());

const httpServer = http.createServer(app);

const io = new Server(httpServer,{
    cors:{
        origin: "http://localhost:5173",
        methods:["GET", "POST"],
        credentials: true
    }
})

io.on('connection', (socket)=>{
    console.log("a new user connected");
    console.log('userId:' , socket.id) 
    socket.emit('welcome',`Welcome to the server ${socket.id}`); 
    socket.broadcast.emit('welcome',`${socket.id} joined the server`);

    socket.on('msg', ({msg, receiver})=>{
        console.log({msg,receiver});
        socket.to(receiver).emit('msg-listener',msg);
    })
}) 

app.get('/',(req,res)=>{
    res.send("hi"); 
})


httpServer.listen(port, ()=>{
    console.log(`server listening on port ${port}`);
})