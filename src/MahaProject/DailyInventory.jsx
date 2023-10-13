import React, { useState, useEffect } from "react";
import axios from "axios";

const DailyInventoryReport = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    // Your useEffect code here...
  }, [selectedDate]);

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Daily Inventory Report</h2>
        <label className="block mb-2">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 mb-4"
        />
        <table className="w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Product</th>
              <th className="border border-gray-300 p-2">Opening Stock</th>
              <th className="border border-gray-300 p-2">Sales</th>
              <th className="border border-gray-300 p-2">Current Stock</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.length > 0 ? (
              inventoryData.map((item) => (
                <tr key={item.productId}>
                  <td className="border border-gray-300 p-2">
                    {item.productName}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {item.openingStock}
                  </td>
                  <td className="border border-gray-300 p-2">{item.sales}</td>
                  <td className="border border-gray-300 p-2">
                    {item.currentStock}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="border border-gray-300 p-2">
                  No data available for the selected date.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyInventoryReport;
