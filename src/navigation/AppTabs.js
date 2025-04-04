import { createStackNavigator } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import ProductListScreen from "../screens/ProductListScreen";
import AddProductScreen from "../screens/AddProductScreen";
import ProveedorListScreen from "../screens/ProveedorListScreen";
import FamiliaManagementScreen from "../screens/FamiliaManagementScreen";
import AddProveedorScreen from "../screens/AddProveedorScreen";
import BulkPriceUpdateScreen from "../screens/BulkPriceUpdateScreen";
import EditProveedorScreen from '../screens/EditProveedorScreen';
import CartScreen from "../screens/CartScreen";

const Stack = createStackNavigator();

const AppTabs = () => {
  return (
    <Stack.Navigator
      screenOptions={{
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
        cardStyle: {
          backgroundColor: "transparent",
        },
        headerStyle: {
          height: 80,
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{ title: "Lista de Productos" }}
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{ title: "Agregar Producto" }}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={{ title: "Editar Producto" }}
      />
      <Stack.Screen
        name="ProveedorList"
        component={ProveedorListScreen}
        options={{ title: "Proveedores" }}
      />
      <Stack.Screen
        name="AddProveedor"
        component={AddProveedorScreen}
        options={{ title: "Agregar Proveedor" }}
      />
      <Stack.Screen
        name="EditProveedor"
        component={EditProveedorScreen}
        options={{ title: "Editar Proveedor" }}
      />
      <Stack.Screen
        name="FamilyList"
        component={FamiliaManagementScreen}
        options={{ title: "Familias" }}
      />
      <Stack.Screen
        name="BulkPriceUpdate"
        component={BulkPriceUpdateScreen}
        options={{ title: "Aumentos" }}
      />
      <Stack.Screen
        name="CartScreen"
        component={CartScreen}
        options={{ title: "Carrito" }}
      />
    </Stack.Navigator>
  );
};

export default AppTabs;