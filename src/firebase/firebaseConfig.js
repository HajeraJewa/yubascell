// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnXNSRXK1yANyuKwVGtKPsAoXQ-aNAhFQ",
  authDomain: "eccomerce-gadget.firebaseapp.com",
  projectId: "eccomerce-gadget",
  storageBucket: "eccomerce-gadget.firebasestorage.app",
  messagingSenderId: "325025521311",
  appId: "1:325025521311:web:64b598989ceaf069d58caa",
  measurementId: "G-QH0QMJVMMC"
};

// ✅ Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Auth dan Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app;