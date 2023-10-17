import React, { useContext } from 'react'
import Layout from '../../components/layout/Layout'
import myContext from '../../context/data/myContext'
import HeroSection from '../../components/heroSection/HeroSection'
import ProductCard from '../../components/productCard/ProductCard'
import Track from '../../components/track/Track'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useEffect } from 'react'
import { setUser } from '../../../SanoshProject/redux/shopOneUserSlice'



function Home() {
  const user = useSelector((state) => state.shoponeuser.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  
useEffect(() => {
  if (!isLoadingUser && user.length === 0 || user.role == "shopkeeper") {
    navigate("/admin/login");
  }
}, [isLoadingUser, user, navigate]);

useEffect(() => { 
  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData) {
    if (userData.role == "shopkeeper") {
      navigate("/customer/login");
    }
    dispatch(setUser(userData));
  }
  setIsLoadingUser(false);
}, []);
  return (
    <Layout>
      <HeroSection />
      <ProductCard />
      <div className="flex justify-center -mt-10 mb-4">
        <Link to={'/shop04/allproducts'}>
          <button className=' bg-gray-300 px-5 py-2 rounded-xl'>See more</button>
        </Link>
      </div>
      <Track />
    </Layout>
  )
}

export default Home