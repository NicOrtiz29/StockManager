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
  StatusBar,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { getProveedores, deleteProveedor } from "../services/productService";
import { Ionicons } from "@expo/vector-icons";

const ProveedorListScreen = ({ navigation }) => {
  const [proveedores, setProveedores] = useState([]);
  const [filteredProveedores, setFilteredProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
 


  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const proveedoresData = await getProveedores();
      setProveedores(proveedoresData);
      setFilteredProveedores(proveedoresData);
    } catch (error) {
      console.error("Error cargando proveedores:", error);
      setError("Error al cargar los proveedores");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setFilteredProveedores(proveedores);
      return;
    }
  
    const filtered = proveedores.filter((proveedor) => {
      const nombreMatch = proveedor.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
      const telefonoMatch = proveedor.telefono ? String(proveedor.telefono).includes(searchTerm) : false;
      const emailMatch = proveedor.email?.toLowerCase().includes(searchTerm.toLowerCase());
  
      return nombreMatch || telefonoMatch || emailMatch;
    });
  
    setFilteredProveedores(filtered);
  };
  

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, proveedores]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleDeleteProveedor = async (proveedorId) => {
    Alert.alert(
      "Eliminar proveedor",
      "¿Estás seguro de que deseas eliminar este proveedor?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            setDeletingId(proveedorId);
            try {
              await deleteProveedor(proveedorId);
              // Eliminación exitosa, actualizar estado
              Alert.alert("Éxito", "Proveedor eliminado");
              setProveedores(prev => prev.filter(p => p.id !== proveedorId));
              setFilteredProveedores(prev => prev.filter(p => p.id !== proveedorId));
            } catch (error) {
              console.error("Error eliminando proveedor:", error);
              Alert.alert("Error", error.message);
            } finally {
              setDeletingId(null);
            }
          },
          style: "destructive",
        },
      ]
    );
  };
  

  if (loading) {
    return (
      <LinearGradient colors={['#000428', '#004e92']} style={styles.fullScreen}>
        <StatusBar translucent backgroundColor="transparent" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Cargando proveedores...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={['#000428', '#004e92']} style={styles.fullScreen}>
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
    <LinearGradient colors={['#000428', '#004e92']} style={styles.fullScreen}>
      <StatusBar translucent backgroundColor="transparent" />
      
      {/* Barra de búsqueda mejorada */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, teléfono o email..."
            placeholderTextColor="#999"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
          />
        </View>
        
        {searchTerm ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchTerm("")}
          >
            <Ionicons name="close-circle" size={24} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Lista de proveedores */}
      {filteredProveedores.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.noProveedoresText}>
            {searchTerm ? "No se encontraron resultados" : "No hay proveedores registrados"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProveedores}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.proveedorCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.proveedorName}>{item.nombre}</Text>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("EditProveedor", { proveedorId: item.id })}
                    style={styles.editButton}
                  >
                    <Ionicons name="pencil" size={18} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteProveedor(item.id)}
                    style={styles.deleteButton}
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Ionicons name="trash" size={18} color="white" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              
              {item.telefono && (
                <View style={styles.detailRow}>
                  <Ionicons name="call-outline" size={16} color="rgba(255,255,255,0.7)" style={styles.detailIcon} />
                  <Text style={styles.detailValue}>{item.telefono}</Text>
                </View>
              )}

              {item.email && (
                <View style={styles.detailRow}>
                  <Ionicons name="mail-outline" size={16} color="rgba(255,255,255,0.7)" style={styles.detailIcon} />
                  <Text style={styles.detailValue}>{item.email}</Text>
                </View>
              )}

              {item.notas && (
                <View style={styles.detailRow}>
                  <Ionicons name="document-text-outline" size={16} color="rgba(255,255,255,0.7)" style={styles.detailIcon} />
                  <Text style={styles.detailValue} numberOfLines={2}>{item.notas}</Text>
                </View>
              )}
            </View>
          )}
        />
      )}
      
      {/* Botón flotante de agregar */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddProveedor")}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    paddingTop: 10,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginTop:60,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    height: 40,
  },
  clearButton: {
    marginLeft: 10,
    padding: 5,
    marginTop:60,
  },
  listContent: {
    paddingBottom: 20,
  },
  proveedorCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  proveedorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  detailIcon: {
    width: 24,
    marginRight: 5,
  },
  detailValue: {
    flex: 1,
    color: 'white',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  editButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
  },
  errorText: {
    color: '#ff5252',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noProveedoresText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
  },
});

export default ProveedorListScreen;