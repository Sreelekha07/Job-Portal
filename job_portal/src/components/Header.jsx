import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token); // Set authentication status based on token presence

    const handleAuthChange = () => {
      const token = localStorage.getItem("access_token");
      setIsAuthenticated(!!token);
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('authChange'));
    setTimeout(() => { navigate("/login") }, 1)
  };

  return (
    <header className="header">
      <h1>Job Portal</h1>
      <nav>
        {!isAuthenticated ? (
          <>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            <Link to="#" onClick={handleLogout}>Logout</Link>
            <Link to="/">Home</Link>
            <Link to="/categories">Categories</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;