// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLWJI3H2QH2-bDytnlO1DajJDDMb6AxyE",
  authDomain: "shank-mobiles.firebaseapp.com",
  projectId: "shank-mobiles",
  storageBucket: "shank-mobiles.appspot.com",
  messagingSenderId: "454295150547",
  appId: "1:454295150547:web:297415539f5c59fb349926"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app);
const auth = getAuth(app);

export {fireDB, auth}