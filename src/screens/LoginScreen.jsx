import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  StatusBar
} from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
       webClientId: '926601493060-pd65992cb45mmdjl5p9ida8ul01hqbsl.apps.googleusercontent.com', 
       iosClientId:"926601493060-pm8su9et5m4urf8f2liv4jul08gi135b.apps.googleusercontent.com",
      offlineAccess: true,
    });
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
      } else {
        throw new Error("No user info received");
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Cancelled", "Login was cancelled.");
      } else {
        Alert.alert("Login Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.topSection}>
        <View style={styles.logoContainer}>
          {/* Using your high-tech logo from the Splash Screen */}
          <Image 
            source={require('../assets/logo1.png')} 
            style={styles.logo} 
          />
          <View style={styles.logoGlow} />
        </View>
        <Text style={styles.welcomeText}>Welcome to <Text style={styles.brandText}>CallerID</Text></Text>
        <Text style={styles.subText}>AI-Powered spam protection and real-time identity verification.</Text>
      </View>

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
          <Text style={styles.linkText}>Terms of Service</Text> & <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0F1724' 
  },
  topSection: { 
    flex: 2, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 30 
  },
  logoContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  logo: { 
    width: 140, 
    height: 140, 
    resizeMode: 'contain',
    zIndex: 2
  },
  logoGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#5EE7DF',
    opacity: 0.1,
    filter: 'blur(30px)', // Note: standard RN doesn't support filter, use blurRadius on Image if needed
  },
  welcomeText: { 
    fontSize: 28, 
    fontWeight: '300', 
    marginTop: 10,
    color: '#F4F7FB',
    textAlign: 'center'
  },
  brandText: {
    fontWeight: '800',
    color: '#5EE7DF'
  },
  subText: { 
    fontSize: 15, 
    color: '#8A95A8', 
    textAlign: 'center', 
    marginTop: 12,
    lineHeight: 22,
    paddingHorizontal: 10
  },
  bottomSection: { 
    flex: 1, 
    padding: 30, 
    justifyContent: 'center' 
  },
  googleBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#1A2233', 
    height: 60, 
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(80,95,120,0.3)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  googleIcon: { 
    width: 22, 
    height: 22, 
    marginRight: 12,
  },
  googleText: { 
    fontSize: 16, 
    fontWeight: '700',
    color: '#F4F7FB'
  },
  footerNote: { 
    textAlign: 'center', 
    color: '#8A95A8', 
    fontSize: 12, 
    marginTop: 25,
    lineHeight: 18
  },
  linkText: {
    color: '#5EE7DF',
    fontWeight: '600'
  }
});

export default LoginScreen;