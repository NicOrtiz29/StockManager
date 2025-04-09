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
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { getProveedores, deleteProveedor } from "../services/productService";
import { Ionicons } from "@expo/vector-icons";

// Obtener dimensiones iniciales
const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isTablet = width >= 768;
const isLandscape = width > height;

const ProveedorListScreen = ({ navigation }) => {
  const [proveedores, setProveedores] = useState([]);
  const [filteredProveedores, setFilteredProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [dimensions, setDimensions] = useState({ width, height });

  // Manejar cambios de orientación
  useEffect(() => {
    const updateDimensions = ({ window }) => {
      setDimensions(window);
    };
    
    const subscription = Dimensions.addEventListener('change', updateDimensions);
    return () => subscription?.remove();
  }, []);

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
      <View style={[
        styles.searchContainer,
        isTablet && styles.tabletSearchContainer,
        isLandscape && styles.landscapeSearchContainer
      ]}>
        <View style={[
          styles.searchInputContainer,
          isTablet && styles.tabletSearchInputContainer
        ]}>
          <Ionicons 
            name="search" 
            size={isTablet ? 24 : 20} 
            color="#999" 
            style={styles.searchIcon} 
          />
          <TextInput
            style={[
              styles.searchInput,
              isTablet && styles.tabletSearchInput
            ]}
            placeholder="Buscar por nombre, teléfono o email..."
            placeholderTextColor="#999"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
          />
        </View>
        
        {searchTerm ? (
          <TouchableOpacity
            style={[
              styles.clearButton,
              isTablet && styles.tabletClearButton
            ]}
            onPress={() => setSearchTerm("")}
          >
            <Ionicons 
              name="close-circle" 
              size={isTablet ? 28 : 24} 
              color="#999" 
            />
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
          contentContainerStyle={[
            styles.listContent,
            isTablet && styles.tabletListContent
          ]}
          renderItem={({ item }) => (
            <View style={[
              styles.proveedorCard,
              isTablet && styles.tabletProveedorCard,
              isLandscape && styles.landscapeProveedorCard
            ]}>
              <View style={styles.cardHeader}>
                <Text style={[
                  styles.proveedorName,
                  isTablet && styles.tabletProveedorName
                ]}>{item.nombre}</Text>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("EditProveedor", { proveedorId: item.id })}
                    style={[
                      styles.editButton,
                      isTablet && styles.tabletEditButton
                    ]}
                  >
                    <Ionicons 
                      name="pencil" 
                      size={isTablet ? 22 : 18} 
                      color="white" 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteProveedor(item.id)}
                    style={[
                      styles.deleteButton,
                      isTablet && styles.tabletDeleteButton
                    ]}
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Ionicons 
                        name="trash" 
                        size={isTablet ? 22 : 18} 
                        color="white" 
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              
              {item.telefono && (
                <View style={styles.detailRow}>
                  <Ionicons 
                    name="call-outline" 
                    size={isTablet ? 20 : 16} 
                    color="rgba(255,255,255,0.7)" 
                    style={styles.detailIcon} 
                  />
                  <Text style={[
                    styles.detailValue,
                    isTablet && styles.tabletDetailValue
                  ]}>{item.telefono}</Text>
                </View>
              )}

              {item.email && (
                <View style={styles.detailRow}>
                  <Ionicons 
                    name="mail-outline" 
                    size={isTablet ? 20 : 16} 
                    color="rgba(255,255,255,0.7)" 
                    style={styles.detailIcon} 
                  />
                  <Text style={[
                    styles.detailValue,
                    isTablet && styles.tabletDetailValue
                  ]}>{item.email}</Text>
                </View>
              )}

              {item.notas && (
                <View style={styles.detailRow}>
                  <Ionicons 
                    name="document-text-outline" 
                    size={isTablet ? 20 : 16} 
                    color="rgba(255,255,255,0.7)" 
                    style={styles.detailIcon} 
                  />
                  <Text 
                    style={[
                      styles.detailValue,
                      isTablet && styles.tabletDetailValue
                    ]} 
                    numberOfLines={isTablet ? 3 : 2}
                  >
                    {item.notas}
                  </Text>
                </View>
              )}
            </View>
          )}
          numColumns={isLandscape ? 2 : 1}
          columnWrapperStyle={isLandscape && styles.columnWrapper}
          key={isLandscape ? 'two-column' : 'one-column'}
        />
      )}
      
      {/* Botón flotante de agregar */}
      <TouchableOpacity
        style={[
          styles.addButton,
          isTablet && styles.tabletAddButton,
          isLandscape && styles.landscapeAddButton
        ]}
        onPress={() => navigation.navigate("AddProveedor")}
      >
        <Ionicons 
          name="add" 
          size={isTablet ? 30 : 24} 
          color="white" 
        />
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
    padding: isTablet ? 20 : 15,
    paddingTop: isTablet ? 15 : 10,
    alignItems: 'center',
  },
  tabletSearchContainer: {
    paddingHorizontal: 30,
  },
  landscapeSearchContainer: {
    paddingHorizontal: 15,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: isTablet ? 20 : 15,
    height: isTablet ? 50 : 40,
    marginTop: isTablet ? 20 : 60,
  },
  tabletSearchInputContainer: {
    height: 50,
    marginTop: 20,
  },
  searchIcon: {
    marginRight: isTablet ? 15 : 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    height: isTablet ? 45 : 40,
    fontSize: isTablet ? 18 : 16,
  },
  tabletSearchInput: {
    fontSize: 18,
  },
  clearButton: {
    marginLeft: isTablet ? 15 : 10,
    padding: 5,
    marginTop: isTablet ? 20 : 60,
  },
  tabletClearButton: {
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  tabletListContent: {
    paddingHorizontal: 10,
  },
  proveedorCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: isTablet ? 20 : 15,
    marginBottom: 15,
    padding: isTablet ? 20 : 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  tabletProveedorCard: {
    width: '90%',
    alignSelf: 'center',
  },
  landscapeProveedorCard: {
    width: '48%',
    marginHorizontal: '1%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isTablet ? 15 : 10,
  },
  proveedorName: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  tabletProveedorName: {
    fontSize: 22,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: isTablet ? 12 : 8,
    alignItems: 'center',
  },
  detailIcon: {
    width: isTablet ? 30 : 24,
    marginRight: isTablet ? 10 : 5,
  },
  detailValue: {
    flex: 1,
    color: 'white',
    fontSize: isTablet ? 16 : 14,
  },
  tabletDetailValue: {
    fontSize: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  editButton: {
    width: isTablet ? 40 : 30,
    height: isTablet ? 40 : 30,
    borderRadius: isTablet ? 20 : 15,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: isTablet ? 15 : 10,
  },
  tabletEditButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  deleteButton: {
    width: isTablet ? 40 : 30,
    height: isTablet ? 40 : 30,
    borderRadius: isTablet ? 20 : 15,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: isTablet ? 15 : 10,
  },
  tabletDeleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: isTablet ? 30 : 20,
    right: isTablet ? 30 : 20,
    width: isTablet ? 70 : 60,
    height: isTablet ? 70 : 60,
    borderRadius: isTablet ? 35 : 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 1,
  },
  tabletAddButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  landscapeAddButton: {
    bottom: 15,
    right: 15,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: isTablet ? 18 : 16,
  },
  errorText: {
    color: '#ff5252',
    fontSize: isTablet ? 18 : 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: isTablet ? 15 : 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: isTablet ? 18 : 16,
  },
  noProveedoresText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: isTablet ? 18 : 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
});

export default ProveedorListScreen;