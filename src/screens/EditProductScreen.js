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
import { Picker } from "@react-native-picker/picker";
import {
  updateProduct,
  getProductById,
  getProveedores,
  getFamilias,
} from "../services/productService";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const EditProductScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [porcentajeAumento, setPorcentajeAumento] = useState("30");
  const [stock, setStock] = useState("");
  const [proveedorId, setProveedorId] = useState("");
  const [familiaId, setFamiliaId] = useState("");
  const [proveedores, setProveedores] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [mostrarCalculadora, setMostrarCalculadora] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [codigoBarras, setCodigoBarras] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [product, proveedoresData, familiasData] = await Promise.all([
          getProductById(productId),
          getProveedores(),
          getFamilias(),
        ]);

        setNombre(product.nombre);
        setDescripcion(product.descripcion);
        setPrecioVenta(product.precioVenta?.toString() || "");
        setPrecioCompra(product.precioCompra?.toString() || "");
        setStock(product.stock.toString());
        setProveedorId(product.proveedorId || "");
        setFamiliaId(product.familiaId || "");
        setCodigoBarras(
          product.codigoBarras !== null && product.codigoBarras !== undefined
            ? product.codigoBarras.toString()
            : ""
        );
        setStockMinimo(product.stockMinimo?.toString() || "");

        setProveedores(proveedoresData);
        setFamilias(familiasData);

        if (product.precioVenta && product.precioCompra) {
          const porcentaje = (
            ((product.precioVenta - product.precioCompra) /
              product.precioCompra) *
            100
          ).toFixed(2);
          setPorcentajeAumento(porcentaje);
        }
      } catch (error) {
        Alert.alert("Error", "No se pudo cargar el producto");
        console.error(error);
      } finally {
        setInitialLoad(false);
      }
    };

    loadData();
  }, [productId]);

  useEffect(() => {
    if (mostrarCalculadora && precioCompra && porcentajeAumento) {
      const precioCompraNum = parseFloat(precioCompra);
      const porcentajeNum = parseFloat(porcentajeAumento);

      if (!isNaN(precioCompraNum)) {
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

  const handleUpdateProduct = async () => {
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
      await updateProduct(productId, {
        nombre,
        descripcion,
        precioVenta: parseFloat(precioVenta),
        precioCompra: parseFloat(precioCompra),
        stock: parseInt(stock),
        stockMinimo: stockMinimo ? parseInt(stockMinimo) : null,
        proveedorId,
        familiaId: familiaId || null,
        codigoBarras: codigoBarras ? codigoBarras : null,
      });
      Alert.alert("Éxito", "Producto actualizado correctamente");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message || "Error al actualizar el producto");
    } finally {
      setLoading(false);
    }
  };

  const toggleCalculadora = () => {
    setMostrarCalculadora(!mostrarCalculadora);
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
              onChangeText={(text) => setCodigoBarras(text.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              style={[styles.input, styles.barcodeInput]}
              maxLength={13}
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("BarcodeScanner", { mode: "edit" })
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
            >
              <Picker.Item
                label="Selecciona una familia (opcional)"
                value=""
                color="#aaa"
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
            onPress={handleUpdateProduct}
            style={styles.createButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.createButtonText}>Actualizar Producto</Text>
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
  barcodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  barcodeInput: {
    flex: 1,
    marginRight: 10,
    marginBottom: 0,
  },
  scanButton: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditProductScreen;