import { useEffect, useState, useRef } from 'react'
import './App.css'
import {io} from "socket.io-client"
import MsgCard from './components/msgCard';
import {v4 as uuid} from 'uuid'

function App() {

  const [users, setUsers] = useState([]);
  const [socketId, setSocketId] = useState(null);
  const [msg, setMsg] = useState("");
  const [receiver, setReceiver] = useState("");
  const [messages, setMessages] = useState([]);
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

  const handleSubmit = (e)=>{
    e.preventDefault();
    socketRef.current.emit('msg',{msg, receiver});
    setMsg("");
  }

  useEffect(()=>{
    console.log(messages);
  },[messages]);

  return (
    <>
         <div className='text-2xl font-bold'> 
            Hi, {socketId}
         </div>
         <div>
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col m-8'>
              <label htmlFor="receiver">select id of the reciever</label>
              <select className='border-1 mt-2' onChange={(e)=>setReceiver(e.target.value)}>
                <option className='text-black border-1'>Select Reciever</option>
                {
                  users.map((user)=><option key={user} value={user} className='text-black border-1'>{user}</option>)
                }
              </select>
              <label htmlFor="msg" className='mt-3'>write your message...</label>
              <textarea rows={3} name='msg' onChange={(e)=>setMsg(e.target.value)} className='border-4 mt-1 mb-3 p-1' value={msg}/>
              <button type='submit' className='bg-green-500 rounded-lg h-[40px]'>send</button>
            </div>
          </form>

          <h2 className='font-extrabold text-xl'>Your Messages</h2>
          <div className="mx-2">
            {
              messages.map((message)=><MsgCard key={message.id} msgReceiver={message.receiver} msgText={message.text} msgType={message.type}/>)
            }
          </div> 
         </div>
    </>
  )
}

export default App
