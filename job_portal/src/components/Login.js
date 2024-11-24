import React, { useState } from 'react';
import { loginUser } from '../services/api'; // Import the login function
import { useNavigate } from 'react-router-dom'; // To redirect after successful login
import './Login.css'; // Styling for the Login form

const Login = () => {
  const [username, setUsername] = useState(''); // Username field
  const [password, setPassword] = useState(''); // Password field
  const [error, setError] = useState(''); // State for handling errors
  const [loading, setLoading] = useState(false); // State for handling loading state
  const navigate = useNavigate(); // Hook to navigate after successful login

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the login request with username and password
      const response = await loginUser({ username, password });
  
      // Log the response to ensure it contains 'access' and 'refresh'
      console.log("Login successful:", response);
  
      // Ensure that the response contains the access token
      if (response && response.access && response.refresh) {
        // Store the JWT token in localStorage
        localStorage.setItem('access_token', response.access); // Access token
        localStorage.setItem('refresh_token', response.refresh);
        localStorage.setItem('username', response.user.username); // Store the username for future use
        window.dispatchEvent(new Event('authChange'));
        // Redirect to the home page or any protected route
        navigate('/'); 
      } else {
        alert('Login failed: Invalid response format');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>} {/* Show error message if login fails */}
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Bind username to state
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Bind password to state
              required
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'} {/* Show loading text if logging in */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
