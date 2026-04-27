
import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Animated, Linking, Alert, Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── mock call history for this contact ─────────────────────────
const CALL_HISTORY = [
  { id: 'h1', type: 'incoming', date: 'Today',     time: '1:30 PM',  duration: '4m 32s' },
  { id: 'h2', type: 'missed',   date: 'Yesterday', time: '9:14 AM',  duration: '—'      },
  { id: 'h3', type: 'outgoing', date: 'Mon',       time: '3:05 PM',  duration: '2m 15s' },
  { id: 'h4', type: 'incoming', date: 'Sun',       time: '11:20 AM', duration: '8m 01s' },
  { id: 'h5', type: 'missed',   date: 'Fri',       time: '6:45 PM',  duration: '—'      },
];

// ─── config maps ────────────────────────────────────────────────
const TRUST_CFG = {
  safe:    { color: '#34C759', bg: 'rgba(52,199,89,0.12)',   border: 'rgba(52,199,89,0.3)',   label: 'Verified Safe',    icon: '✓' },
  spam:    { color: '#FF3B30', bg: 'rgba(255,59,48,0.12)',  border: 'rgba(255,59,48,0.3)',  label: 'Spam Likely',      icon: '⚠' },
  unknown: { color: '#8E8E93', bg: 'rgba(142,142,147,0.12)',border: 'rgba(142,142,147,0.3)',label: 'Unknown Caller',   icon: '?' },
  blocked: { color: '#FF3B30', bg: 'rgba(255,59,48,0.1)',   border: 'rgba(255,59,48,0.25)', label: 'Blocked',           icon: '✕' },
};

const HISTORY_CFG = {
  incoming: { color: '#34C759', icon: '↙', label: 'Incoming' },
  outgoing: { color: '#007AFF', icon: '↗', label: 'Outgoing' },
  missed:   { color: '#FF3B30', icon: '↙', label: 'Missed'   },
};

// ─── ActionButton ────────────────────────────────────────────────
const ActionButton = ({ icon, label, color, onPress, disabled }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start();
    onPress?.();
  };

  return (
    <Animated.View style={[styles.actionWrap, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[
          styles.actionBtn,
          { backgroundColor: color + '1A', borderColor: color + '50' },
          disabled && styles.actionBtnDisabled,
        ]}
        onPress={handlePress}
        activeOpacity={1}
        disabled={disabled}
      >
        <Text style={[styles.actionIcon, { color: disabled ? '#2D3748' : color }]}>
          {icon}
        </Text>
      </TouchableOpacity>
      <Text style={[styles.actionLabel, disabled && { color: '#2D3748' }]}>{label}</Text>
    </Animated.View>
  );
};

// ─── InfoRow ─────────────────────────────────────────────────────
const InfoRow = ({ label, value, accent }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={[styles.infoValue, accent && { color: accent }]}>{value}</Text>
  </View>
);

