import React, { useEffect, useState } from "react";
import "./DepositeRequestSection.css";

const DepositeRequestSection = () => {
  const [deposits, setDeposits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null); // deposit id for which action is loading

  const fetchDeposits = async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No admin token found");
        setIsLoading(false);
        return;
      }
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/deposits/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setDeposits(data.data.deposits);
      } else {
        setError(data.message || "Failed to fetch deposits");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleAction = async (id, action) => {
    setActionLoading(id + action);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No admin token found");
        return;
      }
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/deposits/${id}/${action}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        // Remove the deposit from the list
        setDeposits((prev) => prev.filter((d) => d._id !== id));
      } else {
        setError(data.message || `Failed to ${action} deposit`);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="depositerequestsection">
      <div className="topbox">
        <div className="topboxleft">
          <p className="topboxlefttitle">Deposite Requests</p>
          <p className="topboxleftdesc">Manage investor Deposite requests</p>
        </div>
      </div>
      <div className="depositerequestcomeall">
        <div className="depositerequestper">
          <div className="requestpername firstforbold">Name</div>
          <div className="requestperamount firstforbold">Amount</div>
          <div className="requestperstatus firstforbold">Status</div>
          <div className="requestperactions firstforbold">Actions</div>
        </div>
        {isLoading ? (
          <div className="depositerequestper"><div>Loading...</div></div>
        ) : error ? (
          <div className="depositerequestper"><div className="error-message">{error}</div></div>
        ) : deposits.length === 0 ? (
          <div className="depositerequestper"><div>No pending deposit requests.</div></div>
        ) : (
          deposits.map((dep) => (
            <div className="depositerequestper" key={dep._id}>
              <div className="requestpername">{dep.investorId?.name || dep.investorId?.phoneNumber || "-"}</div>
              <div className="requestperamount">₹{dep.amount}</div>
              <div className={`requestperstatus status-${dep.status}`}>{dep.status}</div>
              <div className="requestperactions">
                <button
                  className="approve-btn"
                  disabled={actionLoading === dep._id + "approve"}
                  onClick={() => handleAction(dep._id, "approve")}
                >
                  {actionLoading === dep._id + "approve" ? "Approving..." : "Approve"}
                </button>
                <button
                  className="reject-btn"
                  disabled={actionLoading === dep._id + "reject"}
                  onClick={() => handleAction(dep._id, "reject")}
                >
                  {actionLoading === dep._id + "reject" ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DepositeRequestSection;
