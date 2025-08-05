import React from 'react'
import './UserPlan.css'
import UserNavbaar from '../../../components/User/UserNavbaar/UserNavbaar'
import UserPlanSection from '../../../components/User/UserPlanSection/UserPlanSection'


const UserPlan = () => {
  return (
    <>
      <div className="userplan">
        <UserNavbaar/>
        <UserPlanSection/>
      </div>
    </>
  )
}

export default UserPlan
