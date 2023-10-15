import React, { useState, useEffect } from "react";

import { fetchShop09 } from "../Api/fetchShop09";

import { fetchShop10 } from "../Api/fetchShop10";

import { fetchShop11 } from "../Api/fetchShop11";

import { fetchShop12 } from "../Api/fetchShop12";

import { Link } from "react-router-dom";

const MobileCategory = () => {
  const [mobileProducts, setMobileProducts] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const [productsPerPage] = useState(8);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const shopNineResponse = await fetchShop09();

        const shopTenResponse = await fetchShop10();

        const shopElevenResponse = await fetchShop11();

        const shopTwelveResponse = await fetchShop12();

        const allProducts = [
          ...shopNineResponse,

          ...shopTenResponse,

          ...shopElevenResponse,

          ...shopTwelveResponse,
        ];

        setMobileProducts(allProducts);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);

        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  const handleSearchInputChange = (e) => {
    const query = e.target.value;

    setSearchQuery(query);
  };

  // Calculate the index range for the currently displayed products

  const indexOfLastProduct = currentPage * productsPerPage;

  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = mobileProducts.slice(
    indexOfFirstProduct,

    indexOfLastProduct
  );

  // Function to change the current page

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to go to the previous page

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to go to the next page

  const goToNextPage = () => {
    if (currentPage < Math.ceil(mobileProducts.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const filteredProducts = mobileProducts.filter(
    (product) =>
      product.productname &&
      product.productname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log(filteredProducts);

  return (
    <div className="flex-row min-h-screen border border-opacity-50">
      <div className="header flex items-center justify-between p-10 px-20">
        <h2 className="font-bold text-3xl">MOBILE PRODUCTS</h2>

        <input
          type="text"
          placeholder="Search products"
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="p-2 border rounded-md w-25"
        />
      </div>

      <div className="navigation-bar p-4 bg-gray-200">
        <Link
          to="/erichie"
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 justify-between"
        >
          Go to Homepage
        </Link>
      </div>

      {loading ? (
        <div className="loading-message">
          <p className="text-bold text-center text-3xl ">Loading Please Wait</p>
        </div>
      ) : (
        <div className="ProductList pb-5">
          <ul className="grid grid-cols-4 gap-6 place-items-center">
            {currentProducts.map((product, index) => (
              <li
                key={index}
                className={`w-full p-2 ${
                  product.stock <= 0 ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <Link
                  to={`/${product.shopid}/product/${product.productid}`}
                  className={`flex flex-col items-center gap-2 ${
                    product.stock <= 0
                      ? "text-gray-500 pointer-events-none"
                      : ""
                  } border border-gray-600 rounded-md shadow-md `}
                >
                  <div className="h-70 w-70 relative">
                    <img
                      src={product.imageurl}
                      alt={product.name}
                      className="bg-slate-500 object-cover w-full h-full"
                    />

                    {product.stock > 0 && product.stock <= 5 && (
                      <div className="w-full h-full flex items-center justify-center text-white bg-black bg-opacity-50">
                        <p className="text-white">
                          Only {product.stock} left. Hurry up!
                        </p>
                      </div>
                    )}
                    {product.stock <= 0 && (
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white bg-black bg-opacity-50">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  <h1 className="text-center font-bold text-lg">
                    {product.productname || product.title}
                  </h1>

                  <p className="text-center font-serif">
                    Price: Rs.{product.price}
                  </p>

                  <p className="text-center">Store: {product.shopid}</p>

                  <p className="text-center font-bold">
                    Available: {product.stock}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          {/* Pagination controls */}

          <div className="pagination flex justify-center mt-4">
            <button
              onClick={goToPrevPage}
              className={`px-3 py-1 mx-1 rounded-full ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-700"
                  : "bg-blue-500 text-white"
              }`}
              disabled={currentPage === 1}
            >
              Previous Page
            </button>

            {Array.from(
              { length: Math.ceil(filteredProducts.length / productsPerPage) },

              (_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 mx-1 rounded-full ${
                    i + 1 === currentPage
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}

            <button
              onClick={goToNextPage}
              className={`px-3 py-1 mx-1 rounded-full ${
                currentPage ===
                Math.ceil(filteredProducts.length / productsPerPage)
                  ? "bg-gray-300 text-gray-700"
                  : "bg-orange-500 text-white"
              }`}
              disabled={
                currentPage ===
                Math.ceil(filteredProducts.length / productsPerPage)
              }
            >
              Next Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileCategory;
