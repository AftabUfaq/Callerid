import React, { useEffect, useRef, useCallback } from 'react';
import {
  View, Text, Image, StyleSheet,
  Animated, StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── constants ────────────────────────────────────────────────
const ANIM_DURATION  = 1000;   // ms for fade + scale-in
const MIN_SPLASH_MS = 2500;   // minimum visible time
const STORAGE_KEY   = 'alreadyLaunched';

// ─── component ────────────────────────────────────────────────
const SplashScreen = ({ navigation }) => {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  // Resolve navigation target from storage
  const getNextRoute = useCallback(async () => {
    try {
      const [launched, token] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem('userToken'),
      ]);

      // Mark app as launched for future sessions
      if (launched === null) {
        await AsyncStorage.setItem(STORAGE_KEY, 'true'); // ← was missing!
        return 'Onboarding';
      }
      return token ? 'MainTabs' : 'Login';
    } catch {
      return 'Onboarding'; // safe fallback
    }
  }, []);

  useEffect(() => {
    let isMounted = true;  // ← unmount guard
    let timer;

    // 1. Start animation
    const animation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIM_DURATION,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]);

    // 2. Resolve storage + respect minimum display time in parallel
    const init = async () => {
      const [route] = await Promise.all([
        getNextRoute(),
        new Promise(res =>
          (timer = setTimeout(res, MIN_SPLASH_MS))
        ),
      ]);

      if (!isMounted) return; // ← guard fires here
      navigation.replace(route);
    };

    animation.start();
    init();

    return () => {        // ← cleanup on unmount
      isMounted = false;
      clearTimeout(timer);
      animation.stop();
    };
  }, [navigation, getNextRoute, fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#0F1724"
        barStyle="light-content"
        translucent={false}
      />

      <Animated.View
        style={[
          styles.brandContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Image
          source={require('../assets/logonew.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="CallGuard logo" // ← a11y
        />
        <Text style={styles.title}>
          CALLER<Text style={styles.titleBold}>ID</Text>
        </Text>
        <View style={styles.underline} />
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.tagline}>Secure · Identify · Block</Text>
        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>v1.0.0</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1724',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandContainer: { alignItems: 'center' },
  logo: { width: 200, height: 200, marginBottom: 20 },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 8,
    textTransform: 'uppercase',
  },
  titleBold: { fontWeight: '900', color: '#5EE7DF' },
  underline: {
    width: 40, height: 3,
    backgroundColor: '#5EE7DF',
    marginTop: 10, borderRadius: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  tagline: {
    color: '#8A95A8',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  versionBadge: {
    backgroundColor: 'rgba(94,231,223,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  versionText: { color: '#5EE7DF', fontSize: 10, fontWeight: 'bold' },
});

export default SplashScreen;
