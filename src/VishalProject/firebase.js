// services/firebase.js

import firebase from "firebase/app";
import "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBmDb46vwv-PUXmv41yybXJ2KiQUYDYw0k",
    authDomain: "about-me-bf7ef.firebaseapp.com",
    databaseURL: "https://about-me-bf7ef-default-rtdb.firebaseio.com",
    projectId: "about-me-bf7ef",
    storageBucket: "about-me-bf7ef.appspot.com",
    messagingSenderId: "17182781046",
    appId: "1:17182781046:web:88703d7545092b5fc9f957",
    measurementId: "G-CX8S6L4509"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

export const fetchProducts = async () => {
  try {
    const productsRef = firestore.collection("Products");
    const productsSnapshot = await productsRef.get();

    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};