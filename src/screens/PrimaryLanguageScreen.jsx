import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 60) / 2; // Perfect spacing for 2 columns

const LANGUAGES = [
  { id: '1', name: 'English', code: 'en', flag: '🇺🇸' },
  { id: '2', name: 'Spanish', code: 'es', flag: '🇪🇸' },
  { id: '3', name: 'French', code: 'fr', flag: '🇫🇷' },
  { id: '4', name: 'Arabic', code: 'ar', flag: '🇸🇦' },
  { id: '5', name: 'Hindi', code: 'hi', flag: '🇮🇳' },
  { id: '6', name: 'Urdu', code: 'ur', flag: '🇵🇰' },
];

const PrimaryLanguageScreen = ({ navigation }) => {
  const [selectedLang, setSelectedLang] = useState('en');

  const handleContinue = async () => {
    try {
      await AsyncStorage.setItem('alreadyLaunched', 'true'); // Important for your Splash logic!
      await AsyncStorage.setItem('primaryLanguage', selectedLang);
      navigation.navigate('SecondaryLanguage', { primaryCode: selectedLang }); // Or 'SecondaryLanguage' if you still need it
    } catch (e) {
      console.error("Failed to save language", e);
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedLang === item.code;
    return (
      <TouchableOpacity 
        activeOpacity={0.8}
        style={[
          styles.card, 
          isSelected && styles.selectedCard
        ]} 
        onPress={() => setSelectedLang(item.code)}
      >
        <View style={styles.flagCircle}>
          <Text style={styles.flagEmoji}>{item.flag}</Text>
        </View>
        
        <Text style={[styles.languageName, isSelected && styles.selectedText]}>
          {item.name}
        </Text>

        {isSelected && (
          <View style={styles.checkBadge}>
            <Ionicons name="checkmark-sharp" size={16} color="#FFF" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.stepIndicator}>
          <View style={styles.stepActive} />
          <View style={styles.stepInactive} />
        </View>
        <Text style={styles.title}>Language</Text>
        <Text style={styles.subtitle}>Which language do you prefer to use for your protection?</Text>
      </View>

      <FlatList
        data={LANGUAGES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2} // THE GRID MAGIC
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" style={{marginLeft: 10}} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F3F7', // Soft modern background
  },
  header: {
    padding: 30,
    paddingTop: 40,
  },
  stepIndicator: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  stepActive: { width: 30, height: 6, backgroundColor: '#007AFF', borderRadius: 3, marginRight: 5 },
  stepInactive: { width: 10, height: 6, backgroundColor: '#D1D9E6', borderRadius: 3 },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#1A1C1E',
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
    marginTop: 10,
    lineHeight: 22,
  },
  listPadding: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFF',
    width: COLUMN_WIDTH,
    height: 160,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    // Elevation for Android
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#007AFF',
    backgroundColor: '#FFFFFF',
    elevation: 8,
    shadowOpacity: 0.15,
    transform: [{ scale: 1.02 }]
  },
  flagCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  flagEmoji: {
    fontSize: 35,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#495057',
  },
  selectedText: {
    color: '#007AFF',
  },
  checkBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#007AFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 25,
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    height: 65,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PrimaryLanguageScreen;