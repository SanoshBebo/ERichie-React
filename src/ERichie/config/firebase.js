// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDW5wN784PY9ZM2YslHuVaEK463Mf8Ux48",
  authDomain: "erichieplatform.firebaseapp.com",
  projectId: "erichieplatform",
  storageBucket: "erichieplatform.appspot.com",
  messagingSenderId: "494280895360",
  appId: "1:494280895360:web:ca7c541f99289dab11af65"
};

// Initialize Firebase
const sanoshApp = initializeApp(firebaseConfig, "ERichieApp");
export const auth = getAuth(sanoshApp);
export const googleProvider = new GoogleAuthProvider();
