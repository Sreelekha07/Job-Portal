import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <h1>Job Portal</h1>
      <nav>
        <Link to="/signup">Sign Up</Link>
        <Link to="/login">Login</Link>
        <Link to="/">Home</Link>
        <Link to="/categories">Categories</Link>
      </nav>
    </header>
  );
}

export default Header;
