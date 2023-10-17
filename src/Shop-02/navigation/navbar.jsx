import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Nav.css'; // Import the CSS file

const Nav = () => {
  const handleSignOut = () => {

  localStorage.removeItem("user");
  
  navigate("/admin/login");
  
  };
  const navigate = useNavigate();
  return (
    <nav className='NAV'>
      <ul className='shop15ul'>
      <li className='shop15li'>
          <Link to="/erichie/overall-report">Group Analysis</Link>
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
        
        <button className="btn btn-danger" onClick={handleSignOut}>Sign Out</button>
      </ul>
    </nav>
  );
};

export default Nav;


