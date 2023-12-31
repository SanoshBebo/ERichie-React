import React, { useContext } from "react";

import myContext from "../../../context/data/myContext";

function AddProduct() {
  const context = useContext(myContext);

  const { products, setProducts, addProduct } = context;

  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        <div className=" bg-gray-800 px-10 py-10 rounded-xl ">
          <div className="">
            <h1 className="text-center text-white text-xl mb-4 font-bold">
              Add Product
            </h1>
          </div>

          <div>
            <input
              type="text"
              value={products.productname}
              onChange={(e) =>
                setProducts({ ...products, productname: e.target.value })
              }
              name="productname"
              className=" bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
              placeholder="Product name"
            />
          </div>

          <div>
            <input
              type="number"
              value={products.price}
              onChange={(e) =>{

                if(e.target.value < 0){
                  setProducts({...products,price: 0})
                }
                else{

                  setProducts({ ...products, price: e.target.value })
                }
              }
              }
              name="price"
              className=" bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
              placeholder="Product price"
            />
          </div>

          <div>
            <input
              type="text"
              value={products.imageUrl}
              onChange={(e) =>
                setProducts({ ...products, imageUrl: e.target.value })
              }
              name="imageurl"
              className=" bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
              placeholder="Product imageUrl"
            />
          </div>


          <div>
            <input
              type="number"
              value={products.stock}
              onChange={(e) =>
                {

                  if(e.target.value < 0){
                    setProducts({...products,stock: 0})
                  }
                  else{
                    
                    setProducts({ ...products, stock: e.target.value })
                  }
                }
              }
              name="stock"
              className=" bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
              placeholder="Product stock"
            />
          </div>

          <div>
            <textarea
              cols="30"
              rows="5"
              name="title"
              value={products.description}
              onChange={(e) =>
                setProducts({ ...products, description: e.target.value })
              }
              className=" bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
              placeholder="Product desc"
            ></textarea>
          </div>

          <div className=" flex justify-center mb-3">
            <button
              onClick={addProduct}
              className=" bg-green-500 w-full text-black font-bold  px-2 py-2 rounded-lg"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
