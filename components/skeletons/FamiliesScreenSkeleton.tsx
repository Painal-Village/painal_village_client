import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";

const SHIMMER_DURATION = 1200;

/**
 * Animated shimmer bone component used for skeleton placeholders.
 * Each bone pulses opacity to indicate loading.
 */
const ShimmerBone = ({
  width,
  height,
  borderRadius = 8,
  style,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: SHIMMER_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: SHIMMER_DURATION,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: Colors.border,
          opacity,
        },
        style,
      ]}
    />
  );
};

/** Skeleton for a single family row card */
const SkeletonFamilyRow = ({ isFirst = false }: { isFirst?: boolean }) => (
  <View style={[styles.row, isFirst && styles.rowFirst]}>
    {/* Avatar */}
    <ShimmerBone
      width={isFirst ? 52 : 46}
      height={isFirst ? 52 : 46}
      borderRadius={isFirst ? 16 : 14}
    />
    {/* Name + Hindi name */}
    <View style={styles.infoContainer}>
      <ShimmerBone
        width={isFirst ? 120 : 90 + Math.random() * 40}
        height={isFirst ? 16 : 14}
        borderRadius={6}
      />
      <ShimmerBone
        width={isFirst ? 80 : 60 + Math.random() * 30}
        height={11}
        borderRadius={4}
        style={{ marginTop: 6 }}
      />
    </View>
    {/* Badge */}
    <View style={styles.badge}>
      <ShimmerBone width={24} height={16} borderRadius={4} />
      <ShimmerBone
        width={36}
        height={8}
        borderRadius={3}
        style={{ marginTop: 4 }}
      />
    </View>
    {/* Chevron */}
    <ShimmerBone width={28} height={28} borderRadius={8} style={{ marginLeft: 6 }} />
  </View>
);

/**
 * Full-screen skeleton loader for the Families tab.
 * Mirrors the header, search bar, and family list layout.
 */
export default function FamiliesScreenSkeleton() {
  return (
    <View style={styles.container}>
      {/* Header skeleton */}
      <View style={styles.headerWrap}>
        <SafeAreaView edges={["top"]} style={styles.headerSafe}>
          <View>
            <ShimmerBone width={120} height={22} borderRadius={6} />
            <ShimmerBone
              width={70}
              height={12}
              borderRadius={4}
              style={{ marginTop: 6 }}
            />
          </View>
          <View style={styles.headerCount}>
            <ShimmerBone width={30} height={20} borderRadius={4} />
            <ShimmerBone
              width={36}
              height={8}
              borderRadius={3}
              style={{ marginTop: 4 }}
            />
          </View>
        </SafeAreaView>
      </View>

      {/* Search bar skeleton */}
      <View style={styles.searchContainer}>
        <ShimmerBone width={18} height={18} borderRadius={9} />
        <ShimmerBone
          width={180}
          height={14}
          borderRadius={6}
          style={{ marginLeft: 10 }}
        />
      </View>

      {/* Family rows skeleton — first row is the "All" card, rest are normal */}
      <SkeletonFamilyRow isFirst />
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonFamilyRow key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },

  // Header
  headerWrap: {
    backgroundColor: Colors.primary,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  headerSafe: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerCount: {
    alignItems: "center",
    backgroundColor: "rgba(232,168,56,0.15)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },

  // Row
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 14,
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  rowFirst: {
    borderColor: Colors.borderLight,
    borderLeftColor: Colors.accent,
    borderLeftWidth: 6,
    marginBottom: 24,
    paddingVertical: 18,
    shadowColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
  },

  // Info
  infoContainer: {
    flex: 1,
    marginLeft: 14,
  },

  // Badge
  badge: {
    alignItems: "center",
    minWidth: 48,
    marginRight: 6,
  },
});
