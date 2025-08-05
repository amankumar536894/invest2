import React from 'react'
import './ConfirmWithdrawl.css'
import { X } from 'lucide-react'

const ConfirmWithdrawl = ({withdrawpopup, setWithdrawpopup}) => {
  return (
    <>
      <div className={`confirmWithdrawl ${withdrawpopup ? 'confirmWithdrawl-active' : ''}`} onClick={()=>{setWithdrawpopup(false)}}>
        <div className="confirmWithdrawl-inner" onClick={(e)=>{e.stopPropagation()}}>
            <X className='confirmwithdrawcut' onClick={()=>{setWithdrawpopup(false)}} />
            <p className='withconfirmline'>Are you sure you want to withdraw from Amit kumar</p>
            <div className='withdrawlconfirmbtns'>
                <p className='withdrawlconfirm-cancel' onClick={()=>{setWithdrawpopup(false)}}>Cancel</p>
                <p className='withdrawlconfirm-confirm'>Confirm</p>
            </div>
        </div>
      </div>
    </>
  )
}

export default ConfirmWithdrawl
