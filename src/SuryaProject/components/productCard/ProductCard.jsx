import React, { useContext, useEffect, useState } from "react";
import myContext from "../../context/data/myContext";
import { setUser } from "../../../SanoshProject/redux/shopOneUserSlice";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../../SanoshProject/redux/shopOneCartSlice";
import { addCartToFirestore } from "../../../Api/CartOperationsFirestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ProductCard() {
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

  const dispatch = useDispatch(); // You can use useDispatch here

  const addCart = (product) => {
    console.log(product);
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.role === "customer") {
      dispatch(setUser(userData)); // Dispatch the setUser action
      const cartItem = {
        id: product.id,
        name: product.productname,
        shopid: product.shopid,
        description: product.description,
        stock: product.stock,
        price: product.price,
        imageurl: product.imageUrl,
        quantity: 1,
      };
      dispatch(addItemToCart(cartItem)); // Dispatch the addItemToCart action
      addCartToFirestore(cartItem, userData.email);

      toast.success("added to cart", {
        position: "top-right",
        autoClose: 200,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      const navigate = useNavigate();
      navigate("/customer/login");
    }
    setIsLoadingUser(false);
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-8 md:py-16 mx-auto">
        <div class="lg:w-1/2 w-full mb-6 lg:mb-10">
          <h1
            class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900"
            style={{ color: mode === "dark" ? "white" : "" }}
          >
            Our Latest Collection
          </h1>
          <div class="h-1 w-20 bg-blue-600 rounded"></div>
        </div>

        <div className="flex flex-wrap -m-4">
          {product
            .filter((obj) => obj.productname.toLowerCase().includes(searchkey))
            .filter((obj) => obj.category.toLowerCase().includes(filterType))
            .filter((obj) => obj.price.includes(filterPrice))
            .slice(0, 8)
            .map((item, index) => {
              const { productname, price, description, imageUrl, id } = item;
              return (
                <div key={index} className="p-4 md:w-1/4  drop-shadow-lg ">
                  <div
                    className="h-full border-2 hover:shadow-gray-100 hover:shadow-2xl transition-shadow duration-300 ease-in-out    border-gray-200 border-opacity-60 rounded-2xl overflow-hidden"
                    style={{
                      backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
                      color: mode === "dark" ? "white" : "",
                    }}
                  >
                    <div
                      onClick={() =>
                        (window.location.href = `/shop04/product/${id}`)
                      }
                      className="flex justify-center cursor-pointer"
                    >
                      <img
                        className=" rounded-2xl w-full h-80 p-2 hover:scale-110 transition-scale-110  duration-300 ease-in-out"
                        src={imageUrl}
                        alt="blog"
                      />
                    </div>
                    <div className="p-5 border-t-2">
                      <h2
                        className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1"
                        style={{ color: mode === "dark" ? "white" : "" }}
                      >
                        Supreme-Mart
                      </h2>
                      <h1
                        className="title-font text-lg font-medium text-gray-900 mb-3"
                        style={{ color: mode === "dark" ? "white" : "" }}
                      >
                        {productname}
                      </h1>
                      {/* <p className="leading-relaxed mb-3">{item.description.}</p> */}
                      <p
                        className="leading-relaxed mb-3"
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
  );
}

export default ProductCard;
