import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDG3gN5yGhBKSfoWf_99UlLhmdgYDhKCS0",
  authDomain: "meu-painel-e6a63.firebaseapp.com",
  projectId: "meu-painel-e6a63",
  storageBucket: "meu-painel-e6a63.firebasestorage.app",
  messagingSenderId: "181326849052",
  appId: "1:181326849052:web:80ea9ed4a8e16672a96bd9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore (default database instance)
export const db = getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);
