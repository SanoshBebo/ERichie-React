import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UserView from "./UserView";
import ProductDetails from "./ProductDetails";

export const AkshayaUserPage = () => (
  <div>
    <Routes>
      <Route path="*" element={<UserView />} />

      <Route path="/product/:productId" element={<ProductDetails />} />
    </Routes>
  </div>
);
