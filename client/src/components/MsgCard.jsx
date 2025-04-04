import React from 'react'

function MsgCard({msgReceiver, msgText, msgType}) {
  return (<>
    {msgType==='send' ? (<div className='border-1 m-1 w-full rounded-lg bg-blue-200 text-left px-2 text-black'>
        <h3 className='font-bold'>
            {msgReceiver}
        </h3>
        <p>
            {msgText}
        </p>
    </div>
    ) : (<div className='border-1 m-1 w-full rounded-lg bg-green-200 text-right px-2 text-black'>
        <h3 className='font-bold'>
            {msgReceiver}
        </h3>
        <p>
            {msgText}
        </p>
    </div>)
    }
  </>
  )
}

export default MsgCard