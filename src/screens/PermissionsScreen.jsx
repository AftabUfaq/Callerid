import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  PermissionsAndroid, 
  Platform, 
  NativeModules, 
  Alert, 
  StatusBar 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const PermissionItem = ({ icon, title, desc }) => (
  <View style={styles.pItem}>
    <View style={styles.iconContainer}>
      <Ionicons name={icon} size={24} color="#5EE7DF" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.pTitle}>{title}</Text>
      <Text style={styles.pDesc}>{desc}</Text>
    </View>
  </View>
);

const PermissionsScreen = ({ navigation }) => {
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
        
        // Navigate after request
        navigation.replace('MainTabs');
      } else if (Platform.OS === 'ios') {
        Alert.alert(
          "iOS Protection",
          "On iOS, CallerID works via CallKit. Please enable our extension in Settings > Phone > Call Blocking & Identification.",
          [{ text: "Understood", onPress: () => navigation.replace('MainTabs') }]
        );
      }
    } catch (err) {
      navigation.replace('Onboarding');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1724" />
      
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <View style={styles.shieldIcon}>
                <View style={styles.shieldPulse} />
                <Ionicons name="shield-checkmark" size={44} color="#5EE7DF" />
            </View>
            <Text style={styles.headerTitle}>Security Setup</Text>
            <Text style={styles.headerSub}>
                Grant these permissions to activate high-performance spam detection and real-time caller ID.
            </Text>
        </View>

        <View style={styles.listContainer}>
            <PermissionItem 
              icon="phone-portrait-outline" 
              title="Default Phone App" 
              desc="Required to identify callers automatically as the phone rings." 
            />
            <PermissionItem 
              icon="people-outline" 
              title="Contacts & Logs" 
              desc="Allows us to show names for saved contacts and recent history." 
            />
            <PermissionItem 
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
  header: { 
    padding: 30, 
    paddingTop: 20, 
    alignItems: 'center',
  },
  shieldIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(94,231,223,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(94,231,223,0.2)'
  },
  shieldPulse: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(94,231,223,0.1)',
  },
  headerTitle: { fontSize: 30, fontWeight: '800', color: '#F4F7FB', textAlign: 'center' },
  headerSub: { fontSize: 15, color: '#8A95A8', textAlign: 'center', marginTop: 12, lineHeight: 22 },
  
  listContainer: { paddingHorizontal: 25 },
  pItem: { 
    flexDirection: 'row', 
    marginBottom: 16, 
    backgroundColor: '#1A2233', 
    padding: 16, 
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(80,95,120,0.1)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  pTitle: { fontSize: 16, fontWeight: '700', color: '#F4F7FB' },
  pDesc: { fontSize: 12, color: '#8A95A8', marginTop: 4, lineHeight: 18 },
  
  footer: { padding: 25 },
  btn: { 
    backgroundColor: '#5EE7DF', 
    height: 60, 
    borderRadius: 16, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center',
  },
  btnText: { color: '#0F1724', fontSize: 18, fontWeight: '800', marginRight: 8 },
  skipBtn: { marginTop: 20, alignItems: 'center' },
  skipText: { color: '#8A95A8', fontSize: 14, fontWeight: '500' }
});

export default PermissionsScreen;