// ─── HistoryItem ─────────────────────────────────────────────────
const HistoryItem = ({ item, onCallBack }) => {
  const cfg = HISTORY_CFG[item.type];
  return (
    <View style={styles.histItem}>
      {/* Colored type dot */}
      <View style={[styles.histDot, { backgroundColor: cfg.color }]} />

      <View style={styles.histBody}>
        <Text style={[styles.histType, { color: cfg.color }]}>
          {cfg.icon} {cfg.label}
        </Text>
        <Text style={styles.histTime}>{item.date} · {item.time}</Text>
      </View>
      <View style={styles.histRight}>
        <Text style={styles.histDur}>{item.duration}</Text>
        {/* Callback button on each row */}
        <TouchableOpacity style={styles.callBackBtn} onPress={onCallBack}>
          <Text style={styles.callBackText}>↩ Call</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

// ─── BlockModal ──────────────────────────────────────────────────
const showBlockConfirm = (name, onConfirm) => {
  Alert.alert(
    'Block Contact',
    `Block calls and messages from ${name}? You can unblock anytime in Settings.`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Block',  style: 'destructive', onPress: onConfirm },
    ]
  );
};

// ─── main screen ────────────────────────────────────────────────
const ContactDetailScreen = ({ route, navigation }) => {
  {/* Accept contact from HomeScreen nav param */}
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


  const [isBlocked, setIsBlocked] = useState(false);
  const trust = TRUST_CFG[isBlocked ? 'blocked' : contact.trust];

  // Entrance animations
  const heroAnim   = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(30)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const avatarScale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(avatarScale, { toValue: 1, friction: 5, tension: 50, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(200),
        Animated.parallel([
          Animated.timing(contentAnim,    { toValue: 0, duration: 380, useNativeDriver: true }),
          Animated.timing(contentOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, [heroAnim, avatarScale, contentAnim, contentOpacity]);

  // Action handlers
  const handleCall = useCallback(() => {
    Linking.openURL(`tel:${contact.number.replace(/[^+\d]/g, '')}`);
  }, [contact.number]);

  const handleSMS = useCallback(() => {
    Linking.openURL(`sms:${contact.number.replace(/[^+\d]/g, '')}`);
  }, [contact.number]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `${contact.name} — ${contact.number}`,
        title:   contact.name,
      });
    } catch { /* cancelled */ }
  }, [contact.name, contact.number]);


  const handleBlock = useCallback(() => {
    if (isBlocked) {
      setIsBlocked(false);
    } else {
      showBlockConfirm(contact.name, () => setIsBlocked(true));
    }
  }, [isBlocked, contact.name]);

  const handleReport = useCallback(() => {
    Alert.alert('Report Spam', 'Thanks! This number will be reviewed.');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0F1E" />

      {/* ── Back bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backIcon}>‹</Text>
          <Text style={styles.backText}>Call Log</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Text style={styles.shareBtnText}>⬆</Text>
        </TouchableOpacity>
      </View>


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* ── Hero section ── */}
        <Animated.View style={[styles.hero, { opacity: heroAnim }]}>
          {/* Avatar with animated scale-in */}
          <Animated.View
            style={[
              styles.avatarWrap,
              {
                borderColor:      contact.avatarColor + '60',
                backgroundColor:  contact.avatarColor + '20',
                transform: [{ scale: avatarScale }],
              },
            ]}
          >
            <Text style={[styles.avatarText, { color: contact.avatarColor }]}>
              {contact.initials}
            </Text>
          </Animated.View>


          <Text style={styles.heroName}>{contact.name}</Text>
          <Text style={styles.heroNumber}>{contact.number}</Text>

          {/* Trust badge */}
          <View style={[styles.trustBadge, { backgroundColor: trust.bg, borderColor: trust.border }]}>
            <Text style={[styles.trustIcon, { color: trust.color }]}>{trust.icon}</Text>
            <Text style={[styles.trustLabel, { color: trust.color }]}>{trust.label}</Text>
          </View>

        </Animated.View>

        {/* ── Animated body ── */}
        <Animated.View
          style={{
            opacity: contentOpacity,
            transform: [{ translateY: contentAnim }],
          }}
        >

          {/* ── Quick actions ── */}
          <View style={styles.actionsRow}>
            <ActionButton icon="📞" label="Call"    color="#34C759" onPress={handleCall}   disabled={isBlocked} />
            <ActionButton icon="💬" label="SMS"     color="#007AFF" onPress={handleSMS}    disabled={isBlocked} />
            <ActionButton icon="🚩" label="Report"  color="#FF9500" onPress={handleReport}              />
            <ActionButton
              icon={isBlocked ? "🔓" : "🚫"}
              label={isBlocked ? "Unblock" : "Block"}
              color="#FF3B30"
              onPress={handleBlock}
            />

          </View>

          {/* ── Spam warning card (only for spam contacts) ── */}
          {contact.trust === 'spam' && !isBlocked && (
            <View style={styles.spamWarningCard}>
              <Text style={styles.spamWarningTitle}>⚠ Spam Warning</Text>
              <Text style={styles.spamWarningText}>
                Reported {contact.spamReports ?? 0} times by the community.
                This number has been flagged as {contact.spamCategory ?? 'spam'}.
              </Text>
              <TouchableOpacity style={styles.blockNowBtn} onPress={handleBlock}>
                <Text style={styles.blockNowText}>Block This Number</Text>
              </TouchableOpacity>
            </View>
          )}


          {/* ── Contact info ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Info</Text>
            <View style={styles.infoCard}>
              <InfoRow label="Mobile"   value={contact.number}   accent="#007AFF" />
              <InfoRow label="Location" value={contact.location}  />
              <InfoRow label="Carrier"  value={contact.carrier}   />
              <InfoRow
                label="Trust Score"
                value={trust.label}
                accent={trust.color}
              />

            </View>
          </View>

          {/* ── Call history ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Call History</Text>
              <Text style={styles.histCount}>{CALL_HISTORY.length} calls</Text>

            </View>
            <View style={styles.histCard}>
              {CALL_HISTORY.map((item, idx) => (
                <View key={item.id}>
                  <HistoryItem item={item} onCallBack={handleCall} />
                  {idx < CALL_HISTORY.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>

          {/* ── Danger zone ── */}
          <View style={[styles.section, { marginBottom: 32 }]}>
            <Text style={styles.sectionTitle}>Danger Zone</Text>
            <View style={styles.dangerCard}>
              <TouchableOpacity
                style={styles.dangerRow}
                onPress={handleBlock}
                activeOpacity={0.7}
              >
                <Text style={styles.dangerText}>
                  {isBlocked ? '🔓 Unblock Number' : '🚫 Block Number'}
                </Text>
                <Text style={styles.dangerArrow}>›</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.dangerRow}
                onPress={handleReport}
                activeOpacity={0.7}
              >
                <Text style={styles.dangerText}>🚩 Report as Spam</Text>
                <Text style={styles.dangerArrow}>›</Text>
              </TouchableOpacity>
            </View>
          </View>


        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#0A0F1E' },
  scrollContent:    { paddingBottom: 24 },

  // top bar
  topBar:           {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
  },
  backBtn:          { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backIcon:         { fontSize: 26, color: '#007AFF', lineHeight: 28 },
  backText:         { fontSize: 16, color: '#007AFF', fontWeight: '500' },
  shareBtn:         {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  shareBtnText:     { fontSize: 14, color: '#94A3B8' },

  // hero
  hero:             { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 24 },
  avatarWrap:       {
    width: 88, height: 88, borderRadius: 44,
    borderWidth: 2.5,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText:       { fontSize: 28, fontWeight: '800' },
  heroName:         { fontSize: 24, fontWeight: '800', color: '#F1F5F9', marginBottom: 4 },
  heroNumber:       { fontSize: 14, color: '#4A5568', marginBottom: 14, letterSpacing: 0.5 },
  trustBadge:       {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  trustIcon:        { fontSize: 13, fontWeight: '700' },
  trustLabel:       { fontSize: 13, fontWeight: '700', letterSpacing: 0.3 },


  // actions row
  actionsRow:       {
    flexDirection: 'row', justifyContent: 'space-evenly',
    marginHorizontal: 16, marginBottom: 20,
  },
  actionWrap:       { alignItems: 'center', gap: 8 },
  actionBtn:        {
    width: 58, height: 58, borderRadius: 29,
    borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  actionBtnDisabled:{ opacity: 0.3 },
  actionIcon:       { fontSize: 22 },
  actionLabel:      { fontSize: 11, color: '#94A3B8', fontWeight: '500' },

  // spam warning
  spamWarningCard:  {
    marginHorizontal: 16, marginBottom: 16,
    backgroundColor: 'rgba(255,59,48,0.07)',
    borderWidth: 1, borderColor: 'rgba(255,59,48,0.25)',
    borderRadius: 14, padding: 14,
  },
  spamWarningTitle: { fontSize: 13, fontWeight: '700', color: '#FF3B30', marginBottom: 4 },
  spamWarningText:  { fontSize: 12, color: '#94A3B8', lineHeight: 18, marginBottom: 10 },
  blockNowBtn:      {
    backgroundColor: 'rgba(255,59,48,0.15)',
    borderWidth: 1, borderColor: 'rgba(255,59,48,0.3)',
    borderRadius: 10, paddingVertical: 8, alignItems: 'center',
  },
  blockNowText:     { fontSize: 13, fontWeight: '700', color: '#FF3B30' },


  // sections
  section:          { marginHorizontal: 16, marginBottom: 16 },
  sectionHeader:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  sectionTitle:     { fontSize: 11, fontWeight: '700', color: '#4A5568', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 },
  histCount:        { fontSize: 11, color: '#007AFF', fontWeight: '600' },

  // info card
  infoCard:         {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: 14,
  },
  infoRow:          {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  infoLabel:        { fontSize: 13, color: '#4A5568' },
  infoValue:        { fontSize: 13, color: '#94A3B8', fontWeight: '500' },

  // history
  histCard:         {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: 14,
  },
  histItem:         { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, gap: 10 },
  histDot:          { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  histBody:         { flex: 1, gap: 2 },
  histType:         { fontSize: 13, fontWeight: '600' },
  histTime:         { fontSize: 11, color: '#4A5568' },
  histRight:        { alignItems: 'flex-end', gap: 4 },
  histDur:          { fontSize: 11, color: '#4A5568' },
  callBackBtn:      {
    backgroundColor: 'rgba(0,122,255,0.12)',
    borderWidth: 1, borderColor: 'rgba(0,122,255,0.25)',
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  callBackText:     { fontSize: 10, color: '#007AFF', fontWeight: '600' },

  // danger zone
  dangerCard:       {
    backgroundColor: 'rgba(255,59,48,0.04)',
    borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,59,48,0.15)',
    paddingHorizontal: 14,
  },
  dangerRow:        {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 13,
  },
  dangerText:       { fontSize: 14, color: '#FF3B30', fontWeight: '600' },
  dangerArrow:      { fontSize: 20, color: 'rgba(255,59,48,0.4)' },


  divider:          { height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
});

export default ContactDetailScreen;
