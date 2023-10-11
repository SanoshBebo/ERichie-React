import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DailySalesReport = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    // Fetch daily sales data from Firestore for the selected date
    axios
      .get(
        `https://firestore.googleapis.com/v1/projects/mobileworld-160ce/databases/(default)/documents/orders?orderBy=timestamp&startAt=${selectedDate}T00:00:00Z&endAt=${selectedDate}T23:59:59Z`
      )
      .then((response) => {
        const salesData = response.data.documents.map((doc) => {
          const data = doc.fields;
          return {
            saleId: doc.name.split('/').pop(),
            date: data.purchaseDate.timestampValue, // Assuming you have a 'timestamp' field
            productName: data.productname.stringValue, // Assuming you have a 'productname' field
            itemsSold: data.quantity.integerValue, // Assuming you have a 'quantity' field
            moneyReceived: data.totalAmount.doubleValue, // Assuming you have a 'totalamount' field
          };
        });
        setSalesData(salesData);
      })
      .catch((error) => {
        console.error('Error fetching daily sales data:', error);
      });
  }, [selectedDate]);

  return (
    <div className="container mx-auto p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Daily Sales Report</h2>
        <label className="text-gray-600">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded p-2 focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>
      <table className="w-full mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Sale ID</th>
            <th className="px-4 py-2">Product Name</th>
            <th className="px-4 py-2">Items Sold</th>
            <th className="px-4 py-2">Money Received</th>
          </tr>
        </thead>
        <tbody>
          {salesData.map((item) => (
            <tr key={item.saleId}>
              <td className="px-4 py-2">{item.date}</td>
              <td className="px-4 py-2">{item.saleId}</td>
              <td className="px-4 py-2">{item.productName}</td>
              <td className="px-4 py-2">{item.itemsSold}</td>
              <td className="px-4 py-2">{item.moneyReceived}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DailySalesReport;
