import { useEffect, useState, useRef } from 'react'
import './App.css'
import {io} from "socket.io-client"

function App() {

  const [socketId, setSocketId] = useState(null);
  const [msg, setMsg] = useState("");
  const [receiver, setReceiver] = useState("");
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

    socket.on('msg-listener',(msg)=>
      console.log(msg)
    )

    return ()=> {
      socket.off('connect');
      socket.off('welcome');
      socket.off('msg-listener');
      socket.disconnect();
    };
  },[]);

  const handleSubmit = (e)=>{
    e.preventDefault();
    socketRef.current.emit('msg',{msg, receiver});
    setMsg("");
  }

  return (
    <>
         <div className='text-2xl font-bold'> 
            Hi, {socketId}
         </div>
         <div>
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col m-8'>
              <label htmlFor="receiver">enter id of the reciever</label>
              <input type="text" onChange={(e)=>setReceiver(e.target.value)} name='receiver' className='border-2 p-1 mt-1' value={receiver}/>
              <label htmlFor="msg" className='mt-3'>write your message...</label>
              <textarea rows={3} name='msg' onChange={(e)=>setMsg(e.target.value)} className='border-4 mt-1 mb-3 p-1' value={msg}/>
              <button type='submit' className='bg-green-500 rounded-lg h-[40px]'>send</button>
            </div>
          </form>
         </div>
    </>
  )
}

export default App
