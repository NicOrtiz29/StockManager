import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bienvenido {user?.username}</Text>

      {/* Accesos comunes */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ProductList")}>
        <Text style={styles.buttonText}>Lista de Productos</Text>
      </TouchableOpacity>

      {/* Accesos exclusivos para admin */}
      {user?.role === "admin" && (
        <>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AddProduct")}>
            <Text style={styles.buttonText}>Agregar Producto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ProveedorList")}>
            <Text style={styles.buttonText}>Proveedores</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("FamilyList")}>
            <Text style={styles.buttonText}>Familias</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("BulkPriceUpdate")}>
            <Text style={styles.buttonText}>Aumentos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CartScreen")}>
            <Text style={styles.buttonText}>Carrito</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 15,
    backgroundColor: "#f2f2f2",
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#004e92",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default HomeScreen;
