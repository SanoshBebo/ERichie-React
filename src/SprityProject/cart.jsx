import React, { useEffect } from 'react';

function Cart({ cart = [], totalCartPrice = 0 }) {

  useEffect(() => {
    console.log(cart, "this is the cart");
  }, [])
  
  
  return (

   
    <div>
      <h2>Cart</h2>
      <ul>
        {cart.map((item) => (
          
          <li key={item.id}>
            {item.productname} - Quantity: {item.quantity}
          </li>
        ))}
      </ul>
      
      <p>Total Price: {totalCartPrice}</p>
      
    </div>
  );
}

export default Cart;
