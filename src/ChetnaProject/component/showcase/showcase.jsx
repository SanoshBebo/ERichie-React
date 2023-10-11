import React from "react";
import Navbar from "../navbar/navbar";
import SearchInputForm from "../forms/searchinputForm/SearchInputForm";

const Showcase = () => {
  return (
    <div className="bg-cover bg-center h-screen relative">
      <div className="bg-black bg-opacity-50 absolute inset-0"></div>
      <section className="container mx-auto flex flex-col justify-center items-center h-screen relative z-10">
        <Navbar />
        <div className="text-white text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-4">
            Best <span className="text-primary">Mobile</span> Available
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl font-light mb-8">
            Buy quality products
          </p>
          {/* <SearchInputForm /> */}
        </div>
      </section>
    </div>
  );
};

export default Showcase;
