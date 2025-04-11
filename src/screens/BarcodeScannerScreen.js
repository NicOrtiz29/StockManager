import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function BarcodeScannerScreen({ navigation, route }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const { onBarcodeScanned } = route.params || {};

  // Solicitar permisos
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Reiniciar bandera al montar
  useEffect(() => {
    setScanned(false);
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);
    setLoading(true);
  
    try {
      // Modo edición o callback personalizado
      if (route.params?.onBarcodeScanned) {
        route.params.onBarcodeScanned(data);
        await new Promise(resolve => setTimeout(resolve, 300));
        navigation.goBack();
        return;
      }
  
      // Modo búsqueda (validar existencia)
      const q = query(
        collection(db, 'productos'), 
        where('codigoBarras', '==', Number(data)) // Asegúrate que coincide con tu campo en Firestore
      );
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const producto = {
          id: doc.id,
          ...doc.data(),
          codigoBarras: doc.data().codigoBarras?.toString() || ''
        };
        
        if (route.params?.mode === "search") {
          // Navegar a detalles del producto encontrado
          navigation.navigate("ProductDetail", { productId: doc.id });
        } else {
          // Mostrar alerta informativa
          Alert.alert('Producto encontrado', `Nombre: ${producto.nombre}`);
        }
      } else {
        if (route.params?.mode === "create") {
          // Si estamos creando un nuevo producto, usar el código
          navigation.navigate("CreateProduct", { codigoBarras: data });
        } else {
          Alert.alert(
            'No encontrado', 
            '¿Deseas crear un nuevo producto con este código?',
            [
              { text: "Cancelar" },
              { 
                text: "Crear", 
                onPress: () => navigation.navigate("CreateProduct", { codigoBarras: data }) 
              }
            ]
          );
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Error al procesar el código');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
    backgroundColor: '#000', // fondo base oscuro
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
