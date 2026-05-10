import { initializeApp, getApps, getApp } from 'firebase/app';

import {
  initializeAuth,
  getAuth,
} from 'firebase/auth';

import * as authModule from 'firebase/auth';

import { getDatabase } from 'firebase/database';

import AsyncStorage from '@react-native-async-storage/async-storage';

const getReactNativePersistence =
  (authModule as any).getReactNativePersistence;

const firebaseConfig = {
  apiKey: "AIzaSyCt-HbGqJeWDNJjJ0XKc5qppkrcbBHpHUY",
  authDomain: "ecomersmovil.firebaseapp.com",
  databaseURL: "https://ecomersmovil-default-rtdb.firebaseio.com",
  projectId: "ecomersmovil",
  storageBucket: "ecomersmovil.firebasestorage.app",
  messagingSenderId: "392409110606",
  appId: "1:392409110606:web:692dd3035725af10ba0b1f"
};

console.log('Firebase config:', firebaseConfig);

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  auth = getAuth(app);
}

const db = getDatabase(app);

export { app, auth, db };