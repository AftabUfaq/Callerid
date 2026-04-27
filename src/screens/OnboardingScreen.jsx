import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Dimensions,
  StatusBar, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ← added


const { width, height } = Dimensions.get('window');

// ─── data ──────────────────────────────────────────────────────
const SLIDES = [
  {
    id: '1',
    title: 'Verified Safe Caller',
    subtitle: 'Instantly recognize trusted callers with verified\nidentity checks and community feedback.',
    color: '#007AFF',
    accent: 'rgba(0,122,255,0.15)',
    icon: '🛡️',
    tag1: 'Scanning...',
    tag2: 'Protected',
  },
  {
    id: '2',
    title: 'Stop the Scammers',
    subtitle: 'Automatically detect and block spam, fraud, and\nscam calls before your phone even rings.',
    color: '#FF3B30',
    accent: 'rgba(255,59,48,0.15)',
    icon: '🚫',
    tag1: 'Blocked',
    tag2: 'Spam Detected',
  },
  {
    id: '3',
    title: 'Turn on the Shield',
    subtitle: 'Enable smart protection for real-time caller\nidentification and proactive blocking.',
    color: '#34C759',
    accent: 'rgba(52,199,89,0.15)',
    icon: '✨',
    tag1: 'AI Active',
    tag2: 'Shield On',
  },
];

// ─── FeatureVisual ──────────────────────────────────────────────
const FeatureVisual = ({ item, isActive }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isActive) return;

    // Pulse glow ring
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25, duration: 1200, useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1, duration: 1200, useNativeDriver: true,
        }),
      ])
    );

    // Float the cards up/down
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8, duration: 1800, useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0, duration: 1800, useNativeDriver: true,
        }),
      ])
    );

    pulse.start();
    float.start();
    return () => { pulse.stop(); float.stop(); };
  }, [isActive, pulseAnim, floatAnim]);

  return (
    <View style={styles.visualContainer}>
      {/* Outer glow pulse ring */}
      <Animated.View
        style={[
          styles.glowRing,
          { borderColor: item.color, transform: [{ scale: pulseAnim }] },
        ]}
      />
      {/* Solid glow base */}
      <View style={[styles.glowBase, { backgroundColor: item.color }]} />
      {/* Main icon circle */}
      <View style={styles.mainCircle}>
        <Text style={styles.emojiIcon}>{item.icon}</Text>
      </View>

      {/* Floating badge — top right */}
      <Animated.View
        style={[
          styles.floatingCard,
          { top: 10, right: -28, transform: [{ translateY: floatAnim }] },
        ]}
      >
        <View style={[styles.badgeDot, { backgroundColor: item.color }]} />
        <Text style={styles.floatingText}>{item.tag1}</Text>
      </Animated.View>

      {/* Floating badge — bottom left, opposite phase */}
      <Animated.View
        style={[
          styles.floatingCard,
          {
            bottom: 20, left: -28,
            transform: [{
              translateY: floatAnim.interpolate({
                inputRange: [-8, 0], outputRange: [0, -8],
              }),
            }],
          },
        ]}
      >
        <View style={[styles.badgeDot, { backgroundColor: '#34C759' }]} />
        <Text style={styles.floatingText}>{item.tag2}</Text>
      </Animated.View>
    </View>
  );
};

// ─── SlideContent — animates in per slide ───────────────────────
const SlideContent = ({ item, isActive }) => {
  const titleY  = useRef(new Animated.Value(24)).current;
  const titleO  = useRef(new Animated.Value(0)).current;
  const subY    = useRef(new Animated.Value(24)).current;
  const subO    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isActive) {
      titleY.setValue(24); titleO.setValue(0);
      subY.setValue(24);   subO.setValue(0);
      return;
    }
    // Staggered entrance: title first, then subtitle 120ms later
    Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(titleY, { toValue: 0, duration: 420, useNativeDriver: true }),
        Animated.timing(titleO, { toValue: 1, duration: 420, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(subY, { toValue: 0, duration: 420, useNativeDriver: true }),
        Animated.timing(subO, { toValue: 1, duration: 420, useNativeDriver: true }),
      ]),
    ]).start();
  }, [isActive, titleY, titleO, subY, subO]);

  return (
    <View style={styles.textContainer}>
      <Animated.Text
        style={[styles.title, { color: item.color,
          opacity: titleO, transform: [{ translateY: titleY }] }]}
      >
        {item.title}
      </Animated.Text>
      <Animated.Text
        style={[styles.subtitle, { opacity: subO, transform: [{ translateY: subY }] }]}
      >
        {item.subtitle}
      </Animated.Text>
    </View>
  );
};

