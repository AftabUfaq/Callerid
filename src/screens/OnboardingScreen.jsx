import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Dimensions, 
  Image, 
  StatusBar 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

// 1. Define your onboarding steps
const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Instant Identity',
    subtitle: 'Construct your digital identity to verify who is calling and who you are.',
    // Replace with the generated PNG asset (Identity)
    image: require('../assets/onboarding.png'), 
  },
  {
    id: '2',
    title: 'Smart Verification',
    subtitle: 'Our shield protects you from spam and fraud with real-time verification.',
    // Reuse image_2.png (Verification Shield)
    image: require('../assets/logo.png'), 
  },
  {
    id: '3',
    title: 'Seamless Connection',
    subtitle: 'Construct seamless, secure communication channels for your critical calls.',
    // Replace with the generated PNG asset (Communication)
    image: require('../assets/onboarding1.png'), 
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  // Update index on scroll
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

const handleNext = async () => {
  if (currentIndex < ONBOARDING_DATA.length - 1) {
    flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
  } else {
    // ONLY SET THIS HERE AT THE VERY END
    await AsyncStorage.setItem('alreadyLaunched', 'true');
    navigation.replace('PrimaryLanguage'); 
  }
};

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <View style={styles.imageGlow} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1724" />
      
      {/* 2. paging FlatList */}
      <FlatList
        data={ONBOARDING_DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef}
        ref={flatListRef}
      />

      {/* 3. Footer with Pagination and Button */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {ONBOARDING_DATA.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.dot, 
                currentIndex === index && styles.activeDot
              ]} 
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.8}>
          <Text style={styles.buttonText}>
            {currentIndex === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons 
            name={currentIndex === ONBOARDING_DATA.length - 1 ? "rocket-outline" : "chevron-forward"} 
            size={20} 
            color="#0F1724" 
            style={{marginLeft: 8}} 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1724' },
  slide: { width, alignItems: 'center', justifyContent: 'center', padding: 30 },
  
  imageContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.45, // Allocate space for image
    marginBottom: 40,
  },
  image: { width: width * 0.7, height: width * 0.7, zIndex: 2 },
  imageGlow: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: '#5EE7DF',
    opacity: 0.05,
    filter: 'blur(40px)', // Visual representation only
  },

  textContainer: { alignItems: 'center', paddingHorizontal: 10 },
  title: { fontSize: 32, fontWeight: '800', color: '#F4F7FB', textAlign: 'center', letterSpacing: 1 },
  subtitle: { fontSize: 16, color: '#8A95A8', textAlign: 'center', marginTop: 15, lineHeight: 24, paddingHorizontal: 15 },
  
  footer: { 
    height: 150, 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  paginationContainer: { flexDirection: 'row', height: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 5 },
  activeDot: { width: 30, backgroundColor: '#5EE7DF' }, // Teal accent
  
  button: { 
    backgroundColor: '#5EE7DF', 
    width: '100%', 
    height: 60, 
    borderRadius: 18, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  buttonText: { color: '#0F1724', fontSize: 18, fontWeight: '800' }
});

export default OnboardingScreen;