import React, { useState, useEffect } from "react";

import { useParams, Link } from "react-router-dom";

import axios from "axios";

import Modal from "react-bootstrap/Modal";

import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";

import Card from "react-bootstrap/Card";

import { useDispatch, useSelector } from "react-redux";

import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { setUser } from "../../SanoshProject/redux/shopOneUserSlice";

import { addItemToCart, addNoOfItemsInCart } from "../../SanoshProject/redux/shopOneCartSlice";

import { addCartToFirestore } from "../../Api/CartOperationsFirestore";

import NavBar from "./Navbar";

function ProductDescriptionPage() {
  const navigate = useNavigate();

  const { productId } = useParams();

  const [productData, setProductData] = useState(null);

  const [quantity, setQuantity] = useState(0); // Set the initial quantity to 0

  const [showOrderModal, setShowOrderModal] = useState(false);

  const [isOutOfStock, setIsOutOfStock] = useState(false);

  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const [addedToCart, setAddedToCart] = useState(false);

  const user = useSelector((state) => state.shoponeuser.user);

  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchProductData() {
      try {
        const response = await axios.get(
          `https://firestore.googleapis.com/v1/projects/myapp-5dc30/databases/(default)/documents/Products/${productId}`
        );

        if (response.status === 200) {
          const data = response.data;

          console.log(data);

          setProductData(data);
        } else {
          console.error("Failed to fetch product data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    }

    fetchProductData();
  }, [productId]);

  const handleQuantityChange = (newQuantity) => {
    if (
      newQuantity >= 0 && // Allow quantities from 0 upwards
      newQuantity <= productData.fields.stock.integerValue
    ) {
      setQuantity(newQuantity);

      setIsOutOfStock(false);
    } else {
      setIsOutOfStock(true);
    }
  };

  useEffect(() => {
    if ((!isLoadingUser && user.length === 0) || user.role === "shopkeeper") {
      navigate("/customer/login");
    }
  }, [isLoadingUser, user, navigate]);

  const addToCart = () => {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (userData && userData.role === "customer") {
      dispatch(setUser(userData));

      if (productData.fields.stock.integerValue > 0) {
        const cartItem = {
          id: productId,

          name: productData.fields.productname.stringValue,

          description: productData.fields.description.stringValue,

          stock: productData.fields.stock.integerValue,

          shopid: productData.fields.shopid.stringValue,

          price: productData.fields.price.integerValue,

          imageurl: productData.fields.imageurl.stringValue,

          quantity: quantity,
        };

        dispatch(addItemToCart(cartItem));

        dispatch(addNoOfItemsInCart(quantity));

        addCartToFirestore(cartItem, userData.email);

        setAddedToCart(true);

        toast.success("Product added successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } else {
      const url = `/shop07/product/${productId}`;
  
      let redirectUrl = {
        url: url,
      };
      localStorage.setItem("redirectUrl", JSON.stringify(redirectUrl));

      navigate("/customer/login");
    }

    setIsLoadingUser(false);
  };

  const handleCloseOrderModal = () => {
    setShowOrderModal(false);

    navigate("/shop07");
  };

  if (!productData) {
    return <div>Loading...</div>;
  }

  const imageUrl = productData.fields.imageurl.stringValue;

  const description = productData.fields.description.stringValue;

  const price = productData.fields.price.integerValue;

  return (
    <div>
    <NavBar />

      <div className="container mx-auto p-4">
        <Card className="text-center">
          <Card.Header>
            <h1 className="text-2xl font-semibold">
              {productData.fields.productname.stringValue}
            </h1>
          </Card.Header>

          <Card.Body>
            <div className="bg-gray-200 p-2 rounded-md">
              {/* Add background color */}

              <Card.Img
                src={imageUrl}
                alt="Product"
                className="w-1/3 h-1/3 mx-auto"
              />
            </div>

            <Card.Text>Description: {description}</Card.Text>

            <Card.Text>Price: Rs.{price}</Card.Text>

            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="bg-blue-500 text-white px-2 py-1"
              >
                -
              </button>

              <span>{quantity}</span>

              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="bg-green-500 text-white px-2 py-1"
              >
                +
              </button>
            </div>

            <Card.Text>
              Total Price: Rs.{productData.fields.price.integerValue * quantity}
            </Card.Text>

            {isOutOfStock ? <p className="text-red-600">Out of Stock</p> : null}

            {productData.fields.stock.integerValue > 0 ? (
              <button
                onClick={() => {
                  if (quantity > 0) {
                    addToCart();
                  }
                }}
                className={`${
                  addedToCart ? "bg-green-500" : "bg-blue-500"
                } text-white px-2 py-1`}
              >
                {addedToCart ? "Added to Cart" : "Add to Cart"}
              </button>
            ) : (
              <button disabled className="bg-gray-500 text-white px-2 py-1">
                Out of Stock
              </button>
            )}

            <button
              onClick={() => navigate("/shop07")}
              className="bg-purple-500 text-white px-2 py-1"
            >
              Back to Home
            </button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default ProductDescriptionPage;
