// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqM39qQB3vcZfI4l1nsOXb_JxnFbJT2rU",
  authDomain: "e-richie-application.firebaseapp.com",
  projectId: "e-richie-application",
  storageBucket: "e-richie-application.appspot.com",
  messagingSenderId: "1064408307070",
  appId: "1:1064408307070:web:150b62d327d958e0060f2f",
  measurementId: "G-KB6T9F9D7J",
};

// Initialize Firebase
const sanoshApp = initializeApp(firebaseConfig, "SanoshApp");
export const auth = getAuth(sanoshApp);
export const googleProvider = new GoogleAuthProvider();
