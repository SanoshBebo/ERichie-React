import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import AdminPage from './admin/pages/adminpage';
import CustomerPage from './customer/pages/customerpage';
import AdminHomePage from './admin/pages/adminhomepage';
import CustomerHomePage from './customer/pages/customerhomepage';
import AddProduct from './admin/components/addproduct';
import ViewProducts from './admin/components/viewproducts';


function HomePage() {
  return (
    <div>
      <h1 style={{color: 'white'}}>Welcome to the Superstore</h1>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Admin</h5>
          <button className="btn btn-primary">
            <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>
              Go to Admin Page
            </Link>
          </button>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Customer</h5>
          <button className="btn btn-primary">
            <Link to="/customer" style={{ color: 'white', textDecoration: 'none' }}>
              Go to Customer Page
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/customer" element={<CustomerPage />} />
            <Route path="/adminhomepage" element={<AdminHomePage />} />
            <Route path="/customerhomepage" element={<CustomerHomePage />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/viewproducts" element={<ViewProducts />} />

          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
