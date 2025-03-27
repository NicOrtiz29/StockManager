import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { register } from '../services/authService';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await register(email, password);
      Alert.alert('Registro exitoso');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Registrarse" onPress={handleRegister} />
    </View>
  );
};

export default RegisterScreen;