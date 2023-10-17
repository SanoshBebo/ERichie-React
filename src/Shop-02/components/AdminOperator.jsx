import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AddProduct from '../pages/AddProduct';
import StockReport from '../pages/Report';
import ViewProducts from '../pages/ProductList';
import LiveReport from '../pages/LiveReport';
import Nav from '../navigation/navbar'; // Import the Nav component
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../SanoshProject/redux/shopOneUserSlice';

function AdminOperations() {
  const user = useSelector((state) => state.shoponeuser.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    if (!isLoadingUser && user.length === 0) {
      navigate("/admin/login");
    }
  }, [isLoadingUser, user, navigate]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.email === "sanjayadmin@gmail.com") {
      if (userData.role === "customer") {
        navigate("/admin/login");
      }
      dispatch(setUser(userData));
    }
    setIsLoadingUser(false);
  }, []);

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
