import React from 'react'

function MsgForm({users,msg,setMsg,setReceiver,handleSubmit}) {
  return (
    <>
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
              <button type='submit' className='bg-green-500 rounded-lg h-[40px] hover:cursor-pointer hover:shadow-[2px_2px_3px_white]'>send</button>
            </div>
        </form>
    </>
  )
}

export default MsgForm