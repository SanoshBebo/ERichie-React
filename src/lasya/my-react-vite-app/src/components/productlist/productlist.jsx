import "./productlist.css";

import React, { useState, useEffect } from "react";

import axios from "axios";

import { Link } from "react-router-dom";

import ReactPaginate from "react-js-pagination";

import { FaShoppingCart } from "react-icons/fa";

import FetchItemsInCart from "../../../../../ERichie/components/FetchItemsInCart";

import { useSelector } from "react-redux";

import video from "./greetingspage.mp4";

function ProductList({ isAdmin }) {
  const [products, setProducts] = useState([]);

  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1); // Initialize current page to 1

  const productsPerPage = 6; // Number of products per page

  const itemsInCart = useSelector((state) => state.shoponecart.itemsInCart);

  useEffect(() => {
    // Replace 'YOUR_BACKEND_API_URL/products' with your actual backend API endpoint URL

    axios

      .get(
        "https://firestore.googleapis.com/v1/projects/gamestore-1b041/databases/(default)/documents/Products"
      )

      .then((response) => {
        const productList = response.data.documents.map((doc) => ({
          id: doc.name.split("/").pop(),

          fields: doc.fields,
        }));

        setProducts(productList);
      })

      .catch((error) => {
        setError("Error fetching products: " + error.message);
      });
  }, []);

  const items = FetchItemsInCart();

  // Calculate the start and end index of products to display on the current page

  const startIndex = (currentPage - 1) * productsPerPage;

  const endIndex = startIndex + productsPerPage;

  const displayedProducts = products.slice(startIndex, endIndex);

  //const history = useHistory();

  // Handle page change

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="navbar bg-gray-600">
        <Link to="/erichie">Home Page</Link>

        <Link to="/gaming">Go Back</Link>

        <li>
          <Link to="/erichie/cart">
            🛒
            <p className="bg-white text-black rounded-full h-6 w-6 text-center ">
              {itemsInCart}
            </p>
          </Link>{" "}
          {/* Unicode character for cart (🛒) */}
        </li>

        <a href="/customer/login" className="navbar-button">
          Signout
        </a>
      </div>

      <br></br>

      <div className="video-container">
        <video autoPlay loop muted className="fullscreen-video">
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="product-list-container">
        {error ? (
          <p>{error}</p>
        ) : (
          displayedProducts.map((product) => (
            <div className="product-box" key={product.id}>
              <Link to={`product/${product.id}`}>
                <strong>{product.fields.productname?.stringValue}</strong> - Rs.
                {product.fields.price?.integerValue}
                <p>{product.fields.description?.stringValue}</p>
                {isAdmin ? (
                  <p>Stock: {product.fields.stock?.integerValue}</p>
                ) : null}
                <img
                  className="product-image"
                  src={product.fields.imageurl?.stringValue}
                  alt={product.fields.productname?.stringValue}
                />
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}

      <ReactPaginate
        activePage={currentPage}
        itemsCountPerPage={productsPerPage}
        totalItemsCount={products.length}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
        itemClass="pagination-item"
        linkClass="pagination-link"
        activeLinkClass="active-pagination-link"
      />
    </div>
  );
}

export default ProductList;
