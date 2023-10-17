import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from "lucide-react";
import { useSelector } from 'react-redux';

function CartIcon() {
  const itemsInCart = useSelector((state) => state.shoponecart.itemsInCart);

  return (
    <div className="fixed top-4 right-4 flex items-center cursor-pointer">
      {/* Cart Icon */}
      <Link to="/erichie/cart" className="flex items-center gap-2 hover:underline">
        <ShoppingCart />
        <p className=" text-black rounded-full h-6 w-6 text-center ">
          {itemsInCart}
        </p>
      </Link>
    </div>
  );
}

export default CartIcon;
