import React, { useState, useEffect } from 'react';

import axios from 'axios';

import './App.css';

 

const DeleteProduct = () => {

  const [productName, setProductName] = useState('');

  const [productList, setProductList] = useState([]);

  const [selectedProductId, setSelectedProductId] = useState('');

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchText, setSearchText] = useState(''); // State for search input

  const [searchResults, setSearchResults] = useState([]); // State for search results

 

  useEffect(() => {

    axios

      .get(

        'https://firestore.googleapis.com/v1/projects/mobileworld-160ce/databases/(default)/documents/Products'

      )

      .then((response) => {

        const productsData = response.data.documents.map((doc) => {

          const data = doc.fields;

          return {

            id: doc.name.split('/').pop(),

            productname: data.productname?.stringValue || '',

            description: data.description?.stringValue || '',

            price: data.price?.integerValue || 0,

            imageUrl: data.imageUrl?.stringValue || '',

            shopname: data.shopname?.stringValue || '',

            shopid: data.shopid?.stringValue || '',

            stock: data.stock?.integerValue || '',

          };

        });

        setProductList(productsData);

      })

      .catch((error) => {

        console.error('Error fetching products:', error);

      });

  }, []);

 

  const handleSearch = () => {

    // Filter the productList based on the searchText

    const results = productList.filter((productItem) =>

      productItem.productname.toLowerCase().includes(searchText.toLowerCase())

    );

    setSearchResults(results);

  };

 

  const handleDelete = async () => {

    if (!selectedProductId) {

      alert('Please select a product to delete.');

      return;

    }

 

    try {

      await axios.delete(

        `https://firestore.googleapis.com/v1/projects/mobileworld-160ce/databases/(default)/documents/Products/${selectedProductId}`

      );

 

      alert('Product deleted successfully');

      setSelectedProductId('');

      setSelectedProduct(null);

    } catch (error) {

      console.error('Error deleting product:', error);

    }

  };

 

  return (

    <div className="delete-product-container">

      <h2>Delete Product</h2>

      <label className="label">

        Search for a Product:

        <input

          type="text"

          value={searchText}

          onChange={(e) => setSearchText(e.target.value)}

          placeholder="Search by product name"

        />

        <button type="button" onClick={handleSearch}>

          Search

        </button>

      </label>

      <br />

      {searchResults.length > 0 && (

        <div className="delete-form">

          <label className="label">

            Select a Product to Delete:

            <select

              className="select"

              onChange={(e) => {

                setSelectedProductId(e.target.value);

                const productData = searchResults.find(

                  (productItem) => productItem.id === e.target.value

                );

                setSelectedProduct(productData);

              }}

              value={selectedProductId}

            >

              <option value="">Select a product to delete</option>

              {searchResults.map((productItem) => (

                <option key={productItem.id} value={productItem.id}>

                  {productItem.productname}

                </option>

              ))}

            </select>

          </label>

          <br />

          <h3>Product details:</h3>

          {selectedProduct && (

            <div className="product-details">

              <div className="product-image">

                <img src={selectedProduct.imageUrl} alt={selectedProduct.productname} />

              </div>

              <ul>

                <li>

                  <strong>Product Name:</strong> {selectedProduct.productname}

                </li>

                <li>

                  <strong>Description:</strong> {selectedProduct.description}

                </li>

                <li>

                  <strong>Price:</strong> {selectedProduct.price}

                </li>

                <li>

                  <strong>Shop Name:</strong> {selectedProduct.shopname}

                </li>

                <li>

                  <strong>Stock:</strong> {selectedProduct.stock}

                </li>

              </ul>

            </div>

          )}

          <button className="delete-button" onClick={handleDelete}>

            Delete Product

          </button>

        </div>

      )}

    </div>

  );

};

 

export default DeleteProduct;