// ProductDetails.js (Product Details)
import React from 'react';

const ProductDetails = ({ product, addToCart }) => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-3xl bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold mb-4">{product.name}</h1>
        <img src={product.imageUrl} alt={product.name} className="w-full max-h-96 object-cover mb-4" />
        <p className="text-gray-700 mb-4">{product.description}</p>
        <p className="text-xl font-bold text-purple-600 mb-4">${product.price}</p>
        <button
          onClick={() => addToCart(product)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
