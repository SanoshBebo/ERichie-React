import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getOrderByDateFromFireStore,
  getOrderByDateRangeFromFireStore,
} from "../../../SanoshProject/api/GetOrderDetails";

const ReportPage = () => {
  const [orders, setOrders] = useState([]);
  const [ordersByDate, setOrdersByDate] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const ordersPerPage = 7;
  const pageCount = Math.ceil(orders.length / ordersPerPage);
  const shopid = "shop11";

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * ordersPerPage;
  const currentPageData = orders.slice(offset, offset + ordersPerPage);
  useEffect(() => {
    getOrderByDateFromFireStore(shopid)
      .then((todaysOrders) => {
        console.log(todaysOrders);
        setOrders(todaysOrders);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, []);

  const getOrdersByDate = () => {
    getOrderByDateRangeFromFireStore(startDate, endDate, shopid)
      .then((order) => {
        console.log(order);
        setOrdersByDate(order);
      })
      .catch((err) => {
        console.error("error fetching Data:", err);
      });
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  return (
    <div className="min-h-screen p-10">
      <div className="min-h-[500px]">
        <h2 className="font-bold text-2xl mb-4">Today's Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b border-gray-300 px-4 py-2">Order ID</th>
                <th className="border-b border-gray-300 px-4 py-2">
                  Customer Name
                </th>
                <th className="border-b border-gray-300 px-4 py-2">
                  Purchase Date
                </th>
                <th className="border-b border-gray-300 px-4 py-2">
                  Product Name
                </th>
                <th className="border-b border-gray-300 px-4 py-2">Quantity</th>
                <th className="border-b border-gray-300 px-4 py-2">
                  Current Stock
                </th>
                <th className="border-b border-gray-300 px-4 py-2">
                  Total Price
                </th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((order) => (
                <tr key={order.orderid} className="hover:bg-gray-100">
                  <td className="border-b border-gray-300 px-4 py-2">
                    {order.orderid}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {order.name}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {order.purchaseDate.split("T")[0]}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {order.productname}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {order.quantity}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {order.currentstock}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {order.totalprice}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination-container mt-4 flex justify-between">
          <button
            onClick={() => handlePageClick({ selected: currentPage - 1 })}
            className={`${
              currentPage === 0 ? "hidden" : "block"
            } bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600`}
          >
            Previous
          </button>
          <ReactPaginate
            previousLabel={""}
            nextLabel={""}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            pageLinkClassName={"hidden"}
            previousLinkClassName={"hidden"}
            nextLinkClassName={"hidden"}
            disabledClassName={"pagination-disabled"}
            activeClassName={"pagination-active"}
          />
          <button
            onClick={() => handlePageClick({ selected: currentPage + 1 })}
            className={`${
              currentPage === pageCount - 1 ? "hidden" : "block"
            } bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600`}
          >
            Next
          </button>
        </div>
      </div>
      <div className="flex-row space-y-10 ">
        <h2 className="font-bold text-2xl mb-4">Orders By Date</h2>
        <div className="flex space-x-4 items-center justify-start">
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            placeholderText="Select start date"
            dateFormat="yyyy-MM-dd"
            className="border rounded px-3 py-2"
            maxDate={new Date()}
          />
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            placeholderText="Select end date"
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            className="border rounded px-3 py-2"
          />
          <button
            onClick={getOrdersByDate}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            View
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            {ordersByDate.length > 0 ? (
              <thead>
                <tr className="bg-gray-100">
                  <th className="border-b border-gray-300 px-4 py-2">
                    Order ID
                  </th>
                  <th className="border-b border-gray-300 px-4 py-2">
                    Customer Name
                  </th>
                  <th className="border-b border-gray-300 px-4 py-2">
                    Purchase Date
                  </th>
                  <th className="border-b border-gray-300 px-4 py-2">
                    Product Name
                  </th>
                  <th className="border-b border-gray-300 px-4 py-2">
                    Quantity
                  </th>
                  <th className="border-b border-gray-300 px-4 py-2">
                    Total Price
                  </th>
                </tr>
              </thead>
            ) : (
              <></>
            )}

            <tbody>
              {ordersByDate.map((order) => (
                <tr key={order.orderid} className="hover:bg-gray-100">
                  <td className="border-b border-gray-300 px-4 py-2">
                    {order.orderid}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {order.name}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {order.purchaseDate.split("T")[0]}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {order.productname}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {order.quantity}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {order.totalprice}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
