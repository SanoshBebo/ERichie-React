import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../goback.css'; 
import CustomerHomePage from './customerhomepage';

function CustomerPage() {
  const Navigate = useNavigate(); // Get the history object

  const handleGoBack = () => {
    Navigate('/'); 
  };
  return (
    <div>
      <h1 style={{ color: 'rgb(17, 159, 187)' }}>Customer Page </h1>
      <button className="goback-button" onClick={handleGoBack}>
        &lt; Go Back
      </button>
      <CustomerHomePage /> 
    </div>
  );
}

export default CustomerPage;
