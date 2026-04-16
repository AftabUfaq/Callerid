import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  // 1. Initialize Google Sign-In Configuration
  useEffect(() => {
    GoogleSignin.configure({
     
       webClientId: '926601493060-pd65992cb45mmdjl5p9ida8ul01hqbsl.apps.googleusercontent.com', 
      offlineAccess: true,
    });
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Check if Play Services are available (Android specific)
      await GoogleSignin.hasPlayServices();
      
      // Perform Sign In
      const response = await GoogleSignin.signIn();
      
      // Note: Depending on library version, data might be in response.data or response directly
      const userInfo = response.data ? response.data : response;

      if (userInfo && userInfo.idToken) {
        // Save user info/token
        await AsyncStorage.setItem('userToken', userInfo.idToken);
        await AsyncStorage.setItem('userName', userInfo.user.name || 'User');
        

       navigation.replace('Permissions');
      } else {
        throw new Error("No user info received");
      }

    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Cancelled", "Login was cancelled by user.");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("In Progress", "Sign in is already in progress.");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Error", "Google Play Services not available.");
      } else {
        console.log("Login Error details:", error);
        Alert.alert("Login Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image 
          source={require('../assets/kameez.jpg')} 
          style={styles.logo} 
        />
        <Text style={styles.welcomeText}>Welcome to CallerID</Text>
        <Text style={styles.subText}>Secure your calls and block spam with ease.</Text>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.googleBtn} 
          onPress={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#4285F4" />
          ) : (
            <>
              {/* Replace with your Google icon asset if different */}
              <Image source={require('../assets/kameez.jpg')} style={styles.googleIcon} />
              <Text style={styles.googleText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.footerNote}>By continuing, you agree to our Terms & Privacy Policy</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF' 
  },
  topSection: { 
    flex: 2, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  logo: { 
    width: 150, 
    height: 150, 
    resizeMode: 'contain',
    borderRadius: 75 // Assuming square image, makes it circular
  },
  welcomeText: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    marginTop: 20,
    color: '#000'
  },
  subText: { 
    fontSize: 16, 
    color: '#666', 
    textAlign: 'center', 
    marginTop: 10 
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
    backgroundColor: '#F2F2F2', 
    padding: 15, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  googleIcon: { 
    width: 24, 
    height: 24, 
    marginRight: 12,
    borderRadius: 12
  },
  googleText: { 
    fontSize: 18, 
    fontWeight: '600',
    color: '#333'
  },
  footerNote: { 
    textAlign: 'center', 
    color: '#999', 
    fontSize: 12, 
    marginTop: 20 
  }
});

export default LoginScreen;