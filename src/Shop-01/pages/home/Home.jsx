import React, { useEffect, useState } from "react";
import styles from "./Home.module.scss";
import Slider from "../../components/slider/slider";
import Header from "../../components/header/Header";
import ProductComponent from "../../components/product/Product";
import '../../harinistyles.css'
import Footer from "../../Components/footer/Footer"

const Home = () => {
    useEffect(()=>{
        import ('../../harinistyles.css');
    })
    return (
        <div>
            <Header/>
            <Slider/>
            <ProductComponent/>
            <Footer/>
        </div>
    )
}

export default Home


  
  