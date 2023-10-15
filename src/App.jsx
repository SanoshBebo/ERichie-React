import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//=========================================================Sanoshs imports============================================================================//
import CosmicMediaGadgets from "./SanoshProject/pages/CosmicMediaGadgets";
import ProductDetailsPage from "./SanoshProject/pages/ProductDetailsPage";
import CartPage from "./ERichie/CartPage";
import AdminPage from "./SanoshProject/pages/AdminPage";
import NoPage from "./SanoshProject/pages/NoPage";
import CustomerLoginRegister from "./ERichie/CustomerLoginRegister";
import AdminLoginRegister from "./ERichie/AdminLoginRegister";
import IndividualShopReport from "./SanoshProject/pages/IndividualShopReport";
import Layout from "./SanoshProject/components/Layout";
import AdminLayout from "./SanoshProject/components/AdminLayout";
//=========================================================Sanoshs imports============================================================================//

//=========================================================vishals imports============================================================================//
import { useDispatch } from "react-redux";
import ShopThreeLayout from "./VishalProject/components/shopThreeLayout";
import VishalMediaShop from "./VishalProject/pages/VishalMediaShop";
import ProductPage from "./VishalProject/pages/ProductPage";
import AddProductForm from "./VishalProject/pages/AddProduct";
import { fetchProducts } from "./VishalProject/API/ApiConnections";
import { setShopThreeProducts } from "./SanoshProject/redux/shopThreeProductSlice";
import TablePage from "./VishalProject/pages/TablePage";
//=========================================================vishals imports============================================================================//

//=========================================================Akshayas imports============================================================================//
import AkshayaAdminPage from "./AkshayaProject/AkshayaAdminPage";
import AkshayaIndividualShopReport from "./AkshayaProject/Shop02_DailyInventory";
import AkshayaProductForm from "./AkshayaProject/ProductForm";

//=========================================================Akshayas imports============================================================================//

//=========================================================Suryas imports============================================================================//

import Home from "./SuryaProject/pages/home/Home";
import Dashboard from "./SuryaProject/pages/admin/dashboard/Dashboard";
import MyState from "./SuryaProject/context/data/myState";
import ProductInfo from "./SuryaProject/pages/productInfo/ProductInfo";
import AddProduct from "./SuryaProject/pages/admin/page/AddProduct";
import UpdateProduct from "./SuryaProject/pages/admin/page/UpdateProduct";
import Allproducts from "./SuryaProject/pages/allproducts/Allproducts";

//=========================================================Suryas imports============================================================================//

import ComputerTeamHomePage from "./pages/home";

//=========================================================Sanjays imports============================================================================//

import UserOperations from "./Shop-02/components/UserOperator";
import AdminOperations from "./Shop-02/components/AdminOperator";
import HomePage from "./Shop-02/components/HomePage";
import ProductList from "./Shop-02/components/ProductList";
import CheckoutPage from "./Shop-02/components/CheckOut";
import PaymentPage from "./Shop-02/components/Payment";
import SanjayAddProduct from "./Shop-02/pages/AddProduct";
import ViewProducts from "./Shop-02/pages/ProductList";

import StockReport from "./Shop-02/pages/Report";
import LiveReport from "./Shop-02/pages/LiveReport";
//=========================================================Sanjays imports============================================================================//

//=========================================================Sundaris imports============================================================================//
import ProductDetailPage from "./Shop-03/components/ProductDetail";
import AddProductShop03 from "./Shop-03/components/adminpage";
import UserPageShop03 from "./Shop-03/components/UserPage";
//=========================================================Sundaris imports============================================================================//

//=========================================================Abhirams imports============================================================================//
import AbhiramApp from "./Shop-05/Abhiram/src/App";
import AdminApp from "./Shop-05/Abhiram/admin/adminapp";
//=========================================================Abhirams imports============================================================================//

//=========================================================Harinis imports============================================================================//
import Shop01Home from "./Shop-01/pages/home/Home";
import Shop01Admin from "./Shop-01/pages/admin/Admin";
import Shop01AboutUs from "./Shop-01/pages/About/About";
import Shop01ProductDetail from "./Shop-01/Components/product/ProductDetail";
import IndividualShop17Report from "./Shop-01/pages/admin/shop17_dailyinventory";

//=========================================================Harinis imports============================================================================//

//=========================================================Dhanushiyas imports============================================================================//
import UserPage from "./Shop-04/components/UserPage";
import DhanushiyaAdminPage from "./Shop-04/components/AdminPage";
import ShopProductDetails from "./Shop-04/components/shopProductDetail";
import IndividualShop16Report from "./Shop-04/components/Shop16_Daily_Inventory";

