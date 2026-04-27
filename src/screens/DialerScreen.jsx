import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Linking, StatusBar, Animated, PermissionsAndroid,
  Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon     from 'react-native-vector-icons/Ionicons';
import Contacts from 'react-native-contacts';

// ─── constants ───────────────────────────────────────────────────
const KEYS = [
  { num: '1', sub: ''     }, { num: '2', sub: 'ABC'  }, { num: '3', sub: 'DEF'  },
  { num: '4', sub: 'GHI'  }, { num: '5', sub: 'JKL'  }, { num: '6', sub: 'MNO'  },
  { num: '7', sub: 'PQRS' }, { num: '8', sub: 'TUV'  }, { num: '9', sub: 'WXYZ' },
  { num: '*', sub: ''     }, { num: '0', sub: '+',   longPress: '+' }, { num: '#', sub: '' },
];

// ─── helpers ─────────────────────────────────────────────────────
// Formats typed digits into readable groups: 03001234567 → 0300 123 4567
const formatDisplay = (raw) => {
  const digits = raw.replace(/[^\d+]/g, '');
  if (digits.length === 0) return '';
  if (digits.startsWith('+')) {
    // +92 3XX XXXXXXX
    const n = digits.slice(1);
    if (n.length <= 2)  return '+' + n;
    if (n.length <= 5)  return '+' + n.slice(0,2) + ' ' + n.slice(2);
    if (n.length <= 8)  return '+' + n.slice(0,2) + ' ' + n.slice(2,5) + ' ' + n.slice(5);
    return '+' + n.slice(0,2) + ' ' + n.slice(2,5) + ' ' + n.slice(5,8) + ' ' + n.slice(8);
  }
  // local: 0300 123 4567
  if (digits.length <= 4)  return digits;
  if (digits.length <= 7)  return digits.slice(0,4) + ' ' + digits.slice(4);
  if (digits.length <= 11) return digits.slice(0,4) + ' ' + digits.slice(4,7) + ' ' + digits.slice(7);
  return digits;
};


// Strip everything except digits and leading + before dialling
const cleanForDial = (n) => n.replace(/(?!^\+)[^\d]/g, '');


// Android contacts permission helper
const requestContactsPermission = async () => {
  if (Platform.OS !== 'android') return true;
  try {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title:   'Contacts Permission',
        message: 'CallGuard needs access to match numbers to contacts.',
        buttonPositive: 'Allow',
      }
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
};


