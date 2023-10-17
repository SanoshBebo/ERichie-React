import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserPage1.css'; // Import your CSS file
import { Link } from 'react-router-dom';
import videoFile from './Assets/welcomepage.mp4'; // Import your video file

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
    <div className="product-display-container">
      <div className="navbar">
        <span style={{ color: "white" }} className="navbar-brand">
          The Game Chest
        </span>
        <div className="search-bar">
    <input
      type="text"
      placeholder="Search..."
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
    />
    <button onClick={handleSearch}>Search</button>
  </div>
        <div className="navbar-buttons">
          <Link to="/erichie" className="navbar-button">
            Erichie
          </Link>
          <a href="/customer/login" className="navbar-button">
            Signout
          </a>
          <Link to="/erichie/cart">🛒 Cart</Link> {/* Unicode character for cart (🛒) */}
        </div>
        <div className="search-bar">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            
          </div>
        </div>
      </div>
    
      <div className="video-container">
        <video autoPlay loop muted className="fullscreen-video">
          <source src={videoFile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
       
          <div className="button-container">
            <Link to="/shop05" className="circle-button">
              <h2>Dead Eye Game Store</h2>
            </Link>
            <Link to="/shop06" className="circle-button">
              <h2>Game Store</h2>
            </Link>
            <Link to="/shop07" className="circle-button">
              <h2>GaMer's GoldMine</h2>
            </Link>
         
        </div>
        <div className="sorting-dropdown">
  <div className="sorting-buttons">
  <label>Sort by:</label>
  <button onClick={() => handleSort('default')}>Default</button>
  <button onClick={() => handleSort('highToLow')}>Price: High to Low</button>
  <button onClick={() => handleSort('lowToHigh')}>Price: Low to High</button>
</div>

</div>
      </div>
      {loading ? (
        <div className="loading-container">
          <div className="loading-text">Loading...</div>
        </div>
      ) : (
        <div className="product-list">
         

          {currentProducts.map((product) => (
            <Link key={product.id} to={`/${product.shopid?.stringValue || ''}/product/${product.id}`}>
              <div className="product-card">
                <img
                  src={product.imageurl?.stringValue || product.imageUrl?.stringValue || ''}
                  alt={product.productname?.stringValue || ''}
                  className="product-image"
                />
                <div className="product-details-1">
                  <h3>{product.productname?.stringValue || ''}</h3>
                  <p>Description: {product.description?.stringValue || ''}</p>
                  <p>Price: Rs.{product.price?.doubleValue || product.price?.integerValue || 0}</p>
                  {product.stock.integerValue ==0 ? (
                    <p1>Out of stock</p1>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>{`Page ${currentPage} of ${Math.ceil(filteredProducts.length / productsPerPage)}`}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ProductDisplay1;
