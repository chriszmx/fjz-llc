// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmKuh6fi1MSXBHviX_YBJbWYMsfAWJatQ",
  authDomain: "fjz-llc.firebaseapp.com",
  projectId: "fjz-llc",
  storageBucket: "fjz-llc.appspot.com",
  messagingSenderId: "640909814223",
  appId: "1:640909814223:web:d3324d86af75d62b404aba",
  measurementId: "G-2C0B94HC26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const functions = getFunctions(app);
const db = getFirestore(app);
const assignUserRole = httpsCallable(functions, 'assignUserRole');

export { app, analytics, auth, firestore, assignUserRole, functions, db };
