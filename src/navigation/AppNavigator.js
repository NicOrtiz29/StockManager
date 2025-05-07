import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, StyleSheet, StatusBar, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
import AddUserScreen from "../screens/AddUserScreen";
import ImportExcelScreen from "../screens/ImportExcelScreen";
import UserListScreen from "../screens/UserListScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // Ocultamos todos los headers por defecto
          cardStyle: {
            backgroundColor: "transparent",
          },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen name="MainMenu" component={MainMenuScreen} />

        {/* Pantalla de Lista de Productos con header personalizado */}
        <Stack.Screen
          name="ProductList"
          component={ProductListScreen}
          options={{
            headerBackTitle: "Menú",
            headerShown: false, // Asegura que no haya header
          }}
        />

        <Stack.Screen
          name="AppTabs"
          component={AppTabs}
          options={{ headerShown: false }}
        />

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
              height: 80, // Igual que el de "Lista de Productos"
              borderBottomWidth: 0,
              elevation: 0,
              shadowOpacity: 0,
            },
          }}
        />

        <Stack.Screen
          name="EditProduct"
          component={EditProductScreen}
          options={{
            headerShown: true,
            title: "Editar producto",
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
              height: 80, // Igual que el de "Lista de Productos"
              borderBottomWidth: 0,
              elevation: 0,
              shadowOpacity: 0,
            },
          }}
        />

        <Stack.Screen
          name="ProveedorList"
          component={ProveedorListScreen}
          options={{
            headerShown: true,
            title: "Proveedores",
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
              height: 80, // Igual que el de "Lista de Productos"
              borderBottomWidth: 0,
              elevation: 0,
              shadowOpacity: 0,
            },
          }}
        />

        <Stack.Screen
          name="AddProveedor"
          component={AddProveedorScreen}
          options={{
            headerShown: true,
            title: "Agregar Proveedor",
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
              height: 80, // Igual que el de "Lista de Productos"
              borderBottomWidth: 0,
              elevation: 0,
              shadowOpacity: 0,
            },
          }}
        />

        <Stack.Screen
          name="EditProveedor"
          component={EditProveedorScreen}
          options={{
            headerShown: true,
            title: "Editar Proveedor",
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

        <Stack.Screen
          name="FamilyList"
          component={FamiliaManagementScreen}
          options={{
            headerShown: true,
            title: "Gestion de Familias",
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
              height: 80, // Igual que el de "Lista de Productos"
              borderBottomWidth: 0,
              elevation: 0,
              shadowOpacity: 0,
            },
          }}
        />

        <Stack.Screen
          name="BarcodeScanner"
          component={BarcodeScannerScreen}
          options={{
            headerShown: true,
            title: "Escanear Código",
            headerTransparent: true,
            headerTitleStyle: {
              color: "white",
            },
          }}
        />

        <Stack.Screen
          name="BulkPriceUpdate"
          component={BulkPriceUpdateScreen}
          options={{
            headerShown: true,
            title: "Aumento Masivo",
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
        <Stack.Screen
          name="CartScreen"
          component={CartScreen}
          options={{
            title: "Tu Carrito",
            headerBackTitle: "Menú",
          }}
        />
        <Stack.Screen
          name="ImportExcel"
          component={ImportExcelScreen}
          options={{ title: "Importar desde Excel" }}
        />

        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{
            headerShown: true,
            title: "Finalizar Compra",
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

        <Stack.Screen
          name="HistorialVentas"
          component={HistorialVentasScreen}
          options={{
            headerShown: true,
            title: "Historial de Ventas",
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

        <Stack.Screen
          name="DetalleVenta"
          component={DetalleVentaScreen}
          options={{
            headerShown: true,
            title: "Detalle de Venta",
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
              height: 80, // Igual que el de "Lista de Productos"
              borderBottomWidth: 0,
              elevation: 0,
              shadowOpacity: 0,
            },
          }}
        />
        <Stack.Screen
          name="AddUserScreen"
          component={AddUserScreen}
          options={{
            headerShown: true,
            title: "Agregar Usuario",
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
        <Stack.Screen
          name="UserList"
          component={UserListScreen}
          options={{
            headerShown: true,
            title: "Lista de Usuarios",
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
      </Stack.Navigator>
    </>
  );
};

export default AppNavigator;
