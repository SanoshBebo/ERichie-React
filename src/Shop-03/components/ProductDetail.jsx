
import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { useParams } from 'react-router-dom';

import './ProductDetail.css';

 

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

 

  const addToCart = () => {

    // Implement your logic to add the product to the cart here

    console.log('Product added to cart:', product);

  };

 

  const buyNow = () => {

    // Implement your logic for buying the product here

    console.log('Buy Now clicked for:', product);

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

          <button onClick={addToCart}>Add to Cart</button>

          <button className="spaced-buttons" onClick={buyNow}>Buy Now</button>

        </div>

      </div>

    </div>
    </section>

  );

}

 

export default ProductDetail;

 