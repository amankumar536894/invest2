import React from 'react'
import './UserDashboard.css'
import UserNavbaar from '../../../components/User/UserNavbaar/UserNavbaar'
import UserDashboardSection from '../../../components/User/UserDashboardSection/UserDashboardSection'

const UserDashboard = () => {
  return (
    <>
      <div className="userdashboard">
        <UserNavbaar/>
        <UserDashboardSection/>
      </div>
    </>
  )
}

export default UserDashboard
