import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDG3gN5yGhBKSfoWf_99UlLhmdgYDhKCS0",
  authDomain: "meu-painel-e6a63.firebaseapp.com",
  projectId: "meu-painel-e6a63",
  messagingSenderId: "181326849052",
  appId: "1:181326849052:web:80ea9ed4a8e16672a96bd9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (default database instance)
export const db = getFirestore(app);

