import React, { useContext } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { View, StatusBar, ActivityIndicator } from "react-native";
import { AuthContext } from '../context/AuthContext';
import HomeScreen from './AppTabs';
import LoginScreen from "../screens/LoginScreen";
import AppTabs from "./AppTabs";
import ProductListScreen from "../screens/ProductListScreen";
import BarcodeScannerScreen from "../screens/BarcodeScannerScreen";
import CartScreen from "../screens/CartScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import AddProductScreen from "../screens/AddProductScreen";
import EditProductScreen from "../screens/EditProductScreen";
import AddProveedorScreen from "../screens/AddProveedorScreen";
import ProveedorListScreen from "../screens/ProveedorListScreen";
import EditProveedorScreen from "../screens/EditProveedorScreen";
import BulkPriceUpdateScreen from "../screens/BulkPriceUpdateScreen";
import HistorialVentasScreen from "../screens/HistorialVentasScreen";
import DetalleVentaScreen from "../screens/DetalleVentaScreen";
import AddUserScreen from '../screens/AddUserScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

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
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            {/* ✅ AppTabs visible para todos los logueados */}
            <Stack.Screen name="AppTabs" component={AppTabs} />

            {/* 🔐 Admin routes */}
            {user.role === 'admin' && (
              <>
                <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} />
                <Stack.Screen name="AddProduct" component={AddProductScreen} />
                <Stack.Screen name="EditProduct" component={EditProductScreen} />
                <Stack.Screen name="ProveedorList" component={ProveedorListScreen} />
                <Stack.Screen name="AddProveedor" component={AddProveedorScreen} />
                <Stack.Screen name="EditProveedor" component={EditProveedorScreen} />
                <Stack.Screen name="BulkPriceUpdate" component={BulkPriceUpdateScreen} />
                <Stack.Screen name="HistorialVentas" component={HistorialVentasScreen} />
                <Stack.Screen name="DetalleVenta" component={DetalleVentaScreen} />
                <Stack.Screen name="AddUser" component={AddUserScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />

              </>
            )}

            {/* 🛒 Rutas comunes para todos los logueados */}
            <Stack.Screen name="ProductList" component={ProductListScreen} />
            <Stack.Screen name="CartScreen" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
          </>
        )}
      </Stack.Navigator>
    </>
  );
};

export default AppNavigator;
