// Layout.js
import React from "react";
import ERichieHeader from "./ERichieHeader";
import ERichieFooter from "./ERichieFooter";
import CHAT from "../../ERichie/chat2";
const Layout = ({ children }) => {
  return (
    <>
      <ERichieHeader />
      {children}
      <ERichieFooter />

      <CHAT></CHAT>
    </>
  );
};

export default Layout;
