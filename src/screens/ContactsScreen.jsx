import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, FlatList, StyleSheet, TextInput, 
  TouchableOpacity, ActivityIndicator, Linking, RefreshControl 
} from 'react-native';
import Contacts from 'react-native-contacts';
import Icon from 'react-native-vector-icons/Ionicons';

const ContactsScreen = () => {
  const [allContacts, setAllContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

    // 2. Pull-to-Refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadContacts();
  }, []);

  
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const contacts = await Contacts.getAll();
      const sorted = contacts.sort((a, b) => 
        (a.displayName || '').localeCompare(b.displayName || '')
      );
      setAllContacts(sorted);
      setFilteredContacts(sorted);
    } catch (error) {
      console.error("Failed to load contacts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };



  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredContacts(allContacts);
      return;
    }

    const filtered = allContacts.filter((contact) => {
      const name = contact.displayName?.toLowerCase() || '';
      // Search through ALL phone numbers for this contact
      const phoneMatch = contact.phoneNumbers.some(p => p.number.includes(text));
      return name.includes(text.toLowerCase()) || phoneMatch;
    });
    setFilteredContacts(filtered);
  };

  const makeCall = (phoneNumber) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.contactItem}>
      <View style={styles.leftContent}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.givenName?.[0] || '?'}</Text>
        </View>
        <View>
          <Text style={styles.name}>{item.displayName}</Text>
          <Text style={styles.number}>{item.phoneNumbers[0]?.number || 'No number'}</Text>
        </View>
      </View>
      {item.phoneNumbers.length > 0 && (
        <TouchableOpacity style={styles.callButton} onPress={() => makeCall(item.phoneNumbers[0].number)}>
          <Icon name="call" size={22} color="#4CAF50" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            placeholder="Search contacts..."
            placeholderTextColor="#999"
            style={styles.input}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {loading && allContacts.length === 0 ? (
        <ActivityIndicator size="large" color="#4285F4" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.recordID}
          renderItem={renderItem}
          // 3. Add Pull-to-Refresh here
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4285F4']} />
          }
          ListEmptyComponent={<Text style={styles.empty}>No contacts found</Text>}
          // 4. Optimization for large lists
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchContainer: { padding: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f2f5', borderRadius: 10, paddingHorizontal: 10 },
  searchIcon: { marginRight: 10 },
  input: { flex: 1, height: 45, fontSize: 16, color: '#000' },
  contactItem: { flexDirection: 'row', padding: 15, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
  leftContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#4285F4', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  name: { fontSize: 16, fontWeight: '600' },
  number: { color: '#666', fontSize: 13 },
  callButton: { padding: 10, marginLeft: 10 },
  empty: { textAlign: 'center', marginTop: 40, color: '#999' }
});

export default ContactsScreen;