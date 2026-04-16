import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LANGUAGES = [
  { id: '0', name: 'None / Skip', code: 'none' },
  { id: '1', name: 'English', code: 'en' },
  { id: '2', name: 'Spanish', code: 'es' },
  { id: '3', name: 'Arabic', code: 'ar' },
  { id: '4', name: 'Hindi', code: 'hi' },
  { id: '5', name: 'Urdu', code: 'ur' },
  { id: '6', name: 'Russian', code: 'ru' },
];

const SecondaryLanguageScreen = ({ navigation }) => {
  const [selectedLang, setSelectedLang] = useState('none');

  const handleNext = async () => {
    try {
      await AsyncStorage.setItem('secondaryLanguage', selectedLang);
      // Move to the Onboarding/Intro screens
      navigation.navigate('Onboarding'); 
    } catch (e) {
      console.error("Failed to save secondary language", e);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.languageItem, 
        selectedLang === item.code && styles.selectedItem
      ]} 
      onPress={() => setSelectedLang(item.code)}
    >
      <Text style={[
        styles.languageText, 
        selectedLang === item.code && styles.selectedText
      ]}>
        {item.name}
      </Text>
      {selectedLang === item.code && (
        <Ionicons name="radio-button-on" size={22} color="#007AFF" />
      ) || (
        <Ionicons name="radio-button-off" size={22} color="#C7C7CC" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Secondary Language</Text>
        <Text style={styles.subtitle}>
          This helps us identify caller names in other scripts or regions.
        </Text>
      </View>

      <FlatList
        data={LANGUAGES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listPadding}
      />

      <View style={styles.footer}>
        <TouchableOpacity 
            style={[styles.button, selectedLang === 'none' && styles.skipButton]} 
            onPress={handleNext}
        >
          <Text style={[styles.buttonText, selectedLang === 'none' && styles.skipText]}>
            {selectedLang === 'none' ? 'Skip for Now' : 'Set Secondary Language'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
  },
  backBtn: {
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 8,
    lineHeight: 22,
  },
  listPadding: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1, // subtle shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedItem: {
    backgroundColor: '#F0F7FF',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  languageText: {
    fontSize: 17,
    color: '#333',
  },
  selectedText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFF',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  skipButton: {
    backgroundColor: '#F2F2F7',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipText: {
    color: '#3A3A3C',
  }
});

export default SecondaryLanguageScreen;