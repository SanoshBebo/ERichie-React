import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import fetchItems from "./fetcher";
import { useAuthState } from "react-firebase-hooks/auth";
import "../styles/ProductDetails.css";
import { setUser } from "../../../../SanoshProject/redux/shopOneUserSlice";
import { addItemToCart } from "../../../../SanoshProject/redux/shopOneCartSlice";
import { addCartToFirestore } from "../../../../Api/CartOperationsFirestore";
import { useDispatch, useSelector } from "react-redux";

const ProductDetail = ({}) => {
  const [product, setproduct] = useState({});
  const { id } = useParams();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemList = await fetchItems();
        const filtered = itemList.find((item) => item.id === id);
        setproduct(filtered);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {}, []);

  const onClose = () => {
    // Handle closing the product detail page (if needed)
  };

  return (
    <div className="product_detail">
      <div className="container">
        <div className="img_box">
          <img src={product.imageurl} alt="image" />
        </div>
        <div className="info">
          <h4># {product.category}</h4>
          <h2>{product.productname}</h2>
          <p>{product.description}</p>
          <h3>${product.price}</h3>
          <div className="quantity-input">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1" // Set a minimum value
            />
          </div>

          <button
            onClick={() => {
              addToCart();
            }}
          >
            Add To Cart
          </button>
          <button>Buy Now</button>
          {/* <button onClick={onClose}>Close</button> */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
