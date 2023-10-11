import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { query, collection, getDocs, where } from "firebase/firestore";
import { MdOutlineLocalShipping } from 'react-icons/md';
import { AiOutlineSearch,AiOutlineShoppingCart } from 'react-icons/ai';
import { AiOutlineLogin } from 'react-icons/ai';
import { BiLogoAmazon } from 'react-icons/bi';
import {Link} from 'react-router-dom';
import InsertData from './insertdata';
import ProductList from './updatedetailscards';
import Dailyinventory from './dailyinventory';
import Dailysales from './dailysales';

import '../styles/nav.css'


const nav = () => {

  const [isInsertDataVisible, setIsInsertDataVisible] = useState(false);
  const [isUpdateDataVisible, setIsUpdateDataVisible] = useState(false);
  const [isDailyInventoryVisible, setIsDailyInventoryVisible] = useState(false);
  const [isDailySalesVisible, setIsDailySalesVisible] = useState(false);


  const toggleInsertForm = () => {
    setIsInsertDataVisible(!isInsertDataVisible);
    setIsUpdateDataVisible(false); // Close other forms
    setIsDailyInventoryVisible(false);
    setIsDailySalesVisible(false);
  };

  const toggleUpdateForm = () => {
    
    setIsUpdateDataVisible(!isUpdateDataVisible);
    setIsInsertDataVisible(false); // Close other forms
    setIsDailyInventoryVisible(false);
    setIsDailySalesVisible(false);
  };
  const toggleDailyInventory = () => {
    
    setIsUpdateDataVisible(false);
    setIsInsertDataVisible(false); // Close other forms
    setIsDailyInventoryVisible(!isDailyInventoryVisible);
    setIsDailySalesVisible(false);
  };
  const toggleDailySales = () => {
    
    setIsUpdateDataVisible(false);
    setIsInsertDataVisible(false); // Close other forms
    setIsDailyInventoryVisible(false);
    setIsDailySalesVisible(!isDailySalesVisible);
  };






  return (
    <div className="aadminnav">
    <div className='header'>
      <div className='top_header'>
        <div className='icon'>
          <MdOutlineLocalShipping/>
        </div>
          <div className='info'>
            <p>The e-commerce platform that cares</p>

          </div>
          <div className='mid_header'>
            <div className='logo'>
            <img src="https://firebasestorage.googleapis.com/v0/b/abhiram-store.appspot.com/o/image-removebg-preview.png?alt=media&token=f49c4294-e279-4b1b-8c72-34d129babaab&_gl=1*13qb6vb*_ga*MzEwMDU5MjE4LjE2OTUwOTk4MjQ.*_ga_CW55HF8NVT*MTY5NjUxODc4OS43Ni4xLjE2OTY1MjY0NjAuNjAuMC4w" alt="logo" />
            </div>
            <div className='search_box'>

            </div>
            <div className='user'>
              <div className='icon'>
                <AiOutlineShoppingCart/>
              </div>
              <div className='btn'>
              </div>
            </div>

          </div>
          
      </div>
      <div className='last_header'>
              <div className='nav'>
              <ul className="nav">

              <li className="nav-item">
                <button className="btn btn-primary" onClick={toggleInsertForm}>
                  Insert Data
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-primary" onClick={toggleUpdateForm}>
                  Edit Data
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-secondary" onClick={toggleDailyInventory}>
                  Today's Inventory
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-secondary" onClick={toggleDailySales}>
                  Todays sales
                </button>
              </li>
              

            </ul>

      
              </div>
      </div>
            {isInsertDataVisible && <InsertData />} {/* Render InsertData if visible */}
            {isUpdateDataVisible &&  <ProductList  />} {/* Render InsertData if visible */}
            {isDailyInventoryVisible && <Dailyinventory/>}
            {isDailySalesVisible && <Dailysales />}

    </div>
    
    
    </div>


  )
}

export default nav