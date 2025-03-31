import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
// En versiones recientes, CameraType se importa por separado
import { CameraType } from 'expo-camera';
import { searchProductByBarcode } from "../services/productService";
import { Ionicons } from "@expo/vector-icons";

const BarcodeScannerScreen = ({ navigation, route }) => {
  const { mode = "search" } = route.params || {};
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);
  const [cameraType, setCameraType] = useState(CameraType.back);
  
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");

        if (status !== "granted") {
          Alert.alert(
            "Permiso requerido",
            "Necesitamos acceso a tu cámara para escanear códigos",
            [
              {
                text: "Abrir configuración",
                onPress: () => Linking.openSettings(),
              },
              {
                text: "Cancelar",
                style: "cancel",
                onPress: () => navigation.goBack(),
              },
            ]
          );
        }
      } catch (error) {
        console.error("Error al solicitar permisos:", error);
        setHasPermission(false);
      }
    };

    requestPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || loading) return;

    setScanned(true);
    setLoading(true);

    try {
      console.log(`Código escaneado: ${data} (Tipo: ${type})`);

      if (mode === "search") {
        await handleSearchProduct(data);
      } else {
        handleAddProduct(data);
      }
    } catch (error) {
      console.error("Error en escaneo:", error);
      Alert.alert("Error", "Ocurrió un problema al procesar el código");
    } finally {
      setLoading(false);
    }
  };

  const toggleCameraType = () => {
    setCameraType((prevType) =>
      prevType === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Solicitando permisos...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionDeniedContainer}>
        <Text style={styles.permissionDeniedText}>
          No se otorgaron permisos para usar la cámara
        </Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => Linking.openSettings()}
        >
          <Text style={styles.settingsButtonText}>Abrir configuración</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={setCameraRef}
        style={styles.camera}
        type={cameraType} // Usa el estado directamente
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: [
            Camera.Constants.BarCodeType.ean13,
            Camera.Constants.BarCodeType.ean8,
          ],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.scanHint}>
            {mode === "search" ? "ESCANEAR PRODUCTO" : "AGREGAR NUEVO PRODUCTO"}
          </Text>
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.processingText}>Procesando...</Text>
          </View>
        )}
      </Camera>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
          <Ionicons name="camera-reverse" size={32} color="white" />
        </TouchableOpacity>

        {scanned && (
          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.scanAgainText}>Escanear otro</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
  },
  permissionDeniedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  permissionDeniedText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  settingsButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
  },
  settingsButtonText: {
    color: "white",
    fontSize: 16,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 250,
    height: 150,
    borderWidth: 2,
    borderColor: "#FF9800",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
  },
  scanHint: {
    marginTop: 20,
    color: "white",
    fontSize: 16,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 5,
  },
});

export default BarcodeScannerScreen;
