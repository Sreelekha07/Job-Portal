import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

const Signup = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    user_type: "job_seeker", // Default to job_seeker
  });

  const [loading, setLoading] = useState(false); // Track the loading state
  const [errors, setErrors] = useState({}); // Track errors as an object
  const navigate = useNavigate();

  // Client-side validation
  const validateForm = () => {
    let formErrors = {};
    if (!userData.username.trim()) formErrors.username = "Username is required.";
    if (!userData.email.trim()) formErrors.email = "Email is required.";
    if (!userData.password) formErrors.password = "Password is required.";
    else if (userData.password.length < 6)
      formErrors.password = "Password must be at least 6 characters.";
    return formErrors;
  };

  // Handle input changes and update state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Reset errors before submission

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return; // Prevent submission if there are validation errors
    }

    const data = {
      username: userData.username.trim(),
      email: userData.email.trim(),
      password: userData.password,
      user_type: userData.user_type, // Include user_type in the data
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/register/",
        data
      );
      console.log("User registered successfully:", response.data);
      navigate("/login"); // Redirect to login page on success
    } catch (error) {
      console.error("Error registering user:", error.response?.data || error);

      const responseErrors = error.response?.data || {};
      setErrors({
        username: responseErrors.username ? responseErrors.username[0] : "",
        email: responseErrors.email ? responseErrors.email[0] : "",
        password: responseErrors.password ? responseErrors.password[0] : "",
        general:
          !responseErrors.username &&
          !responseErrors.email &&
          !responseErrors.password
            ? "Error registering user"
            : "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign Up</h2>
        {errors.general && <div className="error-message">{errors.general}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
              required
            />
            {errors.username && (
              <div className="error-message">{errors.username}</div>
            )}
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>

          {/* User Type Dropdown */}
          <div className="form-group">
            <label>User Type:</label>
            <select
              name="user_type"
              value={userData.user_type}
              onChange={handleChange}
            >
              <option value="job_seeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
