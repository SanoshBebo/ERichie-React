import React, { useEffect, useState } from 'react';
import { getOrderByDateFromFireStore } from './getorderdetails';
import '../styles/dailysales.css';

const DailySalesReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  let totalSalesAmount = 0;

  useEffect(() => {
    const todayDate = new Date().toISOString().split('T')[0];

    getOrderByDateFromFireStore()
      .then((todaysOrders) => {
        const sales = todaysOrders.map((order) => {
          totalSalesAmount += parseInt(order.totalprice);
          return {
            orderid: order.orderid,
            productname: order.productname,
            quantity: order.quantity,
            totalprice: order.totalprice,
          };
        });

        setSalesData(sales);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <h2 className="mt-4">Daily Sales Report</h2>
      <p>Date: {new Date().toLocaleDateString()}</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered mt-4">
          <thead className="thead-dark">
            <tr>
              <th>Order ID</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((sale, index) => (
              <tr key={index}>
                <td>{sale.orderid}</td>
                <td>{sale.productname}</td>
                <td>{sale.quantity}</td>
                <td>Rs. {sale.totalprice}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3">Total Sales Amount:</td>
              <td>Rs. {totalSalesAmount}</td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
};

export default DailySalesReport;