// ─── main screen ───────────────────────────────────────────────
const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef   = useRef(null);
  const btnScaleAnim  = useRef(new Animated.Value(1)).current;

  // ← Mark onboarding done and navigate
  const finishOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem('alreadyLaunched', 'true');
    } catch { /* ignore */ }
    navigation.replace('PrimaryLanguage');
  }, [navigation]);


  const handleNext = useCallback(() => {
    // Button press bounce
    Animated.sequence([
      Animated.timing(btnScaleAnim, { toValue: 0.94, duration: 80, useNativeDriver: true }),
      Animated.timing(btnScaleAnim, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start();

    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      finishOnboarding();
    }
  }, [currentIndex, btnScaleAnim, finishOnboarding]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderItem = useCallback(({ item, index }) => (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <FeatureVisual item={item} isActive={currentIndex === index} />
      </View>
      <SlideContent item={item} isActive={currentIndex === index} />
    </View>
  ), [currentIndex]);

  const activeSlide = SLIDES[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1724" />

      {/* Skip button — top right */}
      <View style={styles.topBar}>
        <View style={styles.progressTrack}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressSegment,
                i <= currentIndex && { backgroundColor: activeSlide.color },
              ]}
            />
          ))}
        </View>
        <TouchableOpacity onPress={finishOnboarding} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>


      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef}
        scrollEventThrottle={16}
        getItemLayout={(_, i) => ({
          length: width, offset: width * i, index: i,
        })}
      />

      <View style={styles.footer}>
        {/* Classic pill dots */}
        <View style={styles.paginationContainer}>
          {SLIDES.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() =>
                flatListRef.current?.scrollToIndex({ index: i, animated: true })
              }
            >
              <View
                style={[
                  styles.dotIndicator,
                  currentIndex === i && [
                    styles.activeDotIndicator,
                    { backgroundColor: activeSlide.color },
                  ],
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* CTA button with bounce */}
        <Animated.View style={{ transform: [{ scale: btnScaleAnim }] }}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: activeSlide.color }]}
            onPress={handleNext}
            activeOpacity={1}
          >
            <Text style={styles.buttonText}>
              {currentIndex === SLIDES.length - 1 ? 'Get Started 🚀' : 'Continue →'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

// ─── styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1724' },

  // top bar: progress segments + skip
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 12,
  },
  progressTrack: {
    flex: 1, flexDirection: 'row', gap: 6,
  },
  progressSegment: {
    flex: 1, height: 3, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  skipText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 14, fontWeight: '500',
  },


  slide: { width, alignItems: 'center', justifyContent: 'center', paddingTop: 24 },
  imageContainer: {
    height: height * 0.38,
    justifyContent: 'center', alignItems: 'center', width: '100%',
  },

  // visual
  visualContainer: { width: 220, height: 220, justifyContent: 'center', alignItems: 'center' },
  glowRing: {
    position: 'absolute', width: 170, height: 170,
    borderRadius: 85, borderWidth: 1.5,
    opacity: 0.35,
  },

  glowBase: {
    position: 'absolute', width: 130, height: 130,
    borderRadius: 65, opacity: 0.2, transform: [{ scale: 1.6 }],
  },
  mainCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center', zIndex: 10,
  },
  emojiIcon: { fontSize: 52 },
  floatingCard: {
    position: 'absolute', backgroundColor: '#1C2533',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', zIndex: 20,
  },
  badgeDot: { width: 7, height: 7, borderRadius: 4, marginRight: 6 },
  floatingText: { color: '#FFF', fontSize: 12, fontWeight: '600' },

  // text
  textContainer: { alignItems: 'center', paddingHorizontal: 36, marginTop: 44 },
  title: {
    fontSize: 28, fontWeight: '800',
    textAlign: 'center', marginBottom: 14,
    // color comes from item.color per slide ↑
  },

  subtitle: {
    fontSize: 15, color: '#8A95A8',
    textAlign: 'center', lineHeight: 24,
  },

  // footer
  footer: { paddingHorizontal: 28, paddingBottom: 32, paddingTop: 8 },
  paginationContainer: {
    flexDirection: 'row', justifyContent: 'center',
    marginBottom: 24, gap: 6,
  },
  dotIndicator: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  activeDotIndicator: { width: 28 }, // pill shape, color from activeSlide ↑

  button: {
    height: 58, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 10,
  },
  buttonText: { color: '#FFF', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },
});

export default OnboardingScreen;
