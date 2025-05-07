import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener instalado @expo/vector-icons
import { db } from '../config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

// Detección de dispositivo
const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 350;

const UserListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!db) throw new Error('La instancia de Firestore no está disponible');

        const usersCollection = collection(db, 'usuarios');
        const querySnapshot = await getDocs(usersCollection);

        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(usersData);
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', `No se pudieron cargar los usuarios: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <LinearGradient colors={['#000428', '#004e92']} style={styles.fullScreen}>
      <SafeAreaView style={styles.fullScreen}>
        <ScrollView
          contentContainerStyle={[
            styles.listContent,
            isTablet && styles.tabletListContent,
          ]}
        >
          <Text style={styles.header}></Text>

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>Cargando usuarios...</Text>
            </View>
          ) : users.length > 0 ? (
            users.map((user) => (
              <View
                key={user.id}
                style={[
                  styles.productCard,
                  isTablet && styles.tabletProductCard,
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text
                    style={[
                      styles.productName,
                      isSmallDevice && styles.smallDeviceProductName,
                      isTablet && styles.tabletProductName,
                    ]}
                  >
                    {user.nombre || user.name || 'Nombre no disponible'}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.description,
                    isTablet && styles.tabletDescription,
                  ]}
                >
                  {user.email || 'Email no disponible'}
                </Text>

                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Rol:</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        isTablet && styles.tabletDetailValue,
                      ]}
                    >
                      {user.rol || 'Rol no definido'}
                    </Text>
                  </View>

                  {user.telefono && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Teléfono:</Text>
                      <Text style={styles.detailValue}>{user.telefono}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.center}>
              <Text style={styles.noProductsText}>
                No se encontraron usuarios
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Botón flotante */}
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate('AddUserScreen')} // Navega a la pantalla de agregar usuario
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: isTablet ? 18 : isSmallDevice ? 14 : 16,
  },
  header: {
    color: 'white',
    fontSize: isTablet ? 24 : 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 90,
  },
  listContent: {
    paddingBottom: 20,
  },
  tabletListContent: {
    paddingHorizontal: 10,
  },
  productCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: isTablet ? 20 : 15,
    marginBottom: 15,
    padding: isTablet ? 20 : 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  tabletProductCard: {
    width: isTablet ? '90%' : 'auto',
    alignSelf: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isTablet ? 15 : isSmallDevice ? 8 : 10,
  },
  productName: {
    fontSize: isTablet ? 22 : isSmallDevice ? 16 : 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  description: {
    color: 'rgba(255,255,255,0.7)',
    marginBottom: isTablet ? 12 : isSmallDevice ? 6 : 8,
    fontSize: isTablet ? 16 : isSmallDevice ? 13 : 14,
  },
  detailsContainer: {
    marginTop: isTablet ? 12 : isSmallDevice ? 5 : 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: isTablet ? 12 : isSmallDevice ? 6 : 8,
    alignItems: 'center',
    minWidth: isTablet ? '48%' : '100%',
  },
  detailLabel: {
    width: isTablet ? 120 : 80,
    color: 'rgba(255,255,255,0.7)',
    fontSize: isTablet ? 16 : isSmallDevice ? 13 : 14,
  },
  detailValue: {
    flex: 1,
    color: 'white',
    fontSize: isTablet ? 16 : isSmallDevice ? 13 : 14,
  },
  noProductsText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: isTablet ? 18 : isSmallDevice ? 14 : 16,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default UserListScreen;