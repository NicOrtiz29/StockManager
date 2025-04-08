import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
  StatusBar,
  BackHandler,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  getProducts,
  deleteProduct,
  searchProductByBarcode,
  getFamilias,
  createFamilia,
} from "../services/productService";
import { Ionicons } from "@expo/vector-icons";

const ProductListScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFamiliaModal, setShowFamiliaModal] = useState(false);
  const [newFamiliaNombre, setNewFamiliaNombre] = useState("");
  const [familias, setFamilias] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const productos = await getProducts();
      setProducts(productos);
      setFilteredProducts(productos);
    } catch (error) {
      console.error("Error cargando productos:", error);
      setError("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const loadFamilias = async () => {
    try {
      const familiasData = await getFamilias();
      setFamilias(familiasData);
    } catch (error) {
      console.error("Error loading familias:", error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        (product) =>
          product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.codigoBarras && product.codigoBarras.includes(searchTerm))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  useEffect(() => {
    const onBackPress = () => {
      if (cart.length > 0) {
        Alert.alert(
          "Carrito no vacío",
          "¿Seguro que quieres salir? Perderás los items del carrito",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Salir",
              onPress: () => navigation.navigate("MainMenu"),
            },
          ]
        );
        return true;
      }
      navigation.navigate("MainMenu");
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, [navigation, cart.length]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      loadFamilias();
    }, [])
  );

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((product) => {
      const nombreMatch = product.nombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const codigoBarrasStr = product.codigoBarras
        ? product.codigoBarras.toString()
        : "";
      const codigoMatch = codigoBarrasStr.includes(searchTerm);

      return nombreMatch || codigoMatch;
    });

    setFilteredProducts(filtered);
  };

  const handleDeleteProduct = async (productId) => {
    Alert.alert(
      "Eliminar producto",
      "¿Estás seguro de que deseas eliminar este producto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await deleteProduct(productId);
              Alert.alert("Éxito", "Producto eliminado correctamente");
              fetchData();
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleCreateFamilia = async () => {
    if (!newFamiliaNombre.trim()) return;

    try {
      await createFamilia(newFamiliaNombre.trim());
      Alert.alert("Éxito", "Familia creada correctamente");
      setNewFamiliaNombre("");
      setShowFamiliaModal(false);
      loadFamilias();
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la familia");
    }
  };

  const handleCartAction = (product, action) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (action === "add") {
        if (existingItem && existingItem.quantity >= product.stock) {
          Alert.alert("Error", "No hay suficiente stock disponible");
          return prevCart;
        }

        if (existingItem) {
          return prevCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prevCart, { ...product, quantity: 1 }];
      } else {
        if (existingItem && existingItem.quantity > 1) {
          return prevCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          );
        }
        return prevCart.filter((item) => item.id !== product.id);
      }
    });
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.productName}>{item.nombre}</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("EditProduct", { productId: item.id })
            }
            style={styles.editButton}
          >
            <Ionicons name="pencil" size={18} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteProduct(item.id)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {item.descripcion && (
        <Text style={styles.description}>{item.descripcion}</Text>
      )}

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Precio:</Text>
        <Text style={styles.detailValue}>${item.precioVenta}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Stock:</Text>
        <View style={styles.stockContainer}>
          <Text
            style={[
              styles.detailValue,
              item.stockMinimo !== null &&
                item.stock < item.stockMinimo &&
                styles.lowStock,
            ]}
          >
            {item.stock}
          </Text>
          {item.stockMinimo !== null && item.stock < item.stockMinimo && (
            <Ionicons
              name="warning"
              size={16}
              color="#ff5252"
              style={styles.warningIcon}
            />
          )}
        </View>
      </View>

      {item.familiaId && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Familia:</Text>
          <Text style={styles.detailValue}>
            {familias.find((f) => f.id === item.familiaId)?.nombre ||
              "Sin familia"}
          </Text>
        </View>
      )}

      {item.codigoBarras && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Código:</Text>
          <Text style={styles.detailValue}>{item.codigoBarras}</Text>
        </View>
      )}

      {/* Controles del carrito */}
      <View style={styles.cartControls}>
        {selectedProduct === item.id ? (
          <View style={styles.quantityControls}>
            <TouchableOpacity
              onPress={() => handleCartAction(item, "remove")}
              style={styles.controlButton}
            >
              <Ionicons name="remove" size={20} color="#FF9800" />
            </TouchableOpacity>

            <Text style={styles.quantityText}>
              {cart.find((p) => p.id === item.id)?.quantity || 0}
            </Text>

            <TouchableOpacity
              onPress={() => handleCartAction(item, "add")}
              style={styles.controlButton}
              disabled={item.stock <= 0}
            >
              <Ionicons
                name="add"
                size={20}
                color={item.stock > 0 ? "#FF9800" : "#ccc"}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setSelectedProduct(item.id)}
            style={styles.cartButton}
            disabled={item.stock <= 0}
          >
            <Ionicons
              name="cart"
              size={24}
              color={item.stock > 0 ? "#FF9800" : "#ccc"}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <LinearGradient colors={["#000428", "#004e92"]} style={styles.fullScreen}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={["#000428", "#004e92"]} style={styles.fullScreen}>
        <StatusBar translucent backgroundColor="transparent" />
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#000428", "#004e92"]} style={styles.fullScreen}>
      <StatusBar translucent backgroundColor="transparent" />

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o código..."
            placeholderTextColor="#999"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
          />
        </View>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={() =>
            navigation.navigate("BarcodeScanner", {
              mode: "search",
              onBarcodeScanned: (codigo) => {
                setSearchTerm(codigo);
                // Dispara la búsqueda automáticamente
                setTimeout(() => handleSearch(), 300);
              },
            })
          }
        >
          <Ionicons name="barcode-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Lista de productos */}
      {filteredProducts.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.noProductsText}>No se encontraron productos</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={renderProductItem}
        />
      )}

      {/* Botón flotante del carrito */}
      {cart.length > 0 && (
        <TouchableOpacity
          style={styles.floatingCart}
          onPress={() =>
            navigation.navigate("CartScreen", {
              cart,
              updateCart: (updatedCart) => setCart(updatedCart),
            })
          }
        >
          <Ionicons name="cart" size={28} color="white" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Modal de familia */}
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
              placeholderTextColor="#aaa"
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
  fullScreen: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    marginTop: 10,
  },
  errorText: {
    color: "#ff5252",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    padding: 15,
    paddingTop: 10,
    alignItems: "center",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "white",
    height: 40,
  },
  scanButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
  },
  noProductsText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
  },
  productCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    flex: 1,
  },
  description: {
    color: "rgba(255,255,255,0.7)",
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  detailLabel: {
    width: 80,
    color: "rgba(255,255,255,0.7)",
  },
  detailValue: {
    flex: 1,
    color: "white",
  },
  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  lowStock: {
    color: "#ff5252",
  },
  warningIcon: {
    marginLeft: 5,
  },
  actionsContainer: {
    flexDirection: "row",
  },
  editButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F44336",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  createButton: {
    backgroundColor: "#FF9800",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  createButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  cartControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  controlButton: {
    padding: 5,
  },
  quantityText: {
    marginHorizontal: 10,
    color: "white",
  },
  cartButton: {
    padding: 8,
  },
  floatingCart: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FF9800",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ProductListScreen;
