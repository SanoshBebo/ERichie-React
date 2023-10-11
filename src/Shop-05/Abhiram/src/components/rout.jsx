import React from 'react'
import ReactDOM from 'react-dom/client';
import {Route, Routes} from 'react-router-dom';

import Home from './home';
import Shop from './shop';
import Cart from './cart';
import ProductDetail from './ProductDetail';
import AdminApp from '../../admin/adminapp';


const Rout = ({shop,Filter,allcatefilter, addtocart,cart, setCart}) => {
  return (
    <>

      <div>
        {/* <Routes>
        <Route path="/" element={<Home addtocart={addtocart} />} />
        <Route path='/cart' element={<Cart cart={cart} setCart ={setCart} />} />
        <Route path='/shop' element={<Shop shop={shop} Filter={Filter} allcatefilter={allcatefilter} addtocart={addtocart}/>}/>
        <Route path="/shop/:id" element={<ProductDetail addtocart={addtocart}/>}/>
        <Route path="/adminHome" element={<AdminApp/>} />



        </Routes> */}
      </div>


    
    </>
  )
}

export default Rout