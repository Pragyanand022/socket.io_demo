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

const users = [];

io.on('connection', (socket)=>{
    console.log("a new user connected");
    console.log('userId:' , socket.id)     
    users.push(socket.id);
    io.emit('users',users);    
    socket.emit('welcome',`Welcome to the server ${socket.id}`); 
    socket.broadcast.emit('welcome',`${socket.id} joined the server`);

    socket.on('msg', (message)=>{   
        console.log(message.msg, message.receiver);
        socket.to(message.receiver).emit('msg-listener',({text:message.msg, from:socket.id}));
        socket.emit('msg-self',({text:message.msg, to:message.receiver}));
    })

    socket.on('join',(room)=>{
        socket.join(room);
    })
})   
    
app.get('/',(req,res)=>{ 
    res.send("hi"); 
})
  
httpServer.listen(port, ()=>{
    console.log(`server listening on port ${port}`);
}) 