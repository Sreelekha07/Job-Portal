import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CategoryList from "./pages/CategoryList";
import JobDetails from "./components/JobDetails";
import JobListingPage from "./pages/JobListingPage"; // New component for job listings
import JobApplicationPage from "./pages/JobApplicationPage"; // New component for job application
import UserProfile from "./components/UserProfile"; // New component for user profile
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import JobList from "./components/JobList";
import PostJob from "./components/PostJob";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { registerUser } from "./services/api";

function App() {
  // State for handling signup success/error
  const [signupStatus, setSignupStatus] = useState(null);

  // Handle signup functionality
  const handleSignup = async (userData) => {
    try {
      const result = await registerUser(userData);
      setSignupStatus("success"); // Update state for success
      console.log("Signup successful:", result);
      return Promise.resolve(); // Allow navigation upon success
    } catch (error) {
      setSignupStatus("error"); // Update state for error
      console.error("Signup failed:", error);
      return Promise.reject(error); // Pass error to handle it in Signup component
    }
  };

  return (
    <Router>
      <div className="App">
        <Header />

        {/* Display signup status message if needed */}
        {signupStatus === "success" && (
          <div className="alert alert-success">
            Signup successful! You can now log in.
          </div>
        )}
        {signupStatus === "error" && (
          <div className="alert alert-danger">
            Signup failed. Please try again.
          </div>
        )}

        {/* Define Routes */}
        <Routes>
          {/* Home and Category Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<CategoryList />} />

          {/* Job Listing and Application Routes */}
          <Route path="/jobs" element={<JobListingPage />} /> {/* Job Listing Page */}
          <Route path="/apply/:jobId" element={<JobApplicationPage />} /> {/* Job Application Page */}

          {/* User Profile Route */}
          <Route path="/profile" element={<UserProfile />} /> {/* User Profile Page */}

          {/* User Routes */}
          <Route path="/signup" element={<Signup onSignup={handleSignup} />} /> {/* Signup */}
          <Route path="/login" element={<Login />} /> {/* Login */}

          {/* Job Routes */}
          <Route path="/post-job" element={<PostJob />} /> {/* Post Job Page */}
          <Route path="/categories/:id/jobs/:jobId" element={<JobDetails />} /> {/* Job Details */}

          {/* Additional Pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
