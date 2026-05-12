import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { initializeAuth, getAuth, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// @ts-ignore
import { getReactNativePersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL:       process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId:         process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

const db: Database = getDatabase(app);

export { app, auth, db };