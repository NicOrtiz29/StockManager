import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator,Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function BarcodeScannerScreen({ navigation, route }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const { onBarcodeScanned } = route.params || {};

  // Solicitar permisos
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Manejo del escaneo
  const handleBarCodeScanned = async ({ data }) => {
    setLoading(true);
    
    try {
      if (onBarcodeScanned) {
        // Primero actualizamos el código
        onBarcodeScanned(data);
        // Esperamos un breve momento antes de navegar
        await new Promise(resolve => setTimeout(resolve, 300));
        navigation.goBack();
        return;
      }
  
      // Resto del código para búsqueda...
    } catch (error) {
      Alert.alert('Error', 'Error al procesar el código');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Estados de permisos
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Solicitando permisos...</Text>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Sin acceso a la cámara</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={loading ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        barCodeTypes={[
          BarCodeScanner.Constants.BarCodeType.ean13,
          BarCodeScanner.Constants.BarCodeType.ean8,
          BarCodeScanner.Constants.BarCodeType.upc_a,
          BarCodeScanner.Constants.BarCodeType.upc_e,
          BarCodeScanner.Constants.BarCodeType.code39,
          BarCodeScanner.Constants.BarCodeType.code128
        ]}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      <View style={styles.overlay}>
        <View style={styles.scanFrame} />
        <Text style={styles.scanText}>Enfoca un código de barras</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    borderRadius: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 150,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
  },
  scanText: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
});