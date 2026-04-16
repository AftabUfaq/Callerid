import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MOCK_CALLS = [
  { id: '1', name: 'John Doe', type: 'Incoming', time: '2 mins ago', status: 'Safe' },
  { id: '2', name: '+1 888 234 567', type: 'Missed', time: '1 hour ago', status: 'Spam' },
  { id: '3', name: 'Zomato Delivery', type: 'Incoming', time: '3 hours ago', status: 'Safe' },
];

const CallLogsScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.callItem}>
      <Icon 
        name={item.type === 'Incoming' ? "call-outline" : "close-circle-outline"} 
        size={25} 
        color={item.type === 'Incoming' ? "#4CAF50" : "#F44336"} 
      />
      <View style={styles.callInfo}>
        <Text style={styles.callerName}>{item.name}</Text>
        <Text style={styles.callDetails}>{item.type} • {item.time}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: item.status === 'Spam' ? '#FFEBEE' : '#E3F2FD' }]}>
        <Text style={{ color: item.status === 'Spam' ? '#F44336' : '#2196F3', fontSize: 12 }}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList 
        data={MOCK_CALLS} 
        renderItem={renderItem} 
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 15 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  callItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  callInfo: { flex: 1, marginLeft: 15 },
  callerName: { fontSize: 16, fontWeight: 'bold' },
  callDetails: { fontSize: 13, color: '#888' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }
});

export default CallLogsScreen;