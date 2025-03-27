import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { resetPassword } from '../services/authService';

const ResetPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu email');
      return;
    }

    setLoading(true);
    const { success, error, message } = await resetPassword(email);
    
    if (success) {
      Alert.alert('Éxito', message);
    } else {
      Alert.alert('Error', error);
    }
    
    setLoading(false);
  };

  return (
    <LinearGradient colors={['#000428', '#004e92']} style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="key" size={50} color="rgba(255,255,255,0.7)" style={styles.icon} />
        <Text style={styles.title}>Recuperar Contraseña</Text>
        <Text style={styles.subtitle}>Ingresa tu email para recibir el enlace de recuperación</Text>
        
        <TextInput
          placeholder="Email"
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TouchableOpacity
          onPress={handleResetPassword}
          style={styles.button}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>ENVIAR ENLACE</Text>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: 'white',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ResetPasswordScreen;