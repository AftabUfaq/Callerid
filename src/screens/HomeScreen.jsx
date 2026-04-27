import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, Animated, TextInput, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// ─── types ──────────────────────────────────────────────────────
// type CallType = 'incoming' | 'outgoing' | 'missed'
// type TrustLevel = 'safe' | 'spam' | 'unknown' | 'blocked'

// ─── mock data ──────────────────────────────────────────────────
const MOCK_CALLS = [
  {
    id: '1', name: 'Sara Khan', number: '+92-333-000-0003',
    type: 'incoming', trust: 'safe', time: '2 min ago',
    duration: '4m 32s', initials: 'SK', avatarColor: '#007AFF',
    location: 'Lahore, PK', carrier: 'Telenor',
  },
  {
    id: '2', name: 'Unknown', number: '+92-300-987-6543',
    type: 'missed', trust: 'spam', time: '14 min ago',
    duration: '—', initials: '?', avatarColor: '#FF3B30',
    spamReports: 847, spamCategory: 'Telemarketing',
    location: 'Karachi, PK', carrier: 'Jazz',
  },
  {
    id: '3', name: 'Ahmed Ali', number: '+92-301-000-0001',
    type: 'outgoing', trust: 'safe', time: '1h ago',
    duration: '1m 10s', initials: 'AA', avatarColor: '#34C759',
    location: 'Islamabad, PK', carrier: 'Zong',
  },
  {
    id: '4', name: 'Unknown', number: '+44-20-7946-0000',
    type: 'missed', trust: 'unknown', time: '3h ago',
    duration: '—', initials: '?', avatarColor: '#8E8E93',
    location: 'London, UK', carrier: 'Unknown',
  },
  {
    id: '5', name: 'Raza Mir', number: '+92-312-000-0004',
    type: 'incoming', trust: 'safe', time: '5h ago',
    duration: '2m 48s', initials: 'RM', avatarColor: '#AF52DE',
    location: 'Rawalpindi, PK', carrier: 'Ufone',
  },
  {
    id: '6', name: 'Unknown', number: '+92-21-3456-7890',
    type: 'missed', trust: 'spam', time: 'Yesterday',
    duration: '—', initials: '!', avatarColor: '#FF3B30',
    spamReports: 312, spamCategory: 'Scam',
    location: 'Karachi, PK', carrier: 'Jazz',
  },
];

// ─── trust config ───────────────────────────────────────────────
const TRUST_CONFIG = {
  safe:    { bg: 'rgba(52,199,89,0.15)',  border: 'rgba(52,199,89,0.35)',  text: '#34C759', label: 'SAFE'    },
  spam:    { bg: 'rgba(255,59,48,0.15)',  border: 'rgba(255,59,48,0.35)',  text: '#FF3B30', label: 'SPAM'    },
  unknown: { bg: 'rgba(142,142,147,0.15)',border: 'rgba(142,142,147,0.3)', text: '#8E8E93', label: 'UNKNOWN' },
  blocked: { bg: 'rgba(255,59,48,0.1)',   border: 'rgba(255,59,48,0.25)',  text: '#FF3B30', label: 'BLOCKED' },
};

const CALL_ICONS = {
  incoming: '↙',
  outgoing: '↗',
  missed:   '↙',
};

