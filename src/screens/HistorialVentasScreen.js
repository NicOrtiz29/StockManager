import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { obtenerHistorialVentas } from "../services/ventaService";

const HistorialVentasScreen = ({ navigation }) => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    try {
      setError(null);
      const historial = await obtenerHistorialVentas();

      // Asegurarnos que cada venta tenga un array items
      const ventasFormateadas = historial.map((venta) => ({
        ...venta,
        items: venta.items || [], // Si items es undefined, usar array vacío
        fecha: venta.fecha?.seconds
          ? new Date(venta.fecha.seconds * 1000) // Si es Timestamp de Firebase
          : new Date(venta.fecha) || new Date(), // Si ya es una fecha o undefined
      }));

      setVentas(ventasFormateadas);
    } catch (err) {
      console.error("Error al cargar historial:", err);
      setError("Error al cargar el historial");
      setVentas([]); // Asegurar que ventas sea un array
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    cargarDatos();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.ventaItem}
      onPress={() => navigation.navigate("DetalleVenta", { ventaId: item.id })}
    >
      <View style={styles.ventaHeader}>
        <Text style={styles.fecha}>
          {item.fecha instanceof Date && !isNaN(item.fecha)
            ? `${item.fecha.toLocaleDateString()} ${item.fecha.toLocaleTimeString()}`
            : "Fecha no disponible"}
        </Text>

        <Ionicons name="chevron-forward" size={20} color="#FF9800" />
      </View>
      <Text style={styles.total}>
        Total: ${item.total?.toFixed(2) || "0.00"}
      </Text>
      <Text style={styles.itemsCount}>
        {item.items?.length || 0} producto{item.items?.length !== 1 ? "s" : ""}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <LinearGradient colors={["#000428", "#004e92"]} style={styles.fullScreen}>
        <ActivityIndicator size="large" color="white" />
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={["#000428", "#004e92"]} style={styles.fullScreen}>
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={24} color="#ff4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={cargarDatos} style={styles.retryButton}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#000428", "#004e92"]} style={styles.fullScreen}>
      <FlatList
        data={ventas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF9800"]}
            tintColor="#FF9800"
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay ventas registradas</Text>
        }
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    padding: 20,
  },
  list: {
    paddingBottom: 20,
    marginTop: 70,
  },
  ventaItem: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  ventaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  fecha: {
    color: "white",
    fontSize: 16,
  },
  total: {
    color: "#FF9800",
    fontSize: 18,
    fontWeight: "bold",
  },
  itemsCount: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginTop: 5,
  },
  emptyText: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 18,
    marginVertical: 10,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 5,
  },
  retryText: {
    color: "white",
  },
});

export default HistorialVentasScreen;
