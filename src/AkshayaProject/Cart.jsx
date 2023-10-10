// Cart.js

import React from 'react';
import './Cart.css';

  import axios from 'axios';

const Cart = ({ cart, removeFromCart, increaseQuantity, decreaseQuantity, handlestocks }) => {
  const calculateItemTotal = (item) => {
    return item.price * item.quantity;
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const handleOrderClick = () => {
    // Show a prompt when the user clicks the "Order" button
    window.alert('Order placed successfully!');
  };

  const generateTimestamp = () => {
    const timestamp = new Date();
    return timestamp.toISOString(); // Convert the timestamp to ISO string
  };


  const handleOrder = () => {

    cart.map((product)=>{

      const order = {
        product_id: product.id,
        quantity: 1, // You can change this to item.quantity if needed
        total_price: product.price,
        shop_id: product.shopname, // Assuming shopname is the shop ID
        user_uid: 'aksh', // Assuming 'aksh' is the user UID
        date: generateTimestamp(), // Generate timestamp and convert to string
      };
  
      // Send the order to your Firestore "Order" collection
      // Replace 'YOUR_FIRESTORE_PROJECT_ID' and 'YOUR_FIRESTORE_API_KEY' with your actual values
      const firestoreApiKey = 'AIzaSyAMTkJfx4_ZowkhsFySraPbqI-ZoGOEt6U';
      const firestoreProjectId = 'e-ritchie';   
      const firestoreCollection = 'Orders'; // Name of the collection
  
      axios
        .post(
          `https://firestore.googleapis.com/v1/projects/${firestoreProjectId}/databases/(default)/documents/${firestoreCollection}`,
          {
            fields: {
              product_id: { stringValue: order.product_id },
              quantity: { integerValue: order.quantity },
              total_price: { doubleValue: order.total_price },
              shop_id: { stringValue: order.shop_id },
              user_uid: { stringValue: order.user_uid },
              date: { stringValue: order.date },
            },
          }
        )
        .then((response) => {
          console.log('Order created successfully:', response.data);
          
          // You can handle any further actions after the order is created here
        })
        .catch((error) => {
          console.error('Error creating order:', error);
        });

    })
    window.alert('Order placed successfully!');    
  };

  return (
    <div className="cart-container">
      <h2>Cart</h2>
      <ul className="cart-items">
        {cart.map((item) => (
          <li key={item.id} className="cart-item">
            <div className="cart-item-info">
              <div>
                <img src={item.imageUrl} alt={item.name} className="product-image" />
              </div>
              <div>{item.name}</div>
              <div>Price: ${item.price}</div>
              <div>Quantity: {item.quantity}</div>
              <div>Total: ${calculateItemTotal(item)}</div>
            </div>
            <div className="cart-item-actions">
              <button onClick={() => increaseQuantity(item)}>+</button>
              <button onClick={() => decreaseQuantity(item)}>-</button>
              <button onClick={() => removeFromCart(item)}>Remove</button>
            </div>
            
          </li>
        ))}
      </ul>
      <div className="total-price">Total Price: ${calculateTotalPrice()}</div>
      <button onClick={()=>handleOrder()} className="order-button">
        Order
      </button>
    </div>
  );
};

export default Cart;





// // Cart.js

// import React from 'react';
// import './Cart.css';
// import axios from 'axios';

// const Cart = ({ cart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart }) => {
//   const calculateItemTotal = (item) => {
//     return item.price * item.quantity;
//   };

//   const calculateTotalPrice = () => {
//     return cart.reduce((total, item) => total + calculateItemTotal(item), 0);
//   };

//   //   const handleOrderClick = () => {
// //     // Show a prompt when the user clicks the "Order" button
// //     window.alert('Order placed successfully!');
// //   };



//   const handleOrder = () => {
//     cart.map((product) => {
//       const order = {
//         product_id: product.id,
//         quantity: product.quantity,
//         total_price: product.price,
//         shop_id: product.shopname,
//         user_uid: 'aksh',
//         date: generateTimestamp(),
//       };

//       // Send the order to your Firestore "Order" collection
//       const firestoreApiKey = 'YOUR_FIRESTORE_API_KEY';
//       const firestoreProjectId = 'YOUR_FIRESTORE_PROJECT_ID';
//       const firestoreCollection = 'Orders';

//       axios
//         .post(
//           `https://firestore.googleapis.com/v1/projects/${firestoreProjectId}/databases/(default)/documents/${firestoreCollection}`,
//           {
//             fields: {
//               product_id: { stringValue: order.product_id },
//               quantity: { integerValue: order.quantity },
//               total_price: { doubleValue: order.total_price },
//               shop_id: { stringValue: order.shop_id },
//               user_uid: { stringValue: order.user_uid },
//               date: { stringValue: order.date },
//             },
//           }
//         )
//         .then((response) => {
//           console.log('Order created successfully:', response.data);
//           clearCart(); // Clear the cart after placing the order
//           window.alert('Order placed successfully!');
//         })
//         .catch((error) => {
//           console.error('Error creating order:', error);
//         });
//     });
//   };

//   const generateTimestamp = () => {
//     const timestamp = new Date();
//     return timestamp.toISOString();
//   };

//   return (
//     <div className="cart-container">
//       <h2>Cart</h2>
//       <ul className="cart-items">
//         {cart.map((item) => (
//           <li key={item.id} className="cart-item">
//             <div className="cart-item-info">
//               <div>
//                 <img src={item.imageUrl} alt={item.name} className="product-image" />
//               </div>
//               <div>{item.name}</div>
//               <div>Price: ${item.price}</div>
//               <div>Quantity: {item.quantity}</div>
//               <div>Total: ${calculateItemTotal(item)}</div>
//             </div>
//             <div className="cart-item-actions">
//               <button onClick={() => increaseQuantity(item)}>+</button>
//               <button onClick={() => decreaseQuantity(item)}>-</button>
//               <button onClick={() => removeFromCart(item)}>Remove</button>
//             </div>
//           </li>
//         ))}
//       </ul>
//       <div className="total-price">Total Price: ${calculateTotalPrice()}</div>
//       <button onClick={handleOrder} className="order-button">
//         Order
//       </button>
//     </div>
//   );
// };

// export default Cart;
