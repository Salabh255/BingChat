
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCtsaa1fae-BHUYb6wJeFvfw-HRg9FPKEg",
  authDomain: "bingchat-cd2e7.firebaseapp.com",
  projectId: "bingchat-cd2e7",
  storageBucket: "bingchat-cd2e7.appspot.com",
  messagingSenderId: "1030142863464",
  appId: "1:1030142863464:web:e242b2a3aac2d8dbf4f3dd",
  measurementId: "G-E0NS54RYPJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();