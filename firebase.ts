import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD-e5U_-w76KJLIGZoNaO88mBg0wRXH6Lw",
  authDomain: "nexus-tools-9bab6.firebaseapp.com",
  projectId: "nexus-tools-9bab6",
  storageBucket: "nexus-tools-9bab6.firebasestorage.app",
  messagingSenderId: "920520366956",
  appId: "1:920520366956:web:2847f9bbeb08312427b149"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);