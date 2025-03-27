import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  Text, 
  Image,
  Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { login } from '../services/authService';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigation.navigate('MainMenu');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <LinearGradient
      colors={['#000428', '#004e92']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo */}
        <Image
          source={require('../../assets/tln.png')}
          style={styles.logo}
        />
        
        {/* Título */}
        <Text style={styles.title}>TLN AUTORRADIO</Text>
        <Text style={styles.subtitle}>Iniciar Sesión</Text>

        {/* Campo Email */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
          <TextInput
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Campo Contraseña */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
          />
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={20} 
              color="rgba(255,255,255,0.7)" 
            />
          </TouchableOpacity>
        </View>

        {/* Botón de inicio de sesión */}
        <TouchableOpacity 
          onPress={handleLogin}
          style={styles.loginButton}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 30,
    alignItems: 'center',
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: 'white',
    height: 50,
    paddingVertical: 0, // Asegura que el texto esté centrado verticalmente
  },
  eyeIcon: {
    padding: 10,
  },
  loginButton: {
    width: '100%',
    height: 50,
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default LoginScreen;