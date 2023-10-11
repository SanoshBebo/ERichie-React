import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Nav from '../navigation/navbar';


function ReportGenerator() {
  // Simulated data for available stock and sold products
  const availableStockData = [
    { productName: 'Product A', stock: 50 },
    { productName: 'Product B', stock: 30 },
  ];
  const soldTodayData = [
    { productName: 'Product A', sold: 10 },
    { productName: 'Product B', sold: 5 },
  ];

  // Extract stock values from availableStockData
  const availableStockValues = availableStockData.map((product) => product.stock);

  // Extract sold values from soldTodayData
  const soldTodayValues = soldTodayData.map((product) => product.sold);

  // Calculate remaining stock
  const remainingStock = availableStockValues.reduce((acc, stock) => acc + stock, 0) - soldTodayValues.reduce((acc, sold) => acc + sold, 0);

  // Create chart data
  const chartData = {
    labels: ['Available Stock', 'Remaining Stock', 'Sold Today'],
    datasets: [
      {
        data: [availableStockValues.reduce((acc, stock) => acc + stock, 0), remainingStock, soldTodayValues.reduce((acc, sold) => acc + sold, 0)],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  // Function to download the report as a PDF
  const downloadPDF = () => {
    const input = document.getElementById('pdf-content');

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const pdfWidth = 210;
      const pdfHeight = 297;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('report.pdf');
    });
  };

  return (
    <>
        <Nav/>
    <div>
      <div id="pdf-content">
        {/* Render Pie Charts */}
        <div>
          <h2>Available Stock vs. Remaining Stock vs. Sold Today</h2>
          <Pie data={chartData} />
        </div>
        {/* Add more content if needed */}
      </div>

      {/* Add PDF download button */}
      <button onClick={downloadPDF}>Download Report as PDF</button>
    </div>
    </>
  );
}

export default ReportGenerator;