// ─── DialKey — single key with press animation ───────────────────
const DialKey = ({ item, onPress, onLongPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.88, speed: 50, bounciness: 0, useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1, speed: 30, bounciness: 8, useNativeDriver: true,
    }).start();
  };


  return (
    <Animated.View style={[styles.keyOuter, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.key}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        delayLongPress={400}
      >
        <Text style={styles.keyText}>{item.num}</Text>
        {item.sub ? (
          <Text style={styles.subText}>
            {item.sub}
            {/* hint the long-press + on the 0 key */}
            {item.longPress && <Text style={styles.longPressHint}> +</Text>}

          </Text>
        ) : <Text style={styles.subText}> </Text>}
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── SuggestionItem ──────────────────────────────────────────────
const SuggestionItem = ({ contact, onPress }) => {
  const initials = (contact.givenName?.[0] ?? '?') + (contact.familyName?.[0] ?? '');
  const number   = contact.phoneNumbers[0]?.number ?? '';

  return (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => onPress(number)}
      activeOpacity={0.7}
    >
      <View style={styles.suggestAvatar}>
        <Text style={styles.suggestAvatarText}>{initials.toUpperCase()}</Text>
      </View>
      <View style={styles.suggestionTextWrapper}>
        <Text style={styles.suggestionName} numberOfLines={1}>
          {contact.displayName}
        </Text>
        <Text style={styles.suggestionNumber}>{number}</Text>
      </View>
      <Icon name="call-outline" size={16} color="#5EE7DF" />
    </TouchableOpacity>
  );
};

// ─── main screen ─────────────────────────────────────────────────
const DialerScreen = ({ navigation }) => {
  const [number, setNumber]           = useState('');
  const [allContacts, setAllContacts] = useState([]);
  const [matched, setMatched]         = useState([]);

  // Animated values
  const numScaleAnim  = useRef(new Animated.Value(1)).current;
  const suggestHeight = useRef(new Animated.Value(0)).current;
  const suggestOpacity = useRef(new Animated.Value(0)).current;

  // ① Permission-gated contacts fetch
  useEffect(() => {
    const load = async () => {
      const granted = await requestContactsPermission();
      if (!granted) return;
      try {
        const contacts = await Contacts.getAll();
        setAllContacts(contacts);
      } catch (e) {
        console.warn('Dialer contacts error:', e);
      }
    };
    load();
  }, []);


  // ② Filter + animate suggestion bar in/out
  useEffect(() => {
    if (number.length > 0) {
      const clean = number.replace(/\D/g, '');
      const hits = allContacts
        .filter(c => c.phoneNumbers.some(p =>
          p.number.replace(/\D/g, '').includes(clean)
        ))
        .slice(0, 3);
      setMatched(hits);
      Animated.parallel([
        Animated.timing(suggestHeight,  { toValue: hits.length * 56, duration: 220, useNativeDriver: false }),
        Animated.timing(suggestOpacity, { toValue: hits.length > 0 ? 1 : 0, duration: 180, useNativeDriver: false }),
      ]).start();
    } else {
      setMatched([]);
      Animated.parallel([
        Animated.timing(suggestHeight,  { toValue: 0,   duration: 180, useNativeDriver: false }),
        Animated.timing(suggestOpacity, { toValue: 0,   duration: 150, useNativeDriver: false }),
      ]).start();
    }
  }, [number, allContacts, suggestHeight, suggestOpacity]);


  // ③ Number bounce on each keypress
  const bounceNumber = useCallback(() => {
    Animated.sequence([
      Animated.timing(numScaleAnim, { toValue: 1.08, duration: 60, useNativeDriver: true }),
      Animated.spring(numScaleAnim,  { toValue: 1,    friction: 4, tension: 80, useNativeDriver: true }),
    ]).start();
  }, [numScaleAnim]);


  const handlePress = useCallback((key) => {
    setNumber(prev => prev + key);
    bounceNumber();
  }, [bounceNumber]);

  const handleLongPress = useCallback((key) => {
    if (key === '0') {
      setNumber(prev => prev + '+');
      bounceNumber();
    }
  }, [bounceNumber]);

  // Short press = delete last char, long press = clear all
  const handleDelete     = useCallback(() => setNumber(prev => prev.slice(0, -1)), []);
  const handleDeleteAll  = useCallback(() => setNumber(''), []);


  // ④ Clean number before dialling
  const makeCall = useCallback((override) => {
    const raw    = override ?? number;
    const dialed = cleanForDial(raw);
    if (dialed.length === 0) return;
    Linking.openURL(`tel:${dialed}`).catch(() =>
      Alert.alert('Error', 'Could not open the phone app.')
    );
  }, [number]);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1724" />

      {/* ── Suggestions (animated height, no fixed height) ── */}
      <Animated.View style={[
        styles.suggestionsContainer,
        { height: suggestHeight, opacity: suggestOpacity },
      ]}>
        {matched.map((contact, i) => (
          <SuggestionItem
            key={contact.recordID ?? i}
            contact={contact}
            onPress={makeCall}
          />
        ))}
      </Animated.View>


      {/* ── Number display ── */}
      <View style={styles.displayContainer}>
        <View style={styles.sideAction} />

        <Animated.Text
          style={[styles.displayNumber, { transform: [{ scale: numScaleAnim }] }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {formatDisplay(number)}
          {number.length === 0 && <Text style={styles.placeholder}>Enter number</Text>}

        </Animated.Text>

        <View style={styles.sideAction}>
          {number.length > 0 && (
            <TouchableOpacity
              onPress={handleDelete}
              onLongPress={handleDeleteAll}
              delayLongPress={500}
              style={styles.deleteBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Icon name="backspace-outline" size={26} color="#F26D6D" />
            </TouchableOpacity>

          )}
        </View>
      </View>

      {/* ── Keypad — plain View grid, no FlatList ── */}
      <View style={styles.keypadWrapper}>
        {[0, 1, 2, 3].map(row => (
          <View key={row} style={styles.keyRow}>
            {KEYS.slice(row * 3, row * 3 + 3).map(item => (
              <DialKey
                key={item.num}
                item={item}
                onPress={() => handlePress(item.num)}
                onLongPress={() => handleLongPress(item.num)}
              />
            ))}
          </View>
        ))}
      </View>


      {/* ── Footer ── */}
      <View style={styles.footer}>
        {/* Spacer left — mirrors delete button to keep call centred */}
        <View style={styles.footerSide} />


        <TouchableOpacity
          style={[styles.callButton, number.length === 0 && styles.callButtonDim]}
          onPress={() => makeCall()}
          activeOpacity={0.85}
          disabled={number.length === 0}
        >
          <Icon name="call" size={28} color="#0F1724" />
        </TouchableOpacity>

        {/* Contacts shortcut — right side */}
        <TouchableOpacity
          style={styles.footerSide}
          onPress={() => navigation.navigate('Contacts')}
        >
          <Icon name="people-outline" size={26} color="#4A5568" />
        </TouchableOpacity>

      </View>

   


    </SafeAreaView>
  );
};

// ─── styles ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1724' },

  // suggestions — height driven by Animated.Value, NOT fixed
  suggestionsContainer: {
    overflow: 'hidden',
    paddingHorizontal: 16,
    gap: 4,
  },

  suggestionItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 12, height: 52,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  suggestAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(94,231,223,0.15)',
    borderWidth: 1, borderColor: 'rgba(94,231,223,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  suggestAvatarText:    { color: '#5EE7DF', fontWeight: '800', fontSize: 11 },
  suggestionTextWrapper:{ flex: 1, marginLeft: 10 },
  suggestionName:       { fontSize: 14, fontWeight: '600', color: '#F4F7FB' },
  suggestionNumber:     { fontSize: 11, color: '#8A95A8', marginTop: 1 },

  // display
  displayContainer: {
    height: 88, flexDirection: 'row',
    alignItems: 'center', paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  displayNumber: {
    fontSize: 42, fontWeight: '300', color: '#F4F7FB',
    flex: 1, textAlign: 'center', letterSpacing: 2,
  },
  placeholder: { fontSize: 18, color: '#2D3748', fontWeight: '400', letterSpacing: 0 },
  sideAction:  { width: 56, alignItems: 'center', justifyContent: 'center' },
  deleteBtn:   { padding: 8 },

  // keypad — row-based grid, no FlatList
  keypadWrapper: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', gap: 4 },
  keyRow:        { flexDirection: 'row', justifyContent: 'space-between', gap: 4 },
  keyOuter:      { flex: 1 },

  key: {
    aspectRatio: 1.3,
    justifyContent: 'center', alignItems: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  keyText:       { fontSize: 30, color: '#F4F7FB', fontWeight: '300' },
  subText:       { fontSize: 10, color: '#4A5568', marginTop: -2, letterSpacing: 1 },
  longPressHint: { color: '#5EE7DF', fontWeight: '700' },

  // footer
  footer: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40, paddingVertical: 16,
  },
  footerSide: { width: 48, alignItems: 'center', justifyContent: 'center' },
  callButton: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: '#5EE7DF',
    justifyContent: 'center', alignItems: 'center',
  },
  callButtonDim: { opacity: 0.35 },

});

export default DialerScreen;
