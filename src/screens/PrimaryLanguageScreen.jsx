import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Dimensions,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 60) / 2;

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
      await AsyncStorage.setItem('alreadyLaunched', 'true');
      await AsyncStorage.setItem('primaryLanguage', selectedLang);
      // Navigation - ensure 'Login' or 'SecondaryLanguage' exists in your navigator
      navigation.navigate('SecondaryLanguage'); 
    } catch (e) {
      console.error("Failed to save language", e);
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedLang === item.code;
    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        style={[
          styles.card, 
          isSelected && styles.selectedCard
        ]} 
        onPress={() => setSelectedLang(item.code)}
      >
        <View style={[styles.flagCircle, isSelected && styles.selectedFlagCircle]}>
          <Text style={styles.flagEmoji}>{item.flag}</Text>
        </View>
        
        <Text style={[styles.languageName, isSelected && styles.selectedText]}>
          {item.name}
        </Text>

        {isSelected && (
          <View style={styles.checkBadge}>
            <Ionicons name="checkmark-circle" size={24} color="#5EE7DF" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.stepIndicator}>
          <View style={styles.stepActive} />
          <View style={styles.stepInactive} />
        </View>
        <Text style={styles.title}>Language</Text>
        <Text style={styles.subtitle}>Choose your primary language for real-time protection alerts.</Text>
      </View>

      <FlatList
        data={LANGUAGES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
          <Ionicons name="chevron-forward" size={20} color="#0F1724" style={{marginLeft: 8}} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1724', // Dark background
  },
  header: {
    padding: 30,
    paddingTop: 20,
  },
  stepIndicator: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepActive: { width: 40, height: 4, backgroundColor: '#5EE7DF', borderRadius: 2, marginRight: 6 },
  stepInactive: { width: 12, height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F4F7FB',
  },
  subtitle: {
    fontSize: 15,
    color: '#8A95A8',
    marginTop: 8,
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
    backgroundColor: '#1A2233', // Card color
    width: COLUMN_WIDTH,
    height: 150,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(80,95,120,0.2)',
  },
  selectedCard: {
    borderColor: '#5EE7DF',
    backgroundColor: 'rgba(94,231,223,0.05)',
  },
  flagCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedFlagCircle: {
    backgroundColor: 'rgba(94,231,223,0.1)',
  },
  flagEmoji: {
    fontSize: 32,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F4F7FB',
  },
  selectedText: {
    color: '#5EE7DF',
  },
  checkBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  footer: {
    padding: 25,
  },
  button: {
    backgroundColor: '#5EE7DF',
    flexDirection: 'row',
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#0F1724',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default PrimaryLanguageScreen;