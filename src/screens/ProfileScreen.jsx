import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({ name: 'User', email: '' });

  useEffect(() => {
    const loadUserData = async () => {
      const name = await AsyncStorage.getItem('userName');
      const email = await AsyncStorage.getItem('userEmail');
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
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const MenuOption = ({ icon, title, subtitle, onPress, color = '#F4F7FB' }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <View style={styles.menuIconBg}>
          <Ionicons name={icon} size={20} color={color === '#F4F7FB' ? '#5EE7DF' : color} />
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={[styles.menuTitle, { color }]}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#8A95A8" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <Image 
              source={{ uri: `https://ui-avatars.com/api/?name=${userData.name}&background=5EE7DF&color=0F1724` }} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.cameraBadge}>
              <Ionicons name="camera" size={16} color="#0F1724" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <StatCard label="Spam Blocked" value="124" icon="shield-outline" color="#F26D6D" />
          <StatCard label="Identified" value="850" icon="checkmark-done-outline" color="#5EE7DF" />
        </View>

        {/* Preferences Menu */}
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

        {/* Account Menu */}
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
            color="#F26D6D" 
            onPress={handleLogout} 
          />
        </View>

        <Text style={styles.versionText}>CallerID App v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1724' },
  header: { alignItems: 'center', paddingVertical: 30, backgroundColor: '#1A2233', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  avatarWrapper: { position: 'relative', marginBottom: 15 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#5EE7DF' },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#5EE7DF', width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#1A2233' },
  userName: { fontSize: 22, fontWeight: '800', color: '#F4F7FB' },
  userEmail: { fontSize: 14, color: '#8A95A8', marginTop: 4 },
  editBtn: { marginTop: 18, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12, backgroundColor: 'rgba(94,231,223,0.1)', borderWidth: 1, borderColor: 'rgba(94,231,223,0.3)' },
  editBtnText: { color: '#5EE7DF', fontWeight: '700', fontSize: 13 },
  
  statsContainer: { flexDirection: 'row', padding: 20, justifyContent: 'space-between', marginTop: 10 },
  statCard: { backgroundColor: '#1A2233', width: '47%', padding: 20, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(80,95,120,0.2)' },
  iconCircle: { padding: 12, borderRadius: 18, marginBottom: 12 },
  statValue: { fontSize: 22, fontWeight: '800', color: '#F4F7FB' },
  statLabel: { fontSize: 12, color: '#8A95A8', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  
  menuSection: { marginTop: 25, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#8A95A8', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1.5 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#1A2233', borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(80,95,120,0.1)' },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIconBg: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center' },
  menuTextContainer: { marginLeft: 15 },
  menuTitle: { fontSize: 16, fontWeight: '600' },
  menuSubtitle: { fontSize: 12, color: '#8A95A8', marginTop: 2 },
  versionText: { textAlign: 'center', color: '#8A95A8', opacity: 0.5, marginTop: 30, fontSize: 12, letterSpacing: 1 }
});

export default ProfileScreen;