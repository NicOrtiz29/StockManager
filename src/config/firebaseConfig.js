import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBhInymqBkQ3hyw90CC8uuX7dOqEySw2DU",
  authDomain: "stock-manager-app-8c4ee.firebaseapp.com",
  projectId: "stock-manager-app-8c4ee",
  storageBucket: "stock-manager-app-8c4ee.appspot.com",
  messagingSenderId: "887170478122",
  appId: "1:887170478122:web:c6ee5ef6d981c1b624d353"
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