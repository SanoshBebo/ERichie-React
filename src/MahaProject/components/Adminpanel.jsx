import React, { useState } from 'react';
import ProductForm from './ProductForm';
import ProductDisplay from './ProductDisplay';
import UpdateProduct from './UpdateProduct';
import DeleteProduct from './DeleteProduct'; // Import the DeleteProduct component

const AdminPanel = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showDisplayProduct, setShowDisplayProduct] = useState(false);
  const [showUpdateProduct, setShowUpdateProduct] = useState(false);
  const [showDeleteProduct, setShowDeleteProduct] = useState(false); // Add state for delete product

  const handleAddProductClick = () => {
    setShowAddProduct(true);
    setShowDisplayProduct(false);
    setShowUpdateProduct(false);
    setShowDeleteProduct(false); // Ensure other options are set to false
  };

  const handleDisplayProductClick = () => {
    setShowAddProduct(false);
    setShowDisplayProduct(true);
    setShowUpdateProduct(false);
    setShowDeleteProduct(false); // Ensure other options are set to false
  };

  const handleUpdateProductClick = () => {
    setShowAddProduct(false);
    setShowDisplayProduct(false);
    setShowUpdateProduct(true);
    setShowDeleteProduct(false); // Ensure other options are set to false
  };

  const handleDeleteProductClick = () => {
    setShowAddProduct(false);
    setShowDisplayProduct(false);
    setShowUpdateProduct(false);
    setShowDeleteProduct(true);
  };

  return (
    <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 min-h-screen flex flex-col items-center justify-center text-white">
      <div className="admin-panel p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold mb-4 text-center">Move forward with your admin actions</h1>
        <div className="flex flex-col items-center gap-4">
          <button onClick={handleAddProductClick} className="btn">Add Product</button>
          <button onClick={handleDisplayProductClick} className="btn">Display Products</button>
          <button onClick={handleUpdateProductClick} className="btn">Update Products</button>
          <button onClick={handleDeleteProductClick} className="btn">Delete Products</button>
        </div>
        {showAddProduct && <ProductForm />}
        {showDisplayProduct && <ProductDisplay />}
        {showUpdateProduct && <UpdateProduct />}
        {showDeleteProduct && <DeleteProduct />} {/* Render DeleteProduct component when showDeleteProduct is true */}
      </div>
    </div>
  );
};

export default AdminPanel;
