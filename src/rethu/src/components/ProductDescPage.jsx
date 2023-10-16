import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCartToFirestore } from "../../../Api/CartOperationsFirestore";
import { addItemToCart } from "../../../SanoshProject/redux/shopOneCartSlice";
import { setUser } from "../../../SanoshProject/redux/shopOneUserSlice";

import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
function ProductDescPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.shoponeuser.user);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const apiUrl = `https://firestore.googleapis.com/v1/projects/dead-eye-game-store/databases/(default)/documents/Products/${productId}`;

    axios
      .get(apiUrl)
      .then((response) => {
        const productData = response.data.fields;
        setProduct(productData);
      })
      .catch((error) => {
        console.error("Error fetching product data: ", error);
      });
  }, [productId]);



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
        id: productId,
        name: product.productname.stringValue,
        description: product.description.stringValue,
        shopid: product.shopid.stringValue,
        stock: product.stock.integerValue,
        price: parseInt(product.price.integerValue, 10),
        imageurl: product.imageurl.stringValue,
        quantity: quantity,
      };
      dispatch(addItemToCart(cartItem));
      addCartToFirestore(cartItem, userData.email);
      toast.success("Product added successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      localStorage.setItem("redirectUrl", JSON.stringify(redirectUrl));
      navigate("/customer/login");
    }
    setIsLoadingUser(false);
  };

  const handleBuyNow = () => {
    setOrderPlaced(true);
  };

  const handleClose = () => {
    navigate("/shop05");
  };

  const handleAddQuantity =()=> {
    if(quantity < product.stock.integerValue){
      setQuantity((prev)=> prev+ 1);
    }
  }
  const handleMinusQuantity =()=> {
    if(quantity > 1){

      setQuantity((prev)=> prev - 1);
    }
  }
  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="navbar">
          <Link to="/erichie">Home Page</Link>
          <Link to="/gaming">Go back</Link>
          <Link to="/erichie/cart" className="navbar-button">
            <i className="fa fa-shopping-cart"></i> My Cart
          </Link>
          <a href="/customer/login" className="navbar-button">
            Signout
          </a>
          
    </div>
      <style>
        {`
          .centered-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }

          .centered-card {
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            padding: 16px;
            text-align: center;
          }
          .quantity-button {
            display: inline-block;
            background-color: #ccc;
            padding: 5px 10px;
            cursor: pointer;
          }
        `}
      </style>
      <div className="centered-container">
        <div className="centered-card">
          <h1>{product.productname.stringValue}</h1>
          <div className="image-container">
            <img
              src={product.imageurl.stringValue}
              alt={product.productname.stringValue}
              className="product-image1"
            />
          </div>
          <p>Description: {product.description.stringValue}</p>
          <p>Price: Rs.{product.price.integerValue}</p>
          <div className="quantity-container">
            <button
              className="quantity-button"
              onClick={handleMinusQuantity}
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const newQuantity = parseInt(e.target.value, 10) || 1;
                setQuantity(newQuantity);
              }}
              className="quantity-input"
            />
            {/* <p>{quantity}</p> */}
            <button
              className="quantity-button"
              onClick={handleAddQuantity}
            >
              +
            </button>
          </div>
          <button
            onClick={() => {
              addToCart();
            }}
            style={{ backgroundColor: "green", color: "white" }}
            className="buy-button"
          >
            Add to Cart
          </button>
          <button
            onClick={handleClose}
            className="buy-button"
            style={{ backgroundColor: "blue", color: "white" }}
          >
            Back to Home
          </button>
          {orderPlaced && (
            <div>
              <div className="overlay" />
              <div className="popup">
                <p>Order Successfully Placed</p>
                <button onClick={handleClose}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDescPage;
