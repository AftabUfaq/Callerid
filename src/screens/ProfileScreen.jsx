import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 

} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({ name: 'User', email: '' });

  useEffect(() => {
    const loadUserData = async () => {
      const name = await AsyncStorage.getItem('userName');
      const email = await AsyncStorage.getItem('userEmail'); // Assuming you saved this at login
      setUserData({ name: name || 'Caller User', email: email || 'user@email.com' });
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  const StatCard = ({ label, value, icon, color }) => (
    <View style={styles.statCard}>
      <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const MenuOption = ({ icon, title, subtitle, onPress, color = '#333' }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={22} color={color} />
        <View style={styles.menuTextContainer}>
          <Text style={[styles.menuTitle, { color }]}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://ui-avatars.com/api/?name=' + userData.name + '&background=007AFF&color=fff' }} 
            style={styles.avatar} 
          />
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <StatCard label="Spam Blocked" value="124" icon="shield-outline" color="#FF3B30" />
          <StatCard label="Identified" value="850" icon="checkmark-done-outline" color="#34C759" />
        </View>

        {/* Settings Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <MenuOption 
            icon="language-outline" 
            title="App Language" 
            subtitle="English / Urdu" 
            onPress={() => navigation.navigate('PrimaryLanguage')} 
          />
          <MenuOption 
            icon="notifications-outline" 
            title="Notification Settings" 
            onPress={() => {}} 
          />
          <MenuOption 
            icon="call-outline" 
            title="Blocked Numbers" 
            onPress={() => {}} 
          />
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          <MenuOption 
            icon="help-circle-outline" 
            title="Help & Support" 
            onPress={() => {}} 
          />
          <MenuOption 
            icon="log-out-outline" 
            title="Logout" 
            color="#FF3B30" 
            onPress={handleLogout} 
          />
        </View>

        <Text style={styles.versionText}>CallerID App v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { alignItems: 'center', padding: 30, backgroundColor: '#FFF' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  userEmail: { fontSize: 14, color: '#666', marginTop: 4 },
  editBtn: { marginTop: 15, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#007AFF' },
  editBtnText: { color: '#007AFF', fontWeight: '600' },
  statsContainer: { flexDirection: 'row', padding: 20, justifyContent: 'space-between' },
  statCard: { backgroundColor: '#FFF', width: '47%', padding: 20, borderRadius: 16, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  iconCircle: { padding: 10, borderRadius: 20, marginBottom: 10 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 2 },
  menuSection: { backgroundColor: '#FFF', marginTop: 20, paddingHorizontal: 20, paddingVertical: 10 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#999', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuTextContainer: { marginLeft: 15 },
  menuTitle: { fontSize: 16, fontWeight: '500' },
  menuSubtitle: { fontSize: 12, color: '#999', marginTop: 2 },
  versionText: { textAlign: 'center', color: '#CCC', marginVertical: 30, fontSize: 12 }
});

export default ProfileScreen;