import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { Strings } from '../constants/strings';
import { HindiLabel } from '../components/common/HindiLabel';

const { width, height } = Dimensions.get('window');
const SPLASH_DURATION = 2800;

export default function SplashScreen() {
  const router = useRouter();

  const pulseScale = useSharedValue(0.85);
  const pulseOpacity = useSharedValue(0.3);
  const progressWidth = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0.6);
  const ringOpacity = useSharedValue(0);

  useEffect(() => {
    // Lotus pulse
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 900, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 900, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Outer ring pulse
    ringScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1400, easing: Easing.out(Easing.ease) }),
        withTiming(0.8, { duration: 0 })
      ),
      -1
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1400, easing: Easing.out(Easing.ease) }),
        withTiming(0.4, { duration: 0 })
      ),
      -1
    );

    // Title fade in
    titleOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    titleTranslateY.value = withDelay(300, withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) }));

    // Subtitle fade in
    subtitleOpacity.value = withDelay(700, withTiming(1, { duration: 600 }));

    // Progress bar
    progressWidth.value = withDelay(400, withTiming(1, {
      duration: SPLASH_DURATION - 600,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    }));

    const timeout = setTimeout(() => {
      router.replace('/(tabs)/home');
    }, SPLASH_DURATION);

    return () => clearTimeout(timeout);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: interpolate(progressWidth.value, [0, 1], [0, width * 0.55]),
  }));

  return (
    <View style={styles.container}>
      {/* Background decorative circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Lotus Icon */}
      <View style={styles.iconArea}>
        <Animated.View style={[styles.outerRing, ringStyle]} />
        <Animated.View style={[styles.iconContainer, pulseStyle]}>
          <Image source={require('../assets/logo/painal_logo_new.png')} style={styles.splashLogo} resizeMode="contain" />
        </Animated.View>
      </View>

      {/* Title */}
      <Animated.View style={titleStyle}>
        <HindiLabel weight="bold" style={styles.title}>
          {Strings.hi.appTitle}
        </HindiLabel>
        <Text style={styles.titleEn}>GRAAM</Text>
      </Animated.View>

      <Animated.View style={subtitleStyle}>
        <HindiLabel style={styles.subtitle}>
          {Strings.hi.appSubtitle}
        </HindiLabel>
        <Text style={styles.subtitleEn}>Our Village, Our Identity</Text>
      </Animated.View>

      {/* Progress */}
      <View style={styles.progressArea}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, progressStyle]} />
        </View>
        <Text style={styles.loadingText}>Loading your village...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgCircle1: {
    position: 'absolute',
    top: -height * 0.15,
    right: -width * 0.2,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: 'rgba(232, 168, 56, 0.06)',
  },
  bgCircle2: {
    position: 'absolute',
    bottom: -height * 0.1,
    left: -width * 0.15,
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: 'rgba(253, 246, 236, 0.04)',
  },
  iconArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  outerRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(232, 168, 56, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(232, 168, 56, 0.4)',
  },
  splashLogo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 56,
    color: Colors.accent,
    textAlign: 'center',
    letterSpacing: 2,
  },
  titleEn: {
    fontSize: 14,
    color: 'rgba(253, 246, 236, 0.5)',
    textAlign: 'center',
    letterSpacing: 8,
    fontWeight: '300',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 17,
    color: Colors.surface,
    opacity: 0.85,
    marginTop: 16,
    textAlign: 'center',
  },
  subtitleEn: {
    fontSize: 12,
    color: 'rgba(253, 246, 236, 0.45)',
    textAlign: 'center',
    marginTop: 6,
    letterSpacing: 1,
    fontWeight: '300',
  },
  progressArea: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    width: width * 0.55,
  },
  progressTrack: {
    height: 3,
    width: '100%',
    backgroundColor: 'rgba(253, 246, 236, 0.12)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 12,
    color: 'rgba(253, 246, 236, 0.35)',
    letterSpacing: 0.5,
  },
});
