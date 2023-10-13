import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const ERichieHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  // Function to toggle the mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/customer/login");
  };
  const handleSignIn = () => {
    navigate("/customer/login");
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setIsUserSignedIn(true);
    }
  }, []);

  return (
    <div className="bg-black text-white p-4">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/erichie">ERICHIE</Link>
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
                className="flex flex-col items-center gap-2 hover:underline"
              >
                <ShoppingCart />
              </Link>
            </li>
            <li className="cursor-pointer hover:underline">
              <Link to="/erichie">Home</Link>
            </li>
            <li className="cursor-pointer hover:underline">
              <Link to="/order-history">Orders</Link>
            </li>
            {isUserSignedIn ? (
              <li
                className="cursor-pointer hover:underline"
                onClick={handleSignOut}
              >
                Sign Out
              </li>
            ) : (
              <li
                className="cursor-pointer hover:underline"
                onClick={handleSignIn}
              >
                Sign In
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2">
          <ul className="flex flex-col space-y-2">
            <li>
              <Link
                to="/erichie/cart"
                className="flex flex-col items-center gap-2 hover:underline"
              >
                <ShoppingCart />
              </Link>
            </li>
            <li className="cursor-pointer hover:underline">
              <Link to="/erichie">Home</Link>
            </li>
            {isUserSignedIn ? (
              <li
                className="cursor-pointer hover:underline"
                onClick={handleSignOut}
              >
                Sign Out
              </li>
            ) : (
              <li
                className="cursor-pointer hover:underline"
                onClick={handleSignIn}
              >
                Sign In
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ERichieHeader;
