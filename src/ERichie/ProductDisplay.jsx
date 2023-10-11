import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserPage.css'; // Import your CSS file
import { Link } from 'react-router-dom';

function ProductDisplay1() {
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const databaseUrls = [
      "https://firestore.googleapis.com/v1/projects/myapp-5dc30/databases/(default)/documents/Products",
      "https://firestore.googleapis.com/v1/projects/superstore-c138c/databases/(default)/documents/products",
      "https://firestore.googleapis.com/v1/projects/gamestore-1b041/databases/(default)/documents/products",
      "https://firestore.googleapis.com/v1/projects/dead-eye-game-store/databases/(default)/documents/Products",
      
    ];

    const fetchData = async () => {
      const allProducts = [];

      for (const url of databaseUrls) {
        try {
          const response = await axios.get(url);
          const productsData = response.data.documents.map((doc) => ({
            id: doc.name.split('/').pop(),
            ...doc.fields,
          }));
          allProducts.push(...productsData);
          console.log(productsData);
        } catch (error) {
          console.error('Error fetching products from', url, error);
        }
      }

      setProducts(allProducts);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
       <div className="container border rounded mt-2 px-0 px-sm-2 shadow-sm">
        <div className="button-container">
          <Link to="/shop06">
            <button>Game Essentials</button>
          </Link>
          <Link to="/shop07">
            <button>Game Store</button>
          </Link>
          <Link to="/shop05">
            <button>Dead Eye Game Store</button>
          </Link>
        </div>
      </div>
      <div className="container border rounded mt-2 px-0 px-sm-2 shadow-sm">
        <div className="product-list">
          {loading ? (
            <p>Loading...</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={product.imageurl?.stringValue || ''}
                  alt={product.productname?.stringValue || ''}
                  className="product-image"
                />
                <div className="product-details">
                  <h3>{product.productname?.stringValue || ''}</h3>
                  <p>Description: {product.description?.stringValue || ''}</p>
                  <p>Price: ${product.price?.integerValue || 0}</p>
                  <p>Shop: {product.shopid?.stringValue || ''}</p> 
                  <Link to={`/${product.shopid?.stringValue || ''}/product/${product.id}`}>View Details</Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
     
    </div>
    
  );
}

export default ProductDisplay1;
