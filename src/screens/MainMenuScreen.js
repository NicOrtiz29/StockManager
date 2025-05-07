import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Tamaño del botón adaptativo
const getButtonSize = () => {
  if (width < 400) return width * 0.38;
  if (width < 768) return width * 0.3;
  return width * 0.22;
};

const BUTTON_SIZE = getButtonSize();

const MainMenuScreen = ({ navigation }) => {
  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Cerrar Sesión", onPress: () => navigation.replace('Login') },
      ]
    );
  };

  const menuItems = [
    { title: "Productos", icon: "list", action: () => navigation.navigate('AppTabs') },
    { title: "Agregar Producto", icon: "add-circle", action: () => navigation.navigate('AddProduct') },
    { title: "Proveedores", icon: "people", action: () => navigation.navigate('ProveedorList') },
    { title: "Familias", icon: "layers", action: () => navigation.navigate('FamilyList') },
    { title: "Aumentos", icon: "trending-up", action: () => navigation.navigate('BulkPriceUpdate') },
    { title: "Historial Ventas", icon: "receipt", action: () => navigation.navigate('HistorialVentas') },
    { title: "Agregar Usuario", icon: "person-add", action: () => navigation.navigate('AddUserScreen') },
    { title: "Usuarios", icon: "people-circle", action: () => navigation.navigate('UserList') },
    { title: "Cerrar Sesión", icon: "log-out", action: handleLogout },
  ];

  return (
    <LinearGradient colors={['#000428', '#004e92']} style={styles.gradient}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.header}> STOCK MANAGER </Text>

          <View style={styles.grid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.button, { width: BUTTON_SIZE, height: BUTTON_SIZE }]}
                onPress={item.action}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                  style={styles.buttonInner}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={item.icon} size={30} color="white" />
                  <Text style={styles.buttonText}>{item.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    padding: 15,
    paddingBottom: 40,
  },
  header: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    margin: 10,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonInner: {
    flex: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  buttonText: {
    color: 'white',
    marginTop: 10,
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
    width: '90%',
    lineHeight: 16,
    flexWrap: 'wrap',
  },
  
});

export default MainMenuScreen;
