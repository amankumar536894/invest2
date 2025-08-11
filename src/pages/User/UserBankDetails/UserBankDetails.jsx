import React from 'react'
import './UserBankDetails.css'
import UserNavbaar from '../../../components/User/UserNavbaar/UserNavbaar'
import UserBankDetailsSection from '../../../components/User/UserBankDetailsSection/UserBankDetailsSection'

const UserBankDetails = () => {
  return (
    <>
      <div className="userbankdetails">
        <UserNavbaar/>
        <UserBankDetailsSection/>
      </div>
    </>
  )
}

export default UserBankDetails
