import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for admin token in localStorage
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: 'white'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Redirect to admin login if no token
  if (!isAuthenticated) {
    console.log('ProtectedRoute: No admin token found, redirecting to /admin/loggin');
    return <Navigate to="/admin/loggin" replace />;
  }

  return children;
};

export default ProtectedRoute; 