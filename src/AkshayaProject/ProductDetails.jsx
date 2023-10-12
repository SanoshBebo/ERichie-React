import React, { useState, useEffect } from "react";

import axios from "axios";

import { useParams } from "react-router-dom";

import { setUser } from "../SanoshProject/redux/shopOneUserSlice";

import { addItemToCart } from "../SanoshProject/redux/shopOneCartSlice";

import { useDispatch, useSelector } from "react-redux";

import { addCartToFirestore } from "../Api/CartOperationsFirestore";

import { useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const user = useSelector((state) => state.shoponeuser.user);

  const dispatch = useDispatch(); // You can use useDispatch here
  const navigate = useNavigate();

  useEffect(() => {
    if ((!isLoadingUser && user.length === 0) || user.role == "shopkeeper") {
      navigate("/customer/login");
    }
  }, [isLoadingUser, user, navigate]);

  useEffect(() => {
    const firestoreApiKey = "AIzaSyAMTkJfx4_ZowkhsFySraPbqI-ZoGOEt6U";

    const firestoreProjectId = "e-ritchie"; // Replace with your project ID

    axios

      .get(
        `https://firestore.googleapis.com/v1/projects/${firestoreProjectId}/databases/(default)/documents/Products/${productId}?key=${firestoreApiKey}`
      )

      .then((response) => {
        console.log("Response:", response);

        const productData = response.data.fields;

        console.log("Product Data:", productData);

        setProduct({
          name: productData.productname?.stringValue || "Unknown Product",

          description:
            productData.description?.stringValue || "No description available",

          price: productData.price?.integerValue || 0,

          stock: productData.stock?.integerValue || 0,

          category: productData.category?.stringValue || "Uncategorized",

          shopname: productData.shopname?.stringValue || "Unknown Shop",

          imageurl: productData.imageurl?.stringValue || "",
        });
      })

      .catch((error) => {
        console.error("Error fetching product details", error);
      });
  }, [productId]);

  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity) => Math.min(prevQuantity + 1, product.stock));
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const addToCart = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.role == "customer") {
      dispatch(setUser(userData));
      console.log(product);
      const cartItem = {
        id: productId,
        name: product.name,
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

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-detail p-4 bg-white rounded-md shadow-lg">
      <img
        src={product.imageurl}
        alt={product.name}
        className="product-image w-full h-48 object-contain mb-4"
      />

      <h2 className="text-2xl font-semibold">{product.name}</h2>
      <p className="text-gray-600 text-sm mb-4">{product.description}</p>

      <div className="flex items-center">
        <p className="text-xl font-semibold text-blue-600 mr-4">
          Price: ${product.price}
        </p>
        <p className="text-gray-600">Stock: {product.stock}</p>
      </div>

      <div className="flex items-center mt-4">
        <button
          className="bg-blue-500 text-white p-2 rounded-full text-lg mr-2"
          onClick={handleDecreaseQuantity}
        >
          -
        </button>

        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          className="w-12 text-center text-lg border border-gray-300 rounded-md"
          min={1}
          max={product.stock}
        />

        <button
          className="bg-blue-500 text-white p-2 rounded-full text-lg ml-2"
          onClick={handleIncreaseQuantity}
        >
          +
        </button>
      </div>

      <button
        className="add-to-cart-button bg-blue-500 text-white p-3 rounded-md mt-4 hover:bg-blue-600 transition-colors"
        onClick={addToCart}
      >
        Add to Cart
      </button>

      <button
        className="buy-now-button bg-green-500 text-white p-3 rounded-md mt-4 hover:bg-green-600 transition-colors"
        onClick={() => onBuyNow(product, quantity)}
      >
        Buy Now
      </button>
    </div>
  );
};

export default ProductDetails;
