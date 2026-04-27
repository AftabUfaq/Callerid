import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, 
  TouchableOpacity, Dimensions, StatusBar, Animated 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const VARIANTS = {
  en: [
    { id: 'en-us', name: 'English (US)', flag: '🇺🇸' },
    { id: 'en-uk', name: 'English (UK)', flag: '🇬🇧' },
    { id: 'en-ca', name: 'English (Canada)', flag: '🇨🇦' },
    { id: 'en-au', name: 'English (Australia)', flag: '🇦🇺' },
  ],
  ur: [
    { id: 'ur-pk', name: 'Urdu (Pakistan)', flag: '🇵🇰' },
    { id: 'ur-in', name: 'Urdu (India)', flag: '🇮🇳' },
  ],
  ar: [
    { id: 'ar-sa', name: 'Arabic (Saudi Arabia)', flag: '🇸🇦' },
    { id: 'ar-ae', name: 'Arabic (UAE)', flag: '🇦🇪' },
    { id: 'ar-eg', name: 'Arabic (Egypt)', flag: '🇪🇬' },
  ],
  de: [
    { id: 'de-de', name: 'German (Germany)', flag: '🇩🇪' },
    { id: 'de-at', name: 'German (Austria)', flag: '🇦🇹' },
    { id: 'de-ch', name: 'German (Switzerland)', flag: '🇨🇭' },
  ],
  fr: [
    { id: 'fr-fr', name: 'French (France)', flag: '🇫🇷' },
    { id: 'fr-ca', name: 'French (Canada)', flag: '🇨🇦' },
    { id: 'fr-be', name: 'French (Belgium)', flag: '🇧🇪' },
  ],
  es: [
    { id: 'es-es', name: 'Spanish (Spain)', flag: '🇪🇸' },
    { id: 'es-mx', name: 'Spanish (Mexico)', flag: '🇲🇽' },
    { id: 'es-ar', name: 'Spanish (Argentina)', flag: '🇦🇷' },
    { id: 'es-co', name: 'Spanish (Colombia)', flag: '🇨🇴' },
  ],
  hi: [
    { id: 'hi-in', name: 'Hindi (India)', flag: '🇮🇳' },
    { id: 'hi-fj', name: 'Hindi (Fiji)', flag: '🇫🇯' },
  ],
  pt: [
    { id: 'pt-br', name: 'Portuguese (Brazil)', flag: '🇧🇷' },
    { id: 'pt-pt', name: 'Portuguese (Portugal)', flag: '🇵🇹' },
  ],
  ru: [
    { id: 'ru-ru', name: 'Russian (Russia)', flag: '🇷🇺' },
    { id: 'ru-kz', name: 'Russian (Kazakhstan)', flag: '🇰🇿' },
  ],
  ja: [
    { id: 'ja-jp', name: 'Japanese (Japan)', flag: '🇯🇵' },
  ],
  zh: [
    { id: 'zh-cn', name: 'Chinese (Simplified)', flag: '🇨🇳' },
    { id: 'zh-hk', name: 'Chinese (Hong Kong)', flag: '🇭🇰' },
    { id: 'zh-tw', name: 'Chinese (Taiwan)', flag: '🇹🇼' },
  ],
  tr: [
    { id: 'tr-tr', name: 'Turkish (Turkey)', flag: '🇹🇷' },
    { id: 'tr-cy', name: 'Turkish (Cyprus)', flag: '🇨🇾' },
  ],
  default: [
    { id: 'none', name: 'Skip / Use Default', flag: '🛡️' }
  ]
};

// ─── Animated Row Component ──────────────────────────────────────────
const VariantRow = ({ item, isSelected, onPress, index }) => {
  const slideIn = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideIn, {
        toValue: 0, duration: 450, delay: index * 80, useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1, duration: 450, delay: index * 80, useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateX: slideIn }] }}>
      <TouchableOpacity 
        activeOpacity={0.7}
        style={styles.rowItem} 
        onPress={() => onPress(item.id)}
      >
        <View style={styles.leftContent}>
          <View style={[styles.flagWrapper, isSelected && styles.flagWrapperActive]}>
             <Text style={styles.flag}>{item.flag}</Text>
          </View>
          <Text style={[styles.languageText, isSelected && styles.selectedLanguageText]}>
            {item.name}
          </Text>
        </View>

        <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
          {isSelected ? (
            <View style={styles.radioInner} />
          ) : (
            <View style={styles.radioPlaceholder} />
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.separator} />
    </Animated.View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────
const SecondaryLanguageScreen = ({ navigation, route }) => {
  const { primaryCode } = route.params || { primaryCode: 'en' };
  const dataToShow = VARIANTS[primaryCode] || VARIANTS.default;
  const [selectedLang, setSelectedLang] = useState(dataToShow[0].id);

  const handleNext = async () => {
    try {
      await AsyncStorage.setItem('secondaryLanguage', selectedLang);
      navigation.navigate('Login'); 
    } catch (e) { console.error(e); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.progressTrack}>
           <View style={styles.progressBar} />
        </View>

        <Text style={styles.title}>Regional Variant</Text>
        <Text style={styles.subtitle}>Select your local dialect to optimize detection.</Text>
      </View>

      <FlatList
        data={dataToShow}
        renderItem={({ item, index }) => (
          <VariantRow 
            item={item} 
            index={index} 
            isSelected={selectedLang === item.id} 
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
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Finish Setup</Text>
          <Ionicons name="shield-checkmark" size={20} color="#FFF" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1724' },
  header: { paddingHorizontal: 24, paddingTop: 10, marginBottom: 15 },
  backBtn: { marginLeft: -10, marginBottom: 15 },
  
  progressTrack: { 
    height: 4, 
    backgroundColor: 'rgba(255,255,255,0.08)', 
    borderRadius: 2, 
    marginBottom: 25 
  },
  progressBar: { 
    height: 4, 
    width: '100%', 
    backgroundColor: '#5EE7DF', 
    borderRadius: 2 
  },

  title: { fontSize: 32, fontWeight: '800', color: '#FFF' },
  subtitle: { fontSize: 16, color: '#8A95A8', marginTop: 6, lineHeight: 22 },
  
  listContent: { paddingHorizontal: 24 },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  leftContent: { flexDirection: 'row', alignItems: 'center' },
  flagWrapper: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  flagWrapperActive: { backgroundColor: 'rgba(94,231,223,0.15)' },
  flag: { fontSize: 22 },
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

  footer: { padding: 24, paddingBottom: 35 },
  button: {
    backgroundColor: 'rgba(94,231,223,0.1)',
    height: 64, borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#5EE7DF',
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
});

export default SecondaryLanguageScreen;