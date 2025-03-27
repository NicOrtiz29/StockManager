import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const CheckoutScreen = ({ route, navigation }) => {
  const { cart } = route.params;
  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.precioVenta * item.quantity), 0);
  };

  const handleConfirmPurchase = async () => {
    setLoading(true);
    try {
      // Aquí iría la lógica para confirmar la compra
      // y actualizar los stocks en tu base de datos
      
      Alert.alert('Compra exitosa', 'Tu pedido ha sido procesado correctamente');
      navigation.navigate('ProductList'); // O la pantalla que corresponda
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar la compra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#000428', '#004e92']} style={styles.fullScreen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Resumen de Compra</Text>
        
        {cart.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.nombre}</Text>
            <Text style={styles.itemDetails}>
              {item.quantity} x ${item.precioVenta.toFixed(2)} = ${(item.quantity * item.precioVenta).toFixed(2)}
            </Text>
          </View>
        ))}
        
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: ${calculateTotal().toFixed(2)}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handleConfirmPurchase}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirmar Compra</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDetails: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  totalContainer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  totalText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  confirmButton: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CheckoutScreen;