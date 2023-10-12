import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css'; // Import the CSS file

const Nav = () => {
  return (
    <nav className='NAV'>
      <ul className='shop15ul'>
        <li className='shop15li'>
          <Link to="/home">Home</Link>
        </li>
        <li className='shop15li'>
          <Link to="/AdminAction/add">Add Product</Link>
        </li>        
        <li className='shop15li'>
          <Link to="/AdminAction/view">View Products</Link>
        </li>
        <li className='shop15li'>
          <Link to="/AdminAction/report">Stock Report</Link>
        </li>
        <li className='shop15li'>
          <Link to="/AdminAction/livereport">Live Report</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
