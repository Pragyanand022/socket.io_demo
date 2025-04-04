import React, { useState } from 'react'

function GroupTab({msg,setMsg,setReceiver,handleSubmit,onJoin}) {
    const [room, setRoom] = useState('');
    const handleChange = (e)=>{
        const val = e.target.value;
        setRoom(val);
        setReceiver(val);
    }
  return (
    <>
        <form onSubmit={handleSubmit}>
            <div className='flex flex-col m-8'>
              <label htmlFor="receiver">Enter the room name to join...</label>
                <div className='flex gap-2 items-center mt-2'>
                <input type='text' className='p-2 h-[40px] w-3/4 border-1' onChange={handleChange} value={room}/>
                <button type='button' onClick={onJoin(room)} className='w-1/4 bg-green-500 rounded-lg h-[40px] hover:cursor-pointer hover:shadow-[2px_2px_3px_white]'>Join</button>
                </div>
              <label htmlFor="msg" className='mt-3'>write your message...</label>
              <textarea rows={3} name='msg' onChange={(e)=>setMsg(e.target.value)} className='border-4 mt-1 mb-3 p-1' value={msg}/>
              <button type='submit' className='bg-green-500 rounded-lg h-[40px] hover:cursor-pointer hover:shadow-[2px_2px_3px_white]'>send</button>
            </div>
        </form>
    </>
  )
}

export default GroupTab