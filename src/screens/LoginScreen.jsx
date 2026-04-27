import React, { useEffect, useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, Image, 
  TouchableOpacity, ActivityIndicator, Alert, 
  StatusBar, Animated, Dimensions
} from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const shieldScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    GoogleSignin.configure({
       webClientId: '926601493060-pd65992cb45mmdjl5p9ida8ul01hqbsl.apps.googleusercontent.com', 
       iosClientId:"926601493060-pm8su9et5m4urf8f2liv4jul08gi135b.apps.googleusercontent.com",
       offlineAccess: true,
    });

    // Smoother entrance sequence
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
      Animated.timing(shieldScale, { toValue: 1, duration: 1200, useNativeDriver: true })
    ]).start();

    // Breathing pulse for the background
    Animated.loop(
      Animated.sequence([
        Animated.timing(shieldScale, { toValue: 1.05, duration: 3000, useNativeDriver: true }),
        Animated.timing(shieldScale, { toValue: 1, duration: 3000, useNativeDriver: true })
      ])
    ).start();
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const userInfo = response.data ? response.data : response;

      if (userInfo && userInfo.idToken) {
        await AsyncStorage.setItem('userToken', userInfo.idToken);
        await AsyncStorage.setItem('userName', userInfo.user.name || 'User');
        await AsyncStorage.setItem('userEmail', userInfo.user.email || '');
        navigation.replace('Permissions');
      }
    } catch (error) {
      if (error.code !== statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Login Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* BACKGROUND SHIELD - Pulsing and Fading in */}
      <Animated.Image 
        source={require('../assets/bg.jpeg')} 
        style={[
          styles.backgroundImage,
          { opacity: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.4] }), 
            transform: [{ scale: shieldScale }] }
        ]} 
        resizeMode="cover"
      />
      
      <Animated.View style={[styles.topSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.logoContainer}>
          {/* YOUR NEW LOGO */}
          <Image 
            source={require('../assets/logonew.png')} 
            style={styles.logo} 
          />
          <View style={styles.logoGlow} />
        </View>
        
        <View style={styles.textWrapper}>
          <Text style={styles.welcomeText}>Welcome to <Text style={styles.brandText}>CallerID</Text></Text>
          <Text style={styles.subText}>AI-Powered spam protection and real-time identity verification.</Text>
        </View>
      </Animated.View>

      <View style={styles.bottomSection}>
        <TouchableOpacity 
          activeOpacity={0.8}
          style={styles.googleBtn} 
          onPress={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#5EE7DF" />
          ) : (
            <>
              <Image source={require('../assets/google.png')} style={styles.googleIcon} />
              <Text style={styles.googleText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>
        
        <Text style={styles.footerNote}>
          By continuing, you agree to our {'\n'}
          <Text style={styles.linkText} onPress={() => {}}>Terms of Service</Text> & <Text style={styles.linkText} onPress={() => {}}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1724' },
  
  backgroundImage: {
    position: 'absolute',
    top: -height * 0.05,
    width: width,
    height: height * 0.7,
    zIndex: 0,
  },

  topSection: { 
    flex: 2.5, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 30,
    zIndex: 2,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
  logo: { 
    width: 110, 
    height: 110, 
    resizeMode: 'contain',
    shadowColor: '#5EE7DF',
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  logoGlow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: 'rgba(94,231,223,0.1)',
    backgroundColor: 'rgba(94,231,223,0.02)',
  },
  textWrapper: { alignItems: 'center' },
  welcomeText: { fontSize: 28, fontWeight: '300', color: '#F4F7FB', textAlign: 'center' },
  brandText: { fontWeight: '800', color: '#5EE7DF' },
  subText: { 
    fontSize: 15, 
    color: '#8A95A8', 
    textAlign: 'center', 
    marginTop: 15,
    lineHeight: 24,
    paddingHorizontal: 20
  },

  bottomSection: { flex: 1, paddingHorizontal: 30, justifyContent: 'flex-end', paddingBottom: 40 },
  googleBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    height: 62, 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(94,231,223,0.3)',
  },
  googleIcon: { width: 22, height: 22, marginRight: 12 },
  googleText: { fontSize: 17, fontWeight: '700', color: '#FFF' },
  
  footerNote: { 
    textAlign: 'center', 
    color: '#545F71', 
    fontSize: 12, 
    marginTop: 25,
    lineHeight: 18
  },
  linkText: { color: '#5EE7DF', fontWeight: '600' }
});

export default LoginScreen;