import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory from react-router-dom
import '../../goback.css';
import AdminHomePage from './adminhomepage';

function AdminPage() {
  const Navigate = useNavigate(); // Get the history object

  const handleGoBack = () => {
    Navigate('/'); 
  };

  return (
    <div>
      <h1 style={{ color: 'rgb(17, 159, 187)' }}>Admin Page</h1>
      <button className="goback-button" onClick={handleGoBack}>
        &lt; Go Back
      </button>
      <AdminHomePage />
      
    </div>
  );
}

export default AdminPage;
