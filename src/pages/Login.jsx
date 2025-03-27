// Login Page
import React, { useState } from "react";
import {getAuth,signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup} from "firebase/auth"; // Firebase Authentication
import { app } from "../db"; // Firebase App
import google from "../assets/google.jpg"; // Image

const auth = getAuth(app); // Authentication
const Google = new GoogleAuthProvider(); // Google Authentication

export default function Login({ onNavigateToSignup }) { // Pass navigation handler as a prop
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password

  const login = async () => {
    // If no email or password, show alert
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }
    // If password is less than 6 characters, show alert
    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    // Try to log in with email and password
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in successfully:", userCredential.user);
    } catch (error) {
      console.error("Error logging in:", error);
      alert(error.message);
    }
  };

  // Google Sign In
  const googlesignin = async () => {
    try {
      const result = await signInWithPopup(auth, Google);
      console.log("Google sign-in successful:", result.user);
    } catch (error) {
      console.error("Google sign-in error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="shadow-lg mt-[70px] text-center bg-gray-900 bg-opacity-80 rounded-xl p-6 border border-gray-500">
      <div className="text-[25px] text-white font-semibold">Login</div>
      {/* Input Fields */}
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email Address"
        className="w-[400px] h-[50px] mt-[10px] border-white rounded-lg px-3 bg-transparent text-white placeholder-gray-300 focus:outline-none"
        required/><br />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password"
        className="w-[400px] h-[50px] mt-[10px] border-white rounded-lg px-3 bg-transparent text-white placeholder-gray-300 focus:outline-none"
        required/><br />
      {/* Login Button */}
      <button type="button" onClick={login} className="bg-blue-800 text-white hover:bg-blue-600 rounded-xl h-[50px] w-[400px] mt-[20px]">
        Login
      </button>
      {/* Google Sign In */}
      <div className="flex flex-col mt-[20px]">
        <button onClick={googlesignin}
        className="flex items-center justify-center bg-blue-500 rounded-xl h-[50px] text-white hover:bg-blue-700 w-[400px] space-x-2">
          <img src={google} alt="google" className="w-9 h-9" />
          <span>Continue with Google</span>
        </button>
      </div>
      {/* Navigate to SignUp page */}
      <div className="text-[18px] text-white mt-[20px]">
        New to the Platform? <br />
        <button className="text-white font-semibold hover:font-bold hover:text-black" onClick={onNavigateToSignup}>
          Click Here
        </button>
      </div>
    </div>
  );
}