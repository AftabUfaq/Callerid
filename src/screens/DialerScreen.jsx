import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, FlatList, StatusBar, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Contacts from 'react-native-contacts';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

const DialerScreen = () => {
  const [number, setNumber] = useState('');
  const [allContacts, setAllContacts] = useState([]);
  const [matchedContacts, setMatchedContacts] = useState([]);

  const keys = [
    { num: '1', sub: ' ' }, { num: '2', sub: 'ABC' }, { num: '3', sub: 'DEF' },
    { num: '4', sub: 'GHI' }, { num: '5', sub: 'JKL' }, { num: '6', sub: 'MNO' },
    { num: '7', sub: 'PQRS' }, { num: '8', sub: 'TUV' }, { num: '9', sub: 'WXYZ' },
    { num: '*', sub: ' ' }, { num: '0', sub: '+' }, { num: '#', sub: ' ' },
  ];

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
      setMatchedContacts(matches.slice(0, 3)); 
    } else {
      setMatchedContacts([]);
    }
  }, [number, allContacts]);

  const handlePress = (key) => setNumber(prev => prev + key);
  const handleDelete = () => setNumber(prev => prev.slice(0, -1));
  
  const makeCall = (numToCall) => {
    const finalNum = numToCall || number;
    if (finalNum.length > 0) Linking.openURL(`tel:${finalNum}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 1. Suggestions Area */}
      <View style={styles.suggestionsContainer}>
        {matchedContacts.map((contact, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.suggestionItem}
            onPress={() => makeCall(contact.phoneNumbers[0].number)}
          >
            <View style={styles.suggestAvatar}>
               <Text style={styles.suggestAvatarText}>{contact.givenName?.[0]}</Text>
            </View>
            <View style={styles.suggestionTextWrapper}>
              <Text style={styles.suggestionName} numberOfLines={1}>{contact.displayName}</Text>
              <Text style={styles.suggestionNumber}>{contact.phoneNumbers[0].number}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* 2. Number Display Area with Integrated Red Delete Button */}
      <View style={styles.displayContainer}>
        {/* Empty view to balance the center alignment of the number */}
        <View style={styles.sideAction} />
        
        <Text style={styles.displayNumber} numberOfLines={1} adjustsFontSizeToFit>
          {number}
        </Text>
        
        <View style={styles.sideAction}>
          {number.length > 0 && (
            <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
              <Icon name="backspace" size={28} color="#F26D6D" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 3. Keypad */}
      <View style={styles.keypadWrapper}>
        <FlatList
          data={keys}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.key} 
              onPress={() => handlePress(item.num)}
              onLongPress={() => item.num === '0' && handlePress('+')}
            >
              <Text style={styles.keyText}>{item.num}</Text>
              <Text style={styles.subText}>{item.sub}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.num}
          numColumns={3}
          scrollEnabled={false}
        />
      </View>

      {/* 4. Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.callButton} onPress={() => makeCall()}>
          <Icon name="call" size={28} color="#0F1724" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1724' },
  suggestionsContainer: {
    height: 60,
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 8,
    borderRadius: 12,
  },
  suggestAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(94,231,223,0.2)', justifyContent: 'center', alignItems: 'center' },
  suggestAvatarText: { color: '#5EE7DF', fontWeight: 'bold', fontSize: 12 },
  suggestionTextWrapper: { flex: 1, marginLeft: 12 },
  suggestionName: { fontSize: 14, fontWeight: '600', color: '#F4F7FB' },
  suggestionNumber: { fontSize: 11, color: '#8A95A8' },
  
  displayContainer: { 
    height: 80, 
    flexDirection: 'row',
    alignItems: 'center', 
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
  displayNumber: { 
    fontSize: 44, 
    fontWeight: '300', 
    color: '#F4F7FB', 
    flex: 1, 
    textAlign: 'center',
    letterSpacing: 2
  },
  sideAction: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    padding: 10,
  },

  keypadWrapper: {
    flex: 4,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  key: { 
    flex: 1, 
    aspectRatio: 1.2, 
    justifyContent: 'center', 
    alignItems: 'center', 
    margin: 6, 
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  keyText: { fontSize: 32, color: '#F4F7FB' },
  subText: { fontSize: 10, color: '#8A95A8', marginTop: -2 },

  footer: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10
  },
  callButton: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    backgroundColor: '#5EE7DF', 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#5EE7DF',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
});

export default DialerScreen;