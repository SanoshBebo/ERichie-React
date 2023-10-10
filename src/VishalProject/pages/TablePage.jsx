import React, { useState, useEffect } from "react";
import axios from "axios";

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

  const recordsPerPage = 5;

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
              productInfo?.fields.productName?.stringValue || "";

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
          console.error("Error fetching daily inventory data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching daily inventory data:", error);
      }
    }

    // Fetch daily sales data
    async function fetchDailySalesData() {
      try {
        const response = await axios.get(ordersEndpoint);

        if (response.status === 200) {
          const salesData = response.data.documents || [];

          // Assuming your Firestore structure for daily sales data is like this:
          const formattedSalesData = await Promise.all(
            salesData.map(async (doc) => {
              const orderId = doc.name.split("/").pop();
              const productId = doc.fields.productId?.stringValue || "";
              const quantity = doc.fields.quantity?.integerValue || 0;
              const totalPrice = doc.fields.totalPrice?.integerValue || 0;
              const orderDate = new Date(
                doc.fields.orderDate?.timestampValue
              ).toLocaleDateString();

              const productInfoResponse = await axios.get(
                `${productsEndpoint}/${productId}`
              );
              const productName =
                productInfoResponse.data?.fields.productName?.stringValue || "";

              return {
                orderId,
                productId,
                productName,
                quantity,
                totalPrice,
                date: orderDate,
              };
            })
          );

          setDailySalesData(formattedSalesData);
        } else {
          console.error("Error fetching daily sales data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching daily sales data:", error);
      }
    }

    fetchDailyInventoryData();
    fetchDailySalesData();
    setTodaysDate(new Date().toLocaleDateString()); // Set today's date
  }, [selectedSalesDate]); // Add selectedSalesDate as a dependency to update on date change

  const indexOfLastInventoryRecord = inventoryPage * recordsPerPage;
  const indexOfFirstInventoryRecord = indexOfLastInventoryRecord - recordsPerPage;
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
          {currentSalesRecords.map((item, index) => (
            <tr key={index}>
              <td>{item.orderId}</td>
              <td>{item.productName}</td>
              <td>{item.quantity}</td>
              <td>{item.totalPrice}</td>
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
