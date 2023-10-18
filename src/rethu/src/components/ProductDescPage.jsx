import React, { useState, useEffect } from "react";

import axios from "axios";

import { useParams } from "react-router-dom";

import { useNavigate, Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { addCartToFirestore } from "../../../Api/CartOperationsFirestore";

import { addItemToCart, addNoOfItemsInCart } from "../../../SanoshProject/redux/shopOneCartSlice";

import { setUser } from "../../../SanoshProject/redux/shopOneUserSlice";

import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import FetchItemsInCart from "../../../ERichie/components/FetchItemsInCart";

function ProductDescPage() {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [orderPlaced, setOrderPlaced] = useState(false);

  const [totalPrice, setTotalPrice] = useState(0); // Initialize total price as 0

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const user = useSelector((state) => state.shoponeuser.user);

  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const itemsInCart = useSelector((state) => state.shoponecart.itemsInCart);
  
  useEffect(() => {
    const apiUrl = `https://firestore.googleapis.com/v1/projects/dead-eye-game-store/databases/(default)/documents/Products/${productId}`;
    
    axios
    
      .get(apiUrl)
      
      .then((response) => {
        const productData = response.data.fields;

        setProduct(productData);

        setTotalPrice(parseInt(productData.price.integerValue, 10) * quantity); // Initialize total price with the product's price
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
  
  const items = FetchItemsInCart();
  const addToCart = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    
    if (userData && userData.role === "customer") {
      dispatch(setUser(userData));
      
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
      dispatch(addNoOfItemsInCart(quantity));

      addCartToFirestore(cartItem, userData.email);

      toast.success("Product added successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      // Define or replace 'redirectUrl' with the appropriate value

      const redirectUrl = "/"; // Replace with the URL you want to redirect to

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

  const handleAddQuantity = () => {
    if (quantity < product.stock.integerValue) {
      setQuantity((prev) => prev + 1);

      const price = parseInt(product.price.integerValue, 10);

      setTotalPrice(price * quantity);
    }
  };

  const handleMinusQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);

      const price = parseInt(product.price.integerValue, 10);

      setTotalPrice(price * (quantity - 1));
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="bg-gray-200 p-4 flex justify-center space-x-4 items-center">
        <Link
          to="/erichie"
          className="bg-orange-500 text-black px-4 py-2 rounded-full text-lg hover:bg-orange-600"
        >
          Home Page
        </Link>

        <Link
          to="/gaming"
          className="bg-orange-500 text-black px-4 py-2 rounded-full text-lg hover:bg-orange-600"
        >
          Gaming Stores
        </Link>

        <Link
          to="/erichie/cart"
          className="text-4xl text-orange-500 hover:text-orange-600 ml-2 flex items-center justify-center"
        >
          🛒
          <p className="bg-white text-black rounded-full h-6 w-6 text-center ">
              {itemsInCart}
            </p>
        </Link>
      

        <a
          href="/customer/login"
          className="bg-orange-500 text-black px-4 py-2 rounded-full text-lg hover:bg-orange-600"
        >
          Signout
        </a>
      </div>

      <div className="centered-container flex justify-center items-center">
        <div className="centered-card bg-white shadow-md rounded p-4 text-center">
          <h3 className="text-2xl">Dead Eye Game Store🎮</h3>

          <h1 className="text-2xl font-bold">
            {product.productname.stringValue}
          </h1>

          <div className="image-container">
            <img
              src={product.imageurl.stringValue}
              alt={product.productname.stringValue}
              className="product-image4-r mx-auto" // Center the image horizontally
            />
          </div>

          <h2 className="font-bold">{product.productname.stringValue}</h2>

          <p>Description: {product.description.stringValue}</p>

          <p>Price: ₹{product.price.integerValue}</p>

          <div className="quantity-container flex justify-center items-center">
            <button
              className="quantity-button bg-gray-300 p-2 rounded-full"
              onClick={handleMinusQuantity}
            >
              -
            </button>

            <div className="centered-input">
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value, 10) || 1;

                  setQuantity(newQuantity);

                  setTotalPrice(newQuantity * product.price.integerValue); // Update total price when quantity changes
                }}
                className="w-16 h-8 px-2 py-1 rounded border border-gray-300"
              />
            </div>

            <button
              className="quantity-button bg-gray-300 p-2 rounded-full"
              onClick={handleAddQuantity}
            >
              +
            </button>
          </div>

          <p className="font-bold">Total Price: ₹{totalPrice}</p>

          <button
            onClick={() => {
              addToCart();
            }}
            className="bg-orange-500 text-black p-2 rounded-md text-lg mr-2"
          >
            Add to Cart
          </button>

          <button
            onClick={handleClose}
            className="bg-orange-500 text-black p-2 rounded-md text-lg"
          >
            Back to Home
          </button>

          {orderPlaced && (
            <div>
              <div className="overlay fixed top-0 left-0 w-full h-full bg-opacity-70 bg-black flex justify-center items-center">
                <div className="popup bg-white p-4 border border-gray-300 rounded text-center">
                  <p>Order Successfully Placed</p>

                  <button
                    onClick={handleClose}
                    className="bg-red-500 text-white p-2 rounded-full mt-2"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="footer-r">
        <div className="footer-content-r">
          <p>&copy; 2023 Dead Eye Game Store, Inc. All rights reserved.</p>

          <p>
            Ritchie Street, Mount Road, Anna Salai, Chennai, 600002, Tamil Nadu,
            India
          </p>
        </div>
      </footer>
    </div>
  );
}

export default ProductDescPage;
