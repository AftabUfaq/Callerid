import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar   
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const SettingItem = ({ icon, title, subtitle }) => (
  <TouchableOpacity style={styles.item}>
    <View style={styles.iconContainer}>
      <Icon name={icon} size={22} color="#5EE7DF" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
    <Icon name="chevron-forward" size={18} color="#8A95A8" />
  </TouchableOpacity>
);

const SettingsScreen = () => {
  return (
    // 3. Wrap everything in SafeAreaView
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.sectionTitle}>General</Text>
        <SettingItem icon="notifications-outline" title="Notifications" subtitle="Alerts for blocked spam" />
        <SettingItem icon="moon-outline" title="Dark Mode" subtitle="On" />
        
        <Text style={styles.sectionTitle}>Blocking</Text>
        <SettingItem icon="ban-outline" title="Block List" subtitle="Manage your blocked numbers" />
        <SettingItem icon="globe-outline" title="International Calls" subtitle="Block calls from other countries" />

        <Text style={styles.sectionTitle}>About</Text>
        <SettingItem icon="information-circle-outline" title="Version" subtitle="1.0.2 (Beta)" />
        <SettingItem icon="help-circle-outline" title="Support" subtitle="Help center and feedback" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Ensure the safe area takes up the whole screen
  safe: { flex: 1, backgroundColor: '#0F1724' },
  container: { flex: 1 },
  
  sectionTitle: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: '#8A95A8', 
    marginHorizontal: 20, 
    marginTop: 25, 
    marginBottom: 10, 
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  
  item: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1A2233', // Matching your card color
    padding: 16, 
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(80,95,120,0.2)'
  },
  
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(94,231,223,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  
  textContainer: { flex: 1 },
  title: { fontSize: 16, fontWeight: '500', color: '#F4F7FB' },
  subtitle: { fontSize: 12, color: '#8A95A8', marginTop: 2 }
});

export default SettingsScreen;