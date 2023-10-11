import axios from 'axios';
import toast from 'react-hot-toast';
import { store } from './store/store';

import { loginHandle, logoutHandle } from './store/auth';
import { clearCart } from './store/cart';

// Define your Firestore database URL directly
const firestoreURL = 'https://firestore.googleapis.com/v1/projects/myapp-5dc30/databases/(default)/documents'

// Firebase Authentication functions (if needed)
export const login = async (email, password) => {
  try {
    // Make a POST request to Firebase Authentication
    const response = await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBD2d7LAeYHCq22uZLSDiTkHnEqRlcBuSw'
    , {
      email,
      password,
      returnSecureToken: true,
    });

    // Check if authentication was successful
    if (response.data.localId) {
      // Authentication successful, you can handle the user data here if needed
      const userData = {
        email: response.data.email,
        // Add any other user data you want to store
      };
      
      // Dispatch the user data to your Redux store
      store.dispatch(loginHandle(userData));
      
      toast.success('Successfully logged in');
      
      // You can return the user data or do additional actions as needed
      return userData;
    } else {
      // Authentication failed, handle the error
      toast.error('Authentication failed');
    }
  } catch (err) {
    // Handle network or other errors
    toast.error(err.message || 'An error occurred');
  }
};


// Firestore API functions
export const addProduct = async (data) => {
  try {
    // Add a product to Firestore using Axios or your server-side API
    const response = await axios.post(`${firestoreURL}/Products`, data);
    // Handle response if needed
    toast.success('Successfully added');
  } catch (err) {
    toast.error(err.message || 'An error occurred');
  }
};

export const updateProduct = async (product, id) => {
  try {
    // Update a product in Firestore using Axios or your server-side API
    const response = await axios.patch(`${firestoreURL}/products/${id}`, product);
    // Handle response if needed
    toast.success('Product updated');
  } catch (err) {
    toast.error(err.message || 'An error occurred');
  }
};

export const deleteProduct = async (id) => {
  try {
    // Delete a product from Firestore using Axios or your server-side API
    const response = await axios.delete(`${firestoreURL}/products/${id}`);
    // Handle response if needed
    toast.success('Product deleted');
  } catch (err) {
    toast.error(err.message || 'An error occurred');
  }
};

export const placeOrder = async (order) => {
  try {
    // Place an order in Firestore using Axios or your server-side API
    const response = await axios.post(`${firestoreURL}/orders`, order);
    // Handle response if needed
    // Clear the cart after placing the order
    store.dispatch(clearCart());
    toast.success('Order placed successfully');
  } catch (err) {
    toast.error(err.message || 'An error occurred');
  }
};




