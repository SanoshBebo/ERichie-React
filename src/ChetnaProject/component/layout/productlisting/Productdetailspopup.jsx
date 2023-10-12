import React, { useState, useEffect } from "react";

import { useParams, Link, useNavigate } from "react-router-dom";

import axios from "axios";

import './ProductDetailspopup.css';
import { addItemToCart } from "../../../../SanoshProject/redux/shopOneCartSlice";
import { addCartToFirestore } from "../../../../Api/CartOperationsFirestore";
import { setUser } from "../../../../SanoshProject/redux/shopOneUserSlice";
import { useDispatch, useSelector } from "react-redux";

 

const ProductDetailsPage = () => {

  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const [quantity, setQuantity] = useState(1); // Initial quantity is 1

  const [isAvailable, setIsAvailable] = useState(true); // State to track product availability

  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.shoponeuser.user);
  const navigate = useNavigate();

  useEffect(() => {

    // Fetch product details based on the id parameter

    axios

      .get(`https://firestore.googleapis.com/v1/projects/e-mobile-81b40/databases/(default)/documents/Products/${id}`)

      .then((response) => {

        const data = response.data.fields;

        const productData = {

          id: id,

          productname: data.productname.stringValue,

          description: data.description.stringValue,

          price: data.price.integerValue,

          stock: data.stock.integerValue, // Added stock property

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
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.role == "customer") {
      dispatch(setUser(userData));
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


 

  const handleQuantityChange = (event) => {

    setQuantity(parseInt(event.target.value, 10));

    setIsAvailable(true); // Reset product availability state when quantity changes

  };

 

  if (!product) {

    return <div>Loading...</div>;

  }

 

  return (

    <div className="product-details-container-details">

      <h1>{product.productname}</h1>

      <p>Price: ${product.price}</p>

      <p>Description: {product.description}</p>

      <img src={product.imageurl} alt={product.productname} />

      <label>

        Quantity:

        <input

          type="number"

          min="1"

          value={quantity}

          onChange={handleQuantityChange}

        />

      </label>

      {!isAvailable && <p>Product not available in the desired quantity.</p>}

      <div className="bars">

        <button onClick={addToCart}>Add to Cart</button>

        <Link to="/shop11/protectlist">

          <button>Back to Product List</button>

        </Link>

      </div>

    </div>

  );

};

 

export default ProductDetailsPage;