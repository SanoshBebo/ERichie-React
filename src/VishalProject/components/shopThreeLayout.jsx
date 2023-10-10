// Layout.js
import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const shopThreeLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default shopThreeLayout;
