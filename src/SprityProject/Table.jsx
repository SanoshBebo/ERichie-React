import React, { useState, useEffect } from 'react';
 
const AdminDashboard = () => {
  const [productsData, setProductsData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(''); 

  // Function to fetch data from Firestore 
  const fetchData = async () => {
    try {
      // Fetch products data
      const productsResponse = await fetch(
        'https://firestore.googleapis.com/v1/projects/lemontech-67162/databases/(default)/documents/Productid?fields=documents.fields.productname,documents.fields.stock'
      );
      if (!productsResponse.ok) {
        throw new Error('Failed to fetch products data');
      }
      const productsJson = await productsResponse.json();
      console.log('Products Data:', productsJson); // Check product data 
      setProductsData(productsJson.documents);

      // Fetch orders data
      const ordersResponse = await fetch(
        'https://firestore.googleapis.com/v1/projects/lemontech-67162/databases/(default)/documents/orders?fields=documents.fields.quantity,documents.fields.total_price,documents.fields.date'
      );
      if (!ordersResponse.ok) {
        throw new Error('Failed to fetch orders data');
      }
      const ordersJson = await ordersResponse.json();
      console.log('Orders Data:', ordersJson);
      setOrdersData(ordersJson.documents);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Run fetchData when the component mounts

  return (
    <div>
      {/* Date selection */}
      <input
        type="text"
        placeholder="Select date (MM/YYYY)"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {/* Table to display data */}
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Opening Stock</th>
            <th>Stock Now</th>
            <th>Cashflow</th>
          </tr>
        </thead>
        <tbody>
          {/* Map over productsData and calculate opening stock, stock now, and cashflow */}
          {productsData.map((product) => {
            const productName = product.fields.productname.stringValue;
            const stock = product.fields.stock.integerValue;

            // Filter ordersData by selectedDate
            const filteredOrders = ordersData.filter(
              (order) => order.fields.date.stringValue === selectedDate
            );

            // Calculate opening stock, stock now, and cashflow
            let openingStock = stock;
            let cashflow = 0;
            filteredOrders.forEach((order) => {
              const quantity = order.fields.quantity.integerValue;
              const totalPrice = order.fields.total_price.integerValue;
              openingStock += quantity;
              cashflow += totalPrice;
            });

            return (
              <tr key={productName}>
                <td>{productName}</td>
                <td>{openingStock}</td>
                <td>{stock}</td>
                <td>{cashflow}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
