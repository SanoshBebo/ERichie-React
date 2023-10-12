// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { format } from 'date-fns';
// import { getOrderByDateFromFireStore } from './getorderdetails';

// const Dailyinventory = () => {
//   const [productdata, setProductData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [todayDate, setTodayDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [inventoryData, setInventoryData] = useState([]);

//   useEffect(() => {
//     // Fetch product data
//     axios
//       .get('https://firestore.googleapis.com/v1/projects/crud-550f3/databases/(default)/documents/Products')
//       .then((productResponse) => {
//         const products = productResponse.data.documents.map((doc) => {
//           const fields = doc.fields;
//           return {
//             id: doc.name.split('/').pop(),
//             productName: fields.productname.stringValue,
//             currentStock: fields.stock.integerValue,
//           };
//         });
//         setProductData(products);
//       })
//       .catch((error) => {
//         console.error('Error fetching product data:', error);
//         setLoading(false);
//       });

//     // Fetch today's orders and calculate inventory data
//     getOrderByDateFromFireStore()
//       .then((todaysOrders) => {
//         const todaySalesMap = {};

//         todaysOrders.forEach((sale) => {
//           if (!todaySalesMap[sale.productid]) {
//             todaySalesMap[sale.productid] = 0;
//           }
//           todaySalesMap[sale.productid] += sale.quantity;
//         });

//         const inventoryData = productdata.map((product) => {
//           const todaysSales = todaySalesMap[product.id] || 0;
//           const openingStock = parseInt(product.currentStock) + parseInt(todaysSales);
//           const currentStock = openingStock - todaysSales;
//           return {
//             ...product,
//             todaysSales,
//             openingStock,
//             currentStock,
//           };
//         });

//         setInventoryData(inventoryData);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching product data:', error);
//       });
//   }, [productdata]);

//   return (
//     <section className="daily">
//       <div className="container mt-5">
//         <h2 className="text-center mb-4">Daily Inventory Report</h2>
//         <p className="text-center">Date: {todayDate}</p>
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <table className="table table-bordered">
//             <thead>
//               <tr>
//                 <th className="text-center">Product Name</th>
//                 <th className="text-center">Opening Stock</th>
//                 <th className="text-center">Today's Sales</th>
//                 <th className="text-center">Current Stock</th>
//               </tr>
//             </thead>
//             <tbody>
//               {inventoryData.map((product) => (
//                 <tr key={product.id}>
//                   <td className="text-center">{product.productName}</td>
//                   <td className="text-center">{product.openingStock}</td>
//                   <td className="text-center">{product.todaysSales}</td>
//                   <td className="text-center">{product.currentStock}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </section>
//   );
// };

// export default Dailyinventory;


// 

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { format } from 'date-fns';
// import { getOrderByDateFromFireStore } from './getorderdetails'; // Import the function
// // import '../styles/dailysales.css';

// const DailyReports = () => {
//   const [salesData, setSalesData] = useState([]);
//   const [loadingSales, setLoadingSales] = useState(true);
//   const [inventoryData, setInventoryData] = useState([]);
//   const [loadingInventory, setLoadingInventory] = useState(true);
//   const [totalSalesAmount, setTotalSalesAmount] = useState(0);
//   const todayDate = format(new Date(), 'yyyy-MM-dd');

//   useEffect(() => {
//     const fetchData = async () => {
//       // Fetch sales data for the current date using getOrderByDateFromFireStore
//       try {
//         const todaysOrders = await getOrderByDateFromFireStore();
//         const sales = todaysOrders.map((order) => {
//           const totalPrice = order.totalprice;
//           setTotalSalesAmount((prevTotal) => prevTotal + totalPrice);

//           return {
//             orderid: order.orderid,
//             productname: order.productname,
//             quantity: order.quantity,
//             totalprice: totalPrice,
//           };
//         });

//         setSalesData(sales);
//         setLoadingSales(false);
//       } catch (error) {
//         console.error('Error fetching sales data:', error);
//         setLoadingSales(false);
//       }

