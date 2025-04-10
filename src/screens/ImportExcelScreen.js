import React, { useState } from "react";
import { View, Button, Text, FlatList, Alert, Platform } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as XLSX from "xlsx";
import { db } from "../config/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function ImportExcelScreen({ navigation }) {
  const [excelData, setExcelData] = useState([]);

  const handlePickExcel = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
          "application/octet-stream",
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0)
        return;

      const file = result.assets[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          const headers = rawData[0]; // primera fila = encabezados
          const rows = rawData.slice(1); // el resto = datos

          const jsonData = rows.map((row) => {
            const obj = {};
            headers.forEach((header, index) => {
              obj[header.trim()] = row[index];
            });
            return obj;
          });

          setExcelData(jsonData);
        } catch (error) {
          console.log("Error procesando el archivo Excel:", error);
          Alert.alert("Error", "No se pudo procesar el archivo Excel.");
        }
      };

      const response = await fetch(file.uri);
      const blob = await response.blob();
      reader.readAsArrayBuffer(blob);
    } catch (error) {
      console.error("Error al seleccionar archivo:", error);
      Alert.alert("Error", "Ocurrió un error al seleccionar el archivo.");
    }
  };

  const guardarEnFirestore = async () => {
    if (excelData.length === 0) {
      Alert.alert("Error", "No hay datos para guardar");
      return;
    }

    try {
      const productosRef = collection(db, "productos");

      for (const producto of excelData) {
        const nombre = producto.nombre || producto.Nombre || "";
        const descripcion = producto.descripcion || producto.Descripcion || "";
        const precioCompra = parseFloat(producto.precioCompra || 0);
        const precioVenta = parseFloat(producto.precioVenta || 0);
        const stock = parseInt(producto.stock || 0);
        const codigoBarras = producto.codigoBarras || "";
        const proveedor = producto.proveedor || "";
        const familia = producto.familia || "";

        // Asegurarse que el proveedor esté presente
        if (!proveedor) continue;

        await addDoc(productosRef, {
          nombre,
          descripcion,
          precioCompra,
          precioVenta,
          stock,
          codigoBarras,
          proveedor,
          familia,
        });
      }

      Alert.alert("Éxito", "Productos guardados en Firestore");
      setExcelData([]);
      navigation.goBack();
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
      Alert.alert("Error", "No se pudieron guardar los productos.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Seleccionar archivo Excel" onPress={handlePickExcel} />

      {excelData.length > 0 ? (
        <>
          <Text
            style={{ marginVertical: 15, fontWeight: "bold", fontSize: 16 }}
          >
            Vista previa del Excel:
          </Text>
          <FlatList
            data={excelData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  marginBottom: 10,
                  borderBottomWidth: 1,
                  paddingBottom: 5,
                }}
              >
                {Object.entries(item).map(([key, value]) => (
                  <Text key={key}>
                    {key}: {value}
                  </Text>
                ))}
              </View>
            )}
          />

          <View style={{ marginTop: 20 }}>
            <Button title="Guardar en Firestore" onPress={guardarEnFirestore} />
          </View>
        </>
      ) : (
        <Text style={{ marginTop: 20 }}>
          No se ha seleccionado ningún archivo aún.
        </Text>
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Volver" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}
