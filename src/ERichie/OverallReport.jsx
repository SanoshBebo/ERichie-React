import React, { useEffect, useState } from "react";
import { getSalesByCategory } from "../Api/SalesReportFunctionalities";
import { Box, CircularProgress } from "@mui/material";
import LoaderComponent from "./components/LoaderComponent";
import ShopSalesBarChart from "./components/ShopSalesTable";
import ProductCardTopAndBottom from "./components/ProductCardTopAndBottom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setUser } from "../SanoshProject/redux/shopOneUserSlice";

const OverallReport = () => {
  const [shopSalesData, setShopSalesData] = useState({});
  const user = useSelector((state) => state.shoponeuser.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [bottomSellingComputerProducts, setBottomSellingComputerProducts] =
    useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if ((!isLoadingUser && user.length === 0) || user.role == "customer") {
      navigate("/admin/login");
    }
  }, [isLoadingUser, user, navigate]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      if (userData.role == "customer") {
        navigate("/admin/login");
      }
      dispatch(setUser(userData));
    }
    setIsLoadingUser(false);
  }, []);

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
