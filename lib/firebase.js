// Import Firebase core
import { initializeApp } from "firebase/app";

// ✅ Import Firestore (IMPORTANT)
import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";



// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBCGuP0-0u5qbIb2RjrP1Jtrm_0I5yc1wU",
  authDomain: "infinity-events-64946.firebaseapp.com",
  projectId: "infinity-events-64946",
  storageBucket: "infinity-events-64946.firebasestorage.app",
  messagingSenderId: "1006913110687",
  appId: "1:1006913110687:web:ad2c8857c73ed0781798aa"
};

// Initialize app
const app = initializeApp(firebaseConfig);

// ✅ EXPORT DATABASE (THIS FIXES YOUR ERROR)
export const db = getFirestore(app);

export const storage = getStorage(app);

export const auth = getAuth(app);