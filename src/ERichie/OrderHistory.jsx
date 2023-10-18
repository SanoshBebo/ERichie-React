import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getOrderHistory } from "../Api/Orders";
import { Box, CircularProgress } from "@mui/material";
import ReactPaginate from "react-paginate";
import { Link, Navigate, redirect, useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const [Orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Page number starts from 0
  const [itemsPerPage] = useState(5); // Number of items to display per page
  const navigate = useNavigate();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const fetchOrders = async () => {
        try {
          const orders = await getOrderHistory(user.email);
          console.log(orders);
          setOrders(orders);
          setIsDataLoaded(true);
        } catch (err) {
          console.log("Failed to get Order Data", err);
        }
      };
      fetchOrders();
    } else {
      navigate("/customer/login");
    }
  }, []);

  const currentProducts = searchQuery ? filteredOrders : Orders;

  // Calculate the index of the first and last item on the current page
  const offset = currentPage * itemsPerPage;
  const currentItems = currentProducts.slice(offset, offset + itemsPerPage);

  const pageCount = Math.ceil(currentProducts.length / itemsPerPage);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(0); // Reset to the first page when searching

    // Filter products based on the search query
    const filtered = Orders.filter((product) =>
      product.productname.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredOrders(filtered);
  };

  return (
    <div className="flex-row min-h-screen">
      <div className="header flex items-center justify-between p-12 px-20">
        <h2 className="font-bold text-2xl">Your Orders</h2>
        <input
          type="text"
          placeholder="Search Orders"
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="p-2 border rounded-md w-25"
        />
      </div>

      <div className="ProductList pb-5">
        {isDataLoaded ? (
          <div className="">
            <ul className="">
              {currentItems.map((product, index) => (
                <li key={index} className={`w-full p-10 `}>
                  <div className="flex-row border border-gray-100">
                    <div className="flex justify-between bg-gray-200 p-4">
                      <div className="flex-row">
                        <p className="text-lg font-semibold">Order Placed </p>
                        <p> {product.purchaseDate.split("T")[0]}</p>
                        <p> {product.purchaseDate.split("T")[1].split(".")[0]}</p>
                      </div>
                      <div className="flex-row">
                        <p className="text-lg font-semibold">TOTAL </p>
                        <p> ₹ {product.totalprice}</p>
                      </div>
                      <div className="flex-row">
                        <p className="text-lg font-semibold">
                          {" "}
                          ORDER#: {product.orderid}
                        </p>
                        <p className="hover:cursor-pointer">Download Invoice</p>
                      </div>
                    </div>
                    <Link
                      to={`/${product.shopid}/product/${product.productid}`}
                      className={`flex items-center gap-2 hover:translate-y p-5`}
                    >
                      <div className="w-32">
                        <img
                          src={product.imageurl}
                          alt={product.productname}
                          className="bg-slate-500 object-contain w-full h-full"
                        />
                      </div>
                      <div className="flex-row p-4">
                        <h1 className="text-left text-lg font-semibold">
                          {product.productname}
                        </h1>
                        <p className="text-center">{product.description}</p>
                      </div>
                    </Link>
                  </div>
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

export default OrderHistory;
