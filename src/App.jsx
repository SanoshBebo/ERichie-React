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
import { AkshayaUserPage } from "./AkshayaProject/AkshayaUserPage";
import { AkshayaAdminPage } from "./AkshayaProject/AkshayaAdminPage";

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

import MediaCategory from "./ERichie/MediaCategory";
import MainHomePage from "./ERichie/MainHomePage";
import ERichieLayout from "./ERichie/components/ERichieLayout";

const App = () => {
  //=========================================================vishals code============================================================================//
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProducts()
      .then((productsData) => {
        dispatch(setShopThreeProducts(productsData));
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, [dispatch]);
  // =========================================================vishals code============================================================================//

  return (
    <MyState>
      <Router>
        <Routes>
          <Route
            path="/erichie"
            element={
              <ERichieLayout>
                <MainHomePage />
              </ERichieLayout>
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
          <Route path="/shop03/tablepage" element={<TablePage />} />

          {/* // =========================================================askshayas code============================================================================// */}

          <Route path="/shop02/*" element={<AkshayaUserPage />} />
          <Route path="/shop02/admin/*" element={<AkshayaAdminPage />} />

          <Route path="/*" element={<NoPage />} />

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
        </Routes>
        <ToastContainer />
      </Router>
    </MyState>
  );
};

export default App;
