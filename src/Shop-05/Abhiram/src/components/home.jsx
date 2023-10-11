import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import Homeproduct from './home_product'
import {AiFillEye, AiOutlineShoppingCart} from "react-icons/ai";
import fetchItems from './fetcher';
import '../styles/ahome.css';



const Home = (addtocart) => {

  const [items, setItems] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const itemList = await fetchItems();
      setItems(itemList);
    };

    fetchData();
  }, []);



  const [trendingProduct, setTrendingProduct] = useState(Homeproduct)



  return (
    <div className='ahome'>
    <div className='home'>
        <div className='top_banner'>
          <div className='contant'>
            <h3></h3>
            <h2></h2>
            <p></p>
            <Link to='/shop' className='link' >shopnow</Link>
          </div>
        </div>
        
        <div className='trending'>
          <div className='container'>
            <div className='left_box'>
              <div className='header'>
                <div className='heading'>
                  <h2>TRENDING</h2>
                </div>
                <div className='cate'>
                  
                </div>
              </div>
              
            </div>
          </div>
        </div>
        <div className='banners'>
          <div className='container'>
            <div className='left_box'>
              <div className='box'>
              <Link to='/shop13/shop' className='link' ><img src='https://firebasestorage.googleapis.com/v0/b/abhiram-store.appspot.com/o/Multi-Banner-1.avif?alt=media&token=bf63ba5b-fd11-472b-b3ff-68733ea5f2a5&_gl=1*p8m4p6*_ga*MzEwMDU5MjE4LjE2OTUwOTk4MjQ.*_ga_CW55HF8NVT*MTY5NjUxODc4OS43Ni4xLjE2OTY1MjkwOTEuMjguMC4w' alt='banner'></img>
    </Link>

              </div>
              <div className='box'>
              <Link to='/shop13/shop' className='link' ><img src='https://firebasestorage.googleapis.com/v0/b/abhiram-store.appspot.com/o/Multi-banner-2.avif?alt=media&token=ceeea596-3936-4cb8-a2dd-cc479eb35ea2&_gl=1*gqmt2s*_ga*MzEwMDU5MjE4LjE2OTUwOTk4MjQ.*_ga_CW55HF8NVT*MTY5NjUxODc4OS43Ni4xLjE2OTY1MjkxMzcuNjAuMC4w' alt='banner'></img>
    </Link>

              </div>
            </div>
            <div className='right_box'>
              <div className='top'>
              <Link to='/shop13/shop' className='link' ><img src='https://firebasestorage.googleapis.com/v0/b/abhiram-store.appspot.com/o/Multi-Banner-3.webp?alt=media&token=14a67839-c55f-4bc2-aaa3-e81526ebaa91&_gl=1*1jx593l*_ga*MzEwMDU5MjE4LjE2OTUwOTk4MjQ.*_ga_CW55HF8NVT*MTY5NjUxODc4OS43Ni4xLjE2OTY1MjkxNDcuNTAuMC4w' alt='banner'></img>
    </Link>

                <Link to='/shop13/shop' className='link' ><img src='https://firebasestorage.googleapis.com/v0/b/abhiram-store.appspot.com/o/Multi-banner-4.avif?alt=media&token=837c030c-ab0e-40f8-b954-99d647617592&_gl=1*iz4bvv*_ga*MzEwMDU5MjE4LjE2OTUwOTk4MjQ.*_ga_CW55HF8NVT*MTY5NjUxODc4OS43Ni4xLjE2OTY1MjkxNjYuMzEuMC4w' alt='banner'></img>
    </Link>

              </div>
              <div className='bottom'>
              <Link to='/shop13/shop' className='link' ><img src='https://firebasestorage.googleapis.com/v0/b/abhiram-store.appspot.com/o/Multi-Banner-5.webp?alt=media&token=1e9e8fb7-95ce-4985-8479-433acb101ef9&_gl=1*1pd3dua*_ga*MzEwMDU5MjE4LjE2OTUwOTk4MjQ.*_ga_CW55HF8NVT*MTY5NjUxODc4OS43Ni4xLjE2OTY1MjkxODEuMTYuMC4w' alt='banner'></img>
    </Link>

              </div>
            </div>
          </div>
        </div>

        
    </div>
    
    </div>
  )
}

export default Home