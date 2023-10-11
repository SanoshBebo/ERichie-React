import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDAiYMal4gtZLCAv-xY9UMGSJpqX8PZy48",
  authDomain: "superstore-c138c.firebaseapp.com",
  projectId: "superstore-c138c",
  storageBucket: "superstore-c138c.appspot.com",
  messagingSenderId: "278578279049",
  appId: "1:278578279049:web:ba6db215e3441844710c58",
  measurementId: "G-XTYBBQXTN9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);

export default app; // Export the Firebase app instance
