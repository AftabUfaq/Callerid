import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, Dimensions, StatusBar, Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const LANGUAGES = [
  { id: '1', name: 'English', code: 'en', flag: '🇬🇧' },
  { id: '2', name: 'Urdu', code: 'ur', flag: '🇵🇰' },
  { id: '3', name: 'Arabic', code: 'ar', flag: '🇸🇦' },
  { id: '4', name: 'German', code: 'de', flag: '🇩🇪' },
  { id: '5', name: 'French', code: 'fr', flag: '🇫🇷' },
  { id: '6', name: 'Spanish', code: 'es', flag: '🇪🇸' },
  { id: '7', name: 'Hindi', code: 'hi', flag: '🇮🇳' },
  { id: '8', name: 'Portuguese', code: 'pt', flag: '🇧🇷' },
  { id: '9', name: 'Russian', code: 'ru', flag: '🇷🇺' },
  { id: '10', name: 'Japanese', code: 'ja', flag: '🇯🇵' },
  { id: '11', name: 'Chinese', code: 'zh', flag: '🇨🇳' },
  { id: '12', name: 'Turkish', code: 'tr', flag: '🇹🇷' },
];

const LanguageRow = ({ item, isSelected, onPress, index }) => {
  const slideIn = useRef(new Animated.Value(30)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideIn, {
        toValue: 0, duration: 400, delay: index * 60, useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1, duration: 400, delay: index * 60, useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateX: slideIn }] }}>
      <TouchableOpacity 
        activeOpacity={0.7}
        style={styles.rowItem} 
        onPress={() => onPress(item.code)}
      >
        <View style={styles.leftContent}>
          <Text style={styles.flag}>{item.flag}</Text>
          <Text style={[styles.languageText, isSelected && styles.selectedLanguageText]}>
            {item.name}
          </Text>
        </View>

        <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
          {isSelected && <View style={styles.radioInner} />}
          {!isSelected && <View style={styles.radioPlaceholder} />}
        </View>
      </TouchableOpacity>
      <View style={styles.separator} />
    </Animated.View>
  );
};

const PrimaryLanguageScreen = ({ navigation }) => {
  const [selectedLang, setSelectedLang] = useState('en');
  const [search, setSearch] = useState('');

  const filteredLanguages = LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(search.toLowerCase())
  );

const handleContinue = async () => {
  try {
    await AsyncStorage.setItem('primaryLanguage', selectedLang);
    
    // CRITICAL: Pass the primaryCode here!
    navigation.navigate('SecondaryLanguage', { primaryCode: selectedLang }); 
  } catch (e) { 
    console.error(e); 
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Select Language</Text>
        <Text style={styles.subtitle}>Choose your primary language</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="rgba(255,255,255,0.3)" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search languages..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredLanguages}
        renderItem={({ item, index }) => (
          <LanguageRow 
            item={item} 
            index={index} 
            isSelected={selectedLang === item.code} 
            onPress={setSelectedLang} 
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1724' },
  header: { paddingHorizontal: 24, paddingTop: 20, marginBottom: 24 },
  title: { fontSize: 32, fontWeight: '800', color: '#FFF' },
  subtitle: { fontSize: 16, color: '#8A95A8', marginTop: 4 },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 24,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 20,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#FFF', fontSize: 16 },

  listContent: { paddingHorizontal: 24 },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  leftContent: { flexDirection: 'row', alignItems: 'center' },
  flag: { fontSize: 24, marginRight: 16 },
  languageText: { fontSize: 18, fontWeight: '600', color: '#8A95A8' },
  selectedLanguageText: { color: '#FFF' },

  radioOuter: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  radioOuterSelected: { borderColor: '#5EE7DF', backgroundColor: '#5EE7DF' },
  radioInner: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#0F1724',
  },
  radioPlaceholder: { width: 10, height: 10 },
  
  separator: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },

  footer: { padding: 24, paddingBottom: 30 },
  button: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    height: 64, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  buttonText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
});

export default PrimaryLanguageScreen;