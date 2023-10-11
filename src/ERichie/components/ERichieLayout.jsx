// Layout.js
import React from "react";
import ERichieHeader from "./ERichieHeader";
import ERichieFooter from "./ERichieFooter";

const Layout = ({ children }) => {
  return (
    <>
      <ERichieHeader />
      {children}
      <ERichieFooter />
    </>
  );
};

export default Layout;
