//@ts-ignore
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  inMemoryPersistence,
} from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCt-HbGqJeWDNJjJ0XKc5qppkrcbBHpHUY",
  authDomain: "ecomersmovil.firebaseapp.com",
  databaseURL: "https://ecomersmovil-default-rtdb.firebaseio.com",
  projectId: "ecomersmovil",
  storageBucket: "ecomersmovil.appspot.com",
  messagingSenderId: "392409110606",
  appId: "1:392409110606:web:692dd3035725af10ba0b1f"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];


let auth;

try {
  auth = getAuth(app); 
} catch (error) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

const db = getDatabase(app);

export { auth, db };
