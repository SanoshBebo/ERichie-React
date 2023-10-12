import React, { useState, useEffect } from 'react';
import { useParams, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CheckOut.css';
import Header from './Header';
import PaymentPage from './Payment';


import { setUser } from "../../SanoshProject/redux/shopOneUserSlice";
import { addItemToCart } from "../../SanoshProject/redux/shopOneCartSlice";
import { addCartToFirestore } from "../../Api/CartOperationsFirestore";
import { useDispatch, useSelector } from "react-redux";


const CheckoutPage = () => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { productId } = useParams();
  const user = useSelector((state) => state.shoponeuser.user);


  useEffect(() => {
    fetchProduct(productId);
  }, [productId]);

  const fetchProduct = async (id) => {
    try {
      if (!id) {
        console.error('Invalid product ID:', id);
        return;
      }

      // Use environment variables for the API key
      const apiKey = 'AIzaSyCYi91lSnCgGpmOm-5fBjayL_npM65bZcQ';
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/adminstore-196a7/databases/(default)/documents/Products/${id}?key=${apiKey}`;

      const response = await axios.get(firestoreUrl);

      if (response.status === 200 && response.data) {
        const productData = response.data.fields;

        setProduct({
          id,
          productname: productData.productname?.stringValue || 'No name available',
          description: productData.description?.stringValue || 'No description available',
          price: productData.price?.integerValue || 0,
          imageurl: productData.imageurl?.stringValue || 'No image available',
          stock: productData.stock?.integerValue || 0,
          shopid: productData.shopid?.stringValue || 'shop15',
          category: productData.category?.stringValue || 'computers',
        });
      } else {
        console.error('Failed to fetch product data:', response);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleBuyNowClick = () => {
    window.location.href = `#`;
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };


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
    if (userData && userData.role == "customer") {
      dispatch(setUser(userData));
      console.log(product);
      const cartItem = {
        id: product.id,
        name: product.productname,
        description: product.description,
        stock: product.stock,
        price: product.price,
        imageurl: product.imageurl,
        quantity: quantity,
      };
      dispatch(addItemToCart(cartItem));
      addCartToFirestore(cartItem, userData.email);
    } else {
      navigate("/customer/login");
    }
    setIsLoadingUser(false);

    // Create an object with the product details and count
  };



  return (
    <>
      <Header />
      <div className="checkout">
        <h1>Checkout</h1>
        {product && (
          <div className="product-details">
            <img src={product.imageurl} alt={`Image for ${product.productname}`} />
            <strong>Product Name:</strong> {product.productname}<br />
            <strong>Price:</strong> ${product.price}<br />
            <p>{product.description}</p>
            <label>Quantity:</label>
            <button onClick={increaseQuantity}>+</button>
            <span>{quantity}</span>
            <button >Buy Now</button><br>
            </br>
            <button onClick={() => {
              addToCart();
            }}>Addtocart</button>
          </div>
        )}
        
        
      </div>
    </>
  );
};

export default CheckoutPage;
