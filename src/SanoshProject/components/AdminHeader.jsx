import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  // Function to toggle the mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  return (
    <div className="bg-black text-white p-4">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/shop01/admin">Cosmic Media Gadgets</Link>
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
            <li className="cursor-pointer hover:underline">
              <Link to="/shop01/admin">Inventory</Link>
            </li>
            <li className="cursor-pointer hover:underline">
              <Link to="/shop01/admin/reports">Reports</Link>
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
            <li className="cursor-pointer hover:underline">
              <Link to="/">Products</Link>
            </li>
            <li className="cursor-pointer hover:underline">
              <Link to="/admin/reports">Reports</Link>
            </li>
            <li className="cursor-pointer hover:underline">Sign Out</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminHeader;
