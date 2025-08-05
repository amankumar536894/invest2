import React from 'react'
import './InvestmentPlans.css'
import Navbaar from '../../components/Navbaar/Navbaar'
import PlansSection from '../../components/PlansSection/PlansSection'

const InvestmentPlans = () => {
  return (
    <>
      <div className="investmentplans">
        <Navbaar/>
        <PlansSection/>
      </div>
    </>
  )
}

export default InvestmentPlans
