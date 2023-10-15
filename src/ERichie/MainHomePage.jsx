import React from "react";
import { Link } from "react-router-dom";
import computer from "../ERichie/Assets/computer.jpg";
import gaming from "../ERichie/Assets/gaming.jpg";
import media from "../ERichie/Assets/media.jpg";
import mobile from "../ERichie/Assets/mobile.jpg";
const MainHomePage = () => {
  return (
    <div className="min-h-screen flex-grow justify-center items-center relative">
      <div className="flex-row lg:flex md:flex-row md:w-full ">
        <div className="w-1/2 h-1/2 relative">
          <Link to="/computer">
            <img
              src={computer}
              alt=""
              className="w-full cursor-pointer"
              onMouseEnter={(e) => {
                e.target.style.opacity = 0.9;
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = 1;
              }}
            />
          </Link>
        </div>
        <div className="w-1/2 h-1/2 relative">
          <Link to="/gaming">
            <img
              src={gaming}
              alt=""
              className="w-full cursor-pointer"
              onMouseEnter={(e) => {
                e.target.style.opacity = 0.9;
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = 1;
              }}
            />
          </Link>
        </div>
      </div>
      <div className=" lg:flex md:flex-row md:w-full ">
        <div className="w-1/2 h-1/2 relative">
          <Link to="/MediaCategories">
            <img
              src={media}
              alt=""
              className="w-full cursor-pointer"
              onMouseEnter={(e) => {
                e.target.style.opacity = 0.9;
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = 1;
              }}
            />
          </Link>
        </div>
        <div className="w-1/2 h-1/2 relative">
          <Link to="/mobiles">
            <img
              src={mobile}
              alt=""
              className="w-full cursor-pointer"
              onMouseEnter={(e) => {
                e.target.style.opacity = 0.9;
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = 1;
              }}
            />
          </Link>
        </div>
      </div>
      <div className="bg-black rounded-full absolute m-auto w-40 h-40 z-30 left-0 right-0 top-0 bottom-0 flex text-center items-center justify-center">
        <h1 className="text-white font-mono font-bold text-2xl">ERICHIE</h1>
      </div>
    </div>
  );
};

export default MainHomePage;
