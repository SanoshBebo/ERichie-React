import React, { useState } from "react";
import { auth, googleProvider } from "./config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkUserRole, storeUserInFirestore } from "./auth";
import { setUser } from "../SanoshProject/redux/shopOneUserSlice";

const AdminLoginRegister = () => {
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

        dispatch(setUser(user));

        if (userRole == "shopkeeper") {
          localStorage.setItem("user", JSON.stringify(user));
          navigate("/admin");
        } else {
          console.log("invalid login credentials");
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
          role: "shopkeeper",
        };
        await storeUserInFirestore(user);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(setUser(user));
        navigate("/admin");
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
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center ">
          {isRegistering ? "Admin Register" : "Admin Login"}
        </h2>
        {isRegistering && (
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border rounded"
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
            className="w-full px-4 py-2 border rounded"
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
            className="w-full px-4 py-2 border rounded"
            placeholder="Your password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex space-x-8">
          <button
            onClick={() => {
              isRegistering ? signUp() : signIn();
            }}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-2"
          >
            {isRegistering ? "Register" : "Login"}
          </button>
          <button
            onClick={signInWithGoogle}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mb-2"
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
            className="text-blue-500 hover:underline"
            onClick={toggleRegistration}
          >
            {isRegistering ? "Login" : "Sign up"}
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginRegister;
