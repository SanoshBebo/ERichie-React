import React, { useEffect } from "react";
import styles from "./Header.module.scss";
import { Link } from "react-router-dom";
import {FaShoppingCart} from "react-icons/fa"
import '../../harinistyles.css'
const logo = (
    <div className={styles.logo}>
    <Link to="/">
       <h2>
          e<span>Shop.</span>
       </h2>
    </Link>
 </div>
)
const cart = (
    <span className={styles.cart}>
      <Link to="/Cart">
        
        <FaShoppingCart size={35} />
        
      </Link>
    </span>
  );

const Header = () => {
    return (
        <header className="shop17-head">
            <div className={styles.header}>
               {logo}
               <nav>
               <ul>
                <li>
                    <h1 style={{color:"white" , marginLeft:'25px', fontSize:'4rem'}}>Harini Computers</h1>
                    
                </li>
                
            </ul>
            
                <div className={styles["header-right"]}>
                 {cart}
                 <Link to="/ContactUs" >
                  <p style={{color:'white',marginLeft:'10px'}}>Contact Us</p>
                 </Link>
                 <Link to="/About" className={styles.link}>
                  <p style={{color:'white',marginLeft:'10px'}}>About Us</p>
                 </Link>
                </div>
               </nav>
            </div>
        </header>
    )
}

export default Header

// import React from "react";
// import styles from "./Header.module.scss";
// import { Link } from "react-router-dom";
// import { FaShoppingCart } from "react-icons/fa";

// const logo = (
//   <div className={styles.logo}>
//     <Link to="/">
//       <h2>
//         e<span>Shop.</span>
//       </h2>
//     </Link>
//   </div>
// );

// const Header = ({ cartCount }) => {
//   return (
//     <header>
//       <div className={styles.header}>
//         {logo}
//         <nav>
//           <ul>
//             <li>
//               <h1 style={{ color: "white", marginLeft: "25px" }}>
//                 Harini Computers
//               </h1>
//             </li>
//           </ul>

//           <div className={styles["header-right"]}>
//             <span className={styles.cart}>
//               <Link to="/Cart">
//                 Cart
//                 <FaShoppingCart size={25} />
//                 <p>{cartCount}</p>
//               </Link>
//             </span>
//           </div>
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Header;




// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FaShoppingCart } from 'react-icons/fa';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/firestore';

// function Navigation() {
//   const [cartCount, setCartCount] = useState(0);

//   useEffect(() => {
//     // Fetch cart items for the currently logged-in user and count them
//     const username = /* Get the currently logged-in username */;
//     if (username) {
//       const unsubscribe = firebase
//         .firestore()
//         .collection('carts')
//         .where('username', '==', username)
//         .onSnapshot((snapshot) => {
//           // Calculate the cart count based on the number of items
//           const count = snapshot.docs.length;
//           setCartCount(count);
//         });

//       // Clean up the listener when the component unmounts
//       return () => unsubscribe();
//     }
//   }, []);

//   return (
//     <div className="navigation">
//       <Link to="/">Home</Link>
//       <Link to="/Cart">
//         Cart
//         <FaShoppingCart size={25} />
//         <p>{cartCount}</p>
//       </Link>
//     </div>
//   );
// }

// export default Navigation;
