import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Fade in animation for the logo
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const checkStatus = async () => {
      try {
        // Wait for 2.5 seconds so the user sees the branding
        setTimeout(async () => {
          const isFirstTime = await AsyncStorage.getItem('alreadyLaunched');
          const userToken = await AsyncStorage.getItem('userToken');

          if (isFirstTime === null) {
            // First time opening the app
            navigation.replace('PrimaryLanguage');
          } else if (userToken) {
            // User is already logged in
            navigation.replace('MainApp');
          } else {
            // User has seen intro but isn't logged in
            navigation.replace('Login');
          }
        }, 2500);
      } catch (e) {
        navigation.replace('PrimaryLanguage');
      }
    };

    checkStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
       <Image 
  source={require('../assets/kameez.jpg')} 
  style={styles.logo} 
/>
        <Text style={styles.title}>CALLER ID</Text>
      </Animated.View>
      
      <View style={styles.footer}>
        <Text style={styles.version}>v1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF', // Professional Blue
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
  },
  version: {
    color: '#FFFFFF',
    opacity: 0.7,
  }
});

export default SplashScreen;