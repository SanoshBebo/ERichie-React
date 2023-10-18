import React, { useEffect, useState } from 'react';

import axios from 'axios';

import jsPDF from 'jspdf';

import 'jspdf-autotable';

import Nav from '../navigation/navbar';

import './CSS/report.css';

 

const StockReport = () => {

  const [stockData, setStockData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

 

  useEffect(() => {

    axios

      .get(

        'https://firestore.googleapis.com/v1/projects/adminstore-196a7/databases/(default)/documents/Products'

      )

      .then((response) => {

        const productsData = response.data.documents.map((doc) => {

          const data = doc.fields;

 

          // Ensure data fields are present and of the expected type

          const productName = data.productname && data.productname.stringValue ? data.productname.stringValue : 'N/A';

          const stock = data.stock ? (data.stock.integerValue ? data.stock.integerValue : 0) : 0;

          const price = data.price ? (data.price.integerValue ? data.price.integerValue : 0) : 0;

 

          const result = {

            id: doc.name.split('/').pop(),

            productName,

            stock,

            price,

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

    const headers = [['ID', 'Product Name', 'Quantity', 'Price']];

 

    const rows = stockData.map((item) => [

      item.id,

      item.productName,

      item.stock,

      item.price,

    ]);

   

   

 

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

      <Nav />

      <div className="shop15sanjay-container">

        <h2 className="shop15sanjay-heading">Stock Report</h2>

        <button className="shop15sanjay-button" onClick={handleDownloadPdfClick}>

          Download PDF

        </button>

        <table className="shop15sanjay-table">

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

                <td>${item.price}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </>

  );

};

 

export default StockReport;