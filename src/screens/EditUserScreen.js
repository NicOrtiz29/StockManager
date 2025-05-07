import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker'; // Importa el Picker
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const EditUserScreen = ({ route, navigation }) => {
  const { userId } = route.params; // Recibe el ID del usuario como parámetro
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'usuarios', userId));
        if (userDoc.exists()) {
          setUser({ id: userDoc.id, ...userDoc.data() });
        } else {
          Alert.alert('Error', 'Usuario no encontrado.');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
        Alert.alert('Error', 'No se pudo cargar el usuario.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSave = async () => {
    if (!user.nombre || !user.email) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    setSaving(true);
    try {
      await updateDoc(doc(db, 'usuarios', userId), {
        nombre: user.nombre,
        email: user.email,
        rol: user.rol || '',

      });
      Alert.alert('Éxito', 'Usuario actualizado correctamente.');
      navigation.goBack();
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      Alert.alert('Error', 'No se pudo actualizar el usuario.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Cargando usuario...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#000428', '#004e92']} style={styles.fullScreen}>
      <View style={styles.container}>
        <Text style={styles.header}>Editar Usuario</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="#cccccc"
          value={user?.nombre}
          onChangeText={(text) => setUser({ ...user, nombre: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#cccccc"
          value={user?.email}
          onChangeText={(text) => setUser({ ...user, email: text })}
        />

        <Text style={styles.label}>Rol</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={user?.rol}
            onValueChange={(value) => setUser({ ...user, rol: value })}
            style={styles.picker}
            dropdownIconColor="white"
          >
            <Picker.Item label="Seleccionar Rol" value="" color="#cccccc" />
            <Picker.Item label="Administrador" value="administrador" />
            <Picker.Item label="Usuario" value="usuario" />
          </Picker>
        </View>


        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    color: 'white',
    height: 50,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditUserScreen;