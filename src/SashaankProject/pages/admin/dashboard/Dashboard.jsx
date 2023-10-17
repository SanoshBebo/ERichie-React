//Admin Dashboard
import React, { useContext } from "react";
import MyShankContext from "../../../../SuryaProject/context/data/MyShankContext";
import Layout from "../../../components/layout/Layout";
import DashboardTab from "./DashboardTab";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { setUser } from "../../../../SanoshProject/redux/shopOneUserSlice";
import { FaArrowUp } from "react-icons/fa";

function Dashboard() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Add smooth scrolling behavior
    });
  };

  const context = useContext(MyShankContext);
  const { mode } = context;
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
    if (userData && userData.email == "sashadmin@gmail.com") {
      if (userData.role == "customer") {
        navigate("/admin/login");
      }
      dispatch(setUser(userData));
    }
    setIsLoadingUser(false);
  }, []);
  return (
    <Layout>
      <section className="text-gray-600 body-font mt-10 mb-10">
        <DashboardTab />
        {/* Up arrow button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-gray-500 text-white p-2 rounded-full shadow-md hover:bg-gray-700 transition duration-300"
        >
          <FaArrowUp />
        </button>
      </section>
    </Layout>
  );
}

export default Dashboard;
