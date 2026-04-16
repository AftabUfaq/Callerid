import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SettingItem = ({ icon, title, subtitle }) => (
  <TouchableOpacity style={styles.item}>
    <Icon name={icon} size={24} color="#4285F4" style={{ width: 35 }} />
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
    <Icon name="chevron-forward" size={20} color="#CCC" />
  </TouchableOpacity>
);

const SettingsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>General</Text>
      <SettingItem icon="notifications-outline" title="Notifications" subtitle="Alerts for blocked spam" />
      <SettingItem icon="moon-outline" title="Dark Mode" subtitle="Off" />
      
      <Text style={styles.sectionTitle}>Blocking</Text>
      <SettingItem icon="ban-outline" title="Block List" subtitle="Manage your blocked numbers" />
      <SettingItem icon="globe-outline" title="International Calls" subtitle="Block calls from other countries" />

      <Text style={styles.sectionTitle}>About</Text>
      <SettingItem icon="information-circle-outline" title="Version" subtitle="1.0.2 (Beta)" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#888', marginHorizontal: 20, marginTop: 25, marginBottom: 10, textTransform: 'uppercase' },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderBottomWidth: 0.5, borderBottomColor: '#EEE' },
  textContainer: { flex: 1 },
  title: { fontSize: 16, color: '#333' },
  subtitle: { fontSize: 12, color: '#999' }
});

export default SettingsScreen;