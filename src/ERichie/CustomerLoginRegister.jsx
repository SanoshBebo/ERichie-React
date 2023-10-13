import React, { useState } from "react";
import { auth, googleProvider } from "./config/firebase";

import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { checkUserRole, storeUserInFirestore } from "./auth";

import { useDispatch } from "react-redux";
import { setUser } from "../SanoshProject/redux/shopOneUserSlice";

const CustomerLoginRegister = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const toggleRegistration = () => {
    setIsRegistering(!isRegistering);
  };

  const signIn = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (response.user.uid) {
        let user = {
          useruid: response.user.uid,
          email: response.user.email,
        };
        const userRole = await checkUserRole(user);
        user = {
          useruid: response.user.uid,
          email: response.user.email,
          role: userRole,
        };

        if (userRole == "customer") {
          dispatch(setUser(user));
          localStorage.setItem("user", JSON.stringify(user));
          const redirectUrl = JSON.parse(localStorage.getItem("redirectUrl"));
          console.log(redirectUrl);
          if (redirectUrl) {
            navigate(redirectUrl.url);
            localStorage.removeItem("redirectUrl");
          } else {
            navigate("/erichie");
          }
        }
      }
    } catch (err) {
      if (err.code === "auth/invalid-login-credentials") {
        console.error("Invalid email or password. Please try again.");
      } else {
        console.error("An error occurred while signing in:", err);
      }
    }
  };

  const signUp = async () => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (response.user.uid) {
        const user = {
          name: name,
          useruid: response.user.uid,
          email: response.user.email,
          role: "customer",
        };
        storeUserInFirestore(user);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(setUser(user));
        navigate("/erichie");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const response = await signInWithPopup(auth, googleProvider);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md w-96 transition-transform transform hover:scale-105">
        <h2 className="text-2xl font-semibold mb-4 text-center ">
          {isRegistering ? "Customer Register" : "Customer Login"}
        </h2>
        {isRegistering && (
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
              placeholder="Your full name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
            placeholder="Your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-600">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
            placeholder="Your password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex gap-4 p-2">
          <button
            onClick={() => {
              isRegistering ? signUp() : signIn();
            }}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-2 focus:outline-none focus:bg-blue-600"
          >
            {isRegistering ? "Register" : "Login"}
          </button>
          <button
            onClick={signInWithGoogle}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600  mb-2 focus:outline-none focus:bg-red-600"
          >
            Sign in with Google
          </button>
        </div>
        <p className="mt-4 text-center">
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <a
            href="#"
            className="text-blue-500 hover:underline transition-colors duration-300 ease-in-out"
            onClick={toggleRegistration}
          >
            {isRegistering ? "Login" : "Sign up"}
          </a>
        </p>
      </div>
      <p className="mt-4 text-center text-[15px]">
        Continue without signing in
        <Link to="/erichie">
          <a className="text-blue-500 hover:underline transition-colors duration-300 ease-in-out p-2">
            Click here
          </a>
        </Link>
      </p>
    </div>
  );
};

export default CustomerLoginRegister;
