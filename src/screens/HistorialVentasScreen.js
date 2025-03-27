import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { obtenerHistorialVentas } from '../services/ventaService';

const HistorialVentasScreen = ({ navigation }) => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const historial = await obtenerHistorialVentas();
        setVentas(historial);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    cargarHistorial();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.ventaItem}
      onPress={() => navigation.navigate('DetalleVenta', { ventaId: item.id })}
    >
      <View style={styles.ventaHeader}>
        <Text style={styles.fecha}>
          {item.fecha.toLocaleDateString()} {item.fecha.toLocaleTimeString()}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#FF9800" />
      </View>
      <Text style={styles.total}>Total: ${item.total.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <LinearGradient colors={['#000428', '#004e92']} style={styles.fullScreen}>
        <ActivityIndicator size="large" color="white" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#000428', '#004e92']} style={styles.fullScreen}>
      <FlatList
        data={ventas}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay ventas registradas</Text>
        }
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    padding: 20
  },
  list: {
    paddingBottom: 20
  },
  ventaItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  ventaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  fecha: {
    color: 'white',
    fontSize: 16
  },
  total: {
    color: '#FF9800',
    fontSize: 18,
    fontWeight: 'bold'
  },
  emptyText: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16
  }
});

export default HistorialVentasScreen;