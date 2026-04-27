import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Animated, Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const TRUST_CFG = {
  safe:    { color: '#34C759', bg: 'rgba(52,199,89,0.15)',  border: 'rgba(52,199,89,0.4)',  label: 'Verified Safe'  },
  spam:    { color: '#FF3B30', bg: 'rgba(255,59,48,0.15)',  border: 'rgba(255,59,48,0.4)',  label: 'Spam Likely'     },
  unknown: { color: '#8E8E93', bg: 'rgba(142,142,147,0.15)',border: 'rgba(142,142,147,0.4)',label: 'Unknown Caller'  },
};

// ─── Animated waveform bars ──────────────────────────────────────
const Waveform = ({ isActive }) => {
  const heights = [0.4, 0.7, 1.0, 0.6, 0.9, 0.5, 0.8, 0.3];
  return (
    <View style={styles.waveform}>
      {heights.map((h, i) => (
        <AnimatedBar key={i} targetHeight={h} isActive={isActive} delay={i * 80} />
      ))}
    </View>
  );
};

const AnimatedBar = ({ targetHeight, isActive, delay }) => {
  const heightAnim = useRef(new Animated.Value(0.2)).current;
  useEffect(() => {
    if (!isActive) { heightAnim.setValue(0.2); return; }
    let stopped = false;
    const animate = () => {
      if (stopped) return;
      Animated.sequence([
        Animated.timing(heightAnim, { toValue: targetHeight, duration: 300 + delay, useNativeDriver: false }),
        Animated.timing(heightAnim, { toValue: 0.2,           duration: 300 + delay, useNativeDriver: false }),
      ]).start(animate);
    };
    const t = setTimeout(animate, delay);
    return () => { stopped = true; clearTimeout(t); };
  }, [isActive, targetHeight, delay]);

  return (
    <Animated.View
      style={[
        styles.waveBar,
        {
          height: heightAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
        },
      ]}
    />
  );
};

