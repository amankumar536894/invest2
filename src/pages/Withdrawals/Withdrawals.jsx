import React from 'react'
import './Withdrawals.css'
import Navbaar from '../../components/Navbaar/Navbaar'
import WithdrawlSection from '../../components/WithdrawlSection/WithdrawlSection'

const Withdrawals = () => {
  return (
    <>
      <div className="withdrawlpage">
        <Navbaar/>
        <WithdrawlSection/>
      </div>
    </>
  )
}

export default Withdrawals
