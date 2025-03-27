import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { getProveedorById, updateProveedor } from "../services/productService";

const EditProveedorScreen = ({ route, navigation }) => {
  const { proveedorId } = route.params;
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [familias, setFamilias] = useState([]);


  useEffect(() => {
    const loadData = async () => {
      try {
        const proveedorData = await getProveedorById(proveedorId);
        console.log("Datos del proveedor:", proveedorData); // Verifica si muestra las familias
        
        if (proveedorData) {
          setNombre(proveedorData.nombre || "");
          setTelefono(proveedorData.telefono || "");
          setEmail(proveedorData.email || "");
          setDireccion(proveedorData.direccion || "");
          setNotas(proveedorData.notas || "");
  
          // Si proveedorData tiene familias, guárdalas en el estado
          if (proveedorData.familias) {
            setFamilias(proveedorData.familias);
            console.log("Familias cargadas:", proveedorData.familias);
          } else {
            console.log("No hay familias disponibles.");
          }
        }
      } catch (error) {
        Alert.alert("Error", "No se pudo cargar el proveedor");
        console.error("Error al cargar proveedor:", error);
      } finally {
        setInitialLoad(false);
      }
    };
  
    loadData();
  }, [proveedorId]);
  
  

  const handleUpdateProveedor = async () => {
    if (!nombre) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }
  
    setLoading(true);
    try {
      await updateProveedor(proveedorId, {
        nombre,
        telefono: telefono || null,
        email: email || null,
        direccion: direccion || null,
        notas: notas || null,
        familias, // Asegúrate de enviar las familias seleccionadas
      });
  
      Alert.alert("Éxito", "Proveedor actualizado correctamente");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message || "Error al actualizar el proveedor");
      console.error("Error al actualizar proveedor:", error);
    } finally {
      setLoading(false);
    }
  };
  
  

  if (initialLoad) {
    return (
      <LinearGradient colors={["#000428", "#004e92"]} style={styles.fullScreen}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#000428", "#004e92"]} style={styles.fullScreen}>
      <StatusBar translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Espacio para el header */}
          <View style={styles.formContainer} />

          <TextInput
            placeholder="Nombre del proveedor*"
            placeholderTextColor="#aaa"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
          />

          <TextInput
            placeholder="Teléfono (opcional)"
            placeholderTextColor="#aaa"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
            style={styles.input}
          />

          <TextInput
            placeholder="Email (opcional)"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            placeholder="Dirección (opcional)"
            placeholderTextColor="#aaa"
            value={direccion}
            onChangeText={setDireccion}
            style={styles.input}
          />

          <TextInput
            placeholder="Notas adicionales (opcional)"
            placeholderTextColor="#aaa"
            value={notas}
            onChangeText={setNotas}
            style={[styles.input, styles.multilineInput]}
            multiline
          />

          <TouchableOpacity
            onPress={handleUpdateProveedor}
            style={styles.createButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.createButtonText}>Actualizar Proveedor</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    paddingBottom: 100,
  },
  fullScreen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 15,
    paddingBottom: 100,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    color: "white",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  createButton: {
    backgroundColor: "#FF9800",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  createButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditProveedorScreen;