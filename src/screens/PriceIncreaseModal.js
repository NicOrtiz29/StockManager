import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// ... (imports anteriores)

const PriceIncreaseModal = ({ 
    visible, 
    suppliers, 
    familias, 
    userId,
    onClose, 
    onApply 
  }) => {
    const [selectedType, setSelectedType] = useState('proveedor');
    const [selectedId, setSelectedId] = useState('');
    const [percentage, setPercentage] = useState('');
  
    const handleApply = async () => {
      if (!selectedId || !percentage) return;
      await onApply(selectedType, selectedId, parseFloat(percentage), userId);
      onClose();
    };
  
    const currentItems = selectedType === 'proveedor' ? suppliers : familias;
  
    return (
      <Modal visible={visible} transparent animationType="slide">
        {/* ... (parte superior igual) ... */}
        
        <View style={styles.typeSelector}>
          <TouchableOpacity 
            style={[styles.typeButton, selectedType === 'proveedor' && styles.activeType]}
            onPress={() => setSelectedType('proveedor')}
          >
            <Text>Por Proveedor</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.typeButton, selectedType === 'familia' && styles.activeType]}
            onPress={() => setSelectedType('familia')}
          >
            <Text>Por Familia</Text>
          </TouchableOpacity>
        </View>
        
        <Picker
          selectedValue={selectedId}
          onValueChange={setSelectedId}
        >
          <Picker.Item label={`Seleccione ${selectedType}`} value="" />
          {currentItems.map(item => (
            <Picker.Item key={item.id} label={item.nombre} value={item.id} />
          ))}
        </Picker>
        
        {/* ... (resto igual) ... */}
      </Modal>
    );
  };
  
  const styles = StyleSheet.create({
    // ... (estilos anteriores) ...
    typeSelector: {
      flexDirection: 'row',
      marginBottom: 15,
    },
    typeButton: {
      flex: 1,
      padding: 10,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent'
    },
    activeType: {
      borderBottomColor: '#FF9800'
    }
  });