import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  PermissionsAndroid, 
  Platform, 
  ActivityIndicator,
  TextInput
} from 'react-native';
import CallLogs from 'react-native-call-log';
import Icon from 'react-native-vector-icons/Ionicons';

const CallLogsScreen = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchCallLogs();
  }, []);

  const fetchCallLogs = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CALL_LOG
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Fetch last 50 calls
          const callLogs = await CallLogs.load(50);
          setLogs(callLogs);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    (log.name && log.name.toLowerCase().includes(searchText.toLowerCase())) ||
    log.phoneNumber.includes(searchText)
  );

  const renderItem = ({ item }) => {
    // Logic to determine icon and color based on call type
    const isIncoming = item.type === 'INCOMING';
    const isMissed = item.type === 'MISSED';
    const isSpam = item.name === null; // Simple logic: if not in contacts, flag as potential spam

    return (
      <View style={styles.callItem}>
        <View style={[styles.iconCircle, { backgroundColor: isMissed ? '#FFEBEE' : '#E8F5E9' }]}>
          <Icon 
            name={isIncoming ? "call" : isMissed ? "close-outline" : "arrow-redo"} 
            size={20} 
            color={isMissed ? "#F44336" : "#4CAF50"} 
          />
        </View>

        <View style={styles.callInfo}>
          <Text style={[styles.callerName, isSpam && { color: '#F44336' }]}>
            {item.name || item.phoneNumber}
          </Text>
          <Text style={styles.callDetails}>
            {item.type} • {item.dateTime}
          </Text>
        </View>

        {isSpam && (
          <View style={styles.spamBadge}>
            <Text style={styles.spamText}>Spam?</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchSection}>
        <Icon name="search" size={20} color="#999" style={{ marginLeft: 10 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search calls or numbers..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 10, color: '#666' }}>Fetching your logs...</Text>
        </View>
      ) : (
        <FlatList 
          data={filteredLogs} 
          renderItem={renderItem} 
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ padding: 15 }}
          ListEmptyComponent={
            <View style={styles.center}>
                <Icon name="journal-outline" size={50} color="#CCC" />
                <Text style={{ color: '#999', marginTop: 10 }}>No recent calls found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 15,
    borderRadius: 15,
    elevation: 2,
    paddingHorizontal: 10
  },
  searchInput: { flex: 1, padding: 12, fontSize: 16 },
  callItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    backgroundColor: '#FFF', 
    borderRadius: 15, 
    marginBottom: 10,
    elevation: 1 
  },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  callInfo: { flex: 1, marginLeft: 15 },
  callerName: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  callDetails: { fontSize: 12, color: '#888', marginTop: 2 },
  spamBadge: { backgroundColor: '#FFEBEE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  spamText: { color: '#F44336', fontSize: 11, fontWeight: 'bold' }
});

export default CallLogsScreen;