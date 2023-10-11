import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import jspdf-autotable
import Nav from '../navigation/navbar';

const StockReport = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch stock data from Firestore
    axios
      .get(
        'https://firestore.googleapis.com/v1/projects/adminstore-196a7/databases/(default)/documents/products'
      )
      .then((response) => {
        const productsData = response.data.documents.map((doc) => {
          const data = doc.fields;
          const result = {
            id: doc.name.split('/').pop(),
            productName: data.name.stringValue,
            stock: data.stock ? data.stock.doubleValue : 0,
            price: data.price.doubleValue,
          };
          return result;
        });

        setStockData(productsData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const handleDownloadPdfClick = () => {
    const doc = new jsPDF();

    // Define column headers
    const headers = [['ID', 'Product Name', 'Quantity', 'Price']];

    // Define rows
    const rows = stockData.map((item) => [item.id, item.productName, item.stock, `$${item.price.toFixed(2)}`]);

    // Add content to the PDF using jspdf-autotable
    doc.autoTable({
      head: headers,
      body: rows,
    });

    const pdfFileName = 'stock_report.pdf';

    doc.save(pdfFileName);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
        <Nav/>
    <div>
      <h2>Stock Report</h2>
      <button onClick={handleDownloadPdfClick}>Download PDF</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {stockData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.productName}</td>
              <td>{item.stock}</td>
              <td>${item.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default StockReport;
