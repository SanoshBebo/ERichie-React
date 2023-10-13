import React, { useState, useEffect } from "react";
import { fetchShopOneProducts } from "../Api/fetchShopOneProducts";
import { fetchShopTwoProducts } from "../Api/fetchShopTwoProducts";
import { fetchShopThreeProducts } from "../Api/fetchShopThreeProducts";
import { fetchShopFourProducts } from "../Api/fetchShopFourProducts";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import ReactPaginate from "react-paginate";

const MediaCategory = () => {
  const [mediaProducts, setMediaProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Page number starts from 0
  const [itemsPerPage] = useState(12); // Number of items to display per page

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        // Make API calls to fetch products from different endpoints
        const shopOneResponse = await fetchShopOneProducts();
        const shopTwoResponse = await fetchShopTwoProducts();
        const shopThreeResponse = await fetchShopThreeProducts();
        const shopFourResponse = await fetchShopFourProducts();
        // Combine all products into a single array
        const allProducts = [
          ...shopOneResponse,
          ...shopTwoResponse,
          ...shopThreeResponse,
          ...shopFourResponse,
        ];

        // Update the state with the combined products
        setMediaProducts(allProducts);
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    // Call the function to fetch products
    fetchAllProducts();
  }, []);

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(0); // Reset to the first page when searching

    // Filter products based on the search query
    const filtered = mediaProducts.filter((product) =>
      product.productname.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredProducts(filtered);
  };

  const currentProducts = searchQuery ? filteredProducts : mediaProducts;

  // Calculate the index of the first and last item on the current page
  const offset = currentPage * itemsPerPage;
  const currentItems = currentProducts.slice(offset, offset + itemsPerPage);

  const pageCount = Math.ceil(currentProducts.length / itemsPerPage);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <div className="flex-row min-h-screen">
      <div className="header flex items-center justify-between p-20 px-20">
        <h2 className="font-bold text-2xl">Products</h2>
        <input
          type="text"
          placeholder="Search products"
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="p-2 border rounded-md w-25"
        />
      </div>

      <div className="ProductList pb-5">
        {isDataLoaded ? (
          <div>
            <ul className="grid grid-cols-4 gap-6 place-items-center">
              {currentItems.map((product, index) => (
                <li
                  key={index}
                  className={`w-full p-2 ${
                    product.stock === 0 ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <Link
                    to={`/${product.shopid}/product/${product.productid}`}
                    className={`flex flex-col items-center gap-2 hover:translate-y${
                      product.stock === 0 ? "text-gray-500" : ""
                    }`}
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
                            Only {product.stock} left Hurry up!
                          </p>
                        </div>
                      )}

                      {product.stock === 0 && (
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white bg-black bg-opacity-50">
                          Out of Stock
                        </div>
                      )}
                    </div>
                    <h1 className="text-center">{product.productname}</h1>
                    <p className="text-center">Price: {product.price}</p>
                    <p className="text-center">Stock Left: {product.stock}</p>
                  </Link>
                </li>
              ))}
            </ul>
            {pageCount > 1 && (
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination p-10"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
                previousClassName={"pagination-button"}
                nextClassName={"pagination-button"}
                pageClassName={"pagination-button"}
                pageLinkClassName={"pagination-link"}
              />
            )}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "90vh",
            }}
          >
            <Box>
              <CircularProgress />
            </Box>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaCategory;
