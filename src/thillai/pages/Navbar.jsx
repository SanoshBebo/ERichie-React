import React, { useState } from "react";

import { Link } from "react-router-dom";
import FetchItemsInCart from "../../ERichie/components/FetchItemsInCart";
import { useSelector } from "react-redux";

const NavBar = ({ handleSearch }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const itemsInCart = useSelector((state) => state.shoponecart.itemsInCart);

  const items = FetchItemsInCart();

  return (
    <header className="navbar-t bg-gray-800 text-white p-4">
      <div className="navbar-content-t container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          <Link to="/gaming" className="text-white">
            Gamers Gold Mine
          </Link>
        </h1>

        <ul className="menu-t flex space-x-4">
          <li>
            <Link to="/erichie/cart" className="flex items-center">
              <span role="img" aria-label="Cart" className="text-2xl">
                🛒
               
            <p className="bg-white text-black rounded-full h-6 w-6 text-center ">
              {itemsInCart}
            </p>
              </span>
            </Link>
          </li>

          <li>
            <Link to="/erichie">Erichie</Link>
          </li>

          <li>
            <Link to="/customer/login">Sign Out</Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default NavBar;
