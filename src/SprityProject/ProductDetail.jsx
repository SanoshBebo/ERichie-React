import React, { useState, useEffect } from "react";

import axios from "axios";

import { Link, useNavigate, useParams } from "react-router-dom";

import { setUser } from "../SanoshProject/redux/shopOneUserSlice";

import { addItemToCart } from "../SanoshProject/redux/shopOneCartSlice";

import { addCartToFirestore } from "../Api/CartOperationsFirestore";

import { useDispatch, useSelector } from "react-redux";

function ProductDetail() {
  const [product, setProduct] = useState(null);

  const [confirmationDisplayed, setConfirmationDisplayed] = useState(false);

  const { productId } = useParams();

  const [stock, setStock] = useState(0);

  const [quantity, setQuantity] = useState(1);

  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const dispatch = useDispatch();

  const user = useSelector((state) => state.shoponeuser.user);

  const navigate = useNavigate();

  const handleVisitStore = () => {
    // Redirect to the "/mobiles" page

    navigate("/shop10/home");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://firestore.googleapis.com/v1/projects/lemontech-67162/databases/(default)/documents/Products/${productId}`
        );

        if (response.status === 200) {
          const productData = response.data;

          setProduct(productData);
          console.log(product);

          setStock(productData.fields.stock.integerValue);
        } else {
          console.error("Error fetching product. Response:", response);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if ((!isLoadingUser && user.length === 0) || user.role == "shopkeeper") {
      navigate("/customer/login");
    }
  }, [isLoadingUser, user, navigate]);

  if (!product) {
    return <div className="text-center">Loading...</div>;
  }

  const productname = product.fields.productname.stringValue;

  const description = product.fields.description.stringValue;

  const imageUrl = product.fields.imageurl
    ? product.fields.imageurl.stringValue
    : "";

  const addToCart = () => {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (userData && userData.role == "customer") {
      dispatch(setUser(userData));

      console.log(product);

      const cartItem = {
        id: productId,

        name: product.fields.productname.stringValue,

        description: product.fields.description.stringValue,

        stock: product.fields.stock.integerValue,

        price: product.fields.price.integerValue,

        shopid: product.fields.shopid.stringValue,

        imageurl: product.fields.imageurl.stringValue,

        quantity: quantity,
      };

      dispatch(addItemToCart(cartItem));

      addCartToFirestore(cartItem, userData.email);

      window.confirm("Product added to cart successfully");
    } else {
      // localStorage.setItem("url", JSON.stringify('shop10/product/productId'));

      localStorage.setItem("redirectUrl", JSON.stringify(redirectUrl));
      navigate("/customer/login");
    }

    setIsLoadingUser(false);

    // Create an object with the product details and count
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      return; // Prevent negative quantities
    }

    if (newQuantity > stock) {
      const confirmMessage = `Unfortunately, we do not have ${newQuantity} in stock for ${productname}. Do you want to proceed anyway?`;

      if (!confirmationDisplayed && window.confirm(confirmMessage)) {
        setConfirmationDisplayed(true);
      }
    } else {
      setQuantity(newQuantity);
    }
  };

  const handleGoBack = () => {
    navigate("/mobiles");

    //  window.history.back();
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-lg p-4">
        <Link to="/erichie/cart">
          <button className="absolute top-4 sm:top-8 md:top-16 lg:top-20 right-4 sm:right-8 md:right-16 lg:right-20 text-lg sm:text-xl md:text-2xl lg:text-3xl cursor-pointer">
            🛒
          </button>
        </Link>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full"
          onClick={handleGoBack}
        >
          Otherstores
        </button>

        <button
          className="bg-blue-500 hover-bg-blue-700 text-white py-2 px-4 rounded-full ml-2"
          onClick={handleVisitStore}
        >
          Visit the Lemon Tech store
        </button>

        <h1 className="text-3xl font-semibold mt-4">{productname}</h1>

        <div className="flex items-center mt-4">
          <img src={imageUrl} alt={productname} className="w-100 h-500  mr-4" />

          <p className="text-gray-700 justify-center">{description}</p>
        </div>

        <div className="flex items-center mt-4">
          <button
            className={`${
              quantity === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700"
            } text-white py-2 px-4 rounded-full ml-2`}
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity === 0}
          >
            -
          </button>

          <span className="text-xl">{quantity}</span>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full mr-2"
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            +
          </button>
        </div>

        <div className="mt-4">
          <button
            onClick={() => {
              if (stock > 0)
              {
              addToCart();}
            }}
            className={`${
              stock == 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700"
            } text-white py-2 px-4 rounded-full`}
            disabled={stock === 0}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
