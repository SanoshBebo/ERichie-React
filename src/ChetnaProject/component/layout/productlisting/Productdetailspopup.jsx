import React, { useState, useEffect } from "react";

import { useParams, Link, useNavigate } from "react-router-dom";

import axios from "axios";

import "./ProductDetailspopup.css";

//import carticon from './carticon.png';

import { addItemToCart } from "../../../../SanoshProject/redux/shopOneCartSlice";

import { addCartToFirestore } from "../../../../Api/CartOperationsFirestore";

import { setUser } from "../../../../SanoshProject/redux/shopOneUserSlice";

import { useDispatch, useSelector } from "react-redux";

const ProductDetailsPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [isAvailable, setIsAvailable] = useState(true);

  const [isProductAdded, setIsProductAdded] = useState(false);

  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const dispatch = useDispatch();

  const user = useSelector((state) => state.shoponeuser.user);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch product details based on the id parameter

    axios

      .get(
        `https://firestore.googleapis.com/v1/projects/e-mobile-81b40/databases/(default)/documents/Products/${id}`
      )

      .then((response) => {
        const data = response.data.fields;

        const productData = {
          id: id,

          productname: data.productname.stringValue,

          description: data.description.stringValue,

          shopid: data.shopid.stringValue,

          price: data.price.integerValue,

          stock: data.stock.integerValue,

          imageurl: data.imageurl.stringValue,
        };

        // Set product state with the retrieved data

        setProduct(productData);
      })

      .catch((error) => {
        console.error("Error fetching product details:", error);
      });
  }, [id]);

  useEffect(() => {
    if ((!isLoadingUser && user.length === 0) || user.role == "shopkeeper") {
      navigate("/customer/login");
    }
  }, [isLoadingUser, user, navigate]);

  const addToCart = () => {
    // Check if the selected quantity exceeds the available stock or if stock is 0

    if (quantity > product.stock) {
      setIsAvailable(false);

      return;
    } else if (product.stock === 0) {
      setIsAvailable(false);

      return;
    }

    const userData = JSON.parse(localStorage.getItem("user"));

    if (userData && userData.role == "customer") {
      dispatch(setUser(userData));

      const cartItem = {
        id: product.id,

        name: product.productname,

        description: product.description,

        stock: product.stock,

        price: product.price,

        shopid: product.shopid,

        imageurl: product.imageurl,

        quantity: quantity,
      };

      dispatch(addItemToCart(cartItem));

      addCartToFirestore(cartItem, userData.email);
    } else {
      localStorage.setItem("redirectUrl", JSON.stringify(redirectUrl));

      navigate("/customer/login");
    }

    setIsLoadingUser(false);

    setIsProductAdded(true);

    setTimeout(() => {
      setIsProductAdded(false);
    }, 3000);
  };

  const handleQuantityChange = (event) => {
    const selectedQuantity = parseInt(event.target.value, 10);

    // Check if selected quantity is within stock limit

    if (selectedQuantity <= product.stock && selectedQuantity >= 1) {
      setQuantity(selectedQuantity);

      setIsAvailable(true);
    } else {
      setIsAvailable(false);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-details-container-details1">
      <div className="bars1">
        <div>
          <Link to="/shop11/">
            <button>Back to E-Mobile shop</button>
          </Link>
        </div>

        <div>
          <Link to="/mobiles">
            <button>Back Mobile </button>
          </Link>
        </div>

        <div>
          <Link to="/erichie/cart">
            <button>View Cart</button>

            {/* <img src={carticon} alt="Cart" /> */}
          </Link>
        </div>
      </div>

      <div className="product-details-container-details">
        <h1>{product.productname}</h1>

        <p>Price: ₹{product.price}</p>

        <p>Description: {product.description}</p>

        <img src={product.imageurl} alt={product.productname} />

        <label>
          Quantity:
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={handleQuantityChange}
          />
        </label>

        {quantity > product.stock && <p style={{ color: "red" }}>Out of Stock.</p>}

        {!isAvailable && product.stock === 0 && <p style={{ color: "red" }}>Out of Stock.</p>}

        {isProductAdded && (
          <p className="message">Product added successfully!</p>
        )}

        <div className="bars">
          <button onClick={addToCart}>Add to Cart</button>

          <Link to="/shop11/protectlist">
            <button>Back to Product List</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
