import React from 'react';

const CartDropdown = ({ cart, removeFromCart, calculateTotalPrice, closeCart, handleBuyNow }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 design">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Your Cart</h3>
        <ul>
          {cart.map((cartProduct) => (
            <li key={cartProduct.id} className="flex items-center justify-between mb-2">
              <div>
                <span className="font-semibold">{cartProduct.productname}</span>
                <span className="text-gray-500"> - Price: ${cartProduct.price}, Quantity: {cartProduct.quantity}</span>
              </div>
              <button
                onClick={() => removeFromCart(cartProduct)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-4">Total Price: ${calculateTotalPrice()}</p>
        <div className="mt-6 flex justify-between">
          
          <button
            onClick={closeCart}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDropdown;
