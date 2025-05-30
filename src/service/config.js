import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyCt-HbGqJeWDNJjJ0XKc5qppkrcbBHpHUY",
  authDomain: "ecomersmovil.firebaseapp.com",
  projectId: "ecomersmovil",
  storageBucket: "ecomersmovil.firebasestorage.app",
  messagingSenderId: "392409110606",
  appId: "1:392409110606:web:692dd3035725af10ba0b1f"
};


let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}


let authInstance;


export const getFirebaseAuth = () => {
  if (!authInstance) {
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
  return authInstance;
};
