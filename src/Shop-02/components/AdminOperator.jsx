import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AddProduct from '../pages/AddProduct';
import StockReport from '../pages/Report';
import ViewProducts from '../pages/ProductList';
import LiveReport from '../pages/LiveReport';
import Nav from '../navigation/navbar'; // Import the Nav component

function AdminOperations() {
  return (
    <div>
      <h1>Welcome Admin!!!!</h1>
      
      {/* Include the Nav component */}
      <Nav />

      <Routes>
        <Route path="/AdminAction/add" element={<AddProduct />} />
        <Route path="/AdminAction/view" element={<ViewProducts />} />
        <Route path="/AdminAction/report" element={<StockReport />} />
        <Route path="/AdminAction/livereport" element={<LiveReport />} />
      </Routes>
    </div>
  );
}

export default AdminOperations;
