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
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const dispatch = useDispatch();

  const toggleRegistration = () => {
    setInvalidCredentials(false);
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
          if (user.email == "sanoshadmin@gmail.com") {
            navigate("/shop01/admin");
          } else if (user.email == "sashadmin@gmail.com") {
            navigate("/shop09/admin/dashboard");
          } else if (user.email == "vishaladmin@gmail.com") {
            navigate("/shop03/admin");
          } else if (user.email == "sprityadmin@gmail.com") {
            navigate("/shop10/adminhome");
          } else if (user.email == "suryaadmin@gmail.com") {
            navigate("/shop04/admin/dashboard");
          } else if (user.email == "akshayaadmin@gmail.com") {
            navigate("/shop02/admin");
          } else if (user.email == "thillaiadmin@gmail.com") {
            navigate("/shop07/admin");
          } else if (user.email == "rethuadmin@gmail.com") {
            navigate("/shop05/admin");
          } else if (user.email == "mahaadmin@gmail.com") {
            navigate("/shop12/admin");
          } else if (user.email == "chetnaadmin@gmail.com") {
            navigate("/shop11/Adminpage");
          } else if (user.email == "lasyaadmin@gmail.com") {
            navigate("/shop06/admin");
          }
          // else if(user.email == "abhinandanadmin@gmail.com"){
          //   navigate("");}
          else if (user.email == "sundariadmin@gmail.com") {
            navigate("/shop14/admin");
          } else if (user.email == "abhiramadmin@gmail.com") {
            navigate("/shop13/abhiramadmin");
          } else if (user.email == "hariniadmin@gmail.com") {
            navigate("/shop17/admin");
          } else if (user.email == "sanjayadmin@gmail.com") {
            navigate("/AdminAction");
          } else if (user.email == "dhanuadmin@gmail.com") {
            navigate("/Shop16/Admin");
          } else {
            console.log("invalid login credentials");
          }
        }
      }
    } catch (err) {
      if (err.code === "auth/invalid-login-credentials") {
        setInvalidCredentials(true);
        console.error("Invalid email or password. Please try again.");
      } else {
        setInvalidCredentials(true);
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
        if (user.email == "sanoshadmin@gmail.com") {
          navigate("/shop01/admin");
          if (user.email == "sashadmin@gmail.com")
            navigate("/shop09/admin/dashboard");
          if (user.email == "vishaladmin@gmail.com") navigate("/shop03/admin");
          if (user.email == "sprityadmin@gmail.com")
            navigate("/shop10/adminhome");
          if (user.email == "suryaadmin@gmail.com")
            navigate("/shop04/admin/dashboard");
          if (user.email == "akshayaadmin@gmail.com") navigate("/shop02/admin");
          if (user.email == "thillaiadmin@gmail.com") navigate("/shop07/admin");
          if (user.email == "rethuadmin@gmail.com") navigate("/shop05/admin");
          if (user.email == "mahaadmin@gmail.com") navigate("/shop12/admin");
          if (user.email == "chetnaadmin@gmail.com")
            navigate("/shop11/Adminpage");
          if (user.email == "lasyaadmin@gmail.com") navigate("/shop06/admin");
          // if(user.email == "abhinandanadmin@gmail.com")
          //   navigate("");
          if (user.email == "sundariadmin@gmail.com") navigate("/shop14/admin");
          if (user.email == "abhiramadmin@gmail.com")
            navigate("/shop13/abhiramadmin");
          if (user.email == "hariniadmin@gmail.com") navigate("/shop17/admin");
          if (user.email == "sanjayadmin@gmail.com") navigate("/AdminAction");
          if (user.email == "dhanuadmin@gmail.com") navigate("/Shop16/Admin");
        }
      }
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
          {invalidCredentials && (
            <div>
              <p className="text-red-500">Invalid Credentials</p>
            </div>
          )}
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
          {invalidCredentials && (
            <div>
              <p className="text-red-500">Invalid Credentials</p>
            </div>
          )}
        </div>
        <div className="flex space-x-8">
          <button
            onClick={() => {
              isRegistering ? signUp() : signIn();
            }}
            className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600 mb-2"
          >
            {isRegistering ? "Register" : "Login"}
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
