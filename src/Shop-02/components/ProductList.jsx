import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductForm.css';
import Header from './Header'

import { Link } from 'react-router-dom';

const ProductItem = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const apiKey = "AIzaSyCYi91lSnCgGpmOm-5fBjayL_npM65bZcQ"; // Replace with your API key
      const firestoreUrl = "https://firestore.googleapis.com/v1/projects/adminstore-196a7/databases/(default)/documents/Products"; // Replace with your Firestore URL

      const response = await axios.get(`${firestoreUrl}?key=${apiKey}`);

      const productsData = response.data.documents.map((doc) => {
        const data = doc.fields;
        const id = doc.name.split('/').pop();
        const productname = data.productname?.stringValue || "No name available";
        const description = data.description?.stringValue || "No description available";
        const price = data.price?.integerValue || 0;
        const imageurl = data.imageurl?.stringValue || "No image available";
        const stock = data.stock?.integerValue;

        return {
          id,
          productname,
          description,
          price,
          imageurl,
          stock,
        };
      });

      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <>
    <Header/>
    <div>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <Link
              to={{
                pathname: `/checkout/${product.id}`,
                state: { product }, // Pass the product data to the product detail page
              }}
            >
              <img src={product.imageurl} alt={`Image for ${product.productname}`} />
            </Link>
            <div className="product-details">
              <strong>Product Name:</strong> {product.productname}<br />
              <strong>Price:</strong> ${product.price}<br />
              <strong>Stock Left:</strong> {product.stock}<br />
              <Link
                to={{
                  pathname: `/checkout/${product.id}`,
                  state: { product }, // Pass the product data to the checkout page
                }}
              >
                <button className='buttonmine'>Buy Now</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default ProductItem;
