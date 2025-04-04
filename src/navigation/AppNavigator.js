import React, { useContext } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { View, StyleSheet, StatusBar, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from '../context/AuthContext';
import LoginScreen from "../screens/LoginScreen";
import AppTabs from "./AppTabs";
import AddProductScreen from "../screens/AddProductScreen";
import EditProductScreen from "../screens/EditProductScreen";
import AddProveedorScreen from "../screens/AddProveedorScreen";
import BarcodeScannerScreen from "../screens/BarcodeScannerScreen";
import MainMenuScreen from "../screens/MainMenuScreen";
import FamiliaManagementScreen from "../screens/FamiliaManagementScreen";
import ProductListScreen from "../screens/ProductListScreen";
import ProveedorListScreen from "../screens/ProveedorListScreen";
import EditProveedorScreen from "../screens/EditProveedorScreen";
import BulkPriceUpdateScreen from "../screens/BulkPriceUpdateScreen";
import CartScreen from "../screens/CartScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import HistorialVentasScreen from "../screens/HistorialVentasScreen";
import DetalleVentaScreen from "../screens/DetalleVentaScreen";
import AddUserScreen from '../screens/AddUserScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* Aquí puedes poner un spinner o splash screen */}
      </View>
    );
  }

   // 🔹 Agregar console.log para verificar el rol del usuario
   console.log('Usuario:', user);
   console.log('Rol del usuario:', user?.role);
 

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "transparent" },
        }}
      >
        {!user ? (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
        ) : (
          <>
            {/* Pantalla principal para usuarios autenticados */}
            <Stack.Screen name="MainMenu" component={MainMenuScreen} />

            {/* Pantallas accesibles para todos los usuarios */}
            <Stack.Screen name="AppTabs" component={AppTabs} />
            <Stack.Screen name="ProductList" component={ProductListScreen} />
            <Stack.Screen name="CartScreen" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} />

            {/* Pantallas solo para administradores */}
            {user.role === 'admin' && (
              <>
                <Stack.Screen
                  name="AddProduct"
                  component={AddProductScreen}
                  options={{
                    headerShown: true,
                    title: "Agregar Producto",
                    headerBackground: () => (
                      <LinearGradient
                        colors={["#000428", "#004e92"]}
                        style={{ flex: 1 }}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      />
                    ),
                    headerTintColor: "white",
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                      fontWeight: "bold",
                      fontSize: 18,
                    },
                    headerTransparent: true,
                    headerStyle: {
                      height: 80,
                      borderBottomWidth: 0,
                      elevation: 0,
                      shadowOpacity: 0,
                    },
                  }}
                />

                <Stack.Screen name="EditProduct" component={EditProductScreen} />
                <Stack.Screen name="ProveedorList" component={ProveedorListScreen} />
                <Stack.Screen name="AddProveedor" component={AddProveedorScreen} />
                <Stack.Screen name="EditProveedor" component={EditProveedorScreen} />
                <Stack.Screen name="FamilyList" component={FamiliaManagementScreen} />
                <Stack.Screen name="BulkPriceUpdate" component={BulkPriceUpdateScreen} />
                <Stack.Screen name="HistorialVentas" component={HistorialVentasScreen} />
                <Stack.Screen name="DetalleVenta" component={DetalleVentaScreen} />
                <Stack.Screen name="AddUser" component={AddUserScreen} options={{ title: 'Crear Usuario' }} />

              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </>
  );
};

export default AppNavigator;