import React, { useContext, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/data/myContext";

function Allproducts() {
  const context = useContext(myContext);
  const {
    mode,
    product,
    searchkey,
    setSearchkey,
    filterType,
    setFilterType,
    filterPrice,
    setFilterPrice,
  } = context;

  return (
    <Layout>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-8 md:py-16 mx-auto">
          <div class="lg:w-1/2 w-full mb-6 lg:mb-10">
            <h1
              class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900"
              style={{ color: mode === "dark" ? "white" : "" }}
            >
              Our products
            </h1>
            <div class="h-1 w-20 bg-blue-600 rounded"></div>
          </div>

          <div className="flex flex-wrap -m-4">
            {product
              .filter((obj) =>
                obj.productname.toLowerCase().includes(searchkey)
              )
              .filter((obj) => obj.category.toLowerCase().includes(filterType))
              .map((item, index) => {
                const {
                  productname,
                  price,
                  description,
                  imageUrl,
                  id,
                  imageurl,
                } = item;
                return (
                  <div
                    onClick={() =>
                      (window.location.href = `/shop04/product/${id}`)
                    }
                    key={index}
                    className="p-4 md:w-1/4  drop-shadow-lg "
                  >
                    <div
                      className="h-full border-2 hover:shadow-gray-100 hover:shadow-2xl transition-shadow duration-300 ease-in-out    border-gray-200 border-opacity-60 rounded-2xl overflow-hidden"
                      style={{
                        backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
                        color: mode === "dark" ? "white" : "",
                      }}
                    >
                      <div className="flex justify-center cursor-pointer">
                        <img
                          className=" rounded-2xl w-full h-80 p-2 hover:scale-110 transition-scale-110  duration-300 ease-in-out"
                          src={imageUrl || imageurl}
                          alt="blog"
                        />
                      </div>
                      <div className="p-5 border-t-2 flex flex-col justify-between">
                        <h2
                          className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1"
                          style={{ color: mode === "dark" ? "white" : "" }}
                        >
                          Supreme-mart
                        </h2>
                        <h1
                          className="productname-font text-lg font-medium text-gray-900 mb-3"
                          style={{ color: mode === "dark" ? "white" : "" }}
                        >
                          {productname}
                        </h1>
                        {/* <p className="leading-relaxed mb-3">{item.description.}</p> */}
                        <p
                          className="leading-relaxed font-medium text-green-900 mb-3"
                          style={{ color: mode === "dark" ? "white" : "" }}
                        >
                          ₹{price}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Allproducts;
