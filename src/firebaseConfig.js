// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDsNyy0N8zA-muW_k5Fe5jUfbGGalXEb4k",
  authDomain: "vit-swc-admin.firebaseapp.com",
  projectId: "vit-swc-admin",
  storageBucket: "vit-swc-admin.firebasestorage.app",
  messagingSenderId: "684394450806",
  appId: "1:684394450806:web:3cb309535b76ec16027457",
  measurementId: "G-2174GVT6GH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };
