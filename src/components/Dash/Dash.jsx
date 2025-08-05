import React, { useState, useEffect } from "react";
import "./Dash.css";
import { Link } from "react-router-dom";
import {
  BadgeIndianRupee,
  Users,
  Hourglass,
  TrendingUp,
  MoveUpRight,
  MoveDownRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Dash = () => {
  const [stats, setStats] = useState({
    totalInvestment: 0,
    activeUsers: 0,
    pendingWithdrawals: 0,
    monthlyROI: 0,
  });
  const [recentInvestments, setRecentInvestments] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;

      try {
        setIsLoading(true);

        // Fetch dashboard stats
        const statsResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}api/dashboard/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats({
            totalInvestment: statsData.data.totalInvestment || 0,
            activeUsers: statsData.data.activeUsers || 0,
            pendingWithdrawals: statsData.data.pendingWithdrawals || 0,
            monthlyROI: statsData.data.monthlyROI || 0,
          });
        }

        // Fetch recent investments
        const investmentsResponse = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/dashboard/recent-investments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (investmentsResponse.ok) {
          const investmentsData = await investmentsResponse.json();
          setRecentInvestments(investmentsData.data || []);
        }

        // Fetch pending requests
        const requestsResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/pending-requests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (requestsResponse.ok) {
          const requestsData = await requestsResponse.json();
          setPendingRequests(requestsData.data || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN");
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
      <div className="overallleft">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overallleft">
        <div className="topbox">
          <div className="topboxleft">
            <p className="topboxlefttitle">Dashboard</p>
            <p className="topboxleftdesc">
              Monitor your investment platform performance
            </p>
          </div>
        </div>
        <div className="fourall">
          <div className="eachfour">
            <div className="eachfourleft">
              <p className="eachfourlefttitle">Total Investments</p>
              <p className="eachfourleftnum">
                {formatCurrency(stats.totalInvestment)}
              </p>
            </div>
            <Users className="eachfourright" />
          </div>
          <div className="eachfour">
            <div className="eachfourleft">
              <p className="eachfourlefttitle">Active Users</p>
              <p className="eachfourleftnum">{stats.activeUsers}</p>
            </div>
            <Hourglass className="eachfourright" />
          </div>
          <div className="eachfour">
            <div className="eachfourleft">
              <p className="eachfourlefttitle">Pending Withdrawals</p>
              <p className="eachfourleftnum">
                {formatCurrency(stats.pendingWithdrawals)}
              </p>
            </div>
            <TrendingUp className="eachfourright" />
          </div>
          <div className="eachfour">
            <div className="eachfourleft">
              <p className="eachfourlefttitle">Monthly ROI</p>
              <p className="eachfourleftnum">{stats.monthlyROI}%</p>
            </div>
            <TrendingUp className="eachfourright" />
          </div>
        </div>
        <div className="twobigdash">
          <div className="eachtwobig">
            <div className="eachtwobigmain-title">
              <MoveUpRight />
              <p>Recent Investments</p>
            </div>

            <div className="eachtwobigmain-table">
              {recentInvestments.length > 0 ? (
                recentInvestments.map((investment, index) => (
                  <div key={index} className="eachtwomaintable">
                    <div className="eachtwomaintable-left">
                      <p className="eachtwomaintable-left-name">
                        {investment.name || "N/A"}
                      </p>
                      <p className="eachtwomaintable-left-date">
                        {formatDate(investment.date)}
                      </p>
                    </div>
                    <div className="eachtwomaintable-right">
                      <p className="eachtwomaintable-right-amount">
                        {formatCurrency(investment.amount)}
                      </p>
                      <p className="eachtwomaintable-right-plan">
                        {investment.plan || "N/A"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <p>No recent investments</p>
                </div>
              )}
              <Link to="/investors" className="allinvestment">
                View All Investments
              </Link>
            </div>
          </div>

          <div className="eachtwobig">
            <div className="eachtwobigmain-title">
              <MoveDownRight />
              <p>Pending Requests</p>
            </div>
            <div className="eachtwobigmain-table">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((request, index) => (
                  <div key={index} className="eachtwomaintable">
                    <div className="eachtwomaintable-left">
                      <p className="eachtwomaintable-left-name">
                        {request.name}
                      </p>
                      <p className="eachtwomaintable-left-date">
                        {formatDate(request.date)}
                      </p>
                    </div>
                    <div className="eachtwomaintable-right">
                      <p className="eachtwomaintable-right-amount">
                        {formatCurrency(request.moneyInvested)}
                      </p>
                      <p className="eachtwomaintable-right-plan">Withdrawal</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <p>No pending requests</p>
                </div>
              )}
              <Link to="/withdrawals" className="allinvestment">
                View All Requests
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dash;
