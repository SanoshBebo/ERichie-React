import React, { useState,useEffect } from 'react';
import Nav from './components/nav'
import {BrowserRouter, Route, Routes, useParams, useLocation} from 'react-router-dom'
import Rout from './components/rout'
import Footer from './components/footer';
import Homeproduct from './components/home_product';
import fetchItems from './components/fetcher';
import AdminApp from '../admin/adminapp';
import axios from 'axios';
import Home from './components/home';
import Cart from './components/cart';
import Shop from './components/shop';
import ProductDetail from './components/ProductDetail';
// import "./index.css"


const App =() =>{

  const [items, setItems] = useState([]);
  useEffect(() => {
    import ("./index.css")

    const fetchData = async () => {
      const itemList = await fetchItems();
      setItems(itemList);
      setShop(itemList);

    };

    fetchData();
  }, []);


  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')

  const [shop, setShop] = useState(items)

 
  const allcatefilter =()=>
  {
    setShop(items)
  }

  const searchproduct = () => {

    if (!search || search.trim() === '') {
          alert('Please enter a search term');
          setShop(items);
          return;
        }
        

    const searchTerm = search;

    // setSearchTerm(searchTerm);

    const filtered = items.filter((product) =>

      product.productname.toLowerCase().includes(searchTerm.toLowerCase())

    );
    if (filtered.length === 0) {
      setShop(items);
      alert('No matching products found.');
      
    }

    setShop(filtered);

  };
  const defaultshop =()=>{
    setShop(items);
  }


  
  
  const addtocart =(product)=>
  {
    const exist = cart.find((x)=>
    {
      return x.id ===product.id
    })
    if(exist)
    {
      alert("Already added in cart")
    }
    else
    {
      setCart([...cart, {...product, quantity:1}])
      alert("Added in cart")

    }
    
  }

  return (
    <>
          <Nav search={search} setSearch={setSearch} searchproduct={searchproduct} shop={shop} allcatefilter={allcatefilter} addtocart={addtocart} />

      <Routes>

      {/* <Rout setCart={setCart}  cart={cart} shop={shop} allcatefilter={allcatefilter} addtocart={addtocart} defaultshop={defaultshop} /> */}
      <Route path="/" element={<Home addtocart={addtocart} />} />
        <Route path='/shop' element={<Shop shop={shop} allcatefilter={allcatefilter} addtocart={addtocart}/>}/>
        <Route path="/shop/:id" element={<ProductDetail />}/>
        <Route path="/adminHome" element={<AdminApp/>} />

      
      </Routes>
      <Footer />

    </>

  )

  


}

export default App;