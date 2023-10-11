import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import OrderSummary from './ordersummary'; // Import the OrderSummary component
import axios from 'axios';

function Checkout({ cart, removeFromCart }) {
  // Calculate the total amount
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleBuyNow = () => {
    // Prepare the order details
    const order = {
      date: new Date().toISOString(), // Add the order date
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        shopId: 'shop06', // Replace with the actual shop ID
        totalPrice: item.price * item.quantity,
      })),
    };

    // Send the order details to Firestore (or your preferred backend)
    saveOrderToFirestore(order);

    // Decrease the stock of purchased items
    decreaseStock(cart);

    setOrderDetails(order);
    setShowOrderSummary(true);
  };

  // Function to save an order to Firestore
  const saveOrderToFirestore = (orderData) => {
    const apiUrl =
      'https://firestore.googleapis.com/v1/projects/gamestore-1b041/databases/(default)/documents/Orders'; // Replace with your custom path

    // Construct the Firestore document data for the order
    const firestoreData = {
      fields: {
        date: { timestampValue: orderData.date }, // Save the order date
        items: {
          arrayValue: {
            values: orderData.items.map((item) => ({
              mapValue: {
                fields: {
                  productId: { stringValue: item.productId },
                  quantity: { integerValue: item.quantity },
                  shopId: { stringValue: item.shopId },
                  totalPrice: { doubleValue: item.totalPrice },
                },
              },
            })),
          },
        },
      },
    };

    // Make a POST request to save the order to Firestore
    axios
      .post(apiUrl, firestoreData)
      .then((response) => {
        console.log('Order saved successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error saving order:', error);
      });
  };

  // Function to decrease stock of purchased items
  // Function to decrease stock of purchased items
const decreaseStock = (items) => {
  const apiUrl =
    'https://firestore.googleapis.com/v1/projects/gamestore-1b041/databases/(default)/documents/products';

  items.forEach((item) => {
    // Calculate the new stock value after purchase
    const newStock = item.stock - item.quantity;

    // Construct the Firestore document data for updating stock
    const firestoreData = {
      fields: {
        stock: { integerValue: newStock },
      },
    };

    // Make a PATCH request to update the stock in Firestore
    axios
      .patch(apiUrl + `/${item.id}`, firestoreData)
      .then((response) => {
        console.log(`Stock for item ${item.id} updated successfully. New stock: ${newStock}`);
      })
      .catch((error) => {
        console.error(`Error updating stock for item ${item.id}:`, error);
      });
  });
};


  return (
    <div>
      <h2>Checkout</h2>
      <ul>
        {cart.map((item) => (
          <div key={item.id}>
            <p>{item.name} - Quantity: {item.quantity}</p>
            <p>Price: ${item.price}</p>
            <button onClick={() => removeFromCart(item.id)}>Remove from Cart</button>
          </div>
        ))}
      </ul>
      <p>Total Amount: ${totalAmount}</p>
      <button onClick={handleBuyNow}>Buy Now</button>
      <Link to="/">Back to Product List</Link>

      {showOrderSummary && <OrderSummary order={orderDetails} />}
    </div>
  );
}

export default Checkout;
