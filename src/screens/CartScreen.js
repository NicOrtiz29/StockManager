import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { updateStock } from '../services/productService';
import { registrarVenta } from '../services/ventaService';
import { auth } from '../config/firebaseConfig';

const CartScreen = ({ route, navigation }) => {
  const { cart, updateCart } = route.params;
  const [cartItems, setCartItems] = useState(cart);
  const [loading, setLoading] = useState(false);

  const updateQuantity = (productId, change) => {
    setCartItems(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (!existingItem) return prevCart;
      
      const newQuantity = existingItem.quantity + change;
      
      if (newQuantity > existingItem.stock) {
        Alert.alert('Stock insuficiente', `Solo hay ${existingItem.stock} unidades disponibles`);
        return prevCart;
      }
      
      if (newQuantity <= 0) {
        const newCart = prevCart.filter(item => item.id !== productId);
        updateCart(newCart); // Actualizar el carrito en la pantalla anterior
        return newCart;
      }
      
      const newCart = prevCart.map(item =>
        item.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      );
      updateCart(newCart); // Actualizar el carrito en la pantalla anterior
      return newCart;
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.precioVenta * item.quantity), 0
    );
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const total = calculateTotal();
      const usuarioId = auth.currentUser?.uid || null; // Si tienes usuarios autenticados
  
      // 1. Guardar la venta en Firestore
      const nuevaVenta = await registrarVenta(total, cartItems, usuarioId);
  
      // 2. Actualizar los stocks
      await Promise.all(
        cartItems.map(item => updateStock(item.id, item.quantity))
      );
  
      Alert.alert(
        'Compra exitosa', 
        `Venta registrada correctamente\nTotal: $${total.toFixed(2)}`
      );
  
      // 3. Vaciar el carrito
      setCartItems([]);
      updateCart([]);
  
      // 4. Redirigir al historial de ventas
      navigation.navigate('HistorialVentas');
  
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo completar la venta');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <LinearGradient colors={['#000428', '#004e92']} style={styles.fullScreen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Tu Carrito de Compras</Text>
        
        {cartItems.length === 0 ? (
          <Text style={styles.emptyText}>El carrito está vacío</Text>
        ) : (
          cartItems.map((item, index) => (
            <View key={index} style={styles.cartItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.nombre}</Text>
                <Text style={styles.itemPrice}>${item.precioVenta.toFixed(2)} c/u</Text>
              </View>
              
              <View style={styles.quantityRow}>
                <TouchableOpacity 
                  onPress={() => updateQuantity(item.id, -1)}
                  style={styles.quantityButton}
                >
                  <Ionicons name="remove" size={18} color="#FF9800" />
                </TouchableOpacity>
                
                <Text style={styles.quantity}>{item.quantity}</Text>
                
                <TouchableOpacity 
                  onPress={() => updateQuantity(item.id, 1)}
                  style={styles.quantityButton}
                  disabled={item.quantity >= item.stock}
                >
                  <Ionicons 
                    name="add" 
                    size={18} 
                    color={item.quantity < item.stock ? "#FF9800" : "#ccc"} 
                  />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.itemTotal}>
                ${(item.precioVenta * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))
        )}
        
        {cartItems.length > 0 && (
          <>
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total: ${calculateTotal().toFixed(2)}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.checkoutText}>Finalizar Compra</Text>
              )}
            </TouchableOpacity>
          </>
        )}
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
  emptyText: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 18,
    marginTop: 50,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  itemPrice: {
    color: 'white',
    fontSize: 14,
    opacity: 0.8,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  quantityButton: {
    padding: 5,
  },
  quantity: {
    color: 'white',
    fontSize: 16,
    marginHorizontal: 10,
    minWidth: 20,
    textAlign: 'center',
  },
  itemTotal: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
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
  checkoutButton: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CartScreen;