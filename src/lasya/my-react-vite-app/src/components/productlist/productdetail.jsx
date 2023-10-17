import React, { useState, useEffect } from "react";

import axios from "axios";

import "./productdetail.css";

import { useParams, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { addItemToCart, addNoOfItemsInCart } from "../../../../../SanoshProject/redux/shopOneCartSlice";

import { addCartToFirestore } from "../../../../../Api/CartOperationsFirestore";

import { setUser } from "../../../../../SanoshProject/redux/shopOneUserSlice";

import { Link } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import FetchItemsInCart from "../../../../../ERichie/components/FetchItemsInCart";

function ProductDescPage() {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [orderPlaced, setOrderPlaced] = useState(false);

  const [productAvailability, setProductAvailability] = useState(true);

  const navigate = useNavigate();

  const user = useSelector((state) => state.shoponeuser.user);

  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const dispatch = useDispatch();
  const itemsInCart = useSelector((state)=>state.shoponecart.itemsInCart)

  const [totalPrice, setTotalPrice] = useState(0);
  const { items } = FetchItemsInCart();

  useEffect(() => {
    const apiUrl = `https://firestore.googleapis.com/v1/projects/gamestore-1b041/databases/(default)/documents/Products/${productId}`;

    axios

      .get(apiUrl)

      .then((response) => {
        const productData = response.data.fields;

        setProduct(productData);

        // Check product availability based on stock

        if (productData.stock.integerValue === 0) {
          setProductAvailability(false);
        } else {
          setProductAvailability(true);
        }
      })

      .catch((error) => {
        console.error("Error fetching product data: ", error);
      });
  }, [productId]);

  useEffect(() => {
    if ((!isLoadingUser && user.length === 0) || user.role === "shopkeeper") {
      navigate("/customer/login");
    }
  }, [isLoadingUser, user, navigate]);

  useEffect(() => {
    // Calculate and update the total price whenever the quantity or product price changes

    if (product) {
      setTotalPrice(product.price.integerValue * quantity);
    }
  }, [quantity, product]);

  const addToCart = () => {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (userData && userData.role === "customer") {
      dispatch(setUser(userData));

      if (productAvailability) {
        const cartItem = {
          id: productId,

          name: product.productname.stringValue,

          description: product.description.stringValue,

          stock: product.stock.integerValue,

          shopid: product.shopid.stringValue,

          price: product.price.integerValue,

          imageurl: product.imageurl.stringValue,

          quantity: quantity,
        };

        // Check if quantity exceeds stock, limit it to stock

        if (quantity > product.stock.integerValue) {
          cartItem.quantity = product.stock.integerValue;
        }
        
        dispatch(addNoOfItemsInCart(quantity));
        dispatch(addItemToCart(cartItem));

        addCartToFirestore(cartItem, userData.email);


        toast.success("Product added to cart successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error("Product is currently unavailable", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } else {
      localStorage.setItem("redirectUrl", JSON.stringify(redirectUrl));

      navigate("/customer/login");
    }

    setIsLoadingUser(false);
  };

  const handleBuyNow = () => {
    // You can customize this part as per your requirements

    // For simplicity, it sets the orderPlaced state to true.

    setOrderPlaced(true);
  };

  const handleClose = () => {
    // Navigate to "/shop05" when the "Close" button is clicked

    navigate("/shop06");
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        height: "100vh",
      }}
    >
      <div className="navbar">
        <Link to="/erichie">Home Page</Link>

        <Link to="/gaming">Go back</Link>

        <li>
          <Link to="/erichie/cart">🛒 </Link>{" "}
          <p className="bg-white text-black rounded-full h-6 w-6 text-center ">
                  {itemsInCart}
                </p>
        </li>

        <a href="/customer/login" className="navbar-button">
          Signout
        </a>
      </div>

      <div style={{ textAlign: "center" }}>
        <div className="product-card">
          <h1>{product.productname.stringValue}</h1>

          <img
            src={product.imageurl.stringValue}
            alt={product.productname.stringValue}
            style={{ width: "70%" }}
          />

          <p>Description: {product.description.stringValue}</p>

          <p>Price: Rs.{product.price.integerValue}</p>

          <div className="quantity-control">
            <p>Quantity:</p>

            <div className="quantity-buttons">
              <button
                className="quantity-button"
                onClick={() => {
                  const newQuantity = quantity - 1 > 0 ? quantity - 1 : 1;

                  setQuantity(newQuantity);
                }}
              >
                -
              </button>

              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value, 10) || 1;

                  // Ensure the new quantity doesn't exceed the stock

                  if (newQuantity > product.stock.integerValue) {
                    setQuantity(product.stock.integerValue);
                  } else {
                    setQuantity(newQuantity);
                  }
                }}
                max={product.stock.integerValue} // Add max attribute
                style={{ width: "30px" }} // Adjust the width as needed
              />

              <button
                className="quantity-button"
                onClick={() => {
                  // Check if quantity exceeds stock, limit it to stock

                  if (quantity + 1 <= product.stock.integerValue) {
                    setQuantity(quantity + 1);
                  }
                }}
              >
                +
              </button>
            </div>
          </div>
{product.stock === 0 ?(
  <button
  className="buy-button"
  style={{ backgroundColor: "#c5bf20", color: "#fff200" }}
  onClick={() => {
    addToCart();
  }}
  disabled

>
  Add To Cart
  <Link to="/erichie/cart"></Link>
</button>
):(
  
          <button
            className="buy-button"
            style={{ backgroundColor: "#c5bf20", color: "#fff200" }}
            onClick={() => {
              addToCart();
            }}
      
          >
            Add To Cart
            <Link to="/erichie/cart"></Link>
          </button>
)}

          <div className="total-price">
            <p>Total Price: Rs.{totalPrice}</p>
          </div>

          {productAvailability ? (
            <span style={{ color: "white" }}>Add to Cart</span>
          ) : (
            <span style={{ color: "red" }}>
              Product is currently unavailable
            </span>
          )}

          <button
            className="back-button"
            style={{ backgroundColor: "#c5bf20", color: "#fff200" }}
            onClick={() => {
              navigate("/shop06");
            }}
          >
            <span style={{ color: "white" }}>Back to Home</span>
          </button>

          {orderPlaced && (
            <div>
              <div className="overlay" />

              <div className="popup">
                <p>Order Successfully Placed</p>

                <button className="close-button" onClick={handleClose}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDescPage;
