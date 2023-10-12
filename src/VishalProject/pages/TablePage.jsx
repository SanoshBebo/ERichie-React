import React, { useState, useEffect } from "react";

import axios from "axios";

import { format } from "date-fns";

const baseUrl =
  "https://firestore.googleapis.com/v1/projects/about-me-bf7ef/databases/(default)/documents";

const productsEndpoint = `${baseUrl}/Products`;

const ordersEndpoint = `https://firestore.googleapis.com/v1/projects/e-richie-application/databases/(default)/documentsx/Orders`;

const TablePage = () => {
  const [dailyInventoryData, setDailyInventoryData] = useState([]);

  const [dailySalesData, setDailySalesData] = useState([]);

  const [selectedSalesDate, setSelectedSalesDate] = useState(
    new Date().toLocaleDateString()
  );

  const [currentPage, setCurrentPage] = useState(1);

  const [inventoryPage, setInventoryPage] = useState(1);

  const [todaysDate, setTodaysDate] = useState(new Date().toLocaleDateString());

  const recordsPerPage = 5;

  useEffect(() => {
    async function fetchDailyInventoryData() {
      try {
        const response = await axios.get(productsEndpoint);

        if (response.status === 200) {
          const productsData = response.data.documents || [];

          const formattedInventoryData = productsData.map((doc) => {
            const productId = doc.name.split("/").pop();

            const currentStock = doc.fields.stock?.integerValue || 0;

            const todaysSale = dailySalesData

              .filter(
                (item) =>
                  item.date === todaysDate && item.productId === productId
              )

              .reduce((total, item) => total + item.quantity, 0);

            const productName = doc.fields.productname?.stringValue || "";

            // Calculate today's sales, opening stock, and current stock

            const openingStock = parseInt(doc.fields.stock?.integerValue) || 0;

            return {
              productId,

              productName,

              openingStock,

              todaysSale,

              currentStock,
            };
          });

          setDailyInventoryData(formattedInventoryData);
        } else {
          console.error(
            "Error fetching daily inventory data:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching daily inventory data:", error);
      }
    }

    async function fetchDailySalesData() {
      try {
        const response = await axios.get(ordersEndpoint);

        if (response.status === 200) {
          const salesData = response.data.documents || [];

          const formattedSalesData = salesData

            .filter((doc) => {
              const orderDate = doc.fields.purchasedate?.timestampValue;

              const shopId = doc.fields.shopid?.stringValue;

              return (
                orderDate &&
                shopId === "shop03" &&
                orderDate.toDate().toLocaleDateString() === todaysDate
              );
            })

            .map((doc) => {
              const orderId = doc.name.split("/").pop();

              const orderedProducts =
                doc.fields.orderedproducts?.arrayValue.values || [];

              const productDetails = orderedProducts.map((product) => {
                const productId = product.mapValue.fields.productid.stringValue;

                const quantity = product.mapValue.fields.quantity.integerValue;

                return {
                  productId,

                  quantity,
                };
              });

              return {
                orderId,

                products: productDetails,
              };
            });

          setDailySalesData(formattedSalesData);
        } else {
          console.error(
            "Error fetching daily sales data:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching daily sales data:", error);
      }
    }

    fetchDailyInventoryData();

    fetchDailySalesData();

    setTodaysDate(new Date().toLocaleDateString());
  }, [todaysDate]);

  const indexOfLastInventoryRecord = inventoryPage * recordsPerPage;

  const indexOfFirstInventoryRecord =
    indexOfLastInventoryRecord - recordsPerPage;

  const currentInventoryRecords = dailyInventoryData.slice(
    indexOfFirstInventoryRecord,

    indexOfLastInventoryRecord
  );

  const indexOfLastSalesRecord = currentPage * recordsPerPage;

  const indexOfFirstSalesRecord = indexOfLastSalesRecord - recordsPerPage;

  const currentSalesRecords = dailySalesData.slice(
    indexOfFirstSalesRecord,
    indexOfLastSalesRecord
  );

  const paginateSales = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginateInventory = (pageNumber) => {
    setInventoryPage(pageNumber);
  };

  // Calculate total earnings for the daily sales report

  const totalEarnings = currentSalesRecords.reduce(
    (total, item) => total + item.totalPrice,

    0
  );

  return (
    <div className="p-4 bg-pink-100 rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Daily Inventory Report</h1>

      <div className="mb-4">
        <strong>Today's Date: {todaysDate}</strong>
      </div>

      <table className="w-full">
        <thead>
          <tr>
            <th>Product Name</th>

            <th>Opening Stock</th>

            <th>Today's Sale</th>

            <th>Current Stock</th>
          </tr>
        </thead>

        <tbody>
          {currentInventoryRecords.map((item, index) => (
            <tr key={index}>
              <td>{item.productName}</td>

              <td>{item.openingStock}</td>

              <td>{item.todaysSale}</td>

              <td>{item.currentStock}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <button
          onClick={() => paginateInventory(inventoryPage - 1)}
          disabled={inventoryPage === 1}
          className="py-2 px-4 rounded-md bg-pink-400 text-white mr-2"
        >
          Previous
        </button>

        <button
          onClick={() => paginateInventory(inventoryPage + 1)}
          disabled={indexOfLastInventoryRecord >= dailyInventoryData.length}
          className="py-2 px-4 rounded-md bg-pink-400 text-white"
        >
          Next
        </button>
      </div>

      <h1 className="text-2xl font-semibold mb-4">Daily Sales Report</h1>

      <label htmlFor="salesDatePicker">Select Date: </label>

      <input
        type="date"
        id="salesDatePicker"
        value={todaysDate}
        onChange={(e) => setTodaysDate(e.target.value)}
      />

      <table className="w-full">
        <thead>
          <tr>
            <th>Order ID</th>

            <th>Product Name</th>

            <th>Quantity</th>

            <th>Total Price</th>
          </tr>
        </thead>

        <tbody>
          {currentSalesRecords.map((order, index) => (
            <tr key={index}>
              <td>{order.orderId}</td>

              <td>
                {order.products

                  .map((product) => product.productName)

                  .join(", ")}
              </td>

              <td>
                {order.products

                  .map(product)

                  .join(", ")}
              </td>

              <td>
                {order.products

                  .map((product) => product.quantity)

                  .reduce((total, quantity) => total + quantity, 0)}
              </td>

              <td>
                {order.products

                  .map((product) => product.totalPrice)

                  .reduce((total, price) => total + price, 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <button
          onClick={() => paginateSales(currentPage - 1)}
          disabled={currentPage === 1}
          className="py-2 px-4 rounded-md bg-pink-400 text-white mr-2"
        >
          Previous
        </button>

        <button
          onClick={() => paginateSales(currentPage + 1)}
          disabled={indexOfLastSalesRecord >= dailySalesData.length}
          className="py-2 px-4 rounded-md bg-pink-400 text-white"
        >
          Next
        </button>
      </div>

      <div className="mt-4">
        <strong>Total Earnings: {totalEarnings}</strong>
      </div>
    </div>
  );
};

export default TablePage;
