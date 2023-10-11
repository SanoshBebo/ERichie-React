import React, { useState } from 'react';
import { initializeApp } from 'firebase/app'; // Import initializeApp from Firebase v9
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase Authentication modules

const Login = () => {
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

  const handleLogin = () => {
    const auth = getAuth(firebaseApp); // Get the Auth instance

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Successfully logged in
        const user = userCredential.user;
        console.log('Logged in user:', user);
      })
      .catch((error) => {
        // Handle login errors
        console.error('Login error:', error);
      });
  };

  return (
    <div>
      <h2>Login</h2>
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
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
