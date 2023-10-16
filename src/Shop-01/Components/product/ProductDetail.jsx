
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import './ProductDetail.css'; // Import the CSS file
import Header from "../../components/header/Header";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import { addItemToCart } from "../../../SanoshProject/redux/shopOneCartSlice";
import { addCartToFirestore } from "../../../Api/CartOperationsFirestore";
import { useDispatch, useSelector } from "react-redux";




// Check if Firebase is not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
function ProductDetail() {
  const { documentId } = useParams(); // Get the documentId from the URL parameter
  const [product, setProduct] = useState(null);

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
    if((quantity+1)<= product.stock){
      setQuantity((prevQuantity) => prevQuantity + 1);
    }
    
  };

  const decreaseQuantity = () => {
    if (quantity > 0) {
    
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  

  const user = useSelector((state) => state.shoponeuser.user);

  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch(); // You can use useDispatch here
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const navigate = useNavigate();

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
      addCartToFirestore(cartItem, userData.email);
  
      // Show a toast message
      toast.success('Product added to cart!', {
        position: 'top-right',
        autoClose: 3000, // Time in milliseconds to keep the toast open
      });
    } else {
      // localStorage.setItem("redirectUrl", JSON.stringify(redirectUrl));
      navigate("/customer/login");
    }
    setIsLoadingUser(false);
  };



  return (
    <div>
    <Header/>
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
            <div >
            <div style={{display:'flex', alignItems:'center', flexDirection:'column'}}>
              <h1 style={{ color: 'black', marginBottom: '10px' }}>
                {product.productname}
              </h1>
              <h3>{product.description}</h3>
              <p>Availability: {product.stock}</p>
              <p> Rs:{product.price}</p>

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
              
              <button className="purchase-button" onClick={() => {addToCart();}}>
                Add to Cart
              </button>
              <button className="purchase-button" >
              <Link to="/shop17/home" className="shop17-custom-link"> Back to home</Link>
              
              </button>
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



























































