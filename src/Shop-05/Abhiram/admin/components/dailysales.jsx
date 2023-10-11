import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../styles/dailysales.css'

const DailySalesReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
let saletotal =0;  

  useEffect(() => {
    // const today = new Date().toLocaleDateString('en-CA');
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    // Fetch data from the Orders database using Axios
    axios
      .get('https://firestore.googleapis.com/v1/projects/abhiram-store/databases/(default)/documents/Orders')
      .then(async (response) => {
        const orders = response.data.documents;
        // Initialize an array to store sales data
        const sales = [];
        let saletotal =0;  

        // Loop through orders to fetch product name from Products database
        for (const order of orders) {
          const orderDate = order.fields.date.timestampValue; // Assuming "date" is the field name

          // Format the order date to match today's format
          const formattedOrderDate = new Date(orderDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          // Check if the order date is today's date
          if (formattedOrderDate === today) {
            const productid = order.fields.productid.stringValue;
            const quantity = order.fields.quantity.integerValue;
            const totalprice = order.fields.totalprice.integerValue;
            saletotal += totalprice;

            // Fetch product details from Products database
            const productResponse = await axios.get(
              `https://firestore.googleapis.com/v1/projects/abhiram-store/databases/(default)/documents/Products/${productid}`
            );
            const productData = productResponse.data.fields;

            const productname = productData.productname.stringValue; // Fetch product name

            sales.push({
              orderid: order.name.split('/').pop(),
              productname,
              quantity,
              totalprice,
            });
          }
        }

        setSalesData(sales);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  // Calculate the total sales amount
  const totalSalesAmount = salesData.reduce((total, sale) => parseInt(total) + parseInt(sale.totalprice), 0);

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
              <th>TotalAmount</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((sale) => (
              <tr key={sale.orderid}>
                <td>{sale.orderid}</td>
                <td>{sale.productname}</td>
                <td>{sale.quantity}</td>
                <td>${sale.totalprice}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3">Total Sales Amount:</td>
              <td>${totalSalesAmount}</td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
};

export default DailySalesReport;
