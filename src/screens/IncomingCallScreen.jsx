import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Animated, Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// ─── trust config (mirrors existing TRUST_CONFIG) ────────────────
const TRUST_CFG = {
  safe:    { color: '#34C759', bg: 'rgba(52,199,89,0.15)',  border: 'rgba(52,199,89,0.4)',  label: 'Verified Safe'  },
  spam:    { color: '#FF3B30', bg: 'rgba(255,59,48,0.15)',  border: 'rgba(255,59,48,0.4)',  label: 'Spam Likely'     },
  unknown: { color: '#8E8E93', bg: 'rgba(142,142,147,0.15)',border: 'rgba(142,142,147,0.4)',label: 'Unknown Caller'  },
};

// ─── IncomingCallScreen ──────────────────────────────────────────
const IncomingCallScreen = ({ route, navigation }) => {
  const contact = route?.params?.contact ?? {
    name:        'Sara Khan',
    number:      '+92-333-000-0003',
    trust:       'safe',
    initials:    'SK',
    avatarColor: '#007AFF',
    location:    'Lahore, PK',
    carrier:     'Telenor',
    spamReports: 0,
  };

  const trust = TRUST_CFG[contact.trust] ?? TRUST_CFG.unknown;

  // Pulse ring animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.25, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,     duration: 1000, useNativeDriver: true }),
      ])
    ).start();
    return () => pulseAnim.stop();
  }, [pulseAnim]);

  // Entrance animation
  const entranceAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(entranceAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const handleAccept = () => {
    Animated.sequence([
      Animated.timing(new Animated.Value(1), { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.timing(new Animated.Value(1), { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start();
    navigation?.replace('activecall', { contact });
  };

  const handleDecline = () => {
    navigation?.goBack();
  };

  return (
    <Animated.View style={[styles.container, { opacity: entranceAnim }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0F1E" />

      {/* Top bar */}
      <SafeAreaView edges={['top']} style={styles.topBar}>
        <TouchableOpacity style={styles.topBtn} onPress={handleDecline}>
          <Icon name="close" size={22} color="#8A95A8" />
        </TouchableOpacity>
        <View style={styles.callTypeBadge}>
          <Icon name="call-outline" size={14} color="#5EE7DF" />
          <Text style={styles.callTypeText}>  Incoming</Text>
        </View>
        <View style={styles.topBtn} />
      </SafeAreaView>

      {/* Caller info */}
      <View style={styles.callerSection}>
        {/* Pulsing avatar ring */}
        <Animated.View
          style={[
            styles.pulseRing,
            { borderColor: contact.avatarColor, transform: [{ scale: pulseAnim }] },
          ]}
        />
        <Animated.View
          style={[
            styles.pulseRing,
            styles.pulseRingInner,
            { borderColor: contact.avatarColor, transform: [{ scale: pulseAnim }] },
          ]}
        />

        <View style={[
          styles.avatar,
          { backgroundColor: contact.avatarColor + '28', borderColor: contact.avatarColor + '80' },
        ]}>
          <Text style={[styles.avatarText, { color: contact.avatarColor }]}>
            {contact.initials}
          </Text>
        </View>

        <Text style={styles.callerName}>{contact.name}</Text>
        <Text style={styles.callerNumber}>{contact.number}</Text>
        <Text style={styles.callerMeta}>{contact.location}  ·  {contact.carrier}</Text>

        <View style={[styles.trustBadge, { backgroundColor: trust.bg, borderColor: trust.border }]}>
          <Text style={[styles.trustLabel, { color: trust.color }]}>{trust.label}</Text>
        </View>

        {contact.trust === 'spam' && contact.spamReports > 0 && (
          <Text style={styles.spamReports}>
            ⚠ Reported {contact.spamReports.toLocaleString()} times
          </Text>
        )}
      </View>

      {/* Action buttons */}
      <SafeAreaView edges={['bottom']} style={styles.actions}>
        <TouchableOpacity style={styles.declineBtn} onPress={handleDecline} activeOpacity={0.8}>
          <View style={styles.declineIconWrap}>
            <Icon name="close" size={28} color="#FFF" />
          </View>
          <Text style={styles.actionLabel}>Decline</Text>
        </TouchableOpacity>

        <Animated.View style={{ transform: [{ scale: acceptScale }] }}>
          <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept} activeOpacity={1}>
            <View style={[styles.acceptIconWrap, { backgroundColor: '#34C759' }]}>
              <Icon name="call" size={28} color="#FFF" />
            </View>
            <Text style={styles.actionLabel}>Accept</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1E' },

  topBar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  topBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  callTypeBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(94,231,223,0.08)',
    borderWidth: 1, borderColor: 'rgba(94,231,223,0.2)',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
  },
  callTypeText: { color: '#5EE7DF', fontSize: 12, fontWeight: '700' },

  callerSection: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },

  pulseRing: {
    position: 'absolute',
    width: 200, height: 200, borderRadius: 100,
    borderWidth: 1.5, borderColor: 'rgba(0,122,255,0.2)',
  },
  pulseRingInner: {
    width: 170, height: 170, borderRadius: 85,
    borderColor: 'rgba(0,122,255,0.12)', opacity: 0.6,
  },

  avatar: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 2.5, alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  avatarText: { fontSize: 34, fontWeight: '800' },
  callerName:  { fontSize: 30, fontWeight: '800', color: '#F1F5F9', marginBottom: 6 },
  callerNumber: { fontSize: 16, color: '#8A95A8', letterSpacing: 0.5, marginBottom: 4 },
  callerMeta:  { fontSize: 13, color: '#4A5568', marginBottom: 16 },

  trustBadge: {
    borderWidth: 1, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 7,
  },
  trustLabel: { fontSize: 13, fontWeight: '700' },
  spamReports: { marginTop: 10, fontSize: 12, color: '#FF3B30', fontWeight: '600' },

  actions: {
    flexDirection: 'row', justifyContent: 'space-around',
    paddingVertical: 32, paddingHorizontal: 40,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)',
  },
  declineBtn: { alignItems: 'center', gap: 10 },
  acceptBtn:  { alignItems: 'center', gap: 10 },
  declineIconWrap: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#FF3B30', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#FF3B30', shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  acceptIconWrap: {
    width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#34C759', shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  actionLabel: { fontSize: 12, color: '#8A95A8', fontWeight: '600' },
});

export default IncomingCallScreen;
