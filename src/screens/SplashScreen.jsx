import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current; // Start smaller for a "zoom-in" effect

  useEffect(() => {
    // Smooth entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

 const checkStatus = async () => {
  try {
    const isFirstTime = await AsyncStorage.getItem('alreadyLaunched');
    const userToken = await AsyncStorage.getItem('userToken');

    setTimeout(() => {
      // If null, it means the app was just installed or uninstalled/reinstalled
      if (isFirstTime === null) {
        navigation.replace('Onboarding'); // <--- Make sure this points to Onboarding!
      } else if (userToken) {
        navigation.replace('MainTabs'); 
      } else {
        navigation.replace('Login');
      }
    }, 3000);
  } catch (e) {
    navigation.replace('Onboarding'); // Default to onboarding on error
  }
};

    checkStatus();
  }, []);

  return (
    <View style={styles.container}>
      {/* Dark background status bar */}
      <StatusBar backgroundColor="#0F1724" barStyle="light-content" />
      
      <Animated.View style={[
        styles.brandContainer, 
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
      ]}>
        <Image 
          // Ensure your image in assets is the transparent one I provided
          source={require('../assets/logo1.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.title}>CALLER<Text style={styles.titleBold}>ID</Text></Text>
        <View style={styles.underline} />
      </Animated.View>
      
      <View style={styles.footer}>
        <Text style={styles.tagline}>Secure · Identify · Block</Text>
        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>v1.0.0</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1724', // Changed to match your app theme
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 200, // Increased size for impact
    height: 200,
    marginBottom: 20,
    // If your image has glow, removing borderRadius is better
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 8,
    textTransform: 'uppercase',
  },
  titleBold: {
    fontWeight: '900',
    color: '#5EE7DF', // Teal color from your theme
  },
  underline: {
    width: 40,
    height: 3,
    backgroundColor: '#5EE7DF',
    marginTop: 10,
    borderRadius: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  tagline: {
    color: '#8A95A8', // Muted color
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  versionBadge: {
    backgroundColor: 'rgba(94,231,223,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  versionText: {
    color: '#5EE7DF',
    fontSize: 10,
    fontWeight: 'bold',
  }
});

export default SplashScreen;