// ─── CallCard ────────────────────────────────────────────────────
const CallCard = ({ item, onPress, index }) => {
  const slideAnim = useRef(new Animated.Value(40)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const trust     = TRUST_CONFIG[item.trust];
  const isMissed  = item.type === 'missed';
  const isSpam    = item.trust === 'spam';

  useEffect(() => {
    // Staggered entrance per card
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0, duration: 350,
        delay: index * 60, useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 350,
        delay: index * 60, useNativeDriver: true,
      }),
    ]).start();

  }, [index, slideAnim, fadeAnim]);

  return (
    <Animated.View
      style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
    >
      <TouchableOpacity
        style={[
          styles.card,
          isSpam && styles.cardSpam, // red left-border accent for spam

        ]}
        onPress={() => onPress(item)}
        activeOpacity={0.7}
      >
        {/* Avatar */}
        <View style={[styles.avatar, {
          backgroundColor: item.avatarColor + '28',
          borderColor:     item.avatarColor + '60',
        }]}>
          <Text style={[styles.avatarText, { color: item.avatarColor }]}>
            {item.initials}
          </Text>
        </View>

        {/* Main info */}
        <View style={styles.cardBody}>
          <View style={styles.cardRow}>
            <Text
              style={[styles.cardName, isMissed && isSpam && styles.cardNameSpam]}
              numberOfLines={1}
            >
              {item.name === 'Unknown' ? item.number : item.name}
            </Text>
            <View style={[styles.trustBadge, {
              backgroundColor: trust.bg, borderColor: trust.border,
            }]}>
              <Text style={[styles.trustText, { color: trust.text }]}>
                {trust.label}
              </Text>
            </View>
          </View>

          <View style={styles.cardRow}>
            <Text style={[
              styles.cardMeta,
              isMissed && { color: '#FF3B30' }
            ]}>
              {CALL_ICONS[item.type]} {item.type} · {item.time}

            </Text>
            <Text style={styles.cardDuration}>{item.duration}</Text>
          </View>

          {/* Spam sub-row */}
          {isSpam && (
            <Text style={styles.spamSub}>
              ⚠ {item.spamReports} reports · {item.spamCategory}
            </Text>
          )}

        </View>

        {/* Chevron */}
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── StatsBar ────────────────────────────────────────────────────
const StatsBar = ({ calls }) => {
  const spam    = calls.filter(c => c.trust === 'spam').length;
  const safe    = calls.filter(c => c.trust === 'safe').length;
  const unknown = calls.filter(c => c.trust === 'unknown').length;

  return (
    <View style={styles.statsBar}>
      {[
        { label: 'Safe',    val: safe,    color: '#34C759' },
        { label: 'Spam',    val: spam,    color: '#FF3B30' },
        { label: 'Unknown', val: unknown, color: '#8E8E93' },
      ].map(s => (
        <View key={s.label} style={styles.statItem}>
          <Text style={[styles.statNum, { color: s.color }]}>{s.val}</Text>
          <Text style={styles.statLabel}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
};

// ─── FilterTabs ──────────────────────────────────────────────────
const FILTERS = ['All', 'Missed', 'Spam', 'Safe'];

const FilterTabs = ({ active, onChange }) => (
  <View style={styles.filterRow}>
    {FILTERS.map(f => (
      <TouchableOpacity
        key={f}
        style={[styles.filterTab, active === f && styles.filterTabActive]}
        onPress={() => onChange(f)}
        activeOpacity={0.7}
      >
        <Text style={[styles.filterText, active === f && styles.filterTextActive]}>
          {f}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);





// ─── main screen ────────────────────────────────────────────────
const HomeScreen = ({ navigation }) => {
  const [filter, setFilter]       = useState('All');
  const [search, setSearch]       = useState('');
  const [searching, setSearching] = useState(false);
  const searchAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1, duration: 500, useNativeDriver: true,
    }).start();
  }, [headerAnim]);

  // Animate search bar open/close
  const toggleSearch = useCallback(() => {
    const next = !searching;
    setSearching(next);
    if (!next) setSearch('');
    Animated.timing(searchAnim, {
      toValue: next ? 1 : 0,
      duration: 250, useNativeDriver: false,
    }).start();
  }, [searching, searchAnim]);


  // Filter + search logic
  const filteredCalls = useCallback(() => {
    let calls = MOCK_CALLS;
    if (filter === 'Missed') calls = calls.filter(c => c.type === 'missed');
    if (filter === 'Spam')   calls = calls.filter(c => c.trust === 'spam');
    if (filter === 'Safe')   calls = calls.filter(c => c.trust === 'safe');
    if (search.trim()) {
      const q = search.toLowerCase();
      calls = calls.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.number.includes(q)
      );
    }
    return calls;
  }, [filter, search])();


  const handleCallPress = useCallback((item) => {
    navigation.navigate('ContactDetails', { contact: item });
  }, [navigation]);

  const searchBarHeight = searchAnim.interpolate({
    inputRange: [0, 1], outputRange: [0, 48],
  });
  const searchBarOpacity = searchAnim;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1724" />

      {/* ── Header ── */}
      <Animated.View
        style={[styles.header, {
          opacity: headerAnim,
          transform: [{ translateY: headerAnim.interpolate({
            inputRange: [0, 1], outputRange: [-20, 0],
          })}],
        }]}
      >
        <View>
          <Text style={styles.headerSub}>Recent Activity</Text>
          <Text style={styles.headerTitle}>Call Log</Text>
        </View>
        <View style={styles.headerActions}>
          {/* Search toggle */}
          <TouchableOpacity style={styles.headerBtn} onPress={toggleSearch}>
            <Text style={styles.headerBtnText}>{searching ? '✕' : '⌕'}</Text>
          </TouchableOpacity>

          {/* Spam protection badge */}
          <View style={styles.shieldBadge}>
            <Text style={styles.shieldText}>🛡 ON</Text>
          </View>
        </View>
      </Animated.View>

      {/* ── Animated Search Bar ── */}
      <Animated.View style={{ height: searchBarHeight, opacity: searchBarOpacity, overflow: 'hidden', paddingHorizontal: 16 }}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search name or number..."
          placeholderTextColor="#4A5568"
          value={search}
          onChangeText={setSearch}
          autoFocus={searching}
          returnKeyType="search"
        />
      </Animated.View>


      {/* ── Stats Bar ── */}
      <StatsBar calls={MOCK_CALLS} />

      {/* ── Filter Tabs ── */}
      <FilterTabs active={filter} onChange={setFilter} />

      {/* ── Call List ── */}
      <FlatList
        data={filteredCalls}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <CallCard item={item} index={index} onPress={handleCallPress} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No calls found</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}

      />
    </SafeAreaView>
  );
};

// ─── styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#0F1724' },

  // header
  header:        {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
  },
  headerSub:     { fontSize: 11, color: '#4A5568', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 },
  headerTitle:   { fontSize: 26, fontWeight: '800', color: '#F1F5F9' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerBtn:     {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerBtnText: { fontSize: 16, color: '#94A3B8' },
  shieldBadge:   {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(52,199,89,0.15)',
    borderWidth: 1, borderColor: 'rgba(52,199,89,0.35)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
  },
  shieldText:    { fontSize: 11, fontWeight: '700', color: '#34C759', letterSpacing: 0.5 },

  // search
  searchInput:   {
    height: 40, backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12, paddingHorizontal: 14,
    color: '#F1F5F9', fontSize: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 8,
  },

  // stats bar
  statsBar:      {
    flexDirection: 'row', marginHorizontal: 16, marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    paddingVertical: 12,
  },
  statItem:      { flex: 1, alignItems: 'center' },
  statNum:       { fontSize: 20, fontWeight: '800' },
  statLabel:     { fontSize: 11, color: '#4A5568', marginTop: 2, textTransform: 'uppercase', letterSpacing: 1 },


  // filter tabs
  filterRow:     {
    flexDirection: 'row', paddingHorizontal: 16,
    marginBottom: 10, gap: 8,
  },
  filterTab:     {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  filterTabActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  filterText:    { fontSize: 13, fontWeight: '600', color: '#4A5568' },
  filterTextActive: { color: '#FFF' },

  // call cards
  listContent:   { paddingHorizontal: 16, paddingBottom: 16 },
  card:          {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    padding: 14, gap: 12,
  },
  cardSpam:      {
    borderLeftWidth: 3, borderLeftColor: 'rgba(255,59,48,0.6)',
    backgroundColor: 'rgba(255,59,48,0.04)',
  },

  avatar:        {
    width: 46, height: 46, borderRadius: 23,
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
  },
  avatarText:    { fontSize: 15, fontWeight: '800' },
  cardBody:      { flex: 1, gap: 4 },
  cardRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardName:      { fontSize: 14, fontWeight: '700', color: '#F1F5F9', flex: 1, marginRight: 8 },
  cardNameSpam:  { color: '#FF6B6B' },
  cardMeta:      { fontSize: 12, color: '#4A5568', flex: 1 },
  cardDuration:  { fontSize: 12, color: '#4A5568' },
  spamSub:       { fontSize: 11, color: '#FF3B30', marginTop: 2 },
  trustBadge:    {
    borderRadius: 6, borderWidth: 1,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  trustText:     { fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  chevron:       { fontSize: 22, color: '#2D3748', marginLeft: 4 },

  // empty state
  emptyState:    { alignItems: 'center', paddingTop: 80 },
  emptyIcon:     { fontSize: 40, marginBottom: 12 },
  emptyText:     { fontSize: 15, color: '#4A5568' },

  // bottom nav
  bottomNav:     {
    flexDirection: 'row', borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
    backgroundColor: '#0A0F1E', paddingBottom: 8, paddingTop: 6,
  },
  navItem:       { flex: 1, alignItems: 'center', gap: 3 },
  navIconWrap:   {
    width: 36, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },
  navIconActive: { backgroundColor: 'rgba(0,122,255,0.15)' },
  navIcon:       { fontSize: 18, color: '#2D3748' },
  navLabel:      { fontSize: 10, color: '#2D3748', fontWeight: '500' },
});

export default HomeScreen;