// ─── ActionToggle ────────────────────────────────────────────────
const ActionToggle = ({ icon, label, isActive, color = '#5EE7DF', onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.88, duration: 60, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1,    duration: 60, useNativeDriver: true }),
    ]).start();
    onPress?.();
  };
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity style={styles.toggleBtn} onPress={handlePress} activeOpacity={1}>
        <View style={[
          styles.toggleIcon,
          isActive && { backgroundColor: color + '22', borderColor: color + '55' },
        ]}>
          <Icon name={icon} size={24} color={isActive ? color : '#8A95A8'} />
        </View>
        <Text style={[styles.toggleLabel, isActive && { color }]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── DialpadOverlay ──────────────────────────────────────────────
const KEYS = [['1','2','3'], ['4','5','6'], ['7','8','9'], ['*','0','#']];

const DialpadOverlay = ({ onClose }) => {
  const [value, setValue] = useState('');
  const handleKey = (k) => setValue(v => v + k);
  const handleDel = () => setValue(v => v.slice(0, -1));

  return (
    <View style={styles.dialpadOverlay}>
      <View style={styles.dialpadHeader}>
        <Text style={styles.dialpadNumber}>{value || '—'}</Text>
        <TouchableOpacity onPress={onClose} style={styles.dialpadCloseBtn}>
          <Icon name="close-circle" size={24} color="#8A95A8" />
        </TouchableOpacity>
      </View>
      {KEYS.map((row, ri) => (
        <View key={ri} style={styles.dialpadRow}>
          {row.map(k => (
            <TouchableOpacity key={k} style={styles.dialpadKey} onPress={() => handleKey(k)}>
              <Text style={styles.dialpadKeyText}>{k}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <TouchableOpacity style={styles.dialpadDel} onPress={handleDel}>
        <Icon name="backspace-outline" size={20} color="#8A95A8" />
      </TouchableOpacity>
    </View>
  );
};

// ─── ActiveCallScreen ────────────────────────────────────────────
const ActiveCallScreen = ({ route, navigation }) => {
  const contact = route?.params?.contact ?? {
    name:        'Sara Khan',
    number:      '+92-333-000-0003',
    trust:       'safe',
    initials:    'SK',
    avatarColor: '#007AFF',
  };
  const trust = TRUST_CFG[contact.trust] ?? TRUST_CFG.unknown;

  const [isMuted,    setIsMuted]    = useState(false);
  const [isSpeaker,  setIsSpeaker]  = useState(false);
  const [isDialpad,  setIsDialpad]  = useState(false);
  const [callStart]  = useState(Date.now());
  const [elapsed,    setElapsed]    = useState(0);

  // Live timer — cleaned up on unmount
  useEffect(() => {
    const tick = setInterval(() => setElapsed(Date.now() - callStart), 1000);
    return () => clearInterval(tick);
  }, [callStart]);

  const fmtTime = (ms) => {
    const s  = Math.floor(ms / 1000);
    const m  = Math.floor(s / 60);
    const h  = Math.floor(m / 60);
    const ss = String(s % 60).padStart(2, '0');
    const mm = String(m % 60).padStart(2, '0');
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
  };

  const handleEndCall = useCallback(() => {
    navigation.replace('MainTabs');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0F1E" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={[styles.trustBadge, { backgroundColor: trust.bg, borderColor: trust.border }]}>
          <Text style={[styles.trustLabel, { color: trust.color }]}>{trust.label}</Text>
        </View>
      </View>

      {/* Caller info */}
      <View style={styles.callerSection}>
        <View style={[
          styles.avatar,
          { backgroundColor: contact.avatarColor + '28', borderColor: contact.avatarColor + '60' },
        ]}>
          <Text style={[styles.avatarText, { color: contact.avatarColor }]}>
            {contact.initials}
          </Text>
        </View>
        <Text style={styles.callerName}>{contact.name}</Text>
        <Text style={styles.callerNumber}>{contact.number}</Text>
        <Text style={styles.timer}>{fmtTime(elapsed)}</Text>
        <Text style={styles.statusLabel}>
          {isMuted ? '🔇 Muted' : '🔊 Call in progress'}
        </Text>
      </View>

      {/* Waveform */}
      <View style={styles.waveformSection}>
        <Waveform isActive={!isMuted} />
      </View>

      {/* Action row */}
      <View style={styles.actionRow}>
        <ActionToggle
          icon={isMuted ? 'mic-off' : 'mic'}
          label={isMuted ? 'Unmute' : 'Mute'}
          isActive={isMuted}
          color="#FF9500"
          onPress={() => setIsMuted(v => !v)}
        />
        <ActionToggle
          icon={isSpeaker ? 'volume-high' : 'volume-medium'}
          label="Speaker"
          isActive={isSpeaker}
          onPress={() => setIsSpeaker(v => !v)}
        />
        <ActionToggle
          icon={isDialpad ? 'keypad' : 'keypad-outline'}
          label="Dialpad"
          isActive={isDialpad}
          onPress={() => setIsDialpad(v => !v)}
        />
      </View>

      {/* Dialpad overlay */}
      {isDialpad && <DialpadOverlay onClose={() => setIsDialpad(false)} />}

      {/* End call */}
      <View style={styles.endCallSection}>
        <TouchableOpacity style={styles.endCallBtn} onPress={handleEndCall} activeOpacity={0.8}>
          <Icon name="close" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.endCallLabel}>End Call</Text>
      </View>
    </SafeAreaView>
  );
};

// ─── styles ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1E' },

  topBar: { alignItems: 'center', paddingVertical: 16 },
  trustBadge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 },
  trustLabel: { fontSize: 12, fontWeight: '700' },

  callerSection: { alignItems: 'center', paddingTop: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarText: { fontSize: 28, fontWeight: '800' },
  callerName:  { fontSize: 26, fontWeight: '800', color: '#F1F5F9', marginBottom: 4 },
  callerNumber: { fontSize: 14, color: '#8A95A8', marginBottom: 8 },
  timer: { fontSize: 38, fontWeight: '300', color: '#5EE7DF', letterSpacing: 2, marginBottom: 4 },
  statusLabel: { fontSize: 13, color: '#4A5568', fontWeight: '500', marginTop: 4 },

  waveformSection: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  waveform: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 60 },
  waveBar: { width: 4, backgroundColor: '#5EE7DF', borderRadius: 2, opacity: 0.7 },

  actionRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    paddingHorizontal: 24, paddingVertical: 20,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  toggleBtn: { alignItems: 'center', gap: 8 },
  toggleIcon: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  toggleLabel: { fontSize: 11, color: '#8A95A8', fontWeight: '600' },

  endCallSection: { alignItems: 'center', paddingVertical: 28, gap: 10 },
  endCallBtn: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: '#FF3B30', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#FF3B30', shadowOpacity: 0.5, shadowRadius: 16, elevation: 10,
  },
  endCallLabel: { fontSize: 12, color: '#8A95A8', fontWeight: '600' },

  // dialpad overlay
  dialpadOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#12121A', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 36,
    borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  dialpadHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  dialpadNumber: { fontSize: 22, fontWeight: '300', color: '#F1F5F9', flex: 1, letterSpacing: 2, textAlign: 'center' },
  dialpadCloseBtn: { padding: 4 },
  dialpadRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  dialpadKey: { width: 72, height: 54, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  dialpadKeyText: { fontSize: 22, fontWeight: '400', color: '#F1F5F9' },
  dialpadDel: { alignItems: 'center', marginTop: 10, padding: 8 },
});

export default ActiveCallScreen;
