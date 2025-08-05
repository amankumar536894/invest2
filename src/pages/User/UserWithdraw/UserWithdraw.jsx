import React from 'react'
import './UserWithdraw.css'
import UserNavbaar from '../../../components/User/UserNavbaar/UserNavbaar'
import UserWithdrawSection from '../../../components/User/UserWithdrawSection/UserWithdrawSection'


export default function UserWithdraw() {
  return (
    <div className='user-deposit-page'>
        <UserNavbaar/>
        <UserWithdrawSection/>
    </div>
  )
}