//=========================================================Dhanushiyas imports============================================================================//

//=========================================================GaminggTeam imports============================================================================//
import RethuUserPage from "./rethu/src/components/UserPage";
import ProductDisplay1 from "./ERichie/ProductDisplay";
import ShoppingPage from "./thillai/pages/ShoppingPage";
import ProductDescPage from "./rethu/src/components/ProductDescPage";
import DeadEyeShopReport from "./rethu/src/components/shop05_dailyinventory";
import ProductDescriptionPage from "./thillai/pages/ProductDescription";
import IndividualShop07Report from "./thillai/components/admin-page/dashboard/shop07_dailyinventory";
import ThillaiAdminPage from "./thillai/pages/AdminPage";
import ProductList1 from "./thillai/components/admin-page/products/ProductList";
import LasyaProductList from "./lasya/my-react-vite-app/src/components/productlist/productlist";
import LasyaIndividualShopReport from "./lasya/my-react-vite-app/src/components/Shop06_DailyInventory";
import AddProduct1 from "./lasya/my-react-vite-app/src/components/addproduct/addproduct";
import RethuAddProduct from "./rethu/src/components/AdminPage";
import ProductDetail from "./lasya/my-react-vite-app/src/components/productlist/productdetail";
import UserPage1 from "./rethu/src/components/UserPage";

//=========================================================GaminggTeam imports============================================================================//
// ===================================================================SASHAANKIMPORT================================================================

import SashaankHome from "./SashaankProject/pages/home/Home";
import SashaankDashboard from "./SashaankProject/pages/admin/dashboard/Dashboard";
import ShankState from "./SashaankProject/context/data/shankState";
import SashaankProductInfo from "./SashaankProject/pages/productInfo/ProductInfo";
import SashaankAddProduct from "./SashaankProject/pages/admin/page/AddProduct";
import SashaankUpdateProduct from "./SashaankProject/pages/admin/page/UpdateProduct";
import SashaankAllproducts from "./SashaankProject/pages/allproducts/Allproducts";
import IndividualShop09Report from "./SashaankProject/pages/admin/page/Shop09_DailyInventory";

//================================================================SASHAANKIMPORT================================================================

//===============================================================MAHAIMPORTS===================================================================
import MahaAdminLayout from "./MahaProject/Adminlayout";
import CustomerApp from "./MahaProject/components/CustomerApp";
import DailyInventoryReport from "./MahaProject/DailyInventory"; // Import the DailyInventoryReport component
import DailySalesReport from "./MahaProject/DailySalesReport"; // Import the DailySalesReport component
import ProductFetch from "./MahaProject/components/ProductFetch";
//==============================================================MAHAIMPORTS====================================================================

//==============================================================SPRITYIMPORTS====================================================================
import SprityAddProducts from "./SprityProject/Add";
import SprityProductList from "./SprityProject/Display";
import Ecom from "./SprityProject/Commerce";
import Homee from "./SprityProject/home";
import SprityAdminDashboard from "./SprityProject/Table";
import SprityAdminHome from "./SprityProject/Adminhome";
import SprityProductDetail from "./SprityProject/ProductDetail";
//==============================================================SPRITYIMPORTS====================================================================
//==============================================================CHETNAIMPORTS====================================================================

import ChetnaHomePage from "./ChetnaProject//Pages/HomePage/HomePage";
import ChetnaAdminpage from "./ChetnaProject/Pages/HomePage/Admin-page";
import ChetnaProductDetailsPage from "./ChetnaProject/component/layout/productlisting/Productdetailspopup";
import TrandingPages from "./ChetnaProject/component/layout/productlisting/TrandingPages";
import MobileCategory from "./ERichie/MobileCategory";

//==============================================================CHETNAIMPORTS====================================================================

import MediaCategory from "./ERichie/MediaCategory";
import MainHomePage from "./ERichie/MainHomePage";
import ERichieLayout from "./ERichie/components/ERichieLayout";
import OrderHistory from "./ERichie/OrderHistory";
import OverallReport from "./ERichie/OverallReport";
import ProductDetails from "./AkshayaProject/ProductDetails";
import UserView from "./AkshayaProject/UserView";
import ReportPage from "./ChetnaProject/Pages/HomePage/ReportPage";
import SprityAdminReport from "./SprityProject/SprityAdminReport";
import SuryaAdminReport from "./SuryaProject/pages/admin/SuryaAdminReport";

