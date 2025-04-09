// src/config/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyBhInymqBkQ3hyw90CC8uuX7dOqEySw2DU",
  authDomain: "stock-manager-app-8c4ee.firebaseapp.com",
  projectId: "stock-manager-app-8c4ee",
  storageBucket: "stock-manager-app-8c4ee.appspot.com",
  messagingSenderId: "887170478122",
  appId: "1:887170478122:web:c6ee5ef6d981c1b624d353"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// ⚠️ Autenticación compatible con web y móvil
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app); // Web no necesita persistencia personalizada
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

// Inicializar Firestore
const db = getFirestore(app);

export { app, auth, db };
