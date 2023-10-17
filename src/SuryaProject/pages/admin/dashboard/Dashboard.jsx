import React, { useContext } from 'react'
import myContext from '../../../context/data/myContext';
import Layout from '../../../components/layout/Layout';
import DashboardTab from './DashboardTab';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { setUser } from '../../../../SanoshProject/redux/shopOneUserSlice';
import { useEffect } from 'react';
import { useState } from 'react';

function Dashboard() {
    const context = useContext(myContext)
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
      if (userData && userData.email == "suryaadmin@gmail.com") {
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
            <div className="container px-5 mx-auto mb-10">
                
            </div>
            <DashboardTab/>
        </section>
    </Layout>
  )
}

export default Dashboard