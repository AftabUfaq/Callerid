import React, { useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  PermissionsAndroid, Platform, NativeModules, Alert, 
  StatusBar, Animated 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const PermissionItem = ({ icon, title, desc, index }) => {
  const slideAnim = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0, duration: 500, delay: index * 150, useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1, duration: 500, delay: index * 150, useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.pItem, { opacity, transform: [{ translateX: slideAnim }] }]}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={24} color="#5EE7DF" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.pTitle}>{title}</Text>
        <Text style={styles.pDesc}>{desc}</Text>
      </View>
    </Animated.View>
  );
};

const PermissionsScreen = ({ navigation }) => {
  const shieldPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Breathing pulse for the shield icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(shieldPulse, { toValue: 1.15, duration: 1500, useNativeDriver: true }),
        Animated.timing(shieldPulse, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        ];
        
        await PermissionsAndroid.requestMultiple(permissions);
        
        if (NativeModules.DialerModule?.requestDefaultDialer) {
          NativeModules.DialerModule.requestDefaultDialer();
        }
        
        navigation.replace('MainTabs');
      } else {
        // iOS Logic
        navigation.replace('MainTabs');
      }
    } catch (err) {
      navigation.replace('MainTabs');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1724" />
      
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <View style={styles.shieldWrapper}>
                <Animated.View 
                    style={[styles.shieldPulseRing, { transform: [{ scale: shieldPulse }] }]} 
                />
                <View style={styles.shieldIcon}>
                    <Ionicons name="shield-checkmark" size={44} color="#5EE7DF" />
                </View>
            </View>
            <Text style={styles.headerTitle}>Security Setup</Text>
            <Text style={styles.headerSub}>
                Grant these permissions to activate high-performance spam detection and real-time caller ID.
            </Text>
        </View>

        <View style={styles.listContainer}>
            <PermissionItem 
              index={0}
              icon="phone-portrait-outline" 
              title="Default Phone App" 
              desc="Required to identify callers automatically as the phone rings." 
            />
            <PermissionItem 
              index={1}
              icon="people-outline" 
              title="Contacts & Logs" 
              desc="Allows us to show names for saved contacts and recent history." 
            />
            <PermissionItem 
              index={2}
              icon="layers-outline" 
              title="Display Over Apps" 
              desc="Shows a helpful info popup on top of incoming call screens." 
            />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn} onPress={requestPermissions} activeOpacity={0.8}>
          <Text style={styles.btnText}>Grant Permissions</Text>
          <Ionicons name="chevron-forward" size={20} color="#0F1724" />
        </TouchableOpacity>
        
        <TouchableOpacity 
            style={styles.skipBtn} 
            onPress={() => navigation.replace('MainTabs')}
        >
            <Text style={styles.skipText}>Set up later in Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1724' },
  scroll: { paddingBottom: 20 },
  header: { padding: 30, paddingTop: 20, alignItems: 'center' },
  
  shieldWrapper: {
    width: 120, height: 120,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 20,
  },
  shieldIcon: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(94,231,223,0.05)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(94,231,223,0.2)',
    zIndex: 2,
  },
  shieldPulseRing: {
    position: 'absolute',
    width: 110, height: 110, borderRadius: 55,
    borderWidth: 2, borderColor: 'rgba(94,231,223,0.1)',
    zIndex: 1,
  },

  headerTitle: { fontSize: 32, fontWeight: '800', color: '#FFF', textAlign: 'center' },
  headerSub: { fontSize: 15, color: '#8A95A8', textAlign: 'center', marginTop: 12, lineHeight: 22 },
  
  listContainer: { paddingHorizontal: 25 },
  pItem: { 
    flexDirection: 'row', 
    marginBottom: 16, 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    padding: 18, 
    borderRadius: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconContainer: {
    width: 50, height: 50, borderRadius: 15,
    backgroundColor: 'rgba(94,231,223,0.1)',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 16
  },
  pTitle: { fontSize: 17, fontWeight: '700', color: '#FFF' },
  pDesc: { fontSize: 13, color: '#8A95A8', marginTop: 4, lineHeight: 18 },
  
  footer: { padding: 25, paddingBottom: 40 },
  btn: { 
    backgroundColor: '#5EE7DF', 
    height: 64, borderRadius: 20, 
    flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#5EE7DF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 8
  },
  btnText: { color: '#0F1724', fontSize: 18, fontWeight: '900', marginRight: 8 },
  skipBtn: { marginTop: 22, alignItems: 'center' },
  skipText: { color: '#545F71', fontSize: 14, fontWeight: '600' }
});

export default PermissionsScreen;