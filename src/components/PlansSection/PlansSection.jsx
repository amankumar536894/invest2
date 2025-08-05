import React, { useState, useEffect } from "react";
import "./PlansSection.css";
import {
  Plus,
  IndianRupee,
  TrendingUp,
  Calendar,
  SquarePen,
  Trash,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import DeletePlanPopup from "../DeletePlanPopup/DeletePlanPopup";
import EditPlanPopup from "../EditPlanPopup/EditPlanPopup";

const PlansSection = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addplanpopup, setAdduserpopup] = useState(false);
  const [deleteplanpopup, setDeleteplanpopup] = useState(false);
  const [editplanpopup, setEditplanpopup] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    status: "Active",
    minInvestment: "",
    maxInvestment: "",
    returnMultiplier: "",
    durationMonths: "",
    roiPaymentFrequency: "Monthly",
    description: "",
  });
  const { token } = useAuth();

  useEffect(() => {
    fetchPlans();
  }, [token]);

  const resetFormData = () => {
    setFormData({
      name: "",
      status: "Active",
      minInvestment: "",
      maxInvestment: "",
      returnMultiplier: "",
      durationMonths: "",
      roiPaymentFrequency: "Monthly",
      description: "",
    });
  };

  const handleAddPlanClick = () => {
    resetFormData();
    setAdduserpopup(true);
  };

  const handleCloseAddPopup = () => {
    setAdduserpopup(false);
    resetFormData();
  };

  const fetchPlans = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/investment-plans`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPlans(data.data || []);
      } else {
        console.error("Failed to fetch plans");
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlan = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/investment-plans`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            status: formData.status,
            minInvestment: parseInt(formData.minInvestment),
            maxInvestment: parseInt(formData.maxInvestment),
            returnMultiplier: parseFloat(formData.returnMultiplier),
            durationMonths: parseInt(formData.durationMonths),
            roiPaymentFrequency: formData.roiPaymentFrequency,
            description: formData.description,
            isDeleted: false,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Plan created:", data);
        handleCloseAddPopup();
        fetchPlans(); // Refresh the plans list
      } else {
        console.error("Failed to create plan");
      }
    } catch (error) {
      console.error("Error creating plan:", error);
    }
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      status: plan.status,
      minInvestment: plan.minInvestment.toString(),
      maxInvestment: plan.maxInvestment.toString(),
      returnMultiplier: plan.returnMultiplier.toString(),
      durationMonths: plan.durationMonths.toString(),
      roiPaymentFrequency: plan.roiPaymentFrequency,
      description: plan.description,
    });
    setEditplanpopup(true);
  };

  const handleUpdatePlan = async () => {
    if (!token || !selectedPlan) {
      console.error("Missing token or selectedPlan:", {
        token: !!token,
        selectedPlan: !!selectedPlan,
      });
      return;
    }

    try {
      console.log("Updating plan with data:", {
        planId: selectedPlan._id,
        formData: formData,
      });

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/investment-plans/${
          selectedPlan._id
        }`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            status: formData.status,
            minInvestment: parseInt(formData.minInvestment),
            maxInvestment: parseInt(formData.maxInvestment),
            returnMultiplier: parseFloat(formData.returnMultiplier),
            durationMonths: parseInt(formData.durationMonths),
            roiPaymentFrequency: formData.roiPaymentFrequency,
            description: formData.description,
            isDeleted: false,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Plan updated successfully:", data);
        setEditplanpopup(false);
        setSelectedPlan(null);
        fetchPlans(); // Refresh the plans list
      } else {
        const errorData = await response.json();
        console.error("Failed to update plan:", errorData);
      }
    } catch (error) {
      console.error("Error updating plan:", error);
    }
  };

  const handleDeletePlan = async () => {
    if (!token || !selectedPlan) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/investment-plans/${
          selectedPlan._id
        }`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Plan deleted successfully");
        setDeleteplanpopup(false);
        setSelectedPlan(null);
        fetchPlans(); // Refresh the plans list
      } else {
        console.error("Failed to delete plan");
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatRange = (min, max) => {
    if (max === 9007199254740991) {
      return `₹${formatCurrency(min).replace("₹", "")} and above`;
    }
    return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  };

  if (isLoading) {
    return (
      <div className="overallleft">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading investment plans...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overallleft">
        <div className="topbox">
          <div className="topboxleft">
            <p className="topboxlefttitle">Investment Plans</p>
            <p className="topboxleftdesc">
              Manage your investment plans and returns
            </p>
          </div>
          <div className="topboxright" onClick={handleAddPlanClick}>
            <Plus />
            <p>Add Plans</p>
          </div>
        </div>
        <div className="planmainbox">
          {plans.length > 0 ? (
            plans.map((plan) => (
              <div key={plan._id} className="planbox">
                <div className="plantitlebox">
                  <p className="planname">{plan.name}</p>
                  <p className={`planstatus ${plan.status.toLowerCase()}`}>
                    {plan.status}
                  </p>
                </div>
                <div className="rangebox">
                  <IndianRupee />
                  <div className="rangeinnerbox">
                    <p className="investmentrangetitle">Investment Range</p>
                    <p className="investmentrangeexact">
                      {formatRange(plan.minInvestment, plan.maxInvestment)}
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
                <div className="planbtns">
                  <div
                    className="planperbtn"
                    onClick={() => handleEditPlan(plan)}
                  >
                    <SquarePen />
                    <p>Edit</p>
                  </div>
                  <div
                    className="planperbtn"
                    onClick={() => {
                      setSelectedPlan(plan);
                      setDeleteplanpopup(true);
                    }}
                  >
                    <Trash />
                    <p>Delete</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-plans">
              <p>No investment plans found</p>
            </div>
          )}
        </div>

        <div
          className={`addplanpopup ${addplanpopup ? "addplanpopupactive" : ""}`}
          onClick={handleCloseAddPopup}
        >
          <div
            className="inneraddplanpopup"
            onClick={(e) => e.stopPropagation()}
          >
            <X className="planaddcross" onClick={handleCloseAddPopup} />
            <input
              type="text"
              placeholder="Enter Plan Name"
              className="firstnameinput"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <div className="inneraddpopfull">
              <input
                type="number"
                placeholder="Enter Minimum Range"
                value={formData.minInvestment}
                onChange={(e) =>
                  setFormData({ ...formData, minInvestment: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Enter Maximum Range"
                value={formData.maxInvestment}
                onChange={(e) =>
                  setFormData({ ...formData, maxInvestment: e.target.value })
                }
              />
            </div>
            <div className="inneraddpopfull">
              <input
                type="number"
                step="0.1"
                placeholder="Enter ROI Return"
                value={formData.returnMultiplier}
                onChange={(e) =>
                  setFormData({ ...formData, returnMultiplier: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Enter Time Period (Months)"
                value={formData.durationMonths}
                onChange={(e) =>
                  setFormData({ ...formData, durationMonths: e.target.value })
                }
              />
            </div>
            <select
              value={formData.roiPaymentFrequency}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  roiPaymentFrequency: e.target.value,
                })
              }
              className="firstnameinput"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="End of Term">End of Term</option>
            </select>
            <textarea
              placeholder="Enter Description"
              className="firstnameinput"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="3"
            />
            <p className="planaddnow" onClick={handleCreatePlan}>
              Add Now
            </p>
          </div>
        </div>

        <DeletePlanPopup
          deleteplanpopup={deleteplanpopup}
          setDeleteplanpopup={setDeleteplanpopup}
          onDelete={handleDeletePlan}
        />
        <EditPlanPopup
          editplanpopup={editplanpopup}
          setEditplanpopup={setEditplanpopup}
          formData={formData}
          setFormData={setFormData}
          onUpdate={handleUpdatePlan}
        />
      </div>
    </>
  );
};

export default PlansSection;
