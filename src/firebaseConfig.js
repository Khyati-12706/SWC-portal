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
  REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=vit-swc-admin.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=vit-swc-admin
REACT_APP_FIREBASE_STORAGE_BUCKET=vit-swc-admin.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };
