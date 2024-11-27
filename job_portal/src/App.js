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
import Login from "./components/Login";
import Signup from "./components/Signup";
import { registerUser } from "./services/api";
import PrivateRoute from "./components/PrivateRoute";
import { Provider } from "./components/ui/provider";
import { Container } from "@chakra-ui/react";


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
    <Provider>
      <Container>
        <Router>
          <div className="App">
            <Header />

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

            <Routes>
              <Route path="/" element={<PrivateRoute element={Home} />} />
              <Route path="/categories" element={<PrivateRoute element={CategoryList} />} />
              <Route path="/jobs" element={<JobListingPage />} />
              <Route path="/apply/:jobId" element={<JobApplicationPage />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/job/:jobId" element={<JobDetails />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </div>
        </Router>
      </Container>
    </Provider>
  );
}

export default App;