const App = () => {
  return (
    <ShankState>
      <MyState>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <ERichieLayout>
                  <MainHomePage />
                </ERichieLayout>
              }
            />
            <Route
              path="/erichie"
              element={
                <ERichieLayout>
                  <MainHomePage />
                </ERichieLayout>
              }
            />
            <Route
              path="/order-history"
              element={
                <ERichieLayout>
                  <OrderHistory />
                </ERichieLayout>
              }
            />
            <Route
              path="/erichie/overall-report"
              element={
                <AdminLayout>
                  <OverallReport />
                </AdminLayout>
              }
            />
            <Route
              path="/MediaCategories"
              element={
                <ERichieLayout>
                  <MediaCategory />
                </ERichieLayout>
              }
            />
            <Route
              path="/shop01"
              element={
                <Layout>
                  <CosmicMediaGadgets />
                </Layout>
              }
            />
            <Route
              path="/shop01/product/:id"
              element={
                <Layout>
                  <ProductDetailsPage />
                </Layout>
              }
            />
            <Route
              path="/erichie/cart"
              element={
                <ERichieLayout>
                  <CartPage />
                </ERichieLayout>
              }
            />
            <Route
              path="/shop01/admin"
              element={
                <AdminLayout>
                  <AdminPage />
                </AdminLayout>
              }
            />
            <Route path="/customer/login" element={<CustomerLoginRegister />} />
            <Route path="/admin/login" element={<AdminLoginRegister />} />
            <Route
              path="/shop01/admin/reports"
              element={
                <AdminLayout>
                  <IndividualShopReport />
                </AdminLayout>
              }
            />
            <Route
              path="/shop03"
              element={
                <ShopThreeLayout>
                  <VishalMediaShop />
                </ShopThreeLayout>
              }
            />
            <Route
              path="/shop03/product/:id"
              element={
                <ShopThreeLayout>
                  <ProductPage />
                </ShopThreeLayout>
              }
            />
            <Route path="/shop03/admin" element={<AddProductForm />} />
            <Route path="/shop03/admin/overall-report" element={<OverallReport />} />
            <Route path="/shop03/tablepage" element={<TablePage />} />
            {/* // =========================================================askshayas code============================================================================// */}
            <Route path="/shop02" element={<UserView />} />
            <Route
              path="/shop02/product/:productId"
              element={<ProductDetails />}
            />
            <Route path="/shop02/admin" element={<AkshayaAdminPage />} />
            <Route path="/*" element={<NoPage />} />
            <Route
              path="/shop02/admin/report"
              element={<AkshayaIndividualShopReport />}
            />
            <Route
              path="/shop02/admin/add-product"
              element={<AkshayaProductForm />}
            />
            {/* // =========================================================Suryas code============================================================================// */}
            <Route path="/shop04" element={<Home />} />
            <Route path="/shop04/allproducts" element={<Allproducts />} />
            <Route path="/shop04/admin/dashboard" element={<Dashboard />} />
            <Route path="shop04/product/:id" element={<ProductInfo />} />
            <Route path="/shop04/admin/addproduct" element={<AddProduct />} />
            <Route
              path="/shop04/admin/updateproduct"
              element={<UpdateProduct />}
            />
            <Route
              path="/shop04/admin/shopreport"
              element={<SuryaAdminReport />}
            />
            {/* =========================================team computer============================================= */}
            <Route path="/computer" element={<ComputerTeamHomePage />} />
            <Route path="/shop15" element={<UserOperations />} />
            <Route path="/AdminAction" element={<AdminOperations />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/products/*" element={<ProductList />} />
            <Route path="/checkout/:productId" element={<CheckoutPage />} />
            <Route path="/AdminAction/add" element={<SanjayAddProduct />} />
            <Route path="/AdminAction/view" element={<ViewProducts />} />
            <Route path="/AdminAction/report" element={<StockReport />} />
            <Route path="/AdminAction/livereport" element={<LiveReport />} />
            <Route path="/shop14/admin" element={<AddProductShop03 />} />
            <Route path="/shop14" element={<UserPageShop03 />} />
            <Route
              path="/shop14/products/:productId"
              element={<ProductDetailPage />}
            />{" "}
            {/* Add this route */}
            <Route path="/shop17/*" element={<Shop01Home />} />
            <Route path="/shop17/admin" element={<Shop01Admin />} />
            <Route
              path="/products/:documentId"
              element={<Shop01ProductDetail />}
            />
            <Route
              path="/shop17/admin/report"
              element={<IndividualShop17Report />}
            />
            <Route path="/Shop16/User" element={<UserPage />}></Route>
            <Route path="/Shop16/Admin" element={<DhanushiyaAdminPage />} />
            <Route
              path="/Shop16/Daily_Inventoryreport"
              element={<IndividualShop16Report />}
            />
            <Route
              path="/shop4products/:productId"
              element={<ShopProductDetails />}
            />
            <Route path="/shop13/*" element={<AbhiramApp />} />
            <Route path="/shop13/abhiramadmin" element={<AdminApp />} />
            {/* =========================================team computer============================================= */}
            {/* =========================================gaming computer============================================= */}
            <Route path="/gaming" element={<ProductDisplay1 />} />
            <Route path="/shop05" element={<UserPage1 />} />
            <Route path="/shop05/admin" element={<RethuAddProduct />} />
            <Route path="/shop05/admin/overall-report" element={<OverallReport />} />
            <Route
              path="/shop05/admin/Dead_eye_Inventory"
              element={<DeadEyeShopReport />}
            />
            <Route path="/shop07" element={<ShoppingPage />} />
            <Route path="/shop07/admin" element={<ThillaiAdminPage />} />
            <Route
              path="/shop07/admin-page/products"
              element={<ProductList1 />}
            />
            <Route
              path="/shop07/product/:productId"
              element={<ProductDescriptionPage />}
            />
            <Route
              path="/shop07/admin-page"
              element={<IndividualShop07Report />}
            />
            <Route
              path="/shop07/admin-page/overall-report"
              element={<OverallReport />}
            />
            <Route path="/shop06" element={<LasyaProductList />} />
            <Route
              path="/shop06/admin/report"
              element={<LasyaIndividualShopReport />}
            />
            <Route
              path="/shop06/admin/overall-report"
              element={<OverallReport />}
            />
            <Route
              path="/shop06/product/:productId"
              element={<ProductDetail />}
            />
            <Route path="/shop06/admin" element={<AddProduct1 />} />
            <Route
              path="/shop05/product/:productId"
              element={<ProductDescPage />}
            />
            {/* =========================================gaming computer============================================= */}
            <Route path="/mobiles" element={<MobileCategory />} />
            {/* =================================================================CHETNACODE========================================================== */}
            <Route path="/shop11" element={<ChetnaHomePage />} />
            <Route path="/shop11/Adminpage" element={<ChetnaAdminpage />} />
            <Route path="/shop11/admin/shop-report" element={<ReportPage />} />
            <Route
              path="/shop11/product/:id"
              element={<ChetnaProductDetailsPage />}
            />
            <Route path="/shop11/protectlist" element={<TrandingPages />} />
            <Route path="/shop11/admin/overall-report" element={<OverallReport />} />
            {/* ===============================================================MAHACODE===================================================================           */}
            <Route path="/shop12/admin" element={<MahaAdminLayout />} />
            <Route path="/shop12/customer" element={<CustomerApp />} />
            <Route
              path="/shop12/daily-inventory"
              element={<DailyInventoryReport />}
            />
            <Route path="/shop12/daily-sales" element={<DailySalesReport />} />
            <Route path="/shop12/product/:id" element={<ProductFetch />} />
            {/* ================================================================SPRITYCODE====================================================================           */}
            <Route path="/shop10/com" element={<Ecom />} />
            <Route
              path="/shop10/product/:productId"
              element={<SprityProductDetail />}
            />
            <Route path="/shop10/add" element={<SprityAddProducts />} />
            <Route path="/shop10/display" element={<SprityProductList />} />
            <Route path="/shop10/home" element={<Homee />} />
            <Route path="/shop10/table" element={<SprityAdminDashboard />} />
            <Route path="/shop10/adminhome" element={<SprityAdminHome />} />
            <Route
              path="/shop10/admin/report"
              element={<SprityAdminReport />}
            />
            {/*================================================================SASHAANKCODE================================================================*/}
            <Route path="/shop09" element={<SashaankHome />} />
            <Route
              path="/shop09/allproducts"
              element={<SashaankAllproducts />}
            />
            <Route
              path="/shop09/admin/dashboard"
              element={<SashaankDashboard />}
            />
            <Route
              path="/shop09/product/:id"
              element={<SashaankProductInfo />}
            />
            <Route
              path="/shop09/admin/addproduct"
              element={<SashaankAddProduct />}
            />
            <Route
              path="/shop09/admin/updateproduct"
              element={<SashaankUpdateProduct />}
            />
            <Route
              path="/shop09/admin/order-details"
              element={<IndividualShop09Report />}
            />
            <Route
              path="/shop09/admin/overall-analytics"
              element={<OverallReport />}
            />
          </Routes>
          <ToastContainer />
        </Router>
      </MyState>
    </ShankState>
  );
};

export default App;
