import React, { useState, useEffect } from 'react';
import { useParams, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './CheckOut.css';
import Header from './Header';
import PaymentPage from './Payment';

const CheckoutPage = () => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { productId } = useParams();

  useEffect(() => {
    fetchProduct(productId);
  }, [productId]);

  const fetchProduct = async (id) => {
    try {
      if (!id) {
        console.error('Invalid product ID:', id);
        return;
      }

      // Use environment variables for the API key
      const apiKey = 'AIzaSyCYi91lSnCgGpmOm-5fBjayL_npM65bZcQ';
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/adminstore-196a7/databases/(default)/documents/Products/${id}?key=${apiKey}`;

      const response = await axios.get(firestoreUrl);

      if (response.status === 200 && response.data) {
        const productData = response.data.fields;

        setProduct({
          id,
          productname: productData.productname?.stringValue || 'No name available',
          description: productData.description?.stringValue || 'No description available',
          price: productData.price?.integerValue || 0,
          imageurl: productData.imageurl?.stringValue || 'No image available',
          stock: productData.stock?.integerValue || 0,
          shopid: productData.shopid?.stringValue || 'shop15',
          category: productData.category?.stringValue || 'computers',
        });
      } else {
        console.error('Failed to fetch product data:', response);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleBuyNowClick = () => {
    window.location.href = `#`;
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <>
      <Header />
      <div className="checkout">
        <h1>Checkout</h1>
        {product && (
          <div className="product-details">
            <img src={product.imageurl} alt={`Image for ${product.productname}`} />
            <strong>Product Name:</strong> {product.productname}<br />
            <strong>Price:</strong> ${product.price}<br />
            <p>{product.description}</p>
            <label>Quantity:</label>
            <button onClick={increaseQuantity}>+</button>
            <span>{quantity}</span>
            <button onClick={handleBuyNowClick}>Buy Now</button><br>
            </br>
            <button onClick={handleBuyNowClick}>Addtocart</button>
          </div>
        )}
        
        
      </div>
    </>
  );
};

export default CheckoutPage;
