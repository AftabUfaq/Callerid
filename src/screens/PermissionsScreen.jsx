import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, PermissionsAndroid, Platform, NativeModules, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PermissionItem = ({ icon, title, desc }) => (
  <View style={styles.pItem}>
    <Ionicons name={icon} size={30} color="#007AFF" style={styles.pIcon} />
    <View style={{ flex: 1 }}>
      <Text style={styles.pTitle}>{title}</Text>
      <Text style={styles.pDesc}>{desc}</Text>
    </View>
  </View>
);

const PermissionsScreen = ({ navigation }) => {
  const { DialerModule } = NativeModules;
  
const requestPermissions = async () => {
  try {
    if (Platform.OS === 'android') {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      ];

      const granted = await PermissionsAndroid.requestMultiple(permissions);

      // Check each permission individually in the console
      Object.keys(granted).forEach(key => {
        console.log(`${key}: ${granted[key]}`);
      });

      // Handle the Default Dialer Role
      if (NativeModules.DialerModule?.requestDefaultDialer) {
        NativeModules.DialerModule.requestDefaultDialer();
      }

      // Handle Overlay Permission (The "Display over apps" one)
      // We check if it's already granted; if not, we send them to settings.
      // Note: This usually requires a native check, but for now, we trigger the link.
      Linking.openSettings(); 
    }

    navigation.replace('MainTabs');
  } catch (err) {
    console.warn(err);
  }
};

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.headerTitle}>Almost Ready!</Text>
        <Text style={styles.headerSub}>We need a few permissions to protect your calls.</Text>

        <PermissionItem 
          icon="call-outline" 
          title="Default Phone App" 
          desc="Needed to identify calls in real-time and provide spam protection." 
        />
        <PermissionItem 
          icon="copy-outline" 
          title="Call Logs & Contacts" 
          desc="Helps us show your history and identify who is calling." 
        />
        <PermissionItem 
          icon="layers-outline" 
          title="Display Over Apps" 
          desc="This allows the Caller ID popup to appear when you receive a call." 
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn} onPress={requestPermissions}>
          <Text style={styles.btnText}>Allow & Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scroll: { padding: 25 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, marginTop: 40 },
  headerSub: { fontSize: 16, color: '#666', marginBottom: 30 },
  pItem: { flexDirection: 'row', marginBottom: 30, alignItems: 'flex-start' },
  pIcon: { marginRight: 20, marginTop: 5 },
  pTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  pDesc: { fontSize: 14, color: '#777', marginTop: 4 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#EEE' },
  btn: { backgroundColor: '#007AFF', padding: 18, borderRadius: 15, alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});

export default PermissionsScreen;