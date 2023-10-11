import React from 'react';

function OrderSummary({ order }) {
  return (
    <div>
      <h2>Order Details</h2>
      <p>Date: {new Date(order.date).toLocaleString()}</p>
      <ul>
        {order.items.map((item) => (
          <li key={item.productId}>
            Product ID: {item.productId} - Name: {item.name} - Quantity: {item.quantity} - Price: ${item.totalPrice}
          </li>
        ))}
      </ul>
      <button onClick={() => window.print()}>Print Order</button>
    </div>
  );
}

export default OrderSummary;
