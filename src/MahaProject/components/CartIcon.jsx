import React, { useState } from 'react';
import CartDropdown from './CartDropdown';

const CartIcon = ({ cart, setCart }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const removeFromCart = (productToRemove) => {
    const updatedCart = cart.filter((product) => product.id !== productToRemove.id);
    setCart(updatedCart);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div className="fixed top-4 right-4 flex items-center cursor-pointer">
      {/* Cart Icon */}
      <div onClick={toggleCart} className="relative">
        {/* Image */}
        <img src="/cart_icon.png" alt="Cart Icon" className="w-10 h-10" />
        {/* Cart Count */}
        {cart.length > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
            {cart.length}
          </span>
        )}
      </div>

      {/* Cart Dropdown */}
      {isCartOpen && (
        <CartDropdown
          cart={cart}
          removeFromCart={removeFromCart}
          calculateTotalPrice={calculateTotalPrice}
          closeCart={toggleCart}
        />
      )}
    </div>
  );
};

export default CartIcon;
