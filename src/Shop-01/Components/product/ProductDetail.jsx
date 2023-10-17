
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import './ProductDetail.css'; // Import the CSS file
import Header from "../header/Header";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FetchItemsInCart from "../../../ERichie/components/FetchItemsInCart";


const firebaseConfig = {
  apiKey: "AIzaSyBV81LLXLpCtn-8rGdcrLyrIg4mwhCvkZA",
  authDomain: "crud-550f3.firebaseapp.com",
  projectId: "crud-550f3",
  storageBucket: "crud-550f3.appspot.com",
  messagingSenderId: "798322035823",
  appId: "1:798322035823:web:8d8c9b1d108ce5e293919a",
  measurementId: "G-Y7TFJ7XBQ1"
};


import { setUser } from "../../../SanoshProject/redux/shopOneUserSlice";
import { addItemToCart, addNoOfItemsInCart } from "../../../SanoshProject/redux/shopOneCartSlice";
import { addCartToFirestore } from "../../../Api/CartOperationsFirestore";
import { useDispatch, useSelector } from "react-redux";




// Check if Firebase is not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
function ProductDetail() {
  const { documentId } = useParams(); // Get the documentId from the URL parameter
  const [product, setProduct] = useState(null);
  const [amount, setAmount] = useState(0); // Declare the amount state


  useEffect(() => {
    // Function to fetch product details based on the documentId
    const fetchProductDetails = async () => {
      try {
        const productRef = await firebase
          .firestore()
          .collection('Products')
          .doc(documentId)
          .get();

        if (productRef.exists) {
          const productData = productRef.data();
          setProduct(productData);
          setAmount(productData.price);
        } else {
          console.log(`Product with document ID ${documentId} not found.`);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    // Call the function to fetch product details
    fetchProductDetails();
    
  }, [documentId]);

  
  const increaseQuantity = () => {
    const maxPurchaseQuantity = 10;
    
    if (quantity + 1 <= product.stock && quantity < maxPurchaseQuantity) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    } else if (quantity >= maxPurchaseQuantity) {
      toast.error('You can only purchase up to 10 products in a single purchase.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };
  
  

  const decreaseQuantity = () => {
    if (quantity-1 > 0) {
    
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };


  const handleLottery = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    
    if (userData && userData.role === "customer") {
    dispatch(setUser(userData));
    
    const userIdentifier = userData?.email || ''; 
    const lotteryKey = `lotteryParticipation_${userIdentifier}`;
    const hasParticipated = localStorage.getItem(lotteryKey);
  
    if (hasParticipated) {
      toast.warning('You have already participated in the lottery.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } else {
      const randomResult = Math.floor(Math.random() * 2);
  
      if (randomResult === 1) {
       
        const updatedPrice = product.price - 3000;
        setAmount(updatedPrice);
        // const productRef = firebase.firestore().collection('Products').doc(documentId);
        const productRef = firebase.firestore().collection('Products').doc(documentId);
        productRef.update({ price: updatedPrice })
        .then(() => {
          console.log('Price updated in Firestore.');
        })
        .catch((error) => {
          console.error('Error updating price in Firestore:', error);
        });
  
        toast.success('Congratulations! You won a cashback of 3000.', {
          position: 'top-right',
          autoClose: 3000,
        });
  
        localStorage.setItem(lotteryKey, 'true');
      } else {
        toast.error('Sorry, better luck next time.', {
          position: 'top-right',
          autoClose: 3000,
        });
        localStorage.setItem(lotteryKey, 'true');
      }
    }
   }
   else {
    // localStorage.setItem("redirectUrl", JSON.stringify(redirectUrl));
    navigate("/customer/login");
  }
  setIsLoadingUser(false);
  };
  
  const user = useSelector((state) => state.shoponeuser.user);

  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch(); // You can use useDispatch here
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const navigate = useNavigate();

  const itemsInCart = useSelector((state)=>state.shoponecart.itemsInCart)
  const  items = FetchItemsInCart();

  const url = `/Products/${documentId}`;
  let redirectUrl = { 
    url: url,
  };

  useEffect(() => {
    if ((!isLoadingUser && user.length === 0) || user.role == "shopkeeper") {
      navigate("/customer/login");
    }
  }, [isLoadingUser, user, navigate]);

  const addToCart = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    
    if (userData && userData.role === "customer") {
      dispatch(setUser(userData));
      const cartItem = {
        id: documentId,
        name: product.productname,
        description: product.description,
        stock: product.stock,
        shopid: product.shopid,
        price: product.price,
        imageurl: product.imageurl,
        quantity: quantity,
      };
      console.log(cartItem)
      dispatch(addItemToCart(cartItem));
      dispatch(addNoOfItemsInCart(quantity));

      addCartToFirestore(cartItem, userData.email);
  
      // Show a toast message
      toast.success('Product added to cart!', {
        position: 'top-right',
        autoClose: 3000, 
      });
    } else {
      // localStorage.setItem("redirectUrl", JSON.stringify(redirectUrl));
      navigate("/customer/login");
    }
    setIsLoadingUser(false);
  };

  return (
  
      <div>
        <Header />
        <div className="product-detail-container">
          <div className="product-detail-content">
            {product ? (
              <>
                <div>
                  <img
                    src={product.imageurl}
                    alt={product.productname}
                    className="product-image"
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <h1 style={{ color: 'black', marginBottom: '10px' }}>
                      {product.productname}
                    </h1>
                    <h3>{product.description}</h3>
                    {product.stock > 0 ? (
                      <>
                       
                        <p> Rs: {product.price}</p>
                        <div className="quantity-control">
                          <button className="quantity-button" onClick={decreaseQuantity}>
                            -
                          </button>
                          <input
                            type="text"
                            value={quantity}
                            readOnly
                            className="quantity-input"
                          />
                          <button className="quantity-button" onClick={increaseQuantity}>
                            +
                          </button>
                        </div>
                        <button className="purchase-button" onClick={() => { addToCart(); }}>
                          Add to Cart
                        </button>
                        
                        {/* <button className="lottery-button" onClick={handleLottery} style={{margin:'15px'}}>
                          Try Your Luck (Lottery)
                        </button> */}
                        <button
                            className="lottery-button"
                            onClick={handleLottery}
                            style={{ margin: '15px' }}
                            disabled={product.price <= 20000}
                          >
                            Try Your Luck (Lottery)
                          </button>

                      </>
                    ) : (
                      <p>No stock</p>
                    )}
                    <button className="purchase-button" >
                      <Link to="/shop17/home" className="shop17-custom-link"> Back to home</Link>
                    </button>
                    <p>Total Price: Rs {quantity * product.price}</p>
                  </div>
                </div>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    );
    
        }


export default ProductDetail;

// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/firestore';
// import './ProductDetail.css'; // Import the CSS file
// import Header from "../../components/header/Header";
// import { Link } from "react-router-dom";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const firebaseConfig = {
//   apiKey: "AIzaSyBV81LLXLpCtn-8rGdcrLyrIg4mwhCvkZA",
//   authDomain: "crud-550f3.firebaseapp.com",
//   projectId: "crud-550f3",
//   storageBucket: "crud-550f3.appspot.com",
//   messagingSenderId: "798322035823",
//   appId: "1:798322035823:web:8d8c9b1d108ce5e293919a",
//   measurementId: "G-Y7TFJ7XBQ1"
// };

// import { setUser } from "../../../SanoshProject/redux/shopOneUserSlice";
// import { addItemToCart } from "../../../SanoshProject/redux/shopOneCartSlice";
// import { addCartToFirestore } from "../../../Api/CartOperationsFirestore";
// import { useDispatch, useSelector } from "react-redux";

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

// function ProductDetail() {
//   const { documentId } = useParams();
//   const [product, setProduct] = useState(null);
//   const [amount, setAmount] = useState(0);
//   const [lotteryParticipated, setLotteryParticipated] = useState(false);
  
//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       try {
//         const productRef = firebase.firestore().collection('Products').doc(documentId);
//         const productSnapshot = await productRef.get();

//         if (productSnapshot.exists) {
//           const productData = productSnapshot.data();
//           setProduct(productData);
//           setAmount(productData.price);
//         } else {
//           console.log(`Product with document ID ${documentId} not found.`);
//         }
//       } catch (error) {
//         console.error('Error fetching product details:', error);
//       }
//     };

//     fetchProductDetails();
    
//   }, [documentId]);

//   const increaseQuantity = () => {
//     const maxPurchaseQuantity = 10;
    
//     if (quantity + 1 <= product.stock && quantity < maxPurchaseQuantity) {
//       setQuantity((prevQuantity) => prevQuantity + 1);
//     } else if (quantity >= maxPurchaseQuantity) {
//       toast.error('You can only purchase up to 10 products in a single purchase.', {
//         position: 'top-right',
//         autoClose: 3000,
//       });
//     }
//   };
  
//   const decreaseQuantity = () => {
//     if (quantity - 1 > 0) {
//       setQuantity((prevQuantity) => prevQuantity - 1);
//     }
//   };

//   const handleLottery = () => {
//     if (!lotteryParticipated) {
//       const randomResult = Math.floor(Math.random() * 2);

//       if (randomResult === 1) {
//         const updatedPrice = product.price - 1000;
//         setAmount(updatedPrice);

//         const productRef = firebase.firestore().collection('Products').doc(documentId);
//         productRef.update({ price: updatedPrice })
//           .then(() => {
//             console.log('Price updated in Firestore.');
//           })
//           .catch((error) => {
//             console.error('Error updating price in Firestore:', error);
//           });

//         toast.success('Congratulations! You won a cashback of 1000.', {
//           position: 'top-right',
//           autoClose: 3000,
//         });
//         localStorage.setItem(lotteryKey, 'true');
//         setLotteryParticipated(true);
//       } else {
//         toast.error('Sorry, better luck next time.', {
//           position: 'top-right',
//           autoClose: 3000,
//         });
//       }
//     } else {
//       toast.warning('You have already participated in the lottery.', {
//         position: 'top-right',
//         autoClose: 3000,
//       });
//     }
//   }

//   const user = useSelector((state) => state.shoponeuser.user);
//   const [quantity, setQuantity] = useState(1);
//   const dispatch = useDispatch();
//   const [isLoadingUser, setIsLoadingUser] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if ((!isLoadingUser && user.length === 0) || user.role == "shopkeeper") {
//       navigate("/customer/login");
//     }
//   }, [isLoadingUser, user, navigate]);

//   const addToCart = () => {
//     const userData = JSON.parse(localStorage.getItem("user"));
    
//     if (userData && userData.role === "customer") {
//       dispatch(setUser(userData));
//       const cartItem = {
//         id: documentId,
//         name: product.productname,
//         description: product.description,
//         stock: product.stock,
//         shopid: product.shopid,
//         price: product.price,
//         imageurl: product.imageurl,
//         quantity: quantity,
//       };
//       dispatch(addItemToCart(cartItem));
//       addCartToFirestore(cartItem, userData.email);
  
//       toast.success('Product added to cart!', {
//         position: 'top-right',
//         autoClose: 3000,
//       });
//     } else {
//       navigate("/customer/login");
//     }
//     setIsLoadingUser(false);
//   };

//   return (
//     <div>
//       <Header />
//       <div className="product-detail-container">
//         <div className="product-detail-content">
//           {product ? (
//             <>
//               <div>
//                 <img
//                   src={product.imageurl}
//                   alt={product.productname}
//                   className="product-image"
//                 />
//               </div>
//               <div>
//                 <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
//                   <h1 style={{ color: 'black', marginBottom: '10px' }}>
//                     {product.productname}
//                   </h1>
//                   <h3>{product.description}</h3>
//                   {product.stock > 0 ? (
//                     <>
//                       <p> Rs: {product.price || amount}</p>
//                       <div className="quantity-control">
//                         <button className="quantity-button" onClick={decreaseQuantity}>
//                           -
//                         </button>
//                         <input
//                           type="text"
//                           value={quantity}
//                           readOnly
//                           className="quantity-input"
//                         />
//                         <button className="quantity-button" onClick={increaseQuantity}>
//                           +
//                         </button>
//                       </div>
//                       <button className="purchase-button" onClick={() => { addToCart(); }}>
//                         Add to Cart
//                       </button>
//                       <button className="lottery-button" onClick={handleLottery} style={{margin:'15px'}}>
//                         Try Your Luck (Lottery)
//                       </button>
//                     </>
//                   ) : (
//                     <p>No stock</p>
//                   )}
//                   <button className="purchase-button" >
//                     <Link to="/shop17/home" className="shop17-custom-link"> Back to home</Link>
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <p>Loading...</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProductDetail;


























































