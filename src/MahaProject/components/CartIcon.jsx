import React from 'react';
import { Link } from 'react-router-dom';

function CartIcon() {
  return (
    <div className="fixed top-4 right-4 flex items-center cursor-pointer">
      {/* Cart Icon */}
      <Link to="/erichie/cart">
        <div className="relative">
          {/* Image */}
          <i className="absolute top-4 sm:top-8 md:top-16 lg:top-20 right-4 sm:right-8 md:right-16 lg:right-20 text-base sm:text-lg md:text-xl lg:text-2xl cursor-pointer">🛒</i>
        </div>
      </Link>
    </div>
  );
}

export default CartIcon;
