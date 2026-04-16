import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
  const [isProtected, setIsProtected] = useState(true);

  return (
    <View style={styles.container}>
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

      <View style={styles.toggleRow}>
        <Text style={styles.toggleText}>Real-time Spam Detection</Text>
        <Switch 
          value={isProtected} 
          onValueChange={setIsProtected} 
          trackColor={{ false: "#767577", true: "#4285F4" }}
        />
      </View>
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
    marginTop: 40,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 15
  },
  toggleText: { fontSize: 16, fontWeight: '600' }
});

export default HomeScreen;