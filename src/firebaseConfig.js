// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// .env template:
// REACT_APP_FIREBASE_API_KEY=your-api-key
// REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
// REACT_APP_FIREBASE_PROJECT_ID=your-project-id
// REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
// REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
// REACT_APP_FIREBASE_APP_ID=your-app-id
// REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id

const firebaseConfig = {
  apiKey: 'AIzaSyAeDiM6v5h-YlS-m9cJMGagM5f7cYSqlcM', // User-provided new API key
  authDomain: 'vit-swc-admin.firebaseapp.com',
  projectId: 'vit-swc-admin',
  storageBucket: 'vit-swc-admin.appspot.com',
  messagingSenderId: '684394450806', // Example value, replace with your actual sender ID
  appId: '1:684394450806:web:3cb309535b76ec16027457', // Example value, replace with your actual app ID
  measurementId: 'G-2174GVT6GH' // Example value, replace with your actual measurement ID
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };
