// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRZ26g1BQ1axqKiFn7Yf-I8JEBM0suQb8",
  authDomain: "cosmicmediastore-438f7.firebaseapp.com",
  projectId: "cosmicmediastore-438f7",
  storageBucket: "cosmicmediastore-438f7.appspot.com",
  messagingSenderId: "319754893923",
  appId: "1:319754893923:web:0cf6f5dc528ce8e73ad656",
  measurementId: "G-F9542PVK5C",
};

// Initialize Firebase
const sanoshApp = initializeApp(firebaseConfig, 'SanoshApp');
export const auth = getAuth(sanoshApp);
export const googleProvider = new GoogleAuthProvider();
