// DetalleVentaScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { obtenerDetalleVenta } from '../services/ventaService'; // Asegúrate de importar el servicio

const DetalleVentaScreen = ({ route }) => {
  const { ventaId } = route.params; // El ID de la venta que viene desde la navegación
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        const detalle = await obtenerDetalleVenta(ventaId);
        setVenta(detalle); // Guardamos la venta con los productos
        setError(null);
      } catch (err) {
        console.error('Error al cargar detalle:', err);
        setError('Error al cargar el detalle de la venta');
        setVenta(null);
      } finally {
        setLoading(false);
      }
    };

    cargarDetalle(); // Cargamos los datos cuando el componente se monta
  }, [ventaId]); // Solo se ejecutará cuando `ventaId` cambie

  if (loading) {
    return (
      <LinearGradient colors={['#000428', '#004e92']} style={styles.fullScreen}>
        <ActivityIndicator size="large" color="white" />
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={['#000428', '#004e92']} style={styles.fullScreen}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#000428', '#004e92']} style={styles.fullScreen}>
      <View style={styles.container}>
        <Text style={styles.title}>Detalle de Venta #{ventaId}</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Fecha:</Text>
          <Text style={styles.infoValue}>
            {venta.fecha.toDate().toLocaleDateString()} {venta.fecha.toDate().toLocaleTimeString()}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Productos:</Text>

        <FlatList
  data={venta.items} // Cambié productos por items
  keyExtractor={(item, index) => item.productoId || `item-${index}`} // Asegúrate de usar el campo correcto para el id
  renderItem={({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.productName}>{item.nombre || 'Producto sin nombre'}</Text>
      <Text style={styles.productDetail}>
        {item.cantidad || 0} x ${(item.precioUnitario || 0).toFixed(2)} = ${(item.precioUnitario * (item.cantidad || 0)).toFixed(2)}
      </Text>
    </View>
  )}
  ListEmptyComponent={
    <Text style={styles.emptyText}>No hay productos en esta venta</Text>
  }
/>


        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>TOTAL: ${venta.total?.toFixed(2) || '0.00'}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    padding: 20,
  },
  container: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  infoLabel: {
    color: '#FF9800',
    fontWeight: 'bold',
    marginRight: 5,
  },
  infoValue: {
    color: 'white',
  },
  sectionTitle: {
    color: '#FF9800',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  itemContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  productName: {
    color: 'white',
    fontSize: 16,
  },
  productDetail: {
    color: '#FF9800',
    fontSize: 14,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 20,
  },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
    paddingTop: 15,
    marginTop: 15,
  },
  totalText: {
    color: '#FF9800',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default DetalleVentaScreen;
