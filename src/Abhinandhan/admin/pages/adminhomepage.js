import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminHomePage() {
  const navigate = useNavigate();

  const handleAddProductClick = () => {
    // Navigate to the "Add Product" page ("/admin/add-product")
    navigate('/addproduct');
  };
  const handleViewProductsClick = () => {
    // Navigate to the "Add Product" page ("/admin/view-product")
    navigate('/viewproducts');
  };

  return (
    <div>
      <h1>Welcome Admin</h1>
      <button
        style={{ padding: '10px', color: 'rgb(17, 159, 187)' }}
        onClick={handleAddProductClick}
      >
        Add Product
      </button>
      <button
        style={{ padding: '10px', color: 'rgb(17, 159, 187)' }}
        onClick={handleViewProductsClick}
      >
        View Products
      </button>
    </div>
  );
}

export default AdminHomePage;
