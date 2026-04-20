import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Linking, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useContacts } from '../hooks/useContacts';

const ContactsScreen = () => {
  const { allContacts, loading, refreshing, refresh } = useContacts();
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setFilteredContacts(allContacts);
  }, [allContacts]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = allContacts.filter((contact) => {
      const name = (contact.displayName || '').toLowerCase();
      const phoneMatch = contact.phoneNumbers.some(p => p.number.includes(text));
      return name.includes(text.toLowerCase()) || phoneMatch;
    });
    setFilteredContacts(filtered);
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
        <TouchableOpacity style={styles.callButton} onPress={() => Linking.openURL(`tel:${item.phoneNumbers[0].number}`)}>
          <Icon name="call" size={22} color="#5EE7DF" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#999" />
          <TextInput
            placeholder="Search contacts..."
            placeholderTextColor="#999"
            style={styles.input}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#5EE7DF" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.recordID}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#5EE7DF" />}
          ListEmptyComponent={<Text style={styles.empty}>No contacts found</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1724' },
  searchContainer: { padding: 10, backgroundColor: '#1A2233' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F1724', borderRadius: 10, paddingHorizontal: 12 },
  input: { flex: 1, height: 45, color: '#F4F7FB', marginLeft: 10 },
  contactItem: { flexDirection: 'row', padding: 15, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(80,95,120,0.1)' },
  leftContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(94,231,223,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: '#5EE7DF', fontWeight: 'bold', fontSize: 18 },
  name: { fontSize: 16, fontWeight: '600', color: '#F4F7FB' },
  number: { color: '#8A95A8', fontSize: 13, marginTop: 2 },
  callButton: { padding: 10 },
  empty: { textAlign: 'center', marginTop: 40, color: '#8A95A8' }
});

export default ContactsScreen;