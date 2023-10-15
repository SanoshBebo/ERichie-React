
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './UserPage.css';
import './shopProductDetail';
import './DeleteProduct';
import Pagination from "react-js-pagination";

function UserPage() {
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 4;

const handlePageChange = (pageNumber) => {

    setCurrentPage(pageNumber);

  };



  const apiUrl =
    'https://firestore.googleapis.com/v1/projects/d-richie-computers/databases/(default)/documents/Products';

  useEffect(() => {
    axios
      .get(apiUrl)
      .then((response) => {
        const productList = response.data.documents.map((doc) => ({
          id: doc.name.split('/').pop(),
          fields: doc.fields,
        }));
        setProducts(productList);
        setFilteredProducts(productList);
      })
      .catch((error) => {
        console.error('Error fetching Products: ', error);
      });
  }, []);

  useEffect(() => {
    const searchTerm = searchInput.toLowerCase();
    const filtered = products.filter((product) =>
      product.fields.productname?.stringValue?.toLowerCase().includes(searchTerm)
    );
    setFilteredProducts(filtered);
  }, [searchInput, products]);

  return (
    <section className="dhanu">
    <div className="user-page">
    <h1>Welcome to Dhanu Computers!</h1>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    {/* <li><a href="index.html">Cart</a></li> */}
    <li><Link to='/computer' className='link'>ComputerHome</Link></li>

   
      <div className="product-list">
        {/* <h2 id="avail_text">Available Products</h2> */}
        {filteredProducts.map((product) => (
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
    <div>
      <h5>© 1996-2023, dhanu.com, Inc. or its affiliates</h5>
    </div>
    </section>
  );
}

export default UserPage;
