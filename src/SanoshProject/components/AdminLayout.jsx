// Layout.js
import React from "react";
import Footer from "./Footer";
import AdminHeader from "./AdminHeader";

const AdminLayout = ({ children }) => {
  return (
    <>
      <AdminHeader />
      {children}
      <Footer />
    </>
  );
};

export default AdminLayout;
