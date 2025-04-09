// ImportExcelScreen.js
import React, { useState } from 'react';
import { View, Text, Button, FlatList, Alert, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as XLSX from 'xlsx';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function ImportExcelScreen({ navigation }) {
  const [excelData, setExcelData] = useState([]);

  const handlePickExcel = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const fileUri = result.assets[0].uri;

      if (Platform.OS === 'web') {
        const response = await fetch(fileUri);
        const blob = await response.blob();

        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet);
            setExcelData(json);
          } catch (err) {
            console.error('Error procesando el archivo Excel:', err);
            Alert.alert('Error', 'El archivo Excel no es válido o está corrupto.');
          }
        };
        reader.onerror = (err) => {
          console.error('Error leyendo el archivo:', err);
        };
        reader.readAsArrayBuffer(blob);
      } else {
        const fileReaderInstance = await fetch(fileUri);
        const arrayBuffer = await fileReaderInstance.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);
        setExcelData(json);
      }
    } catch (error) {
      console.error('Error al seleccionar o procesar el archivo:', error);
    }
  };

  const handleGuardar = async () => {
    try {
      const batch = excelData.map(async (producto) => {
        if (!producto.proveedor || !producto.nombre) {
          throw new Error('Falta campo obligatorio: proveedor o nombre');
        }
        await addDoc(collection(db, 'stock'), producto);
      });

      await Promise.all(batch);
      Alert.alert('Éxito', 'Productos importados correctamente.');
      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar productos:', error);
      Alert.alert('Error', 'Hubo un problema al guardar los productos.');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Seleccionar Archivo Excel" onPress={handlePickExcel} color="#2196F3" />

      {excelData.length === 0 ? (
        <Text style={{ marginVertical: 20 }}>No se ha seleccionado ningún archivo aún.</Text>
      ) : (
        <FlatList
          data={excelData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 10,
                marginVertical: 5,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
              }}
            >
              <Text>Nombre: {item.nombre}</Text>
              <Text>Descripción: {item.descripcion}</Text>
              <Text>Compra: {item.precioCompra}</Text>
              <Text>Venta: {item.precioVenta}</Text>
              <Text>Stock: {item.stock}</Text>
              <Text>Código de barras: {item.codigoBarras}</Text>
              <Text>Proveedor: {item.proveedor}</Text>
              <Text>Familia: {item.familia}</Text>
            </View>
          )}
        />
      )}

      {excelData.length > 0 && (
        <Button title="Guardar" onPress={handleGuardar} color="#4CAF50" />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Volver" onPress={() => navigation.goBack()} color="#2196F3" />
      </View>
    </View>
  );
}
