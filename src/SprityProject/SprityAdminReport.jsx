import React, { useEffect, useState } from "react";
import {
  getOrderByDateFromFireStore,
  getOrderByDateRangeFromFireStore,
} from "../SprityProject/GetOrderDetailSprity";
import ReactPaginate from "react-paginate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setUser } from "../SanoshProject/redux/shopOneUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

const SprityAdminReport = () => {
  const [orders, setOrders] = useState([]);
  const [ordersByDate, setOrdersByDate] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const ordersPerPage = 7;
  const pageCount = Math.ceil(orders.length / ordersPerPage);
  const shopid = "shop10";
  const [isDataLoaded, setisDataLoaded] = useState(false);
  const user = useSelector((state) => state.shoponeuser.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * ordersPerPage;
  const currentPageData = orders.slice(offset, offset + ordersPerPage);

  useEffect(() => {
    if ((!isLoadingUser && user.length === 0) || user.role == "customer") {
      navigate("/admin/login");
    }
  }, [isLoadingUser, user, navigate]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      if (userData.role == "customer") {
        navigate("/admin/login");
      }
      dispatch(setUser(userData));
    }
    setIsLoadingUser(false);
  }, []);
  useEffect(() => {
    getOrderByDateFromFireStore(shopid)
      .then((todaysOrders) => {
        console.log(todaysOrders);
        setOrders(todaysOrders);
        setisDataLoaded(true);
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
        {isDataLoaded &&
          (currentPageData.length > 0 ? (
            <div className="overflow-x-auto border border-gray-300">
              <table className="w-full table-auto border-b border-gray-300">
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
                      <td className="px-4 py-2">{order.orderid}</td>
                      <td className="px-4 py-2">{order.name}</td>
                      <td className="px-4 py-2">
                        {order.purchaseDate.split("T")[0]}
                      </td>
                      <td className="px-4 py-2">{order.productname}</td>
                      <td className="px-4 py-2">{order.quantity}</td>
                      <td className="px-4 py-2">{order.currentstock}</td>
                      <td className="px-4 py-2">₹ {order.totalprice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center text-center">
              <h2 className="font-bold mt-44 text-2xl">
                Oops Unfortunately no one has made any order for today 🙁
              </h2>
            </div>
          ))}
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
          <table className="w-full table-auto border border-gray-300">
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
                  <td className=" px-4 py-2">{order.orderid}</td>
                  <td className=" px-4 py-2">{order.name}</td>
                  <td className="px-4 py-2">
                    {order.purchaseDate.split("T")[0]}
                  </td>
                  <td className="px-4 py-2">{order.productname}</td>
                  <td className=" px-4 py-2">{order.quantity}</td>
                  <td className=" px-4 py-2">₹ {order.totalprice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SprityAdminReport;