//       // Fetch product data
//       try {
//         const productResponse = await axios.get(
//           'https://firestore.googleapis.com/v1/projects/crud-550f3/databases/(default)/documents/Products'
//         );
//         const products = productResponse.data.documents.map((doc) => {
//           const fields = doc.fields;
//           return {
//             id: doc.name.split('/').pop(),
//             productName: fields.productname.stringValue,
//             currentStock: fields.stock.integerValue,
//           };
//         });
//         setInventoryData(products);
//         setLoadingInventory(false);
//       } catch (error) {
//         console.error('Error fetching product data:', error);
//         setLoadingInventory(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="container">
//       <h2 className="mt-4">Daily Reports</h2>
//       <p>Date: {todayDate}</p>
//       {loadingSales || loadingInventory ? (
//         <p>Loading...</p>
//       ) : (
//         <>
//           <h3>Daily Sales Report</h3>
//           <table className="table table-bordered mt-4">
//             <thead className="thead-dark">
//               <tr>
//                 <th>Order ID</th>
//                 <th>Product Name</th>
//                 <th>Quantity</th>
//                 <th>Total Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {salesData.map((sale, index) => (
//                 <tr key={index}>
//                   <td>{sale.orderid}</td>
//                   <td>{sale.productname}</td>
//                   <td>{sale.quantity}</td>
//                   <td>Rs. {sale.totalprice}</td>
//                 </tr>
//               ))}
//             </tbody>
//             <tfoot>
//               <tr>
//                 <td colSpan="3">Total Sales Amount:</td>
//                 <td>Rs. {totalSalesAmount}</td>
//               </tr>
//             </tfoot>
//           </table>

//           <h3>Daily Inventory Report</h3>
//           <table className="table table-bordered mt-4">
//             <thead className="thead-dark">
//               <tr>
//                 <th>Product Name</th>
//                 <th>Current Stock</th>
//               </tr>
//             </thead>
//             <tbody>
//               {inventoryData.map((product) => (
//                 <tr key={product.id}>
//                   <td>{product.productName}</td>
//                   <td>{product.currentStock}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}
//     </div>
//   );
// };

// export default DailyReports;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { getOrderByDateFromFireStore } from './getorderdetails'; // Import the function
import "./styles.css";

const DailyReports = () => {
  const [salesData, setSalesData] = useState([]);
  const [loadingSales, setLoadingSales] = useState(true);
  const [inventoryData, setInventoryData] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(true);
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const todayDate = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    const fetchData = async () => {
      // Fetch sales data for the current date using getOrderByDateFromFireStore
      try {
        const todaysOrders = await getOrderByDateFromFireStore();
        const sales = todaysOrders.map((order) => {
          const totalPrice = order.totalprice;
          setTotalSalesAmount((prevTotal) => prevTotal + totalPrice);

          return {
            orderid: order.orderid,
            productname: order.productname,
            quantity: order.quantity,
            totalprice: totalPrice,
          };
        });

        setSalesData(sales);
        setLoadingSales(false);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setLoadingSales(false);
      }

      // Fetch product data
      try {
        const productResponse = await axios.get(
          'https://firestore.googleapis.com/v1/projects/crud-550f3/databases/(default)/documents/Products'
        );
        const products = productResponse.data.documents.map((doc) => {
          const fields = doc.fields;
          return {
            id: doc.name.split('/').pop(),
            productName: fields.productname.stringValue,
            currentStock: fields.stock.integerValue,
          };
        });
        setInventoryData(products);
        setLoadingInventory(false);
      } catch (error) {
        console.error('Error fetching product data:', error);
        setLoadingInventory(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h2 className="shop17-title">Mr.Computer Wizz Daily Reports</h2>
      <p className="shop17-date">Date: {todayDate}</p>
      {loadingSales || loadingInventory ? (
        <p>Loading...</p>
      ) : (
        <>
          <h3 className="shop17-subtitle">Daily Sales Report</h3>
          <table className="shop17-table shop17-sales-table">
            <thead className="shop17-table-head">
              <tr>
                <th className="shop17-table-header">Order ID</th>
                <th className="shop17-table-header">Product Name</th>
                <th className="shop17-table-header">Quantity</th>
                <th className="shop17-table-header">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((sale, index) => (
                <tr key={index}>
                  <td className="shop17-table-data">{sale.orderid}</td>
                  <td className="shop17-table-data">{sale.productname}</td>
                  <td className="shop17-table-data">{sale.quantity}</td>
                  <td className="shop17-table-data">Rs. {sale.totalprice}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="shop17-table-footer">
                  Total Sales Amount:
                </td>
                <td className="shop17-table-footer">Rs. {totalSalesAmount}</td>
              </tr>
            </tfoot>
          </table>

          <h3 className="shop17-subtitle">Daily Inventory Report</h3>
          <table className="shop17-table shop17-inventory-table">
            <thead className="shop17-table-head">
              <tr>
                <th className="shop17-table-header">Product Name</th>
                <th className="shop17-table-header">Current Stock</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((product) => (
                <tr key={product.id}>
                  <td className="shop17-table-data">{product.productName}</td>
                  <td className="shop17-table-data">{product.currentStock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default DailyReports;
