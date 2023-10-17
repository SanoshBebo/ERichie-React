import React from 'react'
import { MdOutlineLocalShipping } from 'react-icons/md';
import { AiOutlineSearch,AiOutlineShoppingCart } from 'react-icons/ai';
import { AiOutlineLogin } from 'react-icons/ai';
import { BiLogoAmazon } from 'react-icons/bi';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/nav.css'
import { useSelector } from 'react-redux';


const nav = ({search, setSearch, searchproduct}) => {
  const { pathname } = useLocation();

  // Check if the current URL is '/admin' and hide the element if true
  if (pathname === '/admin'|| pathname === '/adminHome' || pathname === '/register'|| pathname === '/dashboard'|| pathname === '/reset' ) {
    return null;
  }
  const navigate = useNavigate();
  const itemsInCart = useSelector((state)=>state.shoponecart.itemsInCart)

  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/customer/login");

    toast.success('Signed Out!!', {
      position: 'top-right',
      autoClose: 3000, // Time in milliseconds to keep the toast open
    });
  };

  const location = useLocation();
  const isShopPath = location.pathname === '/shop13/shop';

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
            <>
              {isShopPath && (
                <div className='search_boxab'>
                  <input type="text" value={search} placeholder='search' onChange={(e) => setSearch(e.target.value)} />
                  <button onClick={searchproduct}><AiOutlineSearch /></button>
                </div>
              )}
            </>
            <div className='user'>
              <div className='icon'>
                {/* <Link to ="/erichie/cart"><button><AiOutlineShoppingCart/></button></Link> */}
              </div>

            </div>

          </div>
          
      </div>
      <div className='last_headerab'>
              <div className='nav'>
                <ul>
                  <li><Link to='/shop13' className='link'>Home</Link></li>
                  <li><Link to='/shop13/shop' className='link'>Shop</Link></li>
                  <li><Link to="/erichie/cart" className='link'><AiOutlineShoppingCart size={32}/><p className="bg-white text-black rounded-full h-6 w-6 text-center ">
                  {itemsInCart}
                </p></Link></li>
                  <li><Link to='/computer' className='link'>ComputerHome</Link></li>
                  <li><Link to='/erichie' className='link'>E-Richie</Link></li>
                  
                  <li ><Link className='link' onClick={handleSignOut}> SignOut</Link></li>
                </ul>
              
              </div>
            </div>

    </div>
    
    
    </div>


  )
}

export default nav