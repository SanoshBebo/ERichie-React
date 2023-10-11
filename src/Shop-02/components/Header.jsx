import React from 'react';
import './Header.css';
import { Link} from "react-router-dom";
import {ShoppingCart} from "phosphor-react";
const Header = ({ onSearchChange }) => {
    return (
        <header className="fixed-header">
            <Link to="/homepage"><div className='home-list'>Home
            </div>
            </Link>
            <div className="search">
                <input
                    type="text"
                    placeholder="Search Products"
                    onChange={onSearchChange}
                />
            </div>
            <Link to="/products">
            <div className="product-list">Shop</div></Link> 
            
            <Link > <ShoppingCart size={32}/></Link>
            <div >Contact-Us</div>
            
        </header>
    );
};

export default Header;
