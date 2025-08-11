import React, { useState, useEffect } from "react";
import "../../Navbaar/Navbaar.css";
import "./UserNavbaar.css";
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Wallet,
  CreditCard,
  ChartPie,
  Settings,
  LogOut,
  Menu,
  Building2
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from '../../../assets/logo.png'

const UserNavbaar = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ phoneNumber: "User" });

  useEffect(() => {
    // Check if investor token exists
    const token = localStorage.getItem('investor-token');
    if (!token) {
      navigate('/user/loggin');
      return;
    }

    // Fetch user info to display name/phone number
    fetchUserInfo();
  }, [navigate]);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('investor-token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investor-auth/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.data.investor || { phoneNumber: "User" });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const handleLogout = () => {
    // Remove both tokens from localStorage
    localStorage.removeItem('investor-token');
    localStorage.removeItem('token');
    
    // Redirect to login page
    navigate('/user/loggin');
  };

  return (
    <>
      <div className="navbaar">
        <div className="logobox">
          <img src={logo} className="logo"/>
          <Menu className="burgericon" />
        </div>
        <NavLink to="/" className="navbaar-item">
          <LayoutDashboard />
          <p>Home</p>
        </NavLink>
        <NavLink to="/investment-plans" className="navbaar-item">
          <TrendingUp />
          <p>Investment Plans</p>
        </NavLink>
        <NavLink to="/user-deposit" className="navbaar-item">
          <Users />
          <p>Deposite</p>
        </NavLink>
        <NavLink to="/user-withdraw" className="navbaar-item">
          <CreditCard />
          <p>Withdraw</p>
        </NavLink>
        <NavLink to="/user-bank-details" className="navbaar-item">
          <Building2 />
          <p>Bank Details</p>
        </NavLink>
        <button onClick={handleLogout} className="navbaar-item logout-btn">
          <LogOut />
          <p>Logout</p>
        </button>
      </div>
    </>
  );
};

export default UserNavbaar;
