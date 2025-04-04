import { useEffect, useState, useRef } from 'react'
import './App.css'
import {io} from "socket.io-client"
import MsgCard from './components/msgCard';
import {v4 as uuid} from 'uuid'
import MsgForm from './components/MsgForm';
import GroupTab from './components/GroupTab';

function App() {

  const [users, setUsers] = useState([]);
  const [socketId, setSocketId] = useState(null);
  const [msg, setMsg] = useState("");
  const [receiver, setReceiver] = useState("");
  const [messages, setMessages] = useState([]);
  const [isGroup, setIsGroup] = useState(false);
  const socketRef = useRef();

  useEffect(()=>{
    if(!socketRef.current){
      socketRef.current = io("http://localhost:3000",{withCredentials:true});
    }

    const socket = socketRef.current;
    socket.on('connect',()=>{
      // console.log(`welcome to the server, ${socket?.id}`);
      setSocketId(socket?.id);
    })

    socket.on('welcome',(s)=>{
      console.log(s);
    })

    socket.on('msg-listener',({text, from})=>
      setMessages((pre)=>[...pre, 
        {id:uuid(), text, receiver:from, type:'send'}
      ])
    )

    socket.on('msg-self',({text,to})=>
      setMessages((pre)=>[...pre,
        {id:uuid(), text, receiver:to,type:'self'}
      ])
    )

    socket.on('users', (users)=>{
      // console.log(users);
      setUsers(users);
    })

    socket.on('user-disconnet',(id)=>{
      console.log(`${id} disconnected`);
      setUsers((pre)=>
        pre.filter((preId)=> preId!==id)
      )
    })

    return ()=> {
      socket.off('connect');
      socket.off('welcome');
      socket.off('msg-listener');
      socket.off('msg-self');
      socket.off('users');
      socket.off('user-disconnected');
      socket.disconnect();
      // socketRef.current = null;
    };
  },[]);

  useEffect(()=>{
    console.log(messages);
  },[messages]);

  const handleSubmit = (e)=>{
    e.preventDefault();
    socketRef.current.emit('msg',{msg, receiver});
    setMsg("");
  }

  const handleJoin =(roomId)=>{
    socketRef.current.emit('join',(roomId));
  }

  return (
    <>
         <div className='text-2xl font-bold'> 
            Hi, {socketId}
         </div>
         <div>
          <div className='flex m-8 gap-2 justify-center'>
            <button name='personal' onClick={()=>setIsGroup(!isGroup)} className='flex-1 bg-green-500 rounded-lg h-[40px] hover:cursor-pointer hover:shadow-[2px_2px_3px_white] focus:bg-gray-500'>Personal Chat</button>
            <button name="group" onClick={()=>setIsGroup(!isGroup)}  className='flex-1 bg-green-500 rounded-lg h-[40px] hover:cursor-pointer hover:shadow-[2px_2px_3px_white] focus:bg-gray-500'>Room Chat</button>
          </div> 
          {
            isGroup
            ?  <GroupTab msg={msg} setMsg={setMsg} handleSubmit={handleSubmit} setReceiver={setReceiver} onJoin={handleJoin}/> 
            :  <MsgForm msg={msg} setMsg={setMsg} users={users} handleSubmit={handleSubmit} setReceiver={setReceiver}/>
          }
          <h2 className='font-extrabold text-xl'>Your Messages</h2>
          <div className="mx-2 sm:mx-8">
            {
              messages.map((message)=><MsgCard key={message.id} msgReceiver={message.receiver} msgText={message.text} msgType={message.type}/>)
            }
          </div>  
         </div>
    </>
  )
}

export default App
