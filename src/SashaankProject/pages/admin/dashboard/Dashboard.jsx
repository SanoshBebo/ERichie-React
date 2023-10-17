//Admin Dashboard
import React, { useContext } from 'react'
import MyShankContext from '../../../../SuryaProject/context/data/MyShankContext';
import Layout from '../../../components/layout/Layout';
import DashboardTab from './DashboardTab';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import { setUser } from '../../../../SanoshProject/redux/shopOneUserSlice';

function Dashboard() {
    const context = useContext(MyShankContext)
    const { mode} = context
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
      if (userData && userData.email == "sashadmin@gmail.com") {
        if (userData.role == "customer") {
          navigate("/admin/login");
        }
        dispatch(setUser(userData));
      }
      setIsLoadingUser(false);
    }, []);
  return (
    <Layout>
        <section className="text-gray-600 body-font mt-10 mb-10">
            <DashboardTab/>
        </section>
    </Layout>
  )
}

export default Dashboard