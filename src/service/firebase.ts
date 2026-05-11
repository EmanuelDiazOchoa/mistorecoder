import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { initializeAuth, getAuth, Auth, browserLocalPersistence } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
const reactNativePersistence = {
  type: 'LOCAL' as const,
  async _isAvailable() { return true; },
  async _set(key: string, value: string) { await AsyncStorage.setItem(key, value); },
  async _get(key: string) { return AsyncStorage.getItem(key); },
  async _remove(key: string) { await AsyncStorage.removeItem(key); },
  _addListener(_key: string, _listener: unknown) {},
  _removeListener(_key: string, _listener: unknown) {},
};

let auth: Auth;
try {
  auth = initializeAuth(app, { persistence: reactNativePersistence });
} catch {
  auth = getAuth(app);
}

const db: Database = getDatabase(app);

export { app, auth, db };