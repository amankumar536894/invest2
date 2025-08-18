import React, { useEffect, useState } from 'react';

const WithdrawlRequestSection = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchWithdrawals = async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No admin token found");
        setIsLoading(false);
        return;
      }
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/withdrawals/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setWithdrawals(data.data.withdrawals);
      } else {
        setError(data.message || "Failed to fetch withdrawals");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
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
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/withdrawals/${id}/${action}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        // Refresh the list to show updated status instead of removing
        fetchWithdrawals();
      } else {
        setError(data.message || `Failed to ${action} withdrawal`);
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
          <p className="topboxlefttitle">All Withdrawal Requests</p>
          <p className="topboxleftdesc">View all investor withdrawal requests</p>
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
        ) : withdrawals.length === 0 ? (
          <div className="depositerequestper"><div>No withdrawal requests found.</div></div>
        ) : (
          withdrawals.map((w) => (
            <div className="depositerequestper" key={w._id}>
              <div className="requestpername">{w.investorId?.name || w.investorId?.phoneNumber || "-"}</div>
              <div className="requestperamount">₹{w.amount}</div>
              <div className={`requestperstatus status-${w.status}`}>{w.status}</div>
              <div className="requestperactions">
                {w.status === "pending" ? (
                  <>
                    <button
                      className="approve-btn"
                      disabled={actionLoading === w._id + "approve"}
                      onClick={() => handleAction(w._id, "approve")}
                    >
                      {actionLoading === w._id + "approve" ? "Approving..." : "Approve"}
                    </button>
                    <button
                      className="reject-btn"
                      disabled={actionLoading === w._id + "reject"}
                      onClick={() => handleAction(w._id, "reject")}
                    >
                      {actionLoading === w._id + "reject" ? "Rejecting..." : "Reject"}
                    </button>
                  </>
                ) : (
                  <span className={`status-badge ${w.status.toLowerCase()}`}>
                    {w.status === "approved" ? "✓ Approved" : 
                     w.status === "rejected" ? "✗ Rejected" : 
                     w.status}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WithdrawlRequestSection;
