import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyB-Tgz7OxacjvKFzsF6_diBEv-xgJt3D2Y",
  authDomain: "chat-application-fa5ad.firebaseapp.com",
  projectId: "chat-application-fa5ad",
  storageBucket: "chat-application-fa5ad.firebasestorage.app",
  messagingSenderId: "366677739927",
  appId: "1:366677739927:web:1251aa8e0dd5cde9369cd2"
};

export const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export const db=getFirestore()
export const storage=getStorage()