import React from 'react'
import UserNavbaar from '../../../components/User/UserNavbaar/UserNavbaar'
import UserDepositSection from '../../../components/User/UserDepositSection/UserDepositSection'
import './UserDeposit.css'

function UserDeposit() {
  return (
    <div className='user-deposit-page'>
        <UserNavbaar/>
        <UserDepositSection/>
    </div>
  )
}

export default UserDeposit
