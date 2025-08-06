import React, { useState, useEffect } from "react";
import "./UserDashboardSection.css";
import "../../Dash/Dash.css";
import {
  BadgeIndianRupee,
  Users,
  Hourglass,
  TrendingUp,
  MoveUpRight,
  MoveDownRight,
  MessageSquareMore,
  Wallet,
  ChartLine 
} from "lucide-react";

const UserDashboardSection = () => {
  const [dashboardData, setDashboardData] = useState({
    investor: {
      phoneNumber: ""
    },
    dashboard: {
      totalInvestment: 0,
      totalDays: 0,
      totalWithdrawals: 0,
      totalProfit: 0,
      totalReturns: 0,
      pendingDeposits: 0,
      pendingWithdrawals: 0,
      activeInvestments: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('investor-token');
      
      if (!token) {
        setError("No authentication token found");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investor-auth/dashboard`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        setDashboardData(data.data);
        setError("");
      } else {
        setError(data.message || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return (
      <div className="userdashboardbody">
        <div className="loading-container">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="userdashboardbody">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchDashboardData} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="userdashboardbody">
        <div className="mainupperuserdata">
          <p className="usernameheader">Hi {dashboardData.investor.name}</p>
          <p className="usernameheaderunder">
            Grow your money with Trust Market
          </p>
        </div>

        <div className="fourall">
          <div className="eachfour">
            <div className="eachfourleft">
              <p className="eachfourlefttitle">Total Investments</p>
              <p className="eachfourleftnum">₹{dashboardData.dashboard.totalInvestment}</p>
            </div>
            <Users className="eachfourright" />
          </div>
          <div className="eachfour">
            <div className="eachfourleft">
              <p className="eachfourlefttitle">Days</p>
              <p className="eachfourleftnum">{dashboardData.dashboard.totalDays}</p>
            </div>
            <Hourglass className="eachfourright" />
          </div>
          <div className="eachfour">
            <div className="eachfourleft">
              <p className="eachfourlefttitle">Total Withdrawals</p>
              <p className="eachfourleftnum">₹{dashboardData.dashboard.totalWithdrawals}</p>
            </div>
            <TrendingUp className="eachfourright" />
          </div>
          <div className="eachfour">
            <div className="eachfourleft">
              <p className="eachfourlefttitle">Total Profits</p>
              <p className="eachfourleftnum">₹{dashboardData.dashboard.totalProfit}</p>
            </div>
            <TrendingUp className="eachfourright" />
          </div>
        </div>
        <div className="somethingextra">
          <p className="somethingextratitle">Prioritising your investment journey</p>
          <div className="somethingextraall">


            <div className="somethingextraper">
              <MessageSquareMore className="someextrapericon" />
              <p className="someextrapertitle">24x7 Support</p>
              <p className="someextraperdesc">Rely on our 24x7 Live chat support. Always here, always ready</p>
            </div>
            <div className="somethingextraper">
              <Wallet className="someextrapericon" />
              <p className="someextrapertitle">Fast Deposits & Withdrawals</p>
              <p className="someextraperdesc">Enjoy fast bank transfers at any time, free of charge</p>
            </div>
            <div className="somethingextraper">
              <ChartLine className="someextrapericon"  />
              <p className="someextrapertitle">Automated Reports</p>
              <p className="someextraperdesc">Generate your reports in less than 2 minutes</p>
            </div>


          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboardSection;
