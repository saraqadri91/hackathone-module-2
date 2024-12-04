import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth,onAuthStateChanged, createUserWithEmailAndPassword,signInWithEmailAndPassword,sendEmailVerification,signOut,GoogleAuthProvider,signInWithPopup} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import{getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs}from"https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js"
const firebaseConfig = {
  apiKey: "AIzaSyBYtqicXERh64t6CO3eKZTWcQDGGf01Tlw",
  authDomain: "signup-form-c125a.firebaseapp.com",
  projectId: "signup-form-c125a",
  storageBucket: "signup-form-c125a.firebasestorage.app",
  messagingSenderId: "1054580943408",
  appId: "1:1054580943408:web:99829cb273e81f12d11bf5",
  measurementId: "G-93BQ0ZMK8B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
export{getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword, sendEmailVerification,signOut,onAuthStateChanged,GoogleAuthProvider,signInWithPopup}
export{getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs}