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
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  createProduct,
  getProveedores,
  getFamilias,
  createFamilia,
} from "../services/productService";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const AddProductScreen = ({ navigation, route }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [porcentajeAumento, setPorcentajeAumento] = useState("30");
  const [stock, setStock] = useState("");
  const [proveedorId, setProveedorId] = useState("");
  const [familiaId, setFamiliaId] = useState("");
  const [codigoBarras, setCodigoBarras] = useState("");
  const [proveedores, setProveedores] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [mostrarCalculadora, setMostrarCalculadora] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stockMinimo, setStockMinimo] = useState("");
  const [showFamiliaModal, setShowFamiliaModal] = useState(false);
  const [newFamiliaNombre, setNewFamiliaNombre] = useState("");

  useEffect(() => {
    if (route.params?.codigoBarras) {
      setCodigoBarras(route.params.codigoBarras);
    }
  }, [route.params?.codigoBarras]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [proveedoresData, familiasData] = await Promise.all([
          getProveedores(),
          getFamilias(),
        ]);
        setProveedores(proveedoresData);
        setFamilias(familiasData);
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar los datos necesarios");
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    if (mostrarCalculadora && precioCompra && porcentajeAumento) {
      const precioCompraNum = parseFloat(precioCompra);
      const porcentajeNum = parseFloat(porcentajeAumento);

      if (!isNaN(precioCompraNum) && !isNaN(porcentajeNum)) {
        const nuevoPrecioVenta = precioCompraNum * (1 + porcentajeNum / 100);
        setPrecioVenta(nuevoPrecioVenta.toFixed(2));
      }
    }
  }, [precioCompra, porcentajeAumento, mostrarCalculadora]);

  const calcularMargen = () => {
    const precioV = parseFloat(precioVenta || 0);
    const precioC = parseFloat(precioCompra || 1);
    const margen = ((precioV - precioC) / precioC) * 100;
    return isNaN(margen) ? "0.00" : margen.toFixed(2);
  };

  const handleCreateProduct = async () => {
    if (
      !nombre ||
      !descripcion ||
      !precioVenta ||
      !precioCompra ||
      !stock ||
      !proveedorId
    ) {
      Alert.alert("Error", "Los campos marcados con * son obligatorios");
      return;
    }

    if (parseFloat(precioVenta) <= parseFloat(precioCompra)) {
      Alert.alert(
        "Error",
        "El precio de venta debe ser mayor al precio de compra"
      );
      return;
    }
    if (stockMinimo && parseInt(stock) < parseInt(stockMinimo)) {
      Alert.alert(
        "Advertencia",
        "El stock actual es menor que el stock mínimo definido"
      );
    }

    setLoading(true);
    try {
      await createProduct({
        nombre,
        descripcion,
        precioVenta: parseFloat(precioVenta),
        precioCompra: parseFloat(precioCompra),
        stock: parseInt(stock),
        stockMinimo: stockMinimo ? parseInt(stockMinimo) : null,
        proveedorId,
        familiaId: familiaId || null,
        codigoBarras: codigoBarras || null,
      });
      Alert.alert("Éxito", "Producto creado correctamente");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message || "Error al crear el producto");
    } finally {
      setLoading(false);
    }
  };

  const toggleCalculadora = () => {
    setMostrarCalculadora(!mostrarCalculadora);
  };

  const handleCreateFamilia = async () => {
    if (!newFamiliaNombre.trim()) return;

    try {
      await createFamilia(newFamiliaNombre.trim());
      Alert.alert("Éxito", "Familia creada correctamente");
      setNewFamiliaNombre("");
      setShowFamiliaModal(false);
      const familiasData = await getFamilias();
      setFamilias(familiasData);
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la familia");
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
            placeholder="Nombre del producto*"
            placeholderTextColor="#aaa"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
          />

          <TextInput
            placeholder="Descripción*"
            placeholderTextColor="#aaa"
            value={descripcion}
            onChangeText={setDescripcion}
            style={[styles.input, styles.multilineInput]}
            multiline
          />

          <View style={styles.priceContainer}>
            <TextInput
              placeholder="Precio de compra*"
              placeholderTextColor="#aaa"
              value={precioCompra}
              onChangeText={setPrecioCompra}
              keyboardType="numeric"
              style={[styles.input, styles.priceInput]}
            />
            <TouchableOpacity
              onPress={toggleCalculadora}
              style={styles.calculatorIconButton}
            >
              <Ionicons
                name={mostrarCalculadora ? "calculator" : "calculator-outline"}
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </View>

          {/* Eliminamos el calculatorButton original y movemos su contenido aquí */}
          {mostrarCalculadora && (
            <>
              <TextInput
                placeholder="Porcentaje de aumento (ej. 30)*"
                placeholderTextColor="#aaa"
                value={porcentajeAumento}
                onChangeText={setPorcentajeAumento}
                keyboardType="numeric"
                style={styles.input}
              />

              <View style={styles.marginInfo}>
                <Text style={styles.marginText}>
                  Margen de ganancia: {calcularMargen()}%
                </Text>
              </View>
            </>
          )}

          <TextInput
            placeholder="Precio de venta*"
            placeholderTextColor="#aaa"
            value={precioVenta}
            onChangeText={setPrecioVenta}
            keyboardType="numeric"
            style={styles.input}
            editable={!mostrarCalculadora}
          />

          <TextInput
            placeholder="Stock*"
            placeholderTextColor="#aaa"
            value={stock}
            onChangeText={setStock}
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            placeholder="Stock mínimo alerta (opcional)"
            placeholderTextColor="#aaa"
            value={stockMinimo}
            onChangeText={setStockMinimo}
            keyboardType="numeric"
            style={styles.input}
          />

          <View style={styles.barcodeContainer}>
            <TextInput
              placeholder="Código de Barras (opcional)"
              placeholderTextColor="#aaa"
              value={codigoBarras}
              onChangeText={setCodigoBarras}
              keyboardType="numeric"
              style={[styles.input, styles.barcodeInput]}
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("BarcodeScanner", { mode: "search" })
              }
              style={styles.scanButton}
            >
              <Ionicons name="barcode-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={proveedorId}
              onValueChange={setProveedorId}
              style={styles.picker}
              dropdownIconColor="white"
            >
              <Picker.Item
                label="Selecciona un proveedor*"
                value=""
                color="#aaa"
              />
              {proveedores.map((proveedor) => (
                <Picker.Item
                  key={proveedor.id}
                  label={proveedor.nombre}
                  value={proveedor.id}
                  color="black"
                />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={familiaId}
              onValueChange={setFamiliaId}
              style={styles.picker}
              dropdownIconColor="white"
              enabled={true} 
            >
              <Picker.Item
                label="Selecciona una familia (opcional)"
                value=""
                color="#aaa" // Cambiamos de #aaa a white
              />
              {familias.map((familia) => (
                <Picker.Item
                  key={familia.id}
                  label={familia.nombre}
                  value={familia.id}
                  color="black"
                />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            onPress={handleCreateProduct}
            style={styles.createButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.createButtonText}>Crear Producto</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal para agregar familia */}
      <Modal visible={showFamiliaModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={["#000428", "#004e92"]}
            style={styles.modalContent}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFamiliaModal(false)}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Nueva Familia</Text>

            <TextInput
              placeholder="Nombre de la familia (ej: Aceites)"
              placeholderTextColor="black"
              value={newFamiliaNombre}
              onChangeText={setNewFamiliaNombre}
              style={styles.modalInput}
            />

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateFamilia}
            >
              <Text style={styles.createButtonText}>Crear Familia</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
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
  calculatorButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  calculatorButtonText: {
    color: "white",
    fontWeight: "600",
    marginRight: 10,
  },
  marginInfo: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  marginText: {
    color: "white",
    fontWeight: "600",
  },
  pickerContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    color: "white",
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
  barcodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  barcodeInput: {
    flex: 1,
    marginRight: 10,
    marginBottom: 0, // Asegurarse que no tenga margen inferior
  },
  scanButton: {
    height: 50, // Misma altura que el input
    width: 50, // Ancho fijo para mantener proporción
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    width: "90%",
    borderRadius: 15,
    padding: 20,
    paddingTop: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  priceInput: {
    flex: 1,
    marginRight: 10,
    marginBottom: 0,
  },
  calculatorIconButton: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
});

export default AddProductScreen;
