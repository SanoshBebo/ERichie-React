import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { Link } from 'react-router-dom';

import videoFile from './Assets/welcomepage.mp4';

 

 

function ProductDisplay1() {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

 

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 6;

 

  const [searchInput, setSearchInput] = useState('');

  const [filteredProducts, setFilteredProducts] = useState([]);

 

  const [sortOrder, setSortOrder] = useState('default'); // 'default', 'highToLow', 'lowToHigh'

 

  useEffect(() => {

    const databaseUrls = [

      // Add your Firestore database URLs here

      "https://firestore.googleapis.com/v1/projects/myapp-5dc30/databases/(default)/documents/Products",

      "https://firestore.googleapis.com/v1/projects/gamestore-1b041/databases/(default)/documents/Products",

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

      setFilteredProducts(allProducts);

      setLoading(false);

    };

 

    fetchData();

  }, []);

 

  useEffect(() => {

    if (sortOrder === 'highToLow') {

      const sortedProducts = [...filteredProducts].sort((a, b) => (b.price.doubleValue || b.price.integerValue) - (a.price.doubleValue || a.price.integerValue));

      setFilteredProducts(sortedProducts);

    } else if (sortOrder === 'lowToHigh') {

      const sortedProducts = [...filteredProducts].sort((a, b) => (a.price.doubleValue || a.price.integerValue) - (b.price.doubleValue || b.price.integerValue));

      setFilteredProducts(sortedProducts);

    }

  }, [sortOrder, filteredProducts]);

 

  useEffect(() => {

    const searchTerm = searchInput.toLowerCase();

    const filtered = products.filter((product) =>

      product.productname?.stringValue?.toLowerCase().includes(searchTerm)

    );

    setFilteredProducts(filtered);

  }, [searchInput, products]);

 

  const indexOfLastProduct = currentPage * productsPerPage;

  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

 

  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

 

  const paginate = (pageNumber) => {

    if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredProducts.length / productsPerPage)) {

      setCurrentPage(pageNumber);

    }

  };

 

  const handleSearch = () => {

    setCurrentPage(1);

  };

 

  const handleSort = (order) => {

    setSortOrder(order);

    setCurrentPage(1);

  };

 

  return (

    <div className="bg-white min-h-screen py-10 ">

      <div className="navbar flex justify-between items-center p-4">

      <span className="text-black-500 text-2xl font-bold">The Game Chest</span>

       

        <div className="search-bar flex items-center space-x-2">

          <input

            type="text"

            placeholder="Search..."

            value={searchInput}

            onChange={(e) => setSearchInput(e.target.value)}

            className="border border-white-400 p-2 rounded-lg"

          />

          <button onClick={handleSearch} className="bg-purple-500 text-white p-2 rounded-lg">

            Search

          </button>

        </div>

        <div className="navbar-buttons flex items-center space-x-4">

  <Link to="/erichie" className="navbar-button bg-purple-500 text-white hover:bg-purple-700 focus:outline-none">

    Erichie

  </Link>

  <a href="/customer/login" className="navbar-button bg-purple-500 text-white hover:bg-purple-700 focus:outline-none">

    Signout

  </a>

  <Link to="/erichie/cart" className="navbar-button bg-purple-500 text-white hover:bg-purple-700 focus:outline-none">

    <span role="img" aria-label="Cart" className="inline-block w-6 h-6 text-purple-500">🛒</span> Cart

  </Link>

</div>

 

 

 

 

      </div>

   

      <div className="video-container">

        <video autoPlay loop muted className="fullscreen-video">

          <source src={videoFile} type="video/mp4" />

          Your browser does not support the video tag.

        </video>

        <div className="button-container flex justify-center space-x-4">

  <Link to="/shop05" className="flex flex-col items-center w-24 h-24 bg-purple-500 text-white rounded-full hover:bg-purple-700" title="Dead Eye Game Store">

    <h2 className="text-xl text-center">Dead Eye</h2>

    <h2 className="text-xl text-center">Game Store</h2>

  </Link>

  <Link to="/shop06" className="flex flex-col items-center w-24 h-24 bg-purple-500 text-white rounded-full hover:bg-purple-700" title="Game Store">

    <h2 className="text-xl text-center">Game Store</h2>

  </Link>

  <Link to="/shop07" className="flex flex-col items-center w-24 h-24 bg-purple-500 text-white rounded-full hover-bg-purple-700" title="GaMer's GoldMine">

    <h2 className="text-xl text-center">GaMer's</h2>

    <h2 className="text-xl text-center">GoldMine</h2>

  </Link>

</div>

        <div className="sorting-buttons flex items-center space-x-4">

  <label className="text-white-700 font-semibold">Sort by:</label>

  <button

    onClick={() => handleSort('default')}

    className="bg-purple-500 text-white px-3 py-2 rounded-md hover:bg-purple-700 focus:outline-none"

  >

    Default

  </button>

  <button

    onClick={() => handleSort('highToLow')}

    className="bg-purple-500 text-white px-3 py-2 rounded-md hover:bg-purple-700 focus:outline-none"

  >

    Price: High to Low

  </button>

  <button

    onClick={() => handleSort('lowToHigh')}

    className="bg-purple-500 text-white px-3 py-2 rounded-md hover:bg-purple-700 focus:outline-none"

  >

    Price: Low to High

  </button>

</div>

 

       

      </div>

      {loading ? (

        <div className="loading-container ">

          <div className="loading-text">Loading...</div>

        </div>

      ) : (

        <div className="product-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  ">

          {currentProducts.map((product) => (

            <Link key={product.id} to={`/${product.shopid?.stringValue || ''}/product/${product.id}`}>

              <div className="product-card border p-4 rounded-lg shadow-md">

                <img

                  src={product.imageurl?.stringValue || product.imageUrl?.stringValue || ''}

                  alt={product.productname?.stringValue || ''}

                  className="product-image w-full h-40 object-cover mb-2 rounded-lg"

                />

                <div className="product-details-1">

                  <h3 className="text-lg font-semibold">{product.productname?.stringValue || ''}</h3>

                  <p className="text-white-600">Description: {product.description?.stringValue || ''}</p>

                  <p className="text-blue-600 font-semibold">Price: Rs.{product.price?.doubleValue || product.price?.integerValue || 0}</p>

                  {product.stock.integerValue === 0 ? (

                    <p className="text-red-500">Out of stock</p>

                  ) : null}

                </div>

              </div>

            </Link>

          ))}

        </div>

      )}

      <div className="pagination flex justify-center items-center space-x-4 mt-4">

        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="bg-blue-500 text-white p-2 rounded-lg" >

          Previous

        </button>

        <span>{`Page ${currentPage} of ${Math.ceil(filteredProducts.length / productsPerPage)}`}</span>

        <button

          onClick={() => paginate(currentPage + 1)}

          disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}

          className="bg-blue-500 text-white p-2 rounded-lg"

        >

          Next

        </button>

      </div>

    </div>

  );

}

 

export default ProductDisplay1;