import React from "react";

import { Link, useNavigate } from "react-router-dom";
import FetchItemsInCart from "../../ERichie/components/FetchItemsInCart";
import { useSelector } from "react-redux";

const Header = () => {
  const navigate = useNavigate();
  const itemsInCart = useSelector((state)=>state.shoponecart.itemsInCart)

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
  const items = FetchItemsInCart();

  return (
    <div style={headerStyle}>
      <div className="text-5xl font-bold">Vishal Media Shop</div>

      <div>
        <ul className="flex space-x-5">
          <li className="cursor-pointer ">
            <Link to="/erichie/cart">🛒
            <p className="bg-white text-black rounded-full h-6 w-6 text-center ">
                  {itemsInCart}
                </p></Link>
          </li>

          <li className="cursor-pointer hover:underline">
            <Link to="/shop03">VisitShop</Link>
          </li>

          <li className="cursor-pointer hover:underline">
            <Link to="/mediacategories">MediaProducts</Link>
          </li>
          <li className="cursor-pointer hover:underline">
            <Link to="/erichie">MainPage</Link>
          </li>
          <li
            className="cursor-pointer hover:underline"
            onClick={handleSignOut}
          >
            SignOut
          </li>

          <button>
            <a href="mailto:rvishal21062002@gmail.com">ContactUs</a>
          </button>
        </ul>
      </div>
    </div>
  );
};

export default Header;
