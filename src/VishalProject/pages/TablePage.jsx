import React, { useState, useEffect } from "react";

import axios from "axios";

import { format } from "date-fns";

const baseUrl =
  "https://firestore.googleapis.com/v1/projects/about-me-bf7ef/databases/(default)/documents";

const productsEndpoint = `${baseUrl}/Products`;

const ordersEndpoint = `${baseUrl}/Orders`;

const TablePage = () => {
  const [dailyInventoryData, setDailyInventoryData] = useState([]);

  const [dailySalesData, setDailySalesData] = useState([]);

  const [selectedSalesDate, setSelectedSalesDate] = useState(
    new Date().toLocaleDateString()
  );

  const [currentPage, setCurrentPage] = useState(1);

  const [inventoryPage, setInventoryPage] = useState(1);

  const [todaysDate, setTodaysDate] = useState(new Date().toLocaleDateString());

  const recordsPerPage = 10;

  useEffect(() => {
    // Fetch daily inventory data

    async function fetchDailyInventoryData() {
      try {
        const response = await axios.get(productsEndpoint);

        if (response.status === 200) {
          const productsData = response.data.documents || [];

          // Assuming your Firestore structure for daily inventory data is like this:

          const formattedInventoryData = productsData.map((doc) => {
            const productId = doc.name.split("/").pop();

            const openingStock = doc.fields.stock?.integerValue || 0;

            const todaysSale = dailySalesData

              .filter(
                (item) =>
                  item.date === selectedSalesDate &&
                  item.productId === productId
              )

              .reduce((total, item) => total + item.quantity, 0);

            const productInfo = productsData.find(
              (product) => product.name.split("/").pop() === productId
            );

            const productName =
              productInfo?.fields.productname?.stringValue || "";

            return {
              productId,

              productName,

              openingStock,

              todaysSale,

              currentStock: openingStock - todaysSale,
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

    // Fetch daily sales data

    // Fetch daily sales data

    async function fetchDailySalesData() {
      try {
        const response = await axios.get(ordersEndpoint);

        if (response.status === 200) {
          const salesData = response.data.documents || [];

          // Convert selectedSalesDate to "yyyy-MM-dd" format

          const formattedSelectedDate = format(
            new Date(selectedSalesDate),
            "yyyy-MM-dd"
          );

          // Filter and format the sales data for the selected date and shopid "shop03"

          const formattedSalesData = salesData

            .map((doc) => {
              const orderId = doc.name.split("/").pop();

              const orderDate = doc.fields.purchasedate?.timestampValue;

              const shopId = doc.fields.shopid?.stringValue;

              // Check if orderDate, shopId, and the selected date are defined

              if (
                orderDate &&
                shopId === "shop03" &&
                formattedSelectedDate ===
                  orderDate.toDate().toLocaleDateString()
              ) {
                const orderedProducts =
                  doc.fields.orderedproducts?.arrayValue.values || [];

                const productDetails = orderedProducts.map((product) => {
                  const productId =
                    product.mapValue.fields.productid.stringValue;

                  const quantity =
                    product.mapValue.fields.quantity.integerValue;

                  const productInfo = dailyInventoryData.find(
                    (item) => item.productId === productId
                  );

                  return {
                    productId,

                    productName: productInfo.productName,

                    quantity,

                    totalPrice: productInfo.price * quantity,
                  };
                });

                return {
                  orderId,

                  products: productDetails,
                };
              }

              return null; // Filter out entries that don't match the criteria
            })

            .filter((data) => data !== null); // Remove the filtered out entries

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

    setTodaysDate(new Date().toLocaleDateString()); // Set today's date
  }, [selectedSalesDate]);

  const indexOfLastInventoryRecord = inventoryPage * recordsPerPage;

  const indexOfFirstInventoryRecord =
    indexOfLastInventoryRecord - recordsPerPage;

  const currentInventoryRecords = dailyInventoryData.slice(
    indexOfFirstInventoryRecord,

    indexOfLastInventoryRecord
  );

  const indexOfLastSalesRecord = currentPage * recordsPerPage;

  const indexOfFirstSalesRecord = indexOfLastSalesRecord - recordsPerPage;

  const currentSalesRecords = dailySalesData

    .filter((item) => item.date === selectedSalesDate)

    .slice(indexOfFirstSalesRecord, indexOfLastSalesRecord);

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
        value={selectedSalesDate}
        onChange={(e) => setSelectedSalesDate(e.target.value)}
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

                  .map(
                    (product) => `${product.quantity} ${product.productName}`
                  )

                  .join(", ")}
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
