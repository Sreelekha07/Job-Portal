import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <p>© 2024 Job Portal. All rights reserved.</p>
            <nav>
                <Link to="/privacy-policy">Privacy Policy</Link>
                <Link to="/contact">Contact Us</Link>
            </nav>
        </footer>
    );
}

export default Footer;
