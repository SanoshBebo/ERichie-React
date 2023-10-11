// CartPage.jsx

import React from 'react';

function CartPage({ cart, handleQuantityChange }) {
  return (
    <div>
      <h2>Cart</h2>
      <ul>
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.imageurl} alt={item.productname} />
            <h3>{item.productname}</h3>
            <div className="quantity-controls">
              <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity === 0}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default CartPage;
