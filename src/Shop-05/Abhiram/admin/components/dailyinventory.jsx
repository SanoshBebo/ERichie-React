import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/dailyinventory.css'

const Dailyinventory = () => {
  const [productdata, setProductData] = useState([]);
  const [salesdata, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayDate, setTodayDate] = useState('');

  useEffect(() => {
    // Fetch data from your API endpoints using Axios

    axios
      .get('https://firestore.googleapis.com/v1/projects/abhiram-store/databases/(default)/documents/Products')
      .then((productResponse) => {
        const products = productResponse.data.documents.map((doc) => {
          const fields = doc.fields;
          return {
            id: doc.name.split('/').pop(),
            productName: fields.productname.stringValue,
            currentStock: fields.stock.integerValue,
          };
        });
        setProductData(products);
      })
      .catch((error) => {
        console.error('Error fetching product data:', error);
        setLoading(false);
      });

    axios
      .get('https://firestore.googleapis.com/v1/projects/abhiram-store/databases/(default)/documents/Orders')
      .then((salesResponse) => {
        const sales = salesResponse.data.documents.map((doc) => {
          const fields = doc.fields;
          return {
            productID: fields.productid.stringValue,
            quantity: fields.quantity.integerValue,
            date: new Date(fields.date.timestampValue).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          };
        });
        // Filter sales data for today's date
        const today = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        const filteredSales = sales.filter((sale) => sale.date === today);

        setSalesData(filteredSales);
        setTodayDate(today); // Set today's date
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching sales data:', error);
        setLoading(false);
      });
  }, []);

  // Create a map to store today's sales for each product
  const todaySalesMap = {};

  // Calculate today's sales for each product
  salesdata.forEach((sale) => {
    if (!todaySalesMap[sale.productID]) {
      todaySalesMap[sale.productID] = 0;
    }
    todaySalesMap[sale.productID] += parseInt(sale.quantity, 10);
  });

  // Calculate current stock for each product
  const inventoryData = productdata.map((product) => {
    const todaysSales = todaySalesMap[product.id] || 0;
    const openingStock = parseInt(product.currentStock) + parseInt(todaysSales);
    return {
      ...product,
      todaysSales,
      openingStock,
    };
  });

  return (
    <>
    <section className='daily'>
    <div className="container mt-5">
      <h2 className="text-center mb-4">Daily Inventory Report</h2>
      <p className="text-center">Date: {todayDate}</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="text-center">Product Name</th>
              <th className="text-center">Opening Stock</th>
              <th className="text-center">Today's Sales</th>
              <th className="text-center">Current Stock</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((product) => (
              <tr key={product.id}>
                <td className="text-center">{product.productName}</td>
                <td className="text-center">{product.openingStock}</td>
                <td className="text-center">{product.todaysSales}</td>
                <td className="text-center">{product.currentStock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </section>
    </>
  );
};

export default Dailyinventory;
