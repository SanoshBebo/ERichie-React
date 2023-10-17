
import React from "react";
// import styles from "./Header.module.scss";
import styles from "./Header.css"; // Import the normal CSS file

import { Link , useNavigate} from "react-router-dom";
import { FaShoppingCart } from 'react-icons/fa';
const Header = () => {
  const navigate = useNavigate();
  const handleSignOut = () => {
  localStorage.removeItem("user");
  navigate("/customer/login");
};
  return (
    <header className="shop17-header">
      <div className={styles["shop17-header"]}>
       
        <nav>
          <ul>    
          <div>
          <h1 style={{ color: "white", marginLeft: '1%', fontSize: '3.5rem' , display:'inline-block',marginBottom:'0px', textAlign:'center'}}><span style={{color:'orangered'}}>Mr.Computer</span>Wizz</h1>
          <h2 style={{display:'inline', marginLeft:'40%', marginTop:'1.5rem', marginRight:'20px'}}>
            <Link to ="/erichie/cart" className="shop17-custom-link"><FaShoppingCart/></Link>
            <Link to='/computer' className='shop17-custom-link' style={{marginLeft:'10px'}}>ComputerHome</Link> 
          </h2>
          <button onClick={handleSignOut}>Signout</button>
          </div> 
          </ul>
         
             
        </nav>
      </div>
    </header>
  );
}

export default Header;

