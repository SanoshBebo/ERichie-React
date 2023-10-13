import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getSalesByCategory } from "../Api/SalesReportFunctionalities";

const OverallReport = () => {
  const [salesByCategory, setSalesByCategory] = useState([]);

  useEffect(() => {
    const getSalesByCategoryFunction = async () => {
      try {
        const sales = await getSalesByCategory();
        setSalesByCategory(sales);
      } catch (err) {
        console.error("Sales Report Could Not Be Retrieved");
      }
    };
    getSalesByCategoryFunction();
  }, []);

  return <div>OverallReport</div>;
};

export default OverallReport;
