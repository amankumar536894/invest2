import React, { useState, useEffect } from "react";
import "./UserBankDetailsSection.css";
import { Save, CreditCard, TrendingUp, CheckCircle } from "lucide-react";

function UserBankDetailsSection() {
  const [formData, setFormData] = useState({
    accountHolderName: "",
    investmentPlans: []
  });
  const [availablePlans, setAvailablePlans] = useState([]);
  const [currentBankDetails, setCurrentBankDetails] = useState(null);
  const [currentInvestmentPlans, setCurrentInvestmentPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [investorId, setInvestorId] = useState("");

  useEffect(() => {
    fetchInvestorData();
    fetchAvailablePlans();
  }, []);

  const fetchInvestorData = async () => {
    try {
      const token = localStorage.getItem('investor-token');
      
      if (!token) {
        setError("No authentication token found");
        setIsLoading(false);
        return;
      }

      // Get investor profile data
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investor-auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        const investor = data.data.investor;
        setInvestorId(investor._id);
        
        // Set current bank details and pre-fill form
        if (investor.bankDetails) {
          setCurrentBankDetails(investor.bankDetails);
          setFormData({
            accountHolderName: investor.bankDetails?.accountHolderName || "",
            investmentPlans: investor.investmentPlans ? investor.investmentPlans.map(plan => plan._id) : []
          });
        }
        console.log(investor)

        setError("");
      } else {
        setError(data.message || 'Failed to fetch investor data');
      }
    } catch (error) {
      console.error('Error fetching investor data:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailablePlans = async () => {
    try {
      const token = localStorage.getItem('investor-token');
      
      if (!token) {
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investor-auth/investment-plans`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        // Get plans from data.data.plans as per the API response
        const plans = data.data?.plans || [];
        // Filter active plans only if needed (though the API might already filter them)
        const activePlans = plans.filter(plan => plan.status === 'Active');
        setAvailablePlans(activePlans);
        
        // Also update current investment plans if any are selected
        if (formData.investmentPlans.length > 0) {
          const selectedPlans = activePlans.filter(plan => 
            formData.investmentPlans.includes(plan._id)
          );
          setCurrentInvestmentPlans(selectedPlans);
        }
      } else {
        console.error('Failed to fetch investment plans:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching investment plans:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const fieldName = name.replace('bank_', '');
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handlePlanSelection = (planId) => {
    setFormData(prev => ({
      ...prev,
      // allow selecting only one plan at a time (toggle behavior)
      investmentPlans: prev.investmentPlans.includes(planId) ? [] : [planId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    // Basic validation
    if (!formData.accountHolderName) {
      setError("Wallet address is required");
      setIsSubmitting(false);
      return;
    }

    if (formData.investmentPlans.length !== 1) {
      setError("Please select exactly one investment plan");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('investor-token');
      
      if (!token) {
        setError("No authentication token found");
        setIsSubmitting(false);
        return;
      }

      if (!investorId) {
        setError("Investor ID not found");
        setIsSubmitting(false);
        return;
      }

      // Prepare the request body according to the required format
      const requestBody = {
        bankDetails: {
          accountHolderName: formData.accountHolderName
        },
        investmentPlans: formData.investmentPlans
      };
      
      console.log('Submitting form data:', requestBody);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investor/${investorId}/miscellaneous`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log('Response from server:', data);

      if (response.ok && data.status === 'success') {
        setSuccessMessage(data.message || "Bank details and investment plans updated successfully!");
        setError("");
        
        // Update current data with the response data
        if (data.data) {
          // Update bank details from response
          if (data.data.bankDetails) {
            setCurrentBankDetails(data.data.bankDetails);
          }
          
          // Update investment plans from response
          if (data.data.investmentPlans) {
            setCurrentInvestmentPlans(data.data.investmentPlans);
          }
          
          // Update form data with the latest values
          setFormData(prev => ({
            ...prev,
            accountHolderName: data.data.bankDetails?.accountHolderName || prev.accountHolderName,
            investmentPlans: data.data.investmentPlans?.map(plan => plan._id) || prev.investmentPlans
          }));
        }
        
        // Auto-dismiss success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else {
        setError(data.message || 'Failed to update details. Please try again.');
      }
    } catch (error) {
      console.error('Error updating details:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="userbankdetailssection">
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="userbankdetailssection">
      <div className="bank-details-header">
        <h2><CreditCard /> Bank Details & Investment Plans</h2>
        <p>Manage your banking information and select investment plans</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="bank-details-content">
        {/* Current Details Display */}
        {(currentBankDetails || currentInvestmentPlans.length > 0) && (
          <div className="current-details-section">
            <h3>Current Details</h3>
            
            {currentBankDetails && (
              <div className="current-bank-details">
                <h4><CreditCard />  Wallet Address</h4>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label"> Wallet Address</span>
                    <span className="detail-value">{currentBankDetails.accountHolderName}</span>
                  </div>
                </div>
              </div>
            )}

            {currentInvestmentPlans.length > 0 && (
              <div className="current-investment-plans">
                <h4><TrendingUp /> Selected Investment Plans</h4>
                <div className="current-plans-grid">
                  {currentInvestmentPlans.map((plan) => (
                    <div key={plan._id} className="current-plan-card">
                      <h5>{plan.name}</h5>
                      <div className="plan-details">
                        <p><strong>Investment Range:</strong> {formatCurrency(plan.minInvestment)} - {formatCurrency(plan.maxInvestment)}</p>
                        <p><strong>Returns:</strong> {plan.returnMultiplier}x in {plan.durationMonths} months</p>
                        <p><strong>ROI Payment:</strong> {plan.roiPaymentFrequency}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Update Form */}
        <form onSubmit={handleSubmit} className="bank-details-form">
          <div className="form-section">
            <h3><CreditCard /> Wallet Address</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="bank_accountHolderName">Wallet Address</label>
                <input
                  type="text"
                  id="bank_accountHolderName"
                  name="bank_accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleInputChange}
                  placeholder="Enter wallet address"
                  required
                />
              </div>
              
            </div>
          </div>

          <div className="form-section">
            <h3><TrendingUp /> Select Investment Plans</h3>
            <p className="section-description">Choose the investment plans you're interested in</p>
            
            {availablePlans.length > 0 ? (
              <div className="plans-grid">
                {availablePlans.map((plan) => (
                  <div 
                    key={plan._id} 
                    className={`plan-card ${formData.investmentPlans.includes(plan._id) ? 'selected' : ''}`}
                    onClick={() => handlePlanSelection(plan._id)}
                  >
                    <div className="plan-header">
                      <h4>{plan.name}</h4>
                      {formData.investmentPlans.includes(plan._id) && (
                        <CheckCircle className="selected-icon" />
                      )}
                    </div>
                    <div className="plan-details">
                      <div className="plan-detail-row">
                        <span>Investment Range:</span>
                        <span>{formatCurrency(plan.minInvestment)} - {formatCurrency(plan.maxInvestment)}</span>
                      </div>
                      <div className="plan-detail-row">
                        <span>Returns:</span>
                        <span>{plan.returnMultiplier}x in {plan.durationMonths} months</span>
                      </div>
                      <div className="plan-detail-row">
                        <span>ROI Payment:</span>
                        <span>{plan.roiPaymentFrequency}</span>
                      </div>
                      {plan.description && (
                        <div className="plan-description">
                          <p>{plan.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-plans">
                <p>No investment plans available at the moment</p>
              </div>
            )}
          </div>

          <button type="submit" className="save-btn" disabled={isSubmitting}>
            <Save />
            {isSubmitting ? "Saving..." : "Save Details"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserBankDetailsSection;
