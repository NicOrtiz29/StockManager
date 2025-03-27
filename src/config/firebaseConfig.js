// src/config/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBhInymqBkQ3hyw90CC8uuX7dOqEySw2DU",
  authDomain: "stock-manager-app-8c4ee.firebaseapp.com",
  projectId: "stock-manager-app-8c4ee",
  storageBucket: "stock-manager-app-8c4ee.appspot.com",
  messagingSenderId: "887170478122",
  appId: "1:887170478122:web:c6ee5ef6d981c1b624d353"
};

const app = initializeApp(firebaseConfig); // Inicializa Firebase

// Configurar persistencia de sesión
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app); // Inicializa Firestore

export { app, auth, db }; // Exporta app, auth y db