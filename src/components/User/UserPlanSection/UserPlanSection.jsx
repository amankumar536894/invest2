import React, { useState, useEffect } from "react";
import "./UserPlanSection.css";
import { IndianRupee, TrendingUp, Calendar } from "lucide-react";
import "../../PlansSection/PlansSection.css";

const UserPlanSection = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const token = localStorage.getItem('investor-token');
      
      if (!token) {
        setError("No authentication token found");
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/investor-auth/investment-plans`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPlans(data.data.plans || []);
        setError("");
      } else {
        setError(data.message || "Failed to fetch plans");
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  // Helper to format investment range
  const formatRange = (min, max) => {
    if (min === max) return `₹${min}`;
    return `₹${min} - ₹${max}`;
  };

  return (
    <div className="userplansection">
      <p className="investplanusersectitle">Investment Plans</p>
      
      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchPlans} className="retry-btn">Retry</button>
        </div>
      )}
      
      <div className="planmainbox">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="no-plans">
            <p>No investment plans available.</p>
          </div>
        ) : (
          plans.map((plan) => (
            <div key={plan._id} className="planbox">
              <div className="plantitlebox">
                <p className="planname">{plan.name}</p>
                <p className={`planstatus ${plan.status?.toLowerCase()}`}>
                  {plan.status}
                </p>
              </div>
              <div className="rangebox">
                <IndianRupee />
                <div className="rangeinnerbox">
                  <p className="investmentrangetitle">Investment Range</p>
                  <p className="investmentrangeexact">
                    {plan.investmentRange}
                  </p>
                </div>
              </div>
              <div className="returntimeboth">
                <div className="returntimebothbox">
                  <TrendingUp />
                  <div className="rangeinnerbox">
                    <p className="investmentrangetitle">
                      {plan.returnMultiplier}x Return
                    </p>
                    <p className="investmentrangeexact">
                      In {plan.durationMonths} Months
                    </p>
                  </div>
                </div>
                <div className="returntimebothbox">
                  <Calendar />
                  <div className="rangeinnerbox">
                    <p className="investmentrangetitle">ROI Paid</p>
                    <p className="investmentrangeexact">
                      {plan.roiPaymentFrequency}
                    </p>
                  </div>
                </div>
              </div>
              {plan.description && (
                <div className="plan-description">
                  <p>{plan.description}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserPlanSection;
