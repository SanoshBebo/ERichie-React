import React, { useState, useEffect } from 'react';

import axios from 'axios';

import './UserPage.css'; // Import your CSS file

import { Link } from 'react-router-dom';

 

function ProductDisplay1() {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 6;

 

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

        } catch (error) {

          console.error('Error fetching products from', url, error);

        }

      }

 

      setProducts(allProducts);

      setLoading(false);

    };

 

    fetchData();

  }, []);

 

  const indexOfLastProduct = currentPage * productsPerPage;

  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

 

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

 

  return (

    <div className="product-display-container">

      <div className="navbar">

        <span style={{ color:"white"  }}className="navbar-brand">Gaming Team</span>

        <div className="search-bar">

  <div style={{ display: 'flex', alignItems: 'center',  }}>

    <input type="text" placeholder="Search..." />

    <button>Search</button>

  </div>

</div>

      </div>

 

      <div className="product-list">

        {loading ? (

          <p>Loading...</p>

        ) : (

          currentProducts.map((product) => (

            <div key={product.id} className="product-card">

              <img

src={product.imageurl?.stringValue || product.imageUrl?.stringValue || ''}


                alt={product.productname?.stringValue || ''}

                className="product-image"

              />

              <div className="product-details">

                <h3>{product.productname?.stringValue || ''}</h3>

                <p>Description: {product.description?.stringValue || ''}</p>

                <p>Price: Rs.{product.price?.doubleValue || product.price?.integerValue || 0}</p>

                <Link to={`/${product.shopid?.stringValue || ''}/product/${product.id}`}>View Details</Link>

              </div>

            </div>

          ))

        )}

      </div>

 

      <div className="pagination">

      {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, i) => (

  <button key={i} onClick={() => paginate(i + 1)}>{i + 1}</button>

))}

 

      </div>

    </div>

  );

}

 

export default ProductDisplay1;

 