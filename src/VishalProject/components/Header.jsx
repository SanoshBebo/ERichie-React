import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const headerStyle = {
    backgroundColor: "pink",
    color: "black",
    padding: "3rem", // You can adjust the padding as needed
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  return (
    <div style={headerStyle}>
      <div className="text-5xl font-bold">Vishal Media Shop</div>
      <div>
        <ul className="flex space-x-5">
      
          <li className="cursor-pointer hover:underline">
            <Link to="/shop03">Products</Link>
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
