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
  Linking, 
  Alert, // Added missing import
  StatusBar 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PermissionItem = ({ icon, title, desc }) => (
  <View style={styles.pItem}>
    <View style={styles.iconContainer}>
      <Ionicons name={icon} size={26} color="#007AFF" />
    </View>
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
        // Step 1: Standard System Permissions
        const permissions = [
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        ];

        const granted = await PermissionsAndroid.requestMultiple(permissions);
        
        // Step 2: Request Dialer Role (The System Popup)
        if (DialerModule?.requestDefaultDialer) {
          DialerModule.requestDefaultDialer();
        }

        // Step 3: Handle the Overlay (Display over apps)
        // We show an Alert first so they know WHY they are going to settings
        Alert.alert(
          "Final Step: Overlay",
          "To show Caller ID popups during calls, please enable 'Display over other apps' for CallerID in the next screen.",
          [
            { 
              text: "Setup Now", 
              onPress: () => {
                Linking.openSettings(); 
                // We don't replace screen here because they need to come back
              } 
            },
            {
              text: "I'll do it later",
              onPress: () => navigation.replace('MainTabs'),
              style: "cancel"
            }
          ]
        );
      } else {
        navigation.replace('MainTabs');
      }
    } catch (err) {
      console.warn("Permission Error:", err);
      navigation.replace('MainTabs'); // Fallback
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <View style={styles.shieldIcon}>
                <Ionicons name="shield-checkmark" size={50} color="#007AFF" />
            </View>
            <Text style={styles.headerTitle}>Security Setup</Text>
            <Text style={styles.headerSub}>
                Enable these settings to start identifying spam and unknown callers in real-time.
            </Text>
        </View>

        <View style={styles.listContainer}>
            <PermissionItem 
              icon="phone-portrait-outline" 
              title="Default Phone App" 
              desc="Identify callers automatically as the phone rings." 
            />
            <PermissionItem 
              icon="people-outline" 
              title="Contacts & Logs" 
              desc="Show names for saved contacts and your recent call history." 
            />
            <PermissionItem 
              icon="copy-outline" 
              title="Display Over Apps" 
              desc="Shows a popup with caller info on top of your current screen." 
            />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn} onPress={requestPermissions} activeOpacity={0.8}>
          <Text style={styles.btnText}>Grant Permissions</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity 
            style={styles.skipBtn} 
             onPress={() => navigation.replace('MainTabs')}
            
        >
            <Text style={styles.skipText}>Set up later in Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scroll: { paddingBottom: 40 },
  header: { 
    backgroundColor: '#FFF', 
    padding: 30, 
    paddingTop: 60, 
    borderBottomLeftRadius: 40, 
    borderBottomRightRadius: 40,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  shieldIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E7F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  headerTitle: { fontSize: 32, fontWeight: '900', color: '#1A1C1E', textAlign: 'center' },
  headerSub: { fontSize: 16, color: '#6C757D', textAlign: 'center', marginTop: 12, lineHeight: 22 },
  
  listContainer: { padding: 25, marginTop: 10 },
  pItem: { 
    flexDirection: 'row', 
    marginBottom: 25, 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 20,
    alignItems: 'center',
    elevation: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#F0F3F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  pTitle: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  pDesc: { fontSize: 13, color: '#777', marginTop: 2, lineHeight: 18 },
  
  footer: { padding: 25, backgroundColor: 'transparent' },
  btn: { 
    backgroundColor: '#007AFF', 
    height: 65, 
    borderRadius: 20, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }
  },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginRight: 8 },
  skipBtn: { marginTop: 15, alignItems: 'center' },
  skipText: { color: '#ADB5BD', fontSize: 14, fontWeight: '600' }
});

export default PermissionsScreen;