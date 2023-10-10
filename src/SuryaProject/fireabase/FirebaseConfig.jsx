// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBt9OmYBGLkb0HKpi3dSLMslrBzMhjCTrw",
  authDomain: "supreme-mart.firebaseapp.com",
  projectId: "supreme-mart",
  storageBucket: "supreme-mart.appspot.com",
  messagingSenderId: "1015904088511",
  appId: "1:1015904088511:web:c6716b8ca4e166a97e310a",
  measurementId: "G-YBWX3CTPJG"
};

// Initialize Firebase
const SuryaApp = initializeApp(firebaseConfig, 'SuryaApp');
const fireDB = getFirestore(SuryaApp);
const auth = getAuth(SuryaApp);
export {fireDB,auth } ;