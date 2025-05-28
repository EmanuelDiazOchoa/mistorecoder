// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCt-HbGqJeWDNJjJ0XKc5qppkrcbBHpHUY",
  authDomain: "ecomersmovil.firebaseapp.com",
  databaseURL: "https://ecomersmovil-default-rtdb.firebaseio.com",
  projectId: "ecomersmovil",
  storageBucket: "ecomersmovil.firebasestorage.app",
  messagingSenderId: "392409110606",
  appId: "1:392409110606:web:692dd3035725af10ba0b1f"
};
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
