import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // Start slightly smaller

  useEffect(() => {
    // Parallel animation: Fade in AND Scale up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    const checkStatus = async () => {
      try {
        const isFirstTime = await AsyncStorage.getItem('alreadyLaunched');
        const userToken = await AsyncStorage.getItem('userToken');

        // Total delay of 3 seconds (Animation + Branding time)
        setTimeout(() => {
          if (isFirstTime === null) {
            navigation.replace('PrimaryLanguage');
          } else if (userToken) {
            navigation.replace('MainTabs'); // Match your navigator name
          } else {
            navigation.replace('Login');
          }
        }, 3000);
      } catch (e) {
        navigation.replace('Login');
      }
    };

    checkStatus();
  }, []);

  return (
    <View style={styles.container}>
      {/* Match the status bar to the splash background */}
      <StatusBar backgroundColor="#007AFF" barStyle="light-content" />
      
      <Animated.View style={[
        styles.brandContainer, 
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
      ]}>
        <Image 
          source={require('../assets/kameez.jpg')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.title}>CALLER ID</Text>
        <View style={styles.underline} />
      </Animated.View>
      
      <View style={styles.footer}>
        <Text style={styles.tagline}>Secure · Identify · Block</Text>
        <Text style={styles.version}>v1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 160,
    borderRadius: 80, // Makes it circular if the image is square
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  underline: {
    width: 50,
    height: 4,
    backgroundColor: '#FFF',
    marginTop: 5,
    borderRadius: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  tagline: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
    letterSpacing: 1,
  },
  version: {
    color: '#FFFFFF',
    opacity: 0.5,
    fontSize: 12,
  }
});

export default SplashScreen;