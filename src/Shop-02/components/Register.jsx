import React, { useState } from 'react';
import { initializeApp } from 'firebase/app'; // Import initializeApp from Firebase v9
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Import Firebase Authentication modules

const Register = () => {
  // Initialize Firebase with your Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCYi91lSnCgGpmOm-5fBjayL_npM65bZcQ",
    authDomain: "adminstore-196a7.firebaseapp.com",
    projectId: "adminstore-196a7",
    storageBucket: "adminstore-196a7.appspot.com",
    messagingSenderId: "391024143207",
    appId: "1:391024143207:web:6decc626eda3c4dace5dc2",
    measurementId: "G-R1M448G964"
  };

  // Initialize Firebase if it hasn't been already
  const firebaseApp = initializeApp(firebaseConfig);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    const auth = getAuth(firebaseApp); // Get the Auth instance

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Successfully registered user
        const user = userCredential.user;
        console.log('Registered user:', user);
      })
      .catch((error) => {
        // Handle registration errors
        console.error('Registration error:', error);
      });
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
