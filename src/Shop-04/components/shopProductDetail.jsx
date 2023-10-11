import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  const apiUrl = `https://firestore.googleapis.com/v1/projects/d-richie-computers/databases/(default)/documents/Products/${productId}`;

  useEffect(() => {
    axios
      .get(apiUrl)
      .then((response) => {
        const productData = response.data.fields;
        setProduct(productData);
      })
      .catch((error) => {
        console.error('Error fetching Product Details: ', error);
      });
  }, [apiUrl]);

  return (
    <div className="product-details">
      {product ? (
        <div>
          <h2>{product.productname.stringValue}</h2>
          <img src={product.imageurl.stringValue} alt={product.productname.stringValue} />
          <p>Description: {product.description.stringValue}</p>
          <p>Price: ${product.price.integerValue}</p>
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
}

export default ProductDetails;
