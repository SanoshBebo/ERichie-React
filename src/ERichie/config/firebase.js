// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBeO1JzR8v5R0kvxzdMlMKLL5XDg5YHQmU",
  authDomain: "erichiewebsite.firebaseapp.com",
  projectId: "erichiewebsite",
  storageBucket: "erichiewebsite.appspot.com",
  messagingSenderId: "413087480914",
  appId: "1:413087480914:web:5cf6891ae9807065a2b38b",
  measurementId: "G-9NQ3397480"
};

// Initialize Firebase
const sanoshApp = initializeApp(firebaseConfig, "ERichie");
export const auth = getAuth(sanoshApp);
export const googleProvider = new GoogleAuthProvider();
