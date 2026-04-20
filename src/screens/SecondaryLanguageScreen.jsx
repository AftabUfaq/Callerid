import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  default: [
    { id: 'none', name: 'Skip / Use Default', flag: '🏳️' }
  ]
};

const SecondaryLanguageScreen = ({ navigation, route }) => {
  const { primaryCode } = route.params || { primaryCode: 'en' };
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
        activeOpacity={0.8}
        style={[styles.languageItem, isSelected && styles.selectedItem]} 
        onPress={() => setSelectedLang(item.id)}
      >
        <View style={styles.leftRow}>
          <View style={[styles.flagBg, isSelected && styles.selectedFlagBg]}>
            <Text style={styles.flagText}>{item.flag}</Text>
          </View>
          <Text style={[styles.languageText, isSelected && styles.selectedText]}>
            {item.name}
          </Text>
        </View>
        <Ionicons 
            name={isSelected ? "checkmark-circle" : "ellipse-outline"} 
            size={24} 
            color={isSelected ? "#5EE7DF" : "rgba(255,255,255,0.1)"} 
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#F4F7FB" />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
           <View style={[styles.progressBar, { width: '100%' }]} />
        </View>

        <Text style={styles.title}>Regional Variant</Text>
        <Text style={styles.subtitle}>
          Select your local dialect to optimize spam detection and name identification.
        </Text>
      </View>

      <FlatList
        data={dataToShow}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Finish Setup</Text>
          <Ionicons name="shield-checkmark" size={20} color="#0F1724" style={{marginLeft: 8}} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1724' },
  header: { padding: 25, paddingTop: 10 },
  backBtn: { marginBottom: 20, marginLeft: -10 },
  progressContainer: { height: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2, marginBottom: 25 },
  progressBar: { height: 4, backgroundColor: '#5EE7DF', borderRadius: 2 },
  title: { fontSize: 30, fontWeight: '800', color: '#F4F7FB' },
  subtitle: { fontSize: 15, color: '#8A95A8', marginTop: 10, lineHeight: 22 },
  listPadding: { paddingHorizontal: 20, paddingBottom: 20 },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1A2233',
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(80,95,120,0.1)',
  },
  selectedItem: { 
    borderColor: '#5EE7DF', 
    backgroundColor: 'rgba(94,231,223,0.05)' 
  },
  leftRow: { flexDirection: 'row', alignItems: 'center' },
  flagBg: { 
    width: 44, 
    height: 44, 
    borderRadius: 12, 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  selectedFlagBg: { backgroundColor: 'rgba(94,231,223,0.1)' },
  flagText: { fontSize: 24 },
  languageText: { fontSize: 16, color: '#F4F7FB', fontWeight: '500' },
  selectedText: { color: '#5EE7DF', fontWeight: '700' },
  footer: { padding: 25 },
  button: { 
    backgroundColor: '#5EE7DF', 
    height: 60, 
    borderRadius: 16, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  buttonText: { color: '#0F1724', fontSize: 18, fontWeight: '800' }
});

export default SecondaryLanguageScreen;