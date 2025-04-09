import React, { useState } from 'react';
import { View, Text, Button, FlatList, Alert, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import XLSX from 'xlsx';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig'; // Asegurate de que la ruta sea correcta

export default function ImportExcelScreen({ navigation }) {
  const [excelData, setExcelData] = useState([]);

  const handlePickExcel = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      const uri = result.assets[0].uri;

      let fileData;

      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        fileData = await blob.arrayBuffer();
        const workbook = XLSX.read(fileData, { type: 'array' });
        const wsname = workbook.SheetNames[0];
        const sheet = workbook.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(sheet);
        setExcelData(data);
      } else {
        const fileBase64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const workbook = XLSX.read(fileBase64, { type: 'base64' });
        const wsname = workbook.SheetNames[0];
        const sheet = workbook.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(sheet);
        setExcelData(data);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo leer el archivo');
      console.log(error);
    }
  };

  const guardarEnFirestore = async () => {
    try {
      for (const producto of excelData) {
        await addDoc(collection(db, 'productos'), {
          nombre: producto.nombre || producto.Nombre || '',
          precio: parseFloat(producto.precio || producto.Precio || 0),
          stock: parseInt(producto.stock || producto.Stock || 0),
        });
      }

      Alert.alert('Éxito', 'Productos guardados en Firestore');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los productos');
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Seleccionar archivo Excel" onPress={handlePickExcel} />

      <View style={{ marginTop: 20 }}>
        {excelData.length > 0 ? (
          <>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>Vista previa del Excel:</Text>
            <FlatList
              data={excelData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={{ borderBottomWidth: 1, paddingVertical: 5 }}>
                  {Object.entries(item).map(([key, value]) => (
                    <Text key={key}>{key}: {value}</Text>
                  ))}
                </View>
              )}
            />
            <View style={{ marginTop: 20 }}>
              <Button title="Guardar en Firestore" onPress={guardarEnFirestore} />
            </View>
          </>
        ) : (
          <Text style={{ marginTop: 20 }}>No se ha seleccionado ningún archivo aún.</Text>
        )}
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="Volver" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}
