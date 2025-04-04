// src/screens/AddUserScreen.js

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const AddUserScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // o 'admin'
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email y contraseña son requeridos');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        email,
        role,
      });

      Alert.alert('Éxito', 'Usuario creado correctamente');
      setEmail('');
      setPassword('');
      setRole('user');
    } catch (error) {
      console.error('Error al crear usuario:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Nuevo Usuario</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.roleButton}
        onPress={() => setRole(role === 'admin' ? 'user' : 'admin')}
      >
        <Ionicons name="person-circle" size={20} color="white" />
        <Text style={styles.roleText}>Rol: {role} (tocar para cambiar)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateUser}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Crear Usuario</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AddUserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000428',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    color: 'white',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#004e92',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  roleText: {
    color: 'white',
    marginLeft: 10,
  },
  createButton: {
    backgroundColor: '#1e90ff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
