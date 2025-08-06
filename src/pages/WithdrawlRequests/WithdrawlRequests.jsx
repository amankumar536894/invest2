import React from 'react'
import './WithdrawlRequests.css'
import Navbaar from '../../components/Navbaar/Navbaar'
import WithdrawlRequestSection from '../../components/WithdrawlRequestSection/WithdrawlRequestSection'

const WithdrawlRequests = () => {
  return (
    <>
      <div className="withdrawlrequestspage">
        <Navbaar/>
        <WithdrawlRequestSection/>
      </div>
    </>
  )
}

export default WithdrawlRequests
