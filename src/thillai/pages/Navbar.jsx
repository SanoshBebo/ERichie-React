import React, { useState } from 'react';
import './NavBar.css'; // Create a CSS file for styling
import { Link } from 'react-router-dom'; // Import Link from 'react-router-dom'

const NavBar = ({ handleSearch }) => {
  const [searchVisible, setSearchVisible] = useState(false);
 

  return (
    <header className="navbar">
      <div className="navbar-content">
        <h1>
          <Link to="/gaming">Gamers Gold Mine</Link>
        </h1>
        <ul className="menu">
        <li>
            <Link to="/erichie/cart">🛒 Cart</Link> {/* Unicode character for cart (🛒) */}
          </li>
         
          <li>
            <Link to="/erichie">Erichie</Link>
          </li>
           <li>
            <Link to="/customer/login">Sign Out</Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default NavBar;
