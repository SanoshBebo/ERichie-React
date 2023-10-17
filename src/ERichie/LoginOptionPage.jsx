import React from "react";
import { Link } from "react-router-dom";

const LoginOptionPage = () => {
  return (
    <div className=" h-screen relative">
      <h1 className="absolute w-fit p-10 rounded-full bg-white text-center top-[50%] left-0 right-0 m-auto transform translate-y-[-50%] text-black font-bold text-3xl">
        ERICHIE
      </h1>
      <div className="flex items-center justify-center text-center bg-[#755139FF] h-[50%] w-full">
        <Link to="/admin/login">
          <h1 className=" text-[#F2EDD7FF] font-semibold text-2xl hover:cursor-pointer">
            Login As Admin
          </h1>
        </Link>
      </div>
      <div className="flex items-center justify-center text-center bg-[#F2EDD7FF] h-[50%] w-full">
        <Link to="/customer/login">
          <h1 className="text-[#755139FF] font-semibold text-2xl hover:cursor-pointer">
            Login As Customer
          </h1>
        </Link>
      </div>
    </div>
  );
};

export default LoginOptionPage;
