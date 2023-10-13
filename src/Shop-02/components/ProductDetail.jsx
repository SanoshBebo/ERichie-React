
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './ProductDetail.css';


import { setUser } from "../../SanoshProject/redux/shopOneUserSlice";
import { addItemToCart } from "../../SanoshProject/redux/shopOneCartSlice";
import { addCartToFirestore } from "../../Api/CartOperationsFirestore";
import { useDispatch, useSelector } from "react-redux";




function ProductDetail() {

  const { productId } = useParams();

  const [product, setProduct] = useState(null);

  const apiUrl = `https://firestore.googleapis.com/v1/projects/digig-57d5f/databases/(default)/documents/Products/${productId}`;

 
  useEffect(() => {

    axios

      .get(apiUrl)

      .then((response) => {

        const productData = response.data.fields;

        setProduct(productData);

      })

      .catch((error) => {

        console.error('Error fetching product details: ', error);

      });

  }, [apiUrl, productId]);

 

  if (!product) {

    return <div>Loading...</div>;

  }

 

  const buyNow = () => {

    // Implement your logic for buying the product here

    console.log('Buy Now clicked for:', product);

  };



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
        shopid:product.shopid,
        price: product.price,
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

    // Create an object with the product details and count
  };



 

  return (
    <section className='shop_14'>
    <div className="product-detail-page">

      <h1>Product Details</h1>

      <div className="product-details">

        <img

          src={product.imageurl?.stringValue}

          alt={product.productname?.stringValue}

          className="product-image"

        /><br></br>

        <strong>{product.productname?.stringValue}</strong>

        <p>Description: {product.description?.stringValue}</p>

        <p>Price: ₹{product.price?.integerValue}</p>

        <p>Stock: {product.stock?.integerValue}</p>

        <div className="spaced-buttons">

          <button onClick={() => {
              addToCart();
            }}>Add to Cart</button>

          <button className="spaced-buttons" onClick={buyNow}>Buy Now</button>

        </div>

      </div>

    </div>
    </section>

  );

}

 

export default ProductDetail;

 