import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserRegisterSection.css";

const UserRegisterSection = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.phoneNumber || !formData.password || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investor-auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Save token to localStorage - token is nested in data.data.token
        localStorage.setItem('investor-token', data.data.token);
        console.log('Registration successful:', data);
        // Redirect to home page
        navigate('/');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please try again.');
    }
  };

  const togglePassword = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="userregistersection">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>User Registration</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="phoneNumber">Mobile Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="Enter your mobile number"
            pattern="[0-9]{10}"
            required
          />
        </div>
        
        <div className="form-group password-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => togglePassword('password')}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10C2 10 4.5 5 10 5C15.5 5 18 10 18 10C18 10 15.5 15 10 15C4.5 15 2 10 2 10Z" stroke="#4f8cff" strokeWidth="1.5"/>
                  <circle cx="10" cy="10" r="3" stroke="#4f8cff" strokeWidth="1.5"/>
                  <line x1="4" y1="16" x2="16" y2="4" stroke="#4f8cff" strokeWidth="1.5"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10C2 10 4.5 5 10 5C15.5 5 18 10 18 10C18 10 15.5 15 10 15C4.5 15 2 10 2 10Z" stroke="#4f8cff" strokeWidth="1.5"/>
                  <circle cx="10" cy="10" r="3" stroke="#4f8cff" strokeWidth="1.5"/>
                </svg>
              )}
            </button>
          </div>
        </div>
        
        <div className="form-group password-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => togglePassword('confirmPassword')}
              tabIndex={-1}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10C2 10 4.5 5 10 5C15.5 5 18 10 18 10C18 10 15.5 15 10 15C4.5 15 2 10 2 10Z" stroke="#4f8cff" strokeWidth="1.5"/>
                  <circle cx="10" cy="10" r="3" stroke="#4f8cff" strokeWidth="1.5"/>
                  <line x1="4" y1="16" x2="16" y2="4" stroke="#4f8cff" strokeWidth="1.5"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10C2 10 4.5 5 10 5C15.5 5 18 10 18 10C18 10 15.5 15 10 15C4.5 15 2 10 2 10Z" stroke="#4f8cff" strokeWidth="1.5"/>
                  <circle cx="10" cy="10" r="3" stroke="#4f8cff" strokeWidth="1.5"/>
                </svg>
              )}
            </button>
          </div>
        </div>
        
        <button type="submit" className="register-submit-btn">
          Register
        </button>
      </form>
    </div>
  );
};

export default UserRegisterSection;
