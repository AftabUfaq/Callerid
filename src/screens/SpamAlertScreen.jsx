import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Animated, Dimensions, Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const SPAM_CATEGORIES = {
  Telemarketing: { icon: 'megaphone', color: '#FF9500' },
  Scam:          { icon: 'warning',  color: '#FF3B30' },
  Robocall:      { icon: 'radio',    color: '#AF52DE' },
  Spoofed:       { icon: 'alert',    color: '#FF2D55' },
};

const SpamAlertScreen = ({ route, navigation }) => {
  const contact = route?.params?.contact ?? {
    name:         'Unknown',
    number:       '+92-300-987-6543',
    spamReports:  847,
    spamCategory: 'Telemarketing',
    initials:     '?',
    avatarColor:  '#FF3B30',
    location:     'Karachi, PK',
    carrier:      'Jazz',
  };

  const categoryCfg = SPAM_CATEGORIES[contact.spamCategory] ?? SPAM_CATEGORIES.Telemarketing;

  // Shake animation for warning icon
  const shakeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let stopped = false;
    const run = () => {
      if (stopped) return;
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 8,  duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6,  duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0,  duration: 60, useNativeDriver: true }),
        Animated.delay(2000),
      ]).start(run);
    };
    run();
    return () => { stopped = true; shakeAnim.stopAnimation(); };
  }, []);

  // Card entrance animation
  const cardAnim = useRef(new Animated.Value(30)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardAnim,    { toValue: 0, duration: 450, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleBlock = () => {
    Alert.alert(
      'Number Blocked',
      `${contact.number} has been added to your block list.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const handleReport = () => {
    Alert.alert(
      'Report Submitted',
      'Thanks for helping keep CallerID accurate!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const handleIgnore = () => {
    navigation.goBack();
  };

  // Severity fill: reports out of 2000
  const reportPercent = Math.min((contact.spamReports / 2000) * 100, 100);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A0000" />

      <SafeAreaView style={styles.inner}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Spam Alert</Text>
          <Text style={styles.headerSub}>We detected a potentially harmful caller</Text>
        </View>

        {/* Warning card */}
        <Animated.View
          style={[
            styles.warningCard,
            { opacity: cardOpacity, transform: [{ translateY: cardAnim }] },
          ]}
        >
          {/* Shake warning icon */}
          <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
            <View style={styles.warningIconWrap}>
              <Icon name="shield-alert" size={40} color="#FF3B30" />
            </View>
          </Animated.View>

          <Text style={styles.alertTitle}>⚠ Spam Caller Detected</Text>
          <Text style={styles.alertSub}>
            This number has been flagged by our community and AI detection system.
          </Text>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Caller</Text>
            <Text style={styles.infoValue}>{contact.name}  ({contact.number})</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>{contact.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Carrier</Text>
            <Text style={styles.infoValue}>{contact.carrier}</Text>
          </View>

          <View style={styles.categoryBadge}>
            <Icon name={categoryCfg.icon} size={14} color={categoryCfg.color} />
            <Text style={[styles.categoryText, { color: categoryCfg.color }]}>
              {contact.spamCategory}
            </Text>
          </View>

          <View style={styles.reportsRow}>
            <View style={styles.reportsBar}>
              <View style={[styles.reportsFill, { width: `${reportPercent}%` }]} />
            </View>
            <Text style={styles.reportsText}>
              {contact.spamReports.toLocaleString()} community reports
            </Text>
          </View>
        </Animated.View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.blockBtn} onPress={handleBlock} activeOpacity={0.8}>
            <Icon name="ban" size={22} color="#FFF" />
            <Text style={styles.blockBtnText}>Block Number</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.reportBtn} onPress={handleReport} activeOpacity={0.8}>
            <Icon name="flag" size={20} color="#FF9500" />
            <Text style={styles.reportBtnText}>Report as Spam</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ignoreBtn} onPress={handleIgnore} activeOpacity={0.8}>
            <Text style={styles.ignoreText}>Ignore</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0000' },

  inner: { flex: 1, paddingHorizontal: 20 },

  header: { alignItems: 'center', paddingVertical: 28 },
  headerTitle: { fontSize: 14, fontWeight: '700', color: '#FF3B30', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 },
  headerSub:  { fontSize: 13, color: '#8A95A8', textAlign: 'center' },

  warningCard: {
    backgroundColor: 'rgba(255,59,48,0.07)',
    borderWidth: 1, borderColor: 'rgba(255,59,48,0.25)',
    borderRadius: 22, padding: 24,
  },

  warningIconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,59,48,0.12)',
    borderWidth: 2, borderColor: 'rgba(255,59,48,0.3)',
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center', marginBottom: 16,
  },

  alertTitle: { fontSize: 20, fontWeight: '800', color: '#FF3B30', textAlign: 'center', marginBottom: 8 },
  alertSub:  { fontSize: 13, color: '#8A95A8', textAlign: 'center', lineHeight: 20, marginBottom: 16 },

  divider: { height: 1, backgroundColor: 'rgba(255,59,48,0.15)', marginBottom: 16 },

  infoRow:       { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  infoLabel:     { fontSize: 13, color: '#4A5568' },
  infoValue:     { fontSize: 13, color: '#94A3B8', fontWeight: '500', flex: 1, textAlign: 'right', marginLeft: 8 },

  categoryBadge: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginTop: 14, marginBottom: 16,
    backgroundColor: 'rgba(255,59,48,0.1)',
    borderWidth: 1, borderColor: 'rgba(255,59,48,0.2)',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
    alignSelf: 'center',
  },
  categoryText: { fontSize: 12, fontWeight: '700' },

  reportsRow: { alignItems: 'center', gap: 10 },
  reportsBar: {
    width: '100%', height: 6, borderRadius: 3,
    backgroundColor: 'rgba(255,59,48,0.15)', overflow: 'hidden',
  },
  reportsFill: { height: '100%', backgroundColor: '#FF3B30', borderRadius: 3 },
  reportsText: { fontSize: 11, color: '#4A5568', fontWeight: '500' },

  actions: { flex: 1, justifyContent: 'flex-end', paddingBottom: 36, gap: 12 },

  blockBtn: {
    backgroundColor: '#FF3B30', borderRadius: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 58, gap: 10,
    shadowColor: '#FF3B30', shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
  },
  blockBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },

  reportBtn: {
    backgroundColor: 'rgba(255,149,0,0.1)', borderRadius: 18,
    borderWidth: 1, borderColor: 'rgba(255,149,0,0.3)',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 54, gap: 8,
  },
  reportBtnText: { color: '#FF9500', fontSize: 15, fontWeight: '700' },

  ignoreBtn: { alignItems: 'center', paddingVertical: 12 },
  ignoreText: { color: '#4A5568', fontSize: 14, fontWeight: '600' },
});

export default SpamAlertScreen;
