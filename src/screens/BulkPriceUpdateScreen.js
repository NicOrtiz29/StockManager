import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  getProveedores,
  getFamilias,
  updateProductPrices,
} from "../services/productService";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const BulkPriceUpdateScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [proveedores, setProveedores] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [selectedType, setSelectedType] = useState("proveedor");
  const [selectedId, setSelectedId] = useState("");
  const [percentage, setPercentage] = useState("");
  const [fixedAmount, setFixedAmount] = useState("");
  const [updateType, setUpdateType] = useState("percentage");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [provData, famData] = await Promise.all([
          getProveedores(),
          getFamilias(),
        ]);
        setProveedores(provData);
        setFamilias(famData);
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleUpdate = async () => {
    // Validaciones
    if (!selectedId) {
      Alert.alert('Error', 'Selecciona un proveedor/familia');
      return;
    }
  
    const amount = updateType === 'percentage' ? percentage : fixedAmount;
    const numericValue = parseFloat(amount);
  
    if (isNaN(numericValue) || numericValue <= 0) {
      Alert.alert('Error', 'Ingresa un valor válido y positivo');
      return;
    }
  
    try {
      setLoading(true);
      
      // Ejecutar actualización
      const result = await updateProductPrices({
        type: selectedType,
        id: selectedId,
        updateType,
        value: numericValue
      });
  
      Alert.alert(
        'Actualización Exitosa',
        `Se actualizaron ${result.updated} productos\n` +
        `• Nuevo precio de compra\n` +
        `• Precio de venta ajustado automáticamente`
      );
      
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

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
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Aumento Masivo de Precios</Text>

          <View style={styles.section}>
            <Text style={styles.label}>Actualizar por:</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  selectedType === "proveedor" && styles.radioSelected,
                ]}
                onPress={() => setSelectedType("proveedor")}
              >
                <Text style={styles.radioText}>Proveedor</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  selectedType === "familia" && styles.radioSelected,
                ]}
                onPress={() => setSelectedType("familia")}
              >
                <Text style={styles.radioText}>Familia</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>
              {selectedType === "proveedor"
                ? "Seleccionar Proveedor"
                : "Seleccionar Familia"}
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedId}
                onValueChange={setSelectedId}
                style={styles.picker}
                dropdownIconColor="white"
              >
                <Picker.Item
                  label={`Selecciona un ${selectedType}`}
                  value=""
                  color="#aaa"
                />
                {(selectedType === "proveedor" ? proveedores : familias).map(
                  (item) => (
                    <Picker.Item
                      key={item.id}
                      label={item.nombre}
                      value={item.id}
                      color="black"
                    />
                  )
                )}
              </Picker>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Tipo de aumento:</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  updateType === "percentage" && styles.radioSelected,
                ]}
                onPress={() => setUpdateType("percentage")}
              >
                <Text style={styles.radioText}>Porcentaje</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  updateType === "fixed" && styles.radioSelected,
                ]}
                onPress={() => setUpdateType("fixed")}
              >
                <Text style={styles.radioText}>Monto Fijo</Text>
              </TouchableOpacity>
            </View>
          </View>

          {updateType === "percentage" ? (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Porcentaje de aumento:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Ej: 10 para 10%"
                value={percentage}
                onChangeText={setPercentage}
                placeholderTextColor="#aaa"
              />
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Monto fijo a aumentar:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Ej: 50 para $50"
                value={fixedAmount}
                onChangeText={setFixedAmount}
                placeholderTextColor="#aaa"
              />
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Aplicar Aumento</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    color: "white",
    marginBottom: 8,
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  radioSelected: {
    backgroundColor: "#FF9800",
    borderColor: "#FF9800",
  },
  radioText: {
    color: "white",
  },
  pickerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  picker: {
    height: 50,
    color: "white",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "white",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  button: {
    backgroundColor: "#FF9800",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
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

export default BulkPriceUpdateScreen;
