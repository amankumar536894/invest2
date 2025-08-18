import React, { useState, useEffect } from "react";
import "./UserPlanSection.css";
import { IndianRupee, TrendingUp, Calendar, CheckCircle, Save } from "lucide-react";
import "../../PlansSection/PlansSection.css";

const UserPlanSection = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [currentSelectedPlans, setCurrentSelectedPlans] = useState([]);
  const [investorId, setInvestorId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchInvestorData();
    fetchPlans();
  }, []);

  const fetchInvestorData = async () => {
    try {
      const token = localStorage.getItem('investor-token');
      
      if (!token) {
        setError("No authentication token found");
        return;
      }

      // Get investor ID from dashboard
      const dashboardResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investor-auth/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const dashboardData = await dashboardResponse.json();

      if (dashboardResponse.ok) {
        const investorId = dashboardData.data.investor._id;
        setInvestorId(investorId);
        
        // Get current selected investment plans
        const investorResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investor/${investorId}/miscellaneous`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (investorResponse.ok) {
          const investorData = await investorResponse.json();
          const investor = investorData.data;
          
          if (investor.investmentPlans && investor.investmentPlans.length > 0) {
            const planIds = investor.investmentPlans.map(plan => plan._id);
            setSelectedPlans(planIds);
            setCurrentSelectedPlans(investor.investmentPlans);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching investor data:', error);
    }
  };

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
  const handlePlanSelection = (planId) => {
    setSelectedPlans(prev => 
      prev.includes(planId)
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );
  };

  const handleSaveSelection = async () => {
    if (!investorId) {
      setError("Investor ID not found");
      return;
    }

    if (selectedPlans.length === 0) {
      setError("Please select at least one investment plan");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem('investor-token');
      
      if (!token) {
        setError("No authentication token found");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investor/${investorId}/miscellaneous`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          investmentPlans: selectedPlans
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Investment plans updated successfully!");
        setCurrentSelectedPlans(data.data.investmentPlans || []);
        
        // Auto-dismiss success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else {
        setError(data.message || 'Failed to update investment plans');
      }
    } catch (error) {
      console.error('Error updating investment plans:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to format investment range
  const formatRange = (min, max) => {
    if (min === max) return `₹${min}`;
    return `₹${min} - ₹${max}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="userplansection">
      <div className="userplan-header">
        <p className="investplanusersectitle">Investment Plans</p>
        <p className="userplan-subtitle">Select investment plans that interest you</p>
      </div>
      
      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => {fetchInvestorData(); fetchPlans();}} className="retry-btn">Retry</button>
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
        </div>
      )}

      {/* Current Selected Plans */}
      {currentSelectedPlans.length > 0 && (
        <div className="current-selected-section">
          <h3>Currently Selected Plans</h3>
          <div className="current-plans-grid">
            {currentSelectedPlans.map((plan) => (
              <div key={plan._id} className="current-selected-plan">
                <h4>{plan.name}</h4>
                <div className="current-plan-details">
                  <p><strong>Range:</strong> {formatCurrency(plan.minInvestment)} - {formatCurrency(plan.maxInvestment)}</p>
                  <p><strong>Returns:</strong> {plan.returnMultiplier}x in {plan.durationMonths} months</p>
                  <p><strong>ROI Payment:</strong> {plan.roiPaymentFrequency}</p>
                </div>
              </div>
            ))}
          </div>
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
            <div 
              key={plan._id} 
              className={`planbox selectable-plan ${selectedPlans.includes(plan._id) ? 'selected' : ''}`}
              onClick={() => handlePlanSelection(plan._id)}
            >
              <div className="plantitlebox">
                <p className="planname">{plan.name}</p>
                <div className="plan-status-selection">
                  <p className={`planstatus ${plan.status?.toLowerCase()}`}>
                    {plan.status}
                  </p>
                  {selectedPlans.includes(plan._id) && (
                    <CheckCircle className="selected-check" />
                  )}
                </div>
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

      {/* Save Selection Button */}
      {plans.length > 0 && selectedPlans.length > 0 && (
        <div className="save-selection-section">
          <p className="selection-info">
            {selectedPlans.length} plan{selectedPlans.length !== 1 ? 's' : ''} selected
          </p>
          <button 
            className="save-selection-btn" 
            onClick={handleSaveSelection}
            disabled={isSubmitting}
          >
            <Save />
            {isSubmitting ? "Saving..." : "Save Selection"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserPlanSection;
