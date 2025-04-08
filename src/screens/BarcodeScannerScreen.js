// BarcodeScannerScreen.js - Versión final optimizada
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, Alert, ActivityIndicator } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function BarcodeScannerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  // Solicitar permisos
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Manejo del escaneo
  const handleBarCodeScanned = async ({ data }) => {
    if (!scanned) {
      setScanned(true);
      setLoading(true);
      
      try {
        // 1. Buscar producto en Firestore
        const q = query(collection(db, 'productos'), where('codigoBarra', '==', data));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const product = snapshot.docs[0].data();
          Alert.alert(
            'Producto encontrado',
            `Nombre: ${product.nombre}\nPrecio: $${product.precio}`
          );
        } else {
          Alert.alert(
            'No encontrado',
            `¿Deseas agregar el producto con código ${data}?`,
            [
              { text: 'Cancelar', onPress: () => setScanned(false) },
              { text: 'Agregar', onPress: () => navigation.navigate('AddProduct', { barcode: data }) }
            ]
          );
        }
      } catch (error) {
        Alert.alert('Error', 'Error al buscar el producto');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Estados de permisos
  if (hasPermission === null) return <Text>Solicitando permisos...</Text>;
  if (hasPermission === false) return <Text>Sin acceso a la cámara</Text>;

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.ean13, BarCodeScanner.Constants.BarCodeType.ean8]}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {scanned && (
        <Button 
          title="Escanear de nuevo" 
          onPress={() => setScanned(false)} 
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 20,
  }
});