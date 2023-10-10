import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const ProductPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [count, setCount] = useState(1); // Start with 1 item
  const products = useSelector((state) => state.shopthreeproduct.shopthreeproducts);
  const product = products.find((product) => product.productid === id);
  const [manualQuantity, setManualQuantity] = useState("1"); // For manual quantity input

  const addQuantity = () => {
    if (count < product.stock) {
      setCount((prevCount) => prevCount + 1);
      setManualQuantity((prevValue) => (parseInt(prevValue) + 1).toString());
    }
  };

  const minusQuantity = () => {
    if (count > 0) {
      setCount((prevCount) => prevCount - 1);
      setManualQuantity((prevValue) => (parseInt(prevValue) - 1).toString());
    }
  };

  const handleManualQuantityChange = (event) => {
    const inputValue = event.target.value;
    if (
      inputValue === "" ||
      (/^[0-9]*$/.test(inputValue) && parseInt(inputValue) <= product.stock)
    ) {
      setManualQuantity(inputValue);
      setCount(parseInt(inputValue) || 1); // Set a default value of 1 if input is empty
    }
  };

  const addToCart = () => {};

  if (!product) {
    return <div>No product found with ID {id}</div>;
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex gap-4 bg-white rounded-lg shadow-md p-4">
        <img
          src={product.imageurl}
          alt={product.name}
          className="h-40 w-40 object-cover rounded-lg"
        />
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold">{product.productname}</h2>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-lg font-semibold text-green-500">
            ${product.price}
          </p>
          <div className="flex items-center gap-2 mt-4">
            <button
              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
              onClick={minusQuantity}
              disabled={count === 1}
            >
              -
            </button>
            <input
              type="text"
              value={manualQuantity}
              onChange={handleManualQuantityChange}
              className="w-12 text-center border border-gray-300 rounded"
            />
            <button
              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
              onClick={addQuantity}
              disabled={count === product.stock}
            >
              +
            </button>
          </div>
          <div className="flex gap-5">

          <button
            className="bg-black text-white p-2 mt-4 rounded-lg hover:bg-gray-900 transition"
            onClick={addToCart}
            disabled={count > product.stock || count < 1}
            >
            Add To Cart
          </button>
          <button
            className="bg-black text-white p-2 mt-4 rounded-lg hover:bg-gray-900 transition"
            disabled={count > product.stock || count < 1}
            >
            Buy Now
          </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
