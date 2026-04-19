import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Contacts from 'react-native-contacts';
import { SafeAreaView } from 'react-native-safe-area-context';

const DialerScreen = () => {
  const [number, setNumber] = useState('');
  const [allContacts, setAllContacts] = useState([]);
  const [matchedContacts, setMatchedContacts] = useState([]);

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  useEffect(() => {
    Contacts.getAll()
      .then(contacts => setAllContacts(contacts))
      .catch(err => console.log("Dialer fetch error:", err));
  }, []);

  useEffect(() => {
    if (number.length > 0) {
      const cleanTyped = number.replace(/\D/g, '');
      const matches = allContacts.filter(contact => 
        contact.phoneNumbers.some(p => p.number.replace(/\D/g, '').includes(cleanTyped))
      );
      setMatchedContacts(matches.slice(0, 3)); // Reduced to 2 to save vertical space
    } else {
      setMatchedContacts([]);
    }
  }, [number, allContacts]);

  const handlePress = (key) => setNumber(prev => prev + key);
  const handleDelete = () => setNumber(prev => prev.slice(0, -1));
  
  const makeCall = (numToCall) => {
    const finalNum = numToCall || number;
    if (finalNum.length > 0) {
      Linking.openURL(`tel:${finalNum}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Suggestions Area - Moved down from header */}
      <View style={styles.suggestionsContainer}>
        {matchedContacts.map((contact, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.suggestionItem}
            onPress={() => makeCall(contact.phoneNumbers[0].number)}
          >
            <Icon name="person-circle" size={24} color="#4285F4" />
            <View style={styles.suggestionTextWrapper}>
              <Text style={styles.suggestionName} numberOfLines={1}>{contact.displayName}</Text>
              <Text style={styles.suggestionNumber}>{contact.phoneNumbers[0].number}</Text>
            </View>
            <Icon name="call" size={20} color="#4CAF50" />
          </TouchableOpacity>
        ))}
      </View>

      {/* 2. Number Display Area */}
      <View style={styles.displayContainer}>
        <Text style={styles.displayNumber} numberOfLines={1} adjustsFontSizeToFit>
          {number}
        </Text>
        {number.length > 0 && (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
            <Icon name="backspace-outline" size={30} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* 3. Keypad - Use flex to take up middle space */}
      <View style={styles.keypadWrapper}>
        <FlatList
          data={keys}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.key} onPress={() => handlePress(item)}>
              <Text style={styles.keyText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          numColumns={3}
          scrollEnabled={false}
        />
      </View>

      {/* 4. Footer - Call Button fixed at bottom */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.callButton} onPress={() => makeCall()}>
          <Icon name="call" size={35} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
  },
  suggestionsContainer: {
    height: 140, // Slightly shorter
    paddingHorizontal: 20,
    justifyContent: 'center', // Centers content vertically in this block
    paddingTop: 10, // Gives room below the header
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 12,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#eee'
  },
  suggestionTextWrapper: { flex: 1, marginLeft: 10 },
  suggestionName: { fontSize: 15, fontWeight: '600', color: '#333' },
  suggestionNumber: { fontSize: 12, color: '#666' },
  
  displayContainer: { 
    height: 80, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 30,
    marginBottom: 10
  },
  displayNumber: { fontSize: 45, fontWeight: '300', color: '#000', flex: 1, textAlign: 'center' },
  deleteBtn: { padding: 5 },

  keypadWrapper: {
    flex: 1, // Takes up all remaining space between display and footer
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  key: { 
    flex: 1, 
    aspectRatio: 1.3, // Makes buttons slightly wider/shorter to fit
    justifyContent: 'center', 
    alignItems: 'center', 
    margin: 5,
    borderRadius: 50,
    backgroundColor: '#f0f2f5'
  },
  keyText: { fontSize: 28, color: '#000' },

  footer: { 
    height: 100, // Fixed height for footer
    alignItems: 'center', 
    justifyContent: 'center',
    paddingBottom: 20 
  },
  callButton: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    backgroundColor: '#4CAF50', 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  }
});

export default DialerScreen;