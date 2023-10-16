import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import FetchItemsInCart from "../../ERichie/components/FetchItemsInCart";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { itemsInCart } = FetchItemsInCart();

  // Function to toggle the mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/customer/login");
  };

  return (
    <div className="bg-black text-white p-4">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/shop01">Cosmic Media Gadgets</Link>
        </div>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white hover:text-gray-300 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
        <div className="hidden md:block">
          <ul className="flex space-x-5">
            <li>
              <Link
                to="/erichie/cart"
                className="flex items-center gap-2 hover:underline"
              >
                <ShoppingCart />
                <p className="bg-white text-black rounded-full h-6 w-6 text-center ">
                  {itemsInCart}
                </p>
              </Link>
            </li>
            <li className="cursor-pointer hover:underline">
              <Link to="/shop01">Products</Link>
            </li>
            <li className="cursor-pointer hover:underline">
              <Link to="/erichie">Home</Link>
            </li>
            <li className="cursor-pointer hover:underline">
              <Link to="/MediaCategories">Media</Link>
            </li>

            <li
              className="cursor-pointer hover:underline"
              onClick={handleSignOut}
            >
              Sign Out
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2">
          <ul className="flex flex-col space-y-2">
            <li>
              <Link
                to="/cart"
                className="flex items-center gap-2 hover:underline"
              >
                <ShoppingCart />
                <p className="bg-white text-black rounded-full h-6 w-6 text-center ">
                  {itemsInCart}
                </p>
              </Link>
            </li>
            <li className="cursor-pointer hover:underline">
              <Link to="/">Products</Link>
            </li>
            <li className="cursor-pointer hover:underline">About Us</li>
            <li className="cursor-pointer hover:underline">Contact</li>
            <li className="cursor-pointer hover:underline">Sign Out</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
