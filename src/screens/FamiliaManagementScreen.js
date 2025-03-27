import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getFamilias, createFamilia, deleteFamilia } from "../services/productService";
import { LinearGradient } from "expo-linear-gradient";

const FamiliaManagementScreen = ({ navigation }) => {
  const [familias, setFamilias] = useState([]);
  const [newFamiliaNombre, setNewFamiliaNombre] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const loadFamilias = async () => {
    try {
      const familiasData = await getFamilias();
      setFamilias(familiasData);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las familias");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFamilia = async () => {
    if (!newFamiliaNombre.trim()) {
      Alert.alert("Error", "Debe ingresar un nombre para la familia");
      return;
    }

    setCreating(true);
    try {
      await createFamilia(newFamiliaNombre.trim());
      Alert.alert("Éxito", "Familia creada correctamente");
      setNewFamiliaNombre("");
      loadFamilias();
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo crear la familia");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteFamilia = async (id) => {
    Alert.alert(
      "Eliminar Familia",
      "¿Estás seguro de que deseas eliminar esta familia?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await deleteFamilia(id);
              Alert.alert("Éxito", "Familia eliminada correctamente");
              loadFamilias();
            } catch (error) {
              Alert.alert("Error", error.message || "No se pudo eliminar la familia");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  useEffect(() => {
    loadFamilias();
  }, []);

  if (loading) {
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
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Gestión de Familias</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre de la nueva familia"
            placeholderTextColor="#aaa"
            value={newFamiliaNombre}
            onChangeText={setNewFamiliaNombre}
            onSubmitEditing={handleCreateFamilia}
          />
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={handleCreateFamilia}
            disabled={creating}
          >
            {creating ? (
              <ActivityIndicator color="white" />
            ) : (
              <Ionicons name="add" size={24} color="white" />
            )}
          </TouchableOpacity>
        </View>

        <FlatList
          data={familias}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.familiaItem}>
              <Text style={styles.familiaNombre}>{item.nombre}</Text>
              <TouchableOpacity onPress={() => handleDeleteFamilia(item.id)}>
                <Ionicons name="trash-outline" size={24} color="#ff5252" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay familias registradas</Text>
            </View>
          }
          contentContainerStyle={styles.listContentContainer}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginVertical: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 26,
    marginTop:15,
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 15,
    borderRadius: 10,
    color: "white",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  addButton: {
    width: 50,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  listContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  familiaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  familiaNombre: {
    fontSize: 16,
    color: "white",
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 16,
  },
});

export default FamiliaManagementScreen;