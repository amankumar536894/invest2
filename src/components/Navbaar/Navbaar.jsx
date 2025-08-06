import React from 'react'
import './Navbaar.css'
import { LayoutDashboard, TrendingUp, Users, Wallet, CreditCard, ChartPie, Settings, LogOut } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'

const Navbaar = () => {
   const navigate = useNavigate();

   const handleLogout = () => {
      // Remove admin token from localStorage
      localStorage.removeItem('token');
      
      // Redirect to admin login page
      navigate('/admin/loggin');
   };

   return (
      <>
         <div className="navbaar">
            <img src={logo} className="logo"/>
            <NavLink to='/admin' className='navbaar-item'>
               <LayoutDashboard />
               <p>Dashboard</p>
            </NavLink>
            <NavLink to='/admin/investment-plans' className='navbaar-item'>
               <TrendingUp />
               <p>Investment Plans</p>
            </NavLink>
            <NavLink to='/admin/deposite-request' className='navbaar-item'>
               <Users />
               <p>Deposite Request</p>
            </NavLink>
            <NavLink to='/admin/withdrawal-request' className='navbaar-item'>
               <CreditCard />
               <p>Withdrawl Request</p>
            </NavLink>
            <NavLink to='/admin/investors' className='navbaar-item'>
               <Users />
               <p>Investors</p>
            </NavLink>
            <NavLink to='/admin/withdrawals' className='navbaar-item'>
               <CreditCard />
               <p>Withdrawals</p>
            </NavLink>
            <button onClick={handleLogout} className="navbaar-item logout-btn">
               <LogOut />
               <p>Logout</p>
            </button>
         </div>
      </>
   )
}

export default Navbaar
