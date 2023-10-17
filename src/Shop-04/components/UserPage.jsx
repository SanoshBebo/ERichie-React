import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Pagination from "react-js-pagination";
import './UserPage.css';
import './shopProductDetail';
import { AiOutlineSearch,AiOutlineShoppingCart } from 'react-icons/ai';
import { CenterFocusStrong } from "@mui/icons-material";
import { useSelector } from 'react-redux';

function UserPage() {
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    
    const [currentCategory, setCurrentCategory] = useState('All'); // Default category is All
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;
  const itemsInCart = useSelector((state)=>state.shoponecart.itemsInCart)


  const apiUrl = 'https://firestore.googleapis.com/v1/projects/d-richie-computers/databases/(default)/documents/Products';

  
  useEffect(() => {
    axios
      .get(apiUrl)
      .then((response) => {
        const productList = response.data.documents.map((doc) => ({
          id: doc.name.split('/').pop(),
          fields: doc.fields,
        }));
        setProducts(productList);
      })
      .catch((error) => {
        console.error('Error fetching Products: ', error);
      });
  }, []);

  
  useEffect(() => {
  const searchTerm = searchInput.toLowerCase();
  const filteredBySearch = products.filter((product) =>
    product.fields.productname?.stringValue?.toLowerCase().includes(searchTerm)
  );  
  let filteredByCategory;
  if (currentCategory === 'All') {
    filteredByCategory = filteredBySearch;
  } else {
    filteredByCategory = filteredBySearch.filter((product) =>
      product.fields.modelNo?.stringValue?.startsWith(currentCategory)
    );
  }

  setFilteredProducts(filteredByCategory);
}, [searchInput, products, currentCategory]);



  const handleSearch = () => {
    const searchTerm = searchInput.toLowerCase();
    const filtered = products.filter((product) =>
      product.fields.productname?.stringValue
        ?.toLowerCase()
        .includes(searchTerm)
    );
    setFilteredProducts(filtered);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
  };

  return (
    <section className="dhanu">
    <div className="user-page">
    <nav className="navbar">
  <h1>Dhanu Computers!</h1>
  <ul className="navbar-list">
  
    
    <li><Link to='/shop16/user' className='link'>Home</Link></li>
    <li><Link to='/computer' className='link'>Computers Home</Link></li>
    <li><Link to='/erichie/' className='link'>Back to Categories</Link></li>
   
    <li><Link to="/erichie/cart" className="btn btn-link">
            <AiOutlineShoppingCart style={{ fontSize: '24px' }}/> 
            <p className="bg-white text-black rounded-full h-6 w-6 text-center ">
                  {itemsInCart}
                </p>
          </Link></li>
    <li><button >Signout</button></li>
  </ul>
</nav>
<br></br>
<br></br>
<br></br>
<br></br>
<h1 id="avail_products_name">Products</h1>
<br></br>
<br></br>
   <div className='search_options'>
    <div className="search-bar">
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search for brand"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button id="search-button" onClick={handleSearch}>Search</button>
              </div>
              <select className="category-dropdown" onChange={(e) => handleCategoryChange(e.target.value)}>
  <option value="All">All</option>
  <option value="LAP">Laptops</option>
  <option value="COM">Computers</option>
  <option value="SSD">SSD</option>
  <option value="PRI">Printers</option>
  <option value="MBD">MotherBoard</option>
  <option value="CPU">CPU</option>
</select>
</div>
      <div className="product-list">
        {/* <h2 id="avail_text">Available Products</h2> */}
        {currentProducts.map((product) => (
          <div key={product.id} className="product-item">
            <img
              src={product.fields.imageurl?.stringValue || ''}
              alt={product.fields.productname?.stringValue || ''}
            />
            <h4>{product.fields.productname?.stringValue || ''}</h4>
            <h4>Price: Rs.{product.fields.price?.integerValue || 0}</h4>
            <Link to={`/shop4products/${product.id}`}><strong>View Details</strong></Link>
            
          </div>
        ))}
      </div>
      
      <Pagination
          activePage={currentPage}
          itemsCountPerPage={productsPerPage}
          totalItemsCount={filteredProducts.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
          itemClass="page-item"
          linkClass="page-link"
        />
        <br></br>
        <br></br>
        </div>
        <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2023 Dhanu Computers, Inc. All rights reserved.</p>
          <p>2nd floor , work easy space solutions, Urban Square, S.F No; 278/3A & 9A Kandanchavadi, Rajiv Gandhi Salai, Chennai, 600041</p>
        </div>
      </footer>
    
    </section>
  );
}

export default UserPage;
