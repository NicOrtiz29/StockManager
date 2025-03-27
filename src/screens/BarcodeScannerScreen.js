import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Modal } from 'react-native';
import { Camera } from 'expo-camera';
import { searchProductByBarcode } from '../services/productService';

const BarcodeScannerScreen = ({ navigation, route }) => {
  const { mode = 'search' } = route.params || {}; // 'search' o 'add'
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
    //  console.log('Status del permiso:', status);  // Verifica el estado del permiso
      setHasPermission(status === 'granted');
    })();
  }, []);
  

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    
    if (mode === 'search') {
      await handleSearchProduct(data);
    } else {
      handleAddProduct(data);
    }
  };

  const handleSearchProduct = async (barcode) => {
    setLoading(true);
    try {
      const product = await searchProductByBarcode(barcode);
      
      if (product) {
        Alert.alert(
          'Producto encontrado',
          `Nombre: ${product.nombre}\nCódigo: ${barcode}`,
          [
            { 
              text: 'Ver detalles', 
              onPress: () => navigation.navigate('EditProduct', { productId: product.id }) 
            },
            { text: 'OK', style: 'cancel' }
          ]
        );
      } else {
        Alert.alert(
          'Producto no encontrado',
          `¿Deseas crear un nuevo producto con este código? (${barcode})`,
          [
            { 
              text: 'Crear producto', 
              onPress: () => navigation.navigate('AddProduct', { codigoBarras: barcode }) 
            },
            { text: 'Cancelar', style: 'cancel' }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo buscar el producto');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = (barcode) => {
    navigation.navigate('AddProduct', { codigoBarras: barcode });
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Modal transparent animationType="slide" visible={hasPermission === null}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Solicitando permiso para la cámara...</Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.noPermissionText}>Sin acceso a la cámara</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Buscando producto...</Text>
        </View>
      )}

      <Camera
        onBarCodeScanned={scanned || loading ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        barCodeScannerSettings={{
          barCodeTypes: [
            Camera.Constants.BarCodeType.ean13,
            Camera.Constants.BarCodeType.ean8,
            Camera.Constants.BarCodeType.upc_a,
            Camera.Constants.BarCodeType.upc_e,
            Camera.Constants.BarCodeType.code39,
            Camera.Constants.BarCodeType.code128,
          ],
        }}
      />

      <View style={styles.overlay}>
        <View style={styles.scanFrame} />
        <Text style={styles.instructions}>
          {mode === 'search' 
            ? 'Escanea el código de barras para buscar un producto' 
            : 'Escanea el código de barras para asignarlo al producto'}
        </Text>
      </View>

      {scanned && !loading && (
        <TouchableOpacity
          style={styles.scanAgainButton}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.scanAgainText}>Escanear de nuevo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro semitransparente
  },
  modalContent: {
    backgroundColor: '#004e92', // Fondo azul
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  noPermissionText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 100,
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  scanFrame: {
    width: 250,
    height: 150,
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 0, 0.7)',
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  instructions: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    padding: 15,
    borderRadius: 10,
  },
  scanAgainText: {
    color: 'white',
    fontSize: 16,
  },
});

export default BarcodeScannerScreen;
