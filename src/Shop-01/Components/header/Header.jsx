
import React from "react";
// import styles from "./Header.module.scss";
import styles from "./Header.css"; // Import the normal CSS file
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="shop17-header">
      <div className={styles["shop17-header"]}>
       
        <nav>
          <ul>    
          <div>
          <h1 style={{ color: "white", marginLeft: '25px', fontSize: '3.5rem' , margin:'0', display:'inline-block',marginBottom:'25px'}}><span style={{color:'orangered'}}>Mr.Computer</span>Wizz</h1>
          <h2 style={{display:'inline', marginLeft:'40%', marginTop:'1.5rem'}}><Link className="shop17-custom-link">Cart</Link><Link to='/computer' className='link'>ComputerHome</Link> </h2>
          </div> 
              
          </ul>
         
             
        </nav>
      </div>
    </header>
  );
}

export default Header;
