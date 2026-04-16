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
  { id: '1', name: 'English', code: 'en' },
  { id: '2', name: 'Spanish', code: 'es' },
  { id: '3', name: 'French', code: 'fr' },
  { id: '4', name: 'Arabic', code: 'ar' },
  { id: '5', name: 'Hindi', code: 'hi' },
  { id: '6', name: 'Urdu', code: 'ur' },
];

const PrimaryLanguageScreen = ({ navigation }) => {
  const [selectedLang, setSelectedLang] = useState('en');

  const handleContinue = async () => {
    try {
      await AsyncStorage.setItem('primaryLanguage', selectedLang);
      // Move to the next screen in your flow
      navigation.navigate('SecondaryLanguage');
    } catch (e) {
      console.error("Failed to save language", e);
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
        <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Language</Text>
        <Text style={styles.subtitle}>Select your primary language for the app interface.</Text>
      </View>

      <FlatList
        data={LANGUAGES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listPadding}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
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
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  listPadding: {
    paddingHorizontal: 20,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedItem: {
    borderColor: '#007AFF',
    backgroundColor: '#E7F2FF',
  },
  languageText: {
    fontSize: 18,
    color: '#333',
  },
  selectedText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PrimaryLanguageScreen;