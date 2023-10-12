import React from 'react'
import { MdOutlineLocalShipping } from 'react-icons/md';
import { AiOutlineSearch,AiOutlineShoppingCart } from 'react-icons/ai';
import { AiOutlineLogin } from 'react-icons/ai';
import { BiLogoAmazon } from 'react-icons/bi';
import {Link, useLocation} from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

import '../styles/nav.css'


const nav = ({search, setSearch, searchproduct}) => {
  const { pathname } = useLocation();

  // Check if the current URL is '/admin' and hide the element if true
  if (pathname === '/admin'|| pathname === '/adminHome' || pathname === '/register'|| pathname === '/dashboard'|| pathname === '/reset' ) {
    return null;
  }

  return (
    
    <div className='navcss'>
    <div className='headerab'>
      <div className='top_headerab'>
        <div className='icon'>
          <MdOutlineLocalShipping/>
        </div>
          <div className='info'>
            <p>The e-commerce platform that cares</p>

          </div>
          <div className='mid_headerab'>
            <div className='logoab'>
            <img src="https://firebasestorage.googleapis.com/v0/b/abhiram-store.appspot.com/o/image-removebg-preview.png?alt=media&token=f49c4294-e279-4b1b-8c72-34d129babaab&_gl=1*13qb6vb*_ga*MzEwMDU5MjE4LjE2OTUwOTk4MjQ.*_ga_CW55HF8NVT*MTY5NjUxODc4OS43Ni4xLjE2OTY1MjY0NjAuNjAuMC4w" alt="logo" />
            </div>
            <div className='search_boxab'>
              <input type="text" value={search} placeholder='search' onChange={(e)=>setSearch(e.target.value)} />
              <button onClick={ searchproduct}><AiOutlineSearch/></button>
            </div>
            <div className='user'>
              <div className='icon'>
                <Link to ="/erichie/cart"><button><AiOutlineShoppingCart/></button></Link>
              </div>
              <div className='btn'>
                {/* <button>CART</button> */}
              </div>
            </div>

          </div>
          
      </div>
      <div className='last_headerab'>
              <div className='nav'>
                <ul>
                  <li><Link to='/shop13' className='link'>Home</Link></li>
                  <li><Link to='/shop13/shop' className='link'>Shop</Link></li>
                  <li><Link to='/computer' className='link'>ComputerHome</Link></li>
                  {/* <li><Link to='/cart' className='link'>Cart</Link></li> */}

                </ul>
              </div>
            </div>

    </div>
    
    
    </div>


  )
}

export default nav