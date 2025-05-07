import { initializeApp } from 'firebase/app';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCW_HoQF78-fUbTVZxTvac6nRPezOnKtzE",
  authDomain: "stock-ali.firebaseapp.com",
  projectId: "stock-ali",
  storageBucket: "stock-ali.appspot.com",
  messagingSenderId: "877187602868",
  appId: "1:877187602868:web:8f5a0a1fba732004e3fae1",
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);

// Solución especial para React Native
let db;
try {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true, // Necesario para React Native
    });
  } else {
    db = getFirestore(app);
  }
} catch (error) {
  console.error('Error initializing Firestore:', error);
  db = getFirestore(app); // Fallback
}

// Inicialización de Auth
let auth;
try {
  if (Platform.OS === 'web') {
    auth = getAuth(app);
  } else {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
} catch (error) {
  console.error('Error initializing Auth:', error);
  auth = getAuth(app);
}

export { app, auth, db };