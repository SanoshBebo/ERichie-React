import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { getOrderByDateFromFireStore } from './getorderdetails';

const Dailyinventory = () => {
  const [productdata, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayDate, setTodayDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    // Fetch product data
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

    // Fetch today's orders and calculate inventory data
    getOrderByDateFromFireStore()
      .then((todaysOrders) => {
        const todaySalesMap = {};

        todaysOrders.forEach((sale) => {
          if (!todaySalesMap[sale.productid]) {
            todaySalesMap[sale.productid] = 0;
          }
          todaySalesMap[sale.productid] += sale.quantity;
        });

        const inventoryData = productdata.map((product) => {
          const todaysSales = todaySalesMap[product.id] || 0;
          const openingStock = parseInt(product.currentStock) + parseInt(todaysSales);
          const currentStock = openingStock - todaysSales;
          return {
            ...product,
            todaysSales,
            openingStock,
            currentStock,
          };
        });

        setInventoryData(inventoryData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching product data:', error);
      });
  }, [productdata]);

  return (
    <section className="daily">
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
  );
};

export default Dailyinventory;
