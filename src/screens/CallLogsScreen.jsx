import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  PermissionsAndroid, 
  Platform, 
  ActivityIndicator,
  TextInput,
  Alert
} from 'react-native';
import CallLogs from 'react-native-call-log'; // Android Only
import Contacts from 'react-native-contacts'; // For iOS fallback
import Icon from 'react-native-vector-icons/Ionicons';

const CallLogsScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (Platform.OS === 'android') {
      fetchAndroidCallLogs();
    } else {
      fetchIOSContacts();
    }
  }, []);

  // --- ANDROID LOGIC ---
  const fetchAndroidCallLogs = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const logs = await CallLogs.load(50);
        setData(logs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // --- iOS LOGIC (Fallback to Contacts) ---
  const fetchIOSContacts = () => {
    Contacts.checkPermission().then(permission => {
      if (permission === 'undefined') {
        Contacts.requestPermission().then(permission => {
          if (permission === 'authorized') loadContacts();
        });
      } else if (permission === 'authorized') {
        loadContacts();
      } else {
        setLoading(false);
      }
    });
  };

  const loadContacts = () => {
    Contacts.getAll().then(contacts => {
      // Map contacts to a similar format as call logs for the UI
      const mapped = contacts.map(c => ({
        name: `${c.givenName} ${c.familyName}`,
        phoneNumber: c.phoneNumbers[0]?.number || 'No Number',
        type: 'Contact',
        dateTime: 'Saved Contact',
        isContact: true
      }));
      setData(mapped);
      setLoading(false);
    });
  };

  const filteredData = data.filter(item => 
    (item.name && item.name.toLowerCase().includes(searchText.toLowerCase())) ||
    (item.phoneNumber && item.phoneNumber.includes(searchText))
  );

  const renderItem = ({ item }) => {
    const isMissed = item.type === 'MISSED';
    const isSpam = !item.name && Platform.OS === 'android';

    return (
      <View style={styles.callItem}>
        <View style={[styles.iconCircle, { backgroundColor: isMissed ? '#FFEBEE' : '#E8F5E9' }]}>
          <Icon 
            name={Platform.OS === 'ios' ? "person" : (item.type === 'INCOMING' ? "call" : "close-outline")} 
            size={20} 
            color={isMissed ? "#F44336" : "#007AFF"} 
          />
        </View>

        <View style={styles.callInfo}>
          <Text style={[styles.callerName, isSpam && { color: '#F44336' }]}>
            {item.name || item.phoneNumber}
          </Text>
          <Text style={styles.callDetails}>
            {item.type} • {item.dateTime || item.phoneNumber}
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
      <View style={styles.searchSection}>
        <Icon name="search" size={20} color="#999" style={{ marginLeft: 10 }} />
        <TextInput
          style={styles.searchInput}
          placeholder={Platform.OS === 'ios' ? "Search contacts..." : "Search calls..."}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList 
          data={filteredData} 
          renderItem={renderItem} 
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ padding: 15 }}
          ListEmptyComponent={
            <View style={styles.center}>
                <Icon name="people-outline" size={50} color="#CCC" />
                <Text style={{ color: '#999', marginTop: 10 }}>Nothing found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

// ... keep your existing styles ...
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
      paddingHorizontal: 10,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 5,
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