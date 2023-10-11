// import React, { useState, useEffect } from 'react';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/firestore';

// const Cart =() =>{
//   return(
//       <div>
//         <h1 style={{color: "black"}}>
//           Cart
//         </h1>
//       </div>
//   )
// }

// export default Cart

// import React, { useState, useEffect } from 'react';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/firestore';
// import './Cart.css';
// const Cart = () => {
//   const [cartItems, setCartItems] = useState([]);

//   useEffect(() => {
//     // Fetch cart items from Firestore
//     const fetchCartItems = async () => {
//       const cartCollection = firebase.firestore().collection('carts');

//       try {
//         const snapshot = await cartCollection.get();

//         const cartData = snapshot.docs.map((doc) => {
//           const data = doc.data();
//           // You can customize the data you retrieve based on your Firestore structure
//           return {
//             id: doc.id,
//             product: data.product, // Replace with your actual field names
//             quantity: data.quantity,
//           };
//         });

//         setCartItems(cartData);
//       } catch (error) {
//         console.error('Error fetching cart items:', error);
//       }
//     };

//     fetchCartItems();
//   }, []);

//   // Function to handle the purchase action for an item
//   const handlePurchaseNow = (item) => {
//     // You can implement your purchase logic here
//     // For example, you can add the item to a "Purchased Items" collection in Firestore
//     // and update the stock or perform other actions as needed.
//     console.log('Purchase Now clicked for item:', item);
//   };

//   // Function to handle removing an item from the cart
//   const handleRemoveFromCart = async (itemId) => {
//     // Remove the item from the 'carts' collection in Firestore
//     const cartCollection = firebase.firestore().collection('carts');
//     try {
//       await cartCollection.doc(itemId).delete();
//       // Update the cart items state to reflect the removal
//       setCartItems((prevCartItems) => prevCartItems.filter((item) => item.id !== itemId));
//     } catch (error) {
//       console.error('Error removing item from cart:', error);
//     }
//   };

//   // Function to decrease the quantity of an item in the cart
//   const decreaseQuantity = (item) => {
//     if (item.quantity > 1) {
//       // Decrease the quantity by 1
//       item.quantity--;
//       // Update the quantity in Firestore
//       updateQuantityInFirestore(item);
//     }
//   };

//   // Function to increase the quantity of an item in the cart
//   const increaseQuantity = (item) => {
//     // Increase the quantity by 1
//     item.quantity++;
//     // Update the quantity in Firestore
//     updateQuantityInFirestore(item);
//   };

//   // Function to update the quantity in Firestore
//   const updateQuantityInFirestore = async (item) => {
//     const cartCollection = firebase.firestore().collection('carts');
//     try {
//       await cartCollection.doc(item.id).update({
//         quantity: item.quantity,
//       });
//       // Update the cart items state to reflect the change
//       setCartItems((prevCartItems) =>
//         prevCartItems.map((cartItem) =>
//           cartItem.id === item.id ? { ...cartItem, quantity: item.quantity } : cartItem
//         )
//       );
//     } catch (error) {
//       console.error('Error updating quantity in Firestore:', error);
//     }
//   };

//   return (
//     <div className='cart'>
//       <h1 style={{ color: 'black' }}>Cart</h1>
//       <div style={{ display: 'flex', flexWrap: 'wrap' }}>
//         {cartItems.map((item) => (
//           <div
//             key={item.id}
//             style={{
//               margin: '10px',
//               padding: '10px',
//               border: '1px solid #ccc',
//               display: 'flex',
//               alignItems: 'center',
//             }}
//           >
//             <div style={{ flex: '1', marginRight: '10px' }}>
//               <img src={item.product.imageurl} alt={item.product.productname} style={{ maxWidth: '100%' }} />
//             </div>
//             <div style={{ flex: '2' }}>
//               <p>{item.product.productname}</p>
//               <p>Stock: {item.product.stock}</p>
//               <p>Cost: Rs. {item.product.price}</p>
             
//               <div className="quantity-control">
//                 <button className="quantity-button" onClick={() => decreaseQuantity(item)}>
//                   -
//                 </button>
//                 <input
//                   type="text"
//                   value={item.quantity}
//                   readOnly
//                   className="quantity-input"
//                 />
//                 <button className="quantity-button" onClick={() => increaseQuantity(item)}>
//                   +
//                 </button>
//               </div>
//               <button className='cart-button' onClick={() => handlePurchaseNow(item)}>Purchase Now</button>
//               <button className='cart-button' onClick={() => handleRemoveFromCart(item.id)}>Remove from Cart</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Cart;

