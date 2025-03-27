import { auth } from '../config/firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth';

const AuthErrorMessages = {
  'auth/invalid-email': 'El formato del email es inválido',
  'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
  'auth/user-not-found': 'No existe una cuenta con este email',
  'auth/wrong-password': 'La contraseña es incorrecta',
  'auth/email-already-in-use': 'Este email ya está registrado',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
  'auth/too-many-requests': 'Demasiados intentos. Por favor intenta más tarde',
  'default': 'Ocurrió un error. Por favor intenta nuevamente'
};

const getFriendlyErrorMessage = (errorCode) => {
  return AuthErrorMessages[errorCode] || AuthErrorMessages['default'];
};

export const register = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email
      },
      error: null
    };
  } catch (error) {
    console.error("Error en registro:", error);
    return {
      success: false,
      user: null,
      error: getFriendlyErrorMessage(error.code)
    };
  }
};

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    if (!userCredential?.user?.uid) {
      console.error('Datos de usuario incompletos:', userCredential);
      throw new Error('La respuesta del servidor no contiene datos válidos');
    }

    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email
      },
      error: null
    };
  } catch (error) {
    console.error("Error en login:", {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    return {
      success: false,
      user: null,
      error: getFriendlyErrorMessage(error.code)
    };
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      error: null,
      message: 'Se ha enviado un email para restablecer tu contraseña'
    };
  } catch (error) {
    console.error("Error al resetear contraseña:", error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error.code),
      message: null
    };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return {
      success: false,
      error: 'Error al cerrar sesión'
    };
  }
};