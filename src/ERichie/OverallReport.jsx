import React, { useEffect, useState } from "react";
import { getSalesByCategory } from "../Api/SalesReportFunctionalities";
import { PieChart } from "@mui/x-charts/PieChart";

const OverallReport = () => {
  const [shopSales, setShopSales] = useState({});
  const [pieData, setPieData] = useState({});
  const [topSellingMediaProducts, setTopSellingMediaProducts] = useState([]);
  const [bottomSellingMediaProducts, setBottomSellingMediaProducts] = useState(
    []
  );
  const [topSellingMobileProducts, setTopSellingMobileProducts] = useState([]);
  const [bottomSellingMobileProducts, setBottomSellingMobileProducts] =
    useState([]);
  const [topSellingGamingProducts, setTopSellingGamingProducts] = useState([]);
  const [bottomSellingGamingProducts, setBottomSellingGamingProducts] =
    useState([]);
  const [topSellingComputerProducts, setTopSellingComputerProducts] = useState(
    []
  );
  const [bottomSellingComputerProducts, setBottomSellingComputerProducts] =
    useState([]);

  useEffect(() => {
    const getSalesByCategoryFunction = async () => {
      try {
        const {
          shopSales,
          topSellingMediaProducts,
          bottomSellingMediaProducts,
          topSellingMobileProducts,
          bottomSellingMobileProducts,
          topSellingGamingProducts,
          bottomSellingGamingProducts,
          topSellingComputerProducts,
          bottomSellingComputerProducts,
        } = await getSalesByCategory();
        console.log(
          shopSales,
          topSellingMediaProducts,
          bottomSellingMediaProducts,
          topSellingMobileProducts,
          bottomSellingMobileProducts,
          topSellingGamingProducts,
          bottomSellingGamingProducts,
          topSellingComputerProducts,
          bottomSellingComputerProducts
        );
        setShopSales(shopSales);
        setTopSellingMediaProducts(topSellingMediaProducts);
        setBottomSellingMediaProducts(bottomSellingMediaProducts);
        setTopSellingMobileProducts(topSellingMobileProducts);
        setBottomSellingMobileProducts(bottomSellingMobileProducts);
        setTopSellingGamingProducts(topSellingGamingProducts);
        setBottomSellingGamingProducts(bottomSellingGamingProducts);
        setTopSellingComputerProducts(topSellingComputerProducts);
        setBottomSellingComputerProducts(bottomSellingComputerProducts);
      } catch (err) {
        console.error("Sales Report Could Not Be Retrieved", err);
      }
    };

    getSalesByCategoryFunction();
  }, []);

  // Render your component with the updated state variables
  return <div>hello</div>;
};

export default OverallReport;
