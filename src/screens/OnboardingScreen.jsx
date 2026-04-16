import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Dimensions, 
 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Identify Callers',
    description: 'Instantly know who is calling even if the number isn’t in your contacts.',
    icon: 'person-search-outline',
    color: '#007AFF',
  },
  {
    id: '2',
    title: 'Block Spam',
    description: 'Our AI detects and blocks telemarketers and fraud calls automatically.',
    icon: 'shield-checkmark-outline',
    color: '#FF3B30',
  },
  {
    id: '3',
    title: 'Smart Dialer',
    description: 'A powerful dialer with integrated search and smart call logs.',
    icon: 'call-outline',
    color: '#34C759',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const flatListRef = useRef();

  const updateCurrentSlideIndex = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const handleFinish = async () => {
    try {
      // Mark onboarding as complete
      await AsyncStorage.setItem('alreadyLaunched', 'true');
      navigation.replace('Login'); // Move to Google Login
    } catch (e) {
      navigation.replace('Login');
    }
  };

  const Footer = () => (
    <View style={styles.footer}>
      {/* Pagination Dots */}
      <View style={styles.indicatorContainer}>
        {SLIDES.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.indicator, 
              currentSlideIndex === index && styles.activeIndicator
            ]} 
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {currentSlideIndex === SLIDES.length - 1 ? (
          <TouchableOpacity style={styles.getStartedBtn} onPress={handleFinish}>
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.navButtons}>
            <TouchableOpacity onPress={handleFinish}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.nextBtn} 
              onPress={() => {
                flatListRef.current.scrollToIndex({ index: currentSlideIndex + 1 });
              }}
            >
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
              <Ionicons name={item.icon} size={100} color={item.color} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    height: height * 0.2,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#007AFF',
    width: 20,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    padding: 10,
  },
  nextBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  nextText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  getStartedBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  getStartedText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;