import React from "react";
import { Link } from "react-router-dom";

const MainHomePage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="space-x-4">
        <Link to="/MediaCategories">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
            Media
          </button>
        </Link>
        <Link to="/computer">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">
            Computers
          </button>
        </Link>
        <Link to="/gaming">
          <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg">
            Gaming
          </button>
        </Link>
        <Link to="/mobiles">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg">
            Mobiles
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MainHomePage;
