import React, { useState } from "react";
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
import { createProveedor } from "../services/productService";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const AddProveedorScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateProveedor = async () => {
    if (!nombre || !telefono || !email) {
      Alert.alert("Error", "Nombre, teléfono y email son obligatorios");
      return;
    }

    setLoading(true);
    try {
      await createProveedor({ nombre, telefono, email, notas });
      Alert.alert("Éxito", "Proveedor creado correctamente");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

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
            placeholder="Nombre*"
            placeholderTextColor="#aaa"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
          />

          <TextInput
            placeholder="Teléfono*"
            placeholderTextColor="#aaa"
            value={telefono}
            onChangeText={setTelefono}
            style={styles.input}
            keyboardType="phone-pad"
          />

          <TextInput
            placeholder="Email*"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Notas (opcional)"
            placeholderTextColor="#aaa"
            value={notas}
            onChangeText={setNotas}
            style={[styles.input, styles.multilineInput]}
            multiline
          />

          <TouchableOpacity
            onPress={handleCreateProveedor}
            style={styles.createButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.createButtonText}>Crear Proveedor</Text>
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
    backgroundColor: "#4CAF50",
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
});

export default AddProveedorScreen;