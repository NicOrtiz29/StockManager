import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCW_HoQF78-fUbTVZxTvac6nRPezOnKtzE",
  authDomain: "stock-ali.firebaseapp.com",
  projectId: "stock-ali",
  storageBucket: "stock-ali.firebasestorage.app",
  messagingSenderId: "877187602868",
  appId: "1:877187602868:web:8f5a0a1fba732004e3fae1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
let auth;

if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch (error) {
    console.error('Error initializing auth:', error);
    auth = getAuth(app);
  }
}

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };