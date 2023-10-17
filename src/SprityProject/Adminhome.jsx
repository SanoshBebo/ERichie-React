import React, { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../SanoshProject/redux/shopOneUserSlice";


function AdminHome() {

  const user = useSelector((state) => state.shoponeuser.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    if (!isLoadingUser && user.length === 0) {
      navigate("/admin/login");
    }
  }, [isLoadingUser, user, navigate]);

  useEffect(() => { 
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.email == "sprityadmin@gmail.com") {
      if (userData.role == "customer") {
        navigate("/admin/login");
      }
      dispatch(setUser(userData));
    }
    setIsLoadingUser(false);
  }, []);
  const handleSignOut = () => {

    localStorage.removeItem("user");

    navigate("/admin/login");

  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Welcome, Admin
      </h1> 
      <p className="text-base text-gray-600 mb-8 text-center">
        Let's keep a check on everything.
      </p>
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
          to="/shop10/admin/report"
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center text-lg w-48 mx-auto"
        >
          View Reports
        </Link>
        <Link
          to="/erichie/overall-report"
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center text-lg w-48 mx-auto"
        >        
          View E-Richie Reports
        </Link>
        <button
         onClick={handleSignOut}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center text-lg w-48 mx-auto"
        >        
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default AdminHome;
