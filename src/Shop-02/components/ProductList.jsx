import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductForm.css';
import Header from './Header';

import { Link } from 'react-router-dom';

const ProductItem = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  useEffect(() => {
    fetchProducts();
  }, []); // Fetch products when the component mounts

  useEffect(() => {
    // Filter products based on the search term
    const filtered = products.filter((product) =>
      product.productname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]); // Re-filter when searchTerm or products change

  const fetchProducts = async () => {
    try {
      // Your API key and Firestore URL
      // ...
      const firestoreUrl = 'https://firestore.googleapis.com/v1/projects/adminstore-196a7/databases/(default)/documents/Products'
      const apiKey = 'AIzaSyCYi91lSnCgGpmOm-5fBjayL_npM65bZcQ'

      const response = await axios.get(`${firestoreUrl}?key=${apiKey}`);

      const productsData = response.data.documents.map((doc) => {
        // ...
        const data = doc.fields;
        const id = doc.name.split('/').pop(); // Define id here
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
      <Header onSearchChange={handleSearchChange} />
      <div>
        {/* <div className="search-box">
          <input
            type="text"
            placeholder="Search Products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div> */}
        <div className="shop15productsgrids">
          {filteredProducts.map((product) => (
            <div className="shop15productscards" key={product.id}>
              <Link
                to={{
                  pathname: `/checkout/${product.id}`,
                  state: { product },
                }}
              >
                <img src={product.imageurl} alt={`Image for ${product.productname}`} />
              </Link>
              <div className="shop15productsdetails">
                <strong>Product Name:</strong> {product.productname}<br />
                <strong>Price:</strong> ${product.price}<br />
                <strong>Stock Left:</strong> {product.stock}<br />
                <Link
                  to={{
                    pathname: `/checkout/${product.id}`,
                    state: { product },
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
