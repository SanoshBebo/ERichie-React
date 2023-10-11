import React from 'react'
import '../styles/footer.css'
import {FaPiggyBank,FaShippingFast,FaHeadset} from 'react-icons/fa'

const Footer = () => {
  return (
    <>
        <div className='abiramfooter'>
            <div className='container'>
                <div className='left-box'>
                    <div className='box'>
                        <div className='icon_box'>
                            <FaPiggyBank/>
                        </div>
                        <div className='detail   '>
                            <h3>Great saving</h3>
                            <p>Lorem ipsum dolor, sit amet consectetur </p>
                        </div>
                    </div>
                    <div className='box'>
                        <div className='icon_box'>
                            <FaShippingFast/>
                        </div>
                        <div className='detail   '>
                            <h3>Free delivery</h3>
                            <p>Lorem ipsum dolor, sit amet consectetur </p>
                        </div>
                    </div>
                    <div className='box'>
                        <div className='icon_box'>
                            <FaHeadset/>
                        </div>
                        <div className='detail   '>
                            <h3>24/7 support</h3>
                            <p>Lorem ipsum dolor, sit amet consectetur </p>
                        </div>
                    </div>


                </div>
                <div className='right_box'>
                    <div className='header'>
                        <img src="../../public/images/logo.png" alt="" />
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi aspernatur minima nobis sint veritatis ut autem sed numquam ad! Corporis corrupti ratione sed asperiores provident nisi in deserunt a numquam.</p>
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
                            <li>4409,sjndcior </li>
                            <li>dffr , ffrrr,rfrf</li>
                            <li>ddrfrf rgrfrfr</li>
                        </ul>
                    </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </>

  )
}

export default Footer