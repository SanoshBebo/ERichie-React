import React from "react";

import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const headerStyle = {
    backgroundColor: "pink",

    color: "black",

    padding: "3rem", // You can adjust the padding as needed

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",
  };
  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/customer/login");
  };
  return (
    <div style={headerStyle}>
      <div className="text-5xl font-bold">Vishal Media Shop</div>

      <div>
        <ul className="flex space-x-5">
          <li className="cursor-pointer hover:underline">
            <Link to="/erichie/cart">Cart</Link>
          </li>

          <li className="cursor-pointer hover:underline">
            <Link to="/shop03">Visit shop</Link>
          </li>

          <li className="cursor-pointer hover:underline">
            <Link to="/mediacategories">Products</Link>
          </li>
          <li className="cursor-pointer hover:underline">
            <Link to="/erichie">Mainpage</Link>
          </li>
          <li
            className="cursor-pointer hover:underline"
            onClick={handleSignOut}
          >
            Sign Out
          </li>

          <button>
            <a href="mailto:rvishal21062002@gmail.com">Contact us</a>
          </button>
        </ul>
      </div>
    </div>
  );
};

export default Header;
