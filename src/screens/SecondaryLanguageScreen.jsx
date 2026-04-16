import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

// 1. Define your variants mapping
const VARIANTS = {
  en: [
    { id: 'en-us', name: 'English (US)', flag: '🇺🇸' },
    { id: 'en-uk', name: 'English (UK)', flag: '🇬🇧' },
    { id: 'en-ca', name: 'English (Canada)', flag: '🇨🇦' },
    { id: 'en-au', name: 'English (Australia)', flag: '🇦🇺' },
  ],
  es: [
    { id: 'es-es', name: 'Spanish (Spain)', flag: '🇪🇸' },
    { id: 'es-mx', name: 'Spanish (Mexico)', flag: '🇲🇽' },
    { id: 'es-ar', name: 'Spanish (Argentina)', flag: '🇦🇷' },
  ],
  ur: [
    { id: 'ur-pk', name: 'Urdu (Pakistan)', flag: '🇵🇰' },
    { id: 'ur-in', name: 'Urdu (India)', flag: '🇮🇳' },
  ],
  // Fallback / Skip option
  default: [
    { id: 'none', name: 'Skip / Use Default', flag: '🏳️' }
  ]
};

const SecondaryLanguageScreen = ({ navigation, route }) => {
  // 2. Get the primary code from route params
  const { primaryCode } = route.params || { primaryCode: 'en' };
  
  // 3. Select the list based on primary selection
  const dataToShow = VARIANTS[primaryCode] || VARIANTS.default;
  
  const [selectedLang, setSelectedLang] = useState(dataToShow[0].id);

  const handleNext = async () => {
    try {
      await AsyncStorage.setItem('secondaryLanguage', selectedLang);
      navigation.navigate('Login'); 
    } catch (e) {
      console.error(e);
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedLang === item.id;
    return (
      <TouchableOpacity 
        style={[styles.languageItem, isSelected && styles.selectedItem]} 
        onPress={() => setSelectedLang(item.id)}
      >
        <View style={styles.leftRow}>
          <Text style={styles.flag}>{item.flag}</Text>
          <Text style={[styles.languageText, isSelected && styles.selectedText]}>
            {item.name}
          </Text>
        </View>
        <Ionicons 
            name={isSelected ? "radio-button-on" : "radio-button-off"} 
            size={22} 
            color={isSelected ? "#007AFF" : "#C7C7CC"} 
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        {/* Step Indicator UI Update */}
        <View style={styles.progressContainer}>
           <View style={[styles.progressBar, { width: '100%' }]} />
        </View>

        <Text style={styles.title}>Regional Variant</Text>
        <Text style={styles.subtitle}>
          Optimizing CallerID for {primaryCode.toUpperCase()} regional dialects.
        </Text>
      </View>

      <FlatList
        data={dataToShow}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listPadding}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Finish Setup</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: 25 },
  backBtn: { marginBottom: 15 },
  progressContainer: { height: 4, backgroundColor: '#E5E5EA', borderRadius: 2, marginBottom: 20 },
  progressBar: { height: 4, backgroundColor: '#007AFF', borderRadius: 2 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A' },
  subtitle: { fontSize: 15, color: '#666', marginTop: 8, lineHeight: 22 },
  listPadding: { paddingHorizontal: 20 },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  leftRow: { flexDirection: 'row', alignItems: 'center' },
  flag: { fontSize: 24, marginRight: 15 },
  selectedItem: { backgroundColor: '#F0F7FF', borderColor: '#007AFF', borderWidth: 1 },
  languageText: { fontSize: 17, color: '#333', fontWeight: '500' },
  selectedText: { color: '#007AFF', fontWeight: '700' },
  footer: { padding: 25, backgroundColor: '#FFF' },
  button: { backgroundColor: '#007AFF', paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }
});

export default SecondaryLanguageScreen;