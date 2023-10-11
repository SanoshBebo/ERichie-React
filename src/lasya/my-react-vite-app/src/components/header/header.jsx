import './header.css';
import React from 'react';
import { Link } from 'react-router-dom'; // Import the Link component

function Header() {
  return (
    <header>
      <div className="header-left">
        <h1>Game Store</h1>
      </div>
      <div className="header-right">
        <Link to="/about-us">About Us</Link>
        <Link to="/contact-us">Contact Us</Link>
       
        {/* You can style these links as needed */}
      </div>
    </header>
  );
}

export default Header;
