import React, { useState, useEffect } from "react";
import "./UserDepositSection.css";

function UserDepositSection() {
  const [amount, setAmount] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const dummyHistory = [
    {
      _id: "1",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      amount: 5000,
      status: "Success",
    },
    {
      _id: "2",
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      amount: 2000,
      status: "Pending",
    },
    {
      _id: "3",
      createdAt: new Date().toISOString(),
      amount: 10000,
      status: "Success",
    },
  ];

  const fetchHistory = async () => {
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
        `${import.meta.env.VITE_BACKEND_URL}/api/deposits/my-deposits`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setHistory(data.data.deposits || []);
        setError("");
      } else {
        setError(data.message || "Failed to fetch deposit history.");
      }
    } catch (err) {
      console.error("Error fetching deposit history:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    
    try {
      const token = localStorage.getItem('investor-token');
      
      if (!token) {
        setError("No authentication token found");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/deposits`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: Number(amount) }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setAmount("");
        setError("");
        // Refresh the deposit history
        fetchHistory();
      } else {
        setError(data.message || "Failed to create deposit request.");
      }
    } catch (err) {
      console.error("Error creating deposit:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="userdepositsection">
      <form className="deposit-form" onSubmit={handleSubmit}>
        <h2>Deposit Money</h2>
        <div className="deposit-row">
          <div className="form-group">
            <label htmlFor="deposit-amount">Amount</label>
            <input
              type="number"
              id="deposit-amount"
              name="amount"
              placeholder="Enter amount to deposit"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              required
            />
          </div>
          <button type="submit" className="deposit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Depositing..." : "Deposit"}
          </button>
        </div>
        {error && <div className="error-msg">{error}</div>}
      </form>
      <div className="deposit-history-section">
        <h3>Deposit History</h3>
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : history.length === 0 ? (
          <div className="no-history">No deposit history found.</div>
        ) : (
          <table className="deposit-history-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item._id}>
                  <td>{item.requestId}</td>
                  <td>{new Date(item.requestDate).toLocaleString()}</td>
                  <td>₹{item.amount}</td>
                  <td className={`status-${item.status.toLowerCase()}`}>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UserDepositSection;
