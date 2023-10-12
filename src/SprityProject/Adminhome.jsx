import React from 'react';
import { Link } from 'react-router-dom';

function AdminHome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold mb-4 text-center">Welcome, Admin</h1>
      <p className="text-base text-gray-600 mb-8 text-center">Let's keep a check on everything.</p>
      <div className="flex flex-col space-y-4">
        <Link
          to="/shop10/add"
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center text-lg w-48 mx-auto"
        >
          Add Product
        </Link>
        <Link
          to="/shop10/display"
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center text-lg w-48 mx-auto"
        >
          Display Products
        </Link>
        <Link
          to="/shop10/display"
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center text-lg w-48 mx-auto"
        >
          Edit Product
        </Link>
        <Link
          to="/shop10/display"
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center text-lg w-48 mx-auto"
        >
          Delete Product
        </Link>
        <Link
          to="/shop10/reports"
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center text-lg w-48 mx-auto"
        >
          View Reports
        </Link>
      </div>
    </div>
  );
}

export default AdminHome;
