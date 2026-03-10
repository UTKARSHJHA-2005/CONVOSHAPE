// SignUp Page
import React, { useState } from "react";
import google from "../assets/google.png"; // Image
import { setDoc, doc } from 'firebase/firestore'; // Firebase Firestore
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Firebase Authentication
import { app, db } from "../db"; // db instance

const Google = new GoogleAuthProvider(); // Google Authentication
const auth = getAuth(app); // Authentication

export default function Signup({ onNavigateToLogin }) { // Pass Navigation handler as prop
  const [name, setName] = useState(""); // State for name
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  const [agreed, setAgreed] = useState(false); // State for agreement
  const [preview, setPreview] = useState(""); // State for preview

  const register = async () => {
    // If no name,email,password , show alert
    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }
    // If not agreed, show alert
    if (!agreed) {
      alert("You must agree to the terms and conditions");
      return;
    }
    // If password is less than 6 characters, show alert
    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    // Create user with email and password
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        id: userCredential.user.uid,
        blocked: [],
      });
      await setDoc(doc(db, "userchats", userCredential.user.uid), {
        chats: [],
      });
      console.log("User signed up successfully:", userCredential.user);
      alert("Sign-up successful!");
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.message);
    }
  };

  // Google Sign-in
  const googlesignin = async () => {
    try {
      const result = await signInWithPopup(auth, Google);

      const user = result.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          name: user.displayName || "",
          email: user.email || "",
          id: user.uid,
          blocked: [],
        },
        { merge: true } // IMPORTANT
      );

      await setDoc(
        doc(db, "userchats", user.uid),
        {
          chats: [],
        },
        { merge: true }
      );

      console.log("Google sign-up successful:", user);
      alert("Google sign-up successful!");
    } catch (error) {
      console.error("Google sign-up error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">

      <div className="shadow-lg text-center bg-gray-900 bg-opacity-80 rounded-xl p-6 border border-gray-500 w-full max-w-md">

        <div className="text-2xl font-semibold text-white mb-4">
          Sign Up
        </div>

        {/* Input Fields */}

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter the Name"
          className="w-full h-[50px] mt-2 border border-white rounded-lg px-3 bg-transparent text-white placeholder-gray-300 focus:outline-none"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email Address"
          className="w-full h-[50px] mt-3 border border-white rounded-lg px-3 bg-transparent text-white placeholder-gray-300 focus:outline-none"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          className="w-full h-[50px] mt-3 border border-white rounded-lg px-3 bg-transparent text-white placeholder-gray-300 focus:outline-none"
        />

        {/* Agreement */}

        <div className="mt-3 flex items-center justify-center space-x-2">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <p className="text-sm font-semibold text-white">
            Agree to the terms and conditions
          </p>
        </div>

        {/* Google Sign In */}

        <div className="flex flex-col mt-5">
          <button
            onClick={googlesignin}
            className="flex items-center justify-center bg-blue-500 rounded-xl h-[50px] text-white hover:bg-blue-700 w-full space-x-2"
          >
            <img src={google} alt="google" className="w-8 h-8" />
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Signup Button */}

        <button
          type="button"
          onClick={register}
          className="bg-blue-800 text-white hover:bg-blue-600 rounded-xl h-[50px] w-full mt-4"
        >
          Sign Up
        </button>

        {/* Navigate to Login */}

        <div className="mt-4 text-white text-sm">
          Already have an account?
          <br />
          <button
            onClick={onNavigateToLogin}
            className="text-white font-semibold hover:font-bold hover:text-black"
          >
            Click Here
          </button>
        </div>

      </div>

    </div>
  );
}