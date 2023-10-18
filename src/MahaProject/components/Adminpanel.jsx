import React, { useState } from 'react';
import ProductForm from './ProductForm';
import ProductDisplay from './ProductDisplay';
import UpdateProduct from './UpdateProduct';
import DeleteProduct from './DeleteProduct';
import IndividualShopReport from '../DailyInventory';
import { setUser } from '../../SanoshProject/redux/shopOneUserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showDisplayProduct, setShowDisplayProduct] = useState(false);
  const [showUpdateProduct, setShowUpdateProduct] = useState(false);
  const [showDeleteProduct, setShowDeleteProduct] = useState(false);
  const [showinventoryProduct, setshowinventoryProduct] = useState(false);
  const user = useSelector((state) => state.shoponeuser.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const [showsalesreportProduct, setshowsalesreportProduct] = useState(false);

  const handleAddProductClick = () => {
    setShowAddProduct(true);
    setShowDisplayProduct(false);
    setShowUpdateProduct(false);
    setShowDeleteProduct(false);
  };

  const handleDisplayProductClick = () => {
    setShowAddProduct(false);
    setShowDisplayProduct(true);
    setShowUpdateProduct(false);
    setShowDeleteProduct(false);
  };

  const handleUpdateProductClick = () => {
    setShowAddProduct(false);
    setShowDisplayProduct(false);
    setShowUpdateProduct(true);
    setShowDeleteProduct(false);
  };

  const handleDeleteProductClick = () => {
    setShowAddProduct(false);
    setShowDisplayProduct(false);
    setShowUpdateProduct(false);
    setShowDeleteProduct(true);
  };
  const handleinventoryProductClick = () => {
    window.location.href  = '/shop12/daily-inventory';
  }
  useEffect(() => {
    if (!isLoadingUser && user.length === 0) {
      navigate("/admin/login");
    }
  }, [isLoadingUser, user, navigate]);

  useEffect(() => { 
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.email == "mahaadmin@gmail.com") {
      if (userData.role == "admin") {
        navigate("/admin/login");
      }
      dispatch(setUser(userData));
    }
    setIsLoadingUser(false);
  }, []);
  const handlesalesreportProductClick = () => {
    window.location.href  = '/erichie/overall-report';
  }
  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/admin/login"); // Use navigate to redirect to the login page
  };
  

  return (
    <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 min-h-screen flex flex-col items-center justify-center text-black">
      <div className="admin-panel p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold mb-4 text-center">Move forward with your admin actions</h1>
        <div className="flex flex-col items-center gap-4">
          <button onClick={handleAddProductClick} className="btn">Add Product</button>
          <button onClick={handleDisplayProductClick} className="btn">Display Products</button>
          <button onClick={handleUpdateProductClick} className="btn">Update Products</button>
          <button onClick={handleDeleteProductClick} className="btn">Delete Products</button>
          <button onClick={handleinventoryProductClick} className="btn">Inventory Report</button>
          
          <Link to="/erichie/overall-report">
          <button  className="btn">Sales Report</button>
          </Link>
          <button className="btn btn-danger" onClick={handleSignOut}>Sign Out</button>

        </div>
        {showAddProduct && <ProductForm />}
        {showDisplayProduct && <ProductDisplay />}
        {showUpdateProduct && <UpdateProduct />}
        {showDeleteProduct && <DeleteProduct />}
        {showinventoryProduct && <IndividualShopReport />}
        {showsalesreportProduct && <SalesReport />}
      </div>
    </div>
  );
};

export default AdminPanel;
