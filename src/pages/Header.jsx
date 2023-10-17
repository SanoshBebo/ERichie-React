// src/components/Header.js
import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { AiOutlineSearch,AiOutlineShoppingCart } from 'react-icons/ai';

function Header() {
  return (
    <>
      <header className="computer-header">
      <div className='computer-home-page-connector'>
              <Link to ="/erichie">
              <div className="computer-button"><button>E-Richie </button>
                </div>
            </Link>
           </div>
            <h1>COMPUTERS</h1>
            <div className='computer-home-page-connector1'>
            <div className="computer-button"><Link to="/erichie/cart"><button><AiOutlineShoppingCart/></button></Link></div>
            </div>
           
      
      
    </header>
    
    </>
    
  );
}

export default Header;
