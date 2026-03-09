import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// To use this, you must have a .env file with your Firebase config or replace these values.
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "dummy-api-key",
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "dummy-auth-domain.firebaseapp.com",
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "dummy-project-id",
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "dummy-store.appspot.com",
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:000000000000:web:dummy"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
