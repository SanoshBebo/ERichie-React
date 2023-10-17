import React, { useState, useEffect } from "react";

import axios from "axios";

import { useParams, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  addItemToCart,
  addNoOfItemsInCart,
} from "../../../../../SanoshProject/redux/shopOneCartSlice";

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

  const itemsInCart = useSelector((state) => state.shoponecart.itemsInCart);

  const [totalPrice, setTotalPrice] = useState(0);

  const { items } = FetchItemsInCart();

  useEffect(() => {
    const apiUrl = `https://firestore.googleapis.com/v1/projects/gamestore-1b041/databases/(default)/documents/Products/${productId}`;

    axios

      .get(apiUrl)

      .then((response) => {
        const productData = response.data.fields;

        setProduct(productData);

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
    setOrderPlaced(true);
  };

  const handleClose = () => {
    navigate("/shop06");
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Navbar */}

      <div className="bg-gray-800 text-white p-4">
        <div className="flex justify-between items-center">
          <Link to="/erichie">Home Page</Link>

          <div className="flex items-center">
            <Link to="/erichie/cart" className="mr-4">
              🛒
            </Link>

            <a href="/customer/login" className="navbar-button">
              Signout
            </a>
          </div>
        </div>
      </div>

      {/* Product Description */}

      <div className="container mx-auto p-4">
        <div className="text-center">
          <div className="product-card">
            <h1 className="text-2xl font-bold my-2">
              {product.productname.stringValue}
            </h1>

            <img
              src={product.imageurl.stringValue}
              alt={product.productname.stringValue}
              className="w-72 mx-auto my-4"
            />

            <p className="text-lg my-2">
              Description: {product.description.stringValue}
            </p>

            <p className="text-lg my-2">
              Price: Rs.{product.price.integerValue}
            </p>

            <div className="quantity-control my-4">
              <p className="text-xl font-semibold mb-2">Quantity:</p>

              <div className="flex items-center justify-center">
                <button
                  className="quantity-button bg-red-500 text-white py-2 px-4 rounded-full mr-2"
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

                    if (newQuantity > product.stock.integerValue) {
                      setQuantity(product.stock.integerValue);
                    } else {
                      setQuantity(newQuantity);
                    }
                  }}
                  max={product.stock.integerValue}
                  className="w-16 text-xl text-center"
                />

                <button
                  className="quantity-button bg-green-500 text-white py-2 px-4 rounded-full ml-2"
                  onClick={() => {
                    if (quantity + 1 <= product.stock.integerValue) {
                      setQuantity(quantity + 1);
                    }
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {product.stock === 0 ? (
              <button
                className="buy-button bg-yellow-500 text-yellow-900 py-2 px-4 rounded-full"
                onClick={addToCart}
                disabled
              >
                Add To Cart
              </button>
            ) : (
              <button
                className="buy-button bg-yellow-500 text-yellow-900 py-2 px-4 rounded-full"
                onClick={addToCart}
              >
                Add To Cart
              </button>
            )}

            <div className="total-price mt-4">
              <p className="text-lg">Total Price: Rs.{totalPrice}</p>
            </div>

            {productAvailability ? (
              <span className="text-white">Add to Cart</span>
            ) : (
              <span className="text-red-500">
                Product is currently unavailable
              </span>
            )}

            <div className="text-center mt-4">
              <div className="text-center mt-0">
                <button
                  className="back-button bg-yellow-500 text-yellow-900 py-2 px-4 rounded-full"
                  onClick={() => {
                    navigate("/shop06");
                  }}
                >
                  Back to Home
                </button>
              </div>
            </div>

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
    </div>
  );
}

export default ProductDescPage;
