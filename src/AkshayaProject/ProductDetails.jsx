import React, { useState, useEffect } from "react";

import axios from "axios";

import { Link, useParams } from "react-router-dom";

import { setUser } from "../SanoshProject/redux/shopOneUserSlice";

import { addItemToCart, addNoOfItemsInCart } from "../SanoshProject/redux/shopOneCartSlice";

import { useDispatch, useSelector } from "react-redux";

import { addCartToFirestore } from "../Api/CartOperationsFirestore";

import { useNavigate } from "react-router-dom";

import MediaCategory from "../ERichie/MediaCategory";

import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import FetchItemsInCart from "../ERichie/components/FetchItemsInCart";

const ProductDetails = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const user = useSelector((state) => state.shoponeuser.user);

  const dispatch = useDispatch(); // You can use useDispatch here
  const itemsInCart = useSelector((state)=>state.shoponecart.itemsInCart)

  const navigate = useNavigate();
  const url = `/shop02/product/${productId}`;
  
  let redirectUrl = {
    url: url,
  };


  const  items  = FetchItemsInCart();

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

          shopid: productData.shopid?.stringValue || "",
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

        shopid: product.shopid,

        price: product.price,

        imageurl: product.imageurl,

        quantity: quantity,
      };

      toast.success("Product added successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });

      dispatch(addItemToCart(cartItem));
      dispatch(addNoOfItemsInCart(quantity));


      addCartToFirestore(cartItem, userData.email);
    } else {
      localStorage.setItem("redirectUrl", JSON.stringify(redirectUrl));

      navigate("/customer/login");
    }

    setIsLoadingUser(false);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <header className="bg-gray-200 py-4 text-center">
        <h1 className="text-4xl font-bold">E-NERD</h1>

        <ul className="flex justify-end space-x-8 text-center absolute top-3 right-0 mt-4 mr-4">
          <li className="cursor-pointer ">
            <Link to="/erichie/cart">🛒</Link>
            <p className="bg-white text-black rounded-full h-6 w-6 text-center ">
                  {itemsInCart}
                </p>
          </li>

          <li className="cursor-pointer hover:underline">
            <Link to="/mediacategories">MediaProducts</Link>
          </li>

          <li className="cursor-pointer hover:underline">
            <Link to="/erichie">MainPage</Link>
          </li>

          <li className="cursor-pointer hover:underline">
            <Link to="/shop02">VisitShop</Link>
          </li>

          {/* <li

 

        className="cursor-pointer hover:underline"

 

        onClick={handleSignOut}

 

      >

 

        SignOut

 

      </li> */}
        </ul>
      </header>

      <div className="product-detail p-4 w-full bg-white rounded-md shadow-lg min-h-screen flex flex-col items-center justify-center ">
        <div className="text-center">
          <div className="w-52 mx-auto mb-4">
            <img
              src={product.imageurl}
              alt={product.name}
              className="product-image w-full object-contain"
            />
          </div>

          <h2 className="text-2xl font-semibold">{product.name}</h2>

          <p className="text-gray-600 text-sm mb-4">{product.description}</p>

          <p className="text-xl font-semibold text-blue-600 mr-4">
            Price: Rs.{product.price}
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
            readOnly
          />

          <button
            className="bg-blue-500 text-white p-2 rounded-full text-lg ml-2"
            onClick={handleIncreaseQuantity}
          >
            +
          </button>
        </div>

        <div className="mt-4">
          <button
            className="add-to-cart-button bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-colors"
            onClick={addToCart}
          >
            Add to Cart
          </button>
        </div>

        {/* <div className="mt-4">

        <Link to="/shop02">

          <button className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-colors">

            Back

          </button>

        </Link>

        <Link to="/erichie/cart">

          <button

            className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-colors"

            style={{ marginLeft: "10px" }}

          >

            Cart

          </button>

        </Link>

        <Link to="/shop02">

          <button

            className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-colors"

            style={{ marginLeft: "10px" }}

          >

            Myweb

          </button>

        </Link>

      </div> */}
      </div>
    </div>
  );
};

export default ProductDetails;
