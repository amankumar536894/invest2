import React from "react";
import "./DepopsiteRequests.css";
import Navbaar from "../../components/Navbaar/Navbaar";
import DepositeRequestSection from "../../components/DepositeRequestSection/DepositeRequestSection";

const DepopsiteRequests = () => {
  return (
    <>
      <div className="depositerequests">
        <Navbaar />
        <DepositeRequestSection/>
      </div>
    </>
  );
};

export default DepopsiteRequests;
