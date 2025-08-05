import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    console.log('AuthContext: Checking stored token:', !!storedToken);
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      console.log('AuthContext: User authenticated, setting token and user');
    } else {
      // If no token, set flag to redirect
      console.log('AuthContext: No token found, setting redirect flag');
      setShouldRedirect(true);
    }
    
    setIsLoading(false);
  }, []);

  // Global token check - set redirect flag if no token
  useEffect(() => {
    if (!isLoading && !token) {
      console.log('AuthContext: No token after loading, setting redirect flag');
      setShouldRedirect(true);
    }
  }, [token, isLoading]);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    setShouldRedirect(false);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setShouldRedirect(true);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    isLoading,
    shouldRedirect,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 