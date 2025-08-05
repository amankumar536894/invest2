import React from 'react'
import './Investors.css'
import Navbaar from '../../components/Navbaar/Navbaar'
import InvestorsSection from '../../components/InvestorsSection/InvestorsSection'

const Investors = () => {
  return (
    <>
      <div className="investors">
        <Navbaar/>
        <InvestorsSection/>
      </div>
    </>
  )
}

export default Investors
