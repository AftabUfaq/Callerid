import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  TouchableOpacity, 
  NativeModules, // 1. Import NativeModules
  Platform, 
  Alert 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// 2. Access your custom module
const { DialerModule } = NativeModules;
console.log("Available Native Modules:", Object.keys(NativeModules));

const HomeScreen = () => {
  const [isProtected, setIsProtected] = useState(true);

  // 3. Function to trigger the Default Dialer prompt
  const handleSetDefaultDialer = () => {
    if (Platform.OS === 'android') {
      if (DialerModule && DialerModule.requestDefaultDialer) {
        DialerModule.requestDefaultDialer();
      } else {
        Alert.alert(
          "Module Error", 
          "DialerModule not found. Make sure you rebuilt the app using 'npx react-native run-android'."
        );
      }
    } else {
      Alert.alert("Not Supported", "Default dialer roles are only available on Android.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Protection Status Card */}
      <View style={[styles.statusCard, { backgroundColor: isProtected ? '#E8F5E9' : '#FFEBEE' }]}>
        <Icon 
          name={isProtected ? "shield-checkmark" : "shield-alert"} 
          size={80} 
          color={isProtected ? "#4CAF50" : "#F44336"} 
        />
        <Text style={styles.statusTitle}>
          {isProtected ? "Protection is Active" : "Protection is Disabled"}
        </Text>
        <Text style={styles.statusSubtext}>
          {isProtected ? "We are monitoring incoming calls for spam." : "Your phone is currently at risk of spam calls."}
        </Text>
      </View>

      {/* Spam Toggle */}
      <View style={styles.toggleRow}>
        <Text style={styles.toggleText}>Real-time Spam Detection</Text>
        <Switch 
          value={isProtected} 
          onValueChange={setIsProtected} 
          trackColor={{ false: "#767577", true: "#4285F4" }}
        />
      </View>

      {/* 4. New Button to request Default Dialer role */}
      <TouchableOpacity 
        style={styles.dialerBtn} 
        onPress={handleSetDefaultDialer}
      >
        <Icon name="phone-portrait-outline" size={24} color="#FFF" />
        <Text style={styles.dialerBtnText}>Set as Default Dialer</Text>
      </TouchableOpacity>

      <Text style={styles.infoNote}>
        To identify callers and block spam effectively, CallerID must be your default phone app.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  statusCard: { 
    padding: 30, 
    borderRadius: 20, 
    alignItems: 'center', 
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10
  },
  statusTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 15 },
  statusSubtext: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 10 },
  toggleRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 30,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 15
  },
  toggleText: { fontSize: 16, fontWeight: '600' },
  // Styles for the new Dialer button
  dialerBtn: {
    flexDirection: 'row',
    backgroundColor: '#4285F4',
    padding: 18,
    borderRadius: 15,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2
  },
  dialerBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10
  },
  infoNote: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 15,
    lineHeight: 18
  }
});

export default HomeScreen;