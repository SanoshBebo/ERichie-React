import React from 'react'
import '../styles/footer.css'
import {FaPiggyBank,FaShippingFast,FaHeadset} from 'react-icons/fa'
import { useLocation } from 'react-router';

const Footer = () => {
    const { pathname } = useLocation();

  // Check if the current URL is '/admin' and hide the element if true
  if (pathname === '/admin' || pathname === '/register'|| pathname === '/dashboard'|| pathname === '/reset' ) {
    return null;
  }

  return (
    <div className='afooterdiv'>
        <div className='footer'>
            <div className='container'>
                <div className='left-box'>
                    <div className='box'>
                        <div className='icon_box'>
                            <FaPiggyBank/>
                        </div>
                        <div className='detail   '>
                            <h3>Great saving</h3>
                            <p>Great offers and deals to help your budget </p>
                        </div>
                    </div>
                    <div className='box'>
                        <div className='icon_box'>
                            <FaShippingFast/>
                        </div>
                        <div className='detail   '>
                            <h3>Free delivery</h3>
                            <p>Doorstep delivery with great packaging and delivery partnerships </p>
                        </div>
                    </div>
                    <div className='box'>
                        <div className='icon_box'>
                            <FaHeadset/>
                        </div>
                        <div className='detail   '>
                            <h3>24/7 support</h3>
                            <p>Connect with customer support for all your doubts and clarifications </p>
                        </div>
                    </div>


                </div>
                <div className='right_box'>
                    <div className='header'>
                        <img src="../../public/images/logo.png" alt="" />
                        <p>Your one-stop tech paradise: Shop the latest gadgets, computers, and accessories at our e-commerce computer store for unbeatable deals and top-notch service!</p>
                    </div>
                    <div className='bottom'>
                    <div className='box'>
                        <h3>Company</h3>
                        <ul>
                            <li>About us</li>
                            <li>Feedback</li>
                        </ul>
                    </div>
                    <div className='box'>
                        <h3>Address</h3>
                        <ul>
                            <li>123, Street, OMR Road </li>
                            <li>Chennai, TamilNadu, India</li>
                            <li>123321</li>
                        </ul>
                    </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>

  )
}

export default Footer
