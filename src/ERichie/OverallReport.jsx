import React, { useEffect, useState } from "react";
import { getSalesByCategory } from "../Api/SalesReportFunctionalities";
import { Box, CircularProgress } from "@mui/material";
import LoaderComponent from "./components/LoaderComponent";
import ShopSalesBarChart from "./components/ShopSalesTable";
import ProductCardTopAndBottom from "./components/ProductCardTopAndBottom";

const OverallReport = () => {
  const [shopSalesData, setShopSalesData] = useState({});
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
  const [isDataLoaded, setIsDataLoaded] = useState(false);

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
        const restructuredData = Object.entries(shopSales).map(
          ([shop, sales]) => ({
            shop,
            sales,
          })
        );
        console.log(restructuredData);

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
        setShopSalesData(restructuredData);
        setTopSellingMediaProducts(topSellingMediaProducts);
        setBottomSellingMediaProducts(bottomSellingMediaProducts);
        setTopSellingMobileProducts(topSellingMobileProducts);
        setBottomSellingMobileProducts(bottomSellingMobileProducts);
        setTopSellingGamingProducts(topSellingGamingProducts);
        setBottomSellingGamingProducts(bottomSellingGamingProducts);
        setTopSellingComputerProducts(topSellingComputerProducts);
        setBottomSellingComputerProducts(bottomSellingComputerProducts);
        setIsDataLoaded(true);
      } catch (err) {
        console.error("Sales Report Could Not Be Retrieved", err);
      }
    };

    getSalesByCategoryFunction();
  }, []);

  // Render your component with the updated state variables
  return (
    <div className="min-h-screen">
      {isDataLoaded ? (
        <div>
          <ShopSalesBarChart shopSalesData={shopSalesData} />

          <ProductCardTopAndBottom
            topProducts={topSellingMediaProducts}
            bottomProducts={bottomSellingMediaProducts}
            title="Media Products"
          />
          <ProductCardTopAndBottom
            topProducts={topSellingComputerProducts}
            bottomProducts={bottomSellingComputerProducts}
            title="Computer Products"
          />
          <ProductCardTopAndBottom
            topProducts={topSellingMobileProducts}
            bottomProducts={bottomSellingMobileProducts}
            title="Mobile Products"
          />
          <ProductCardTopAndBottom
            topProducts={topSellingGamingProducts}
            bottomProducts={bottomSellingGamingProducts}
            title="Gaming Products"
          />
        </div>
      ) : (
        <LoaderComponent />
      )}
    </div>
  );
};

export default OverallReport;
