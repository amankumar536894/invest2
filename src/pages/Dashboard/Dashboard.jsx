import React from 'react'
import './Dashboard.css'
import Navbaar from '../../components/Navbaar/Navbaar'
import Dash from '../../components/Dash/Dash'

const Dashboard = () => {
  return (
    <>
      <div className="dashboard">
        <Navbaar />
        <Dash />
      </div>
    </>
  )
}

export default Dashboard
