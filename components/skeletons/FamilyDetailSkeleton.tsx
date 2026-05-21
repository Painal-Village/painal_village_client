import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";

const SHIMMER_DURATION = 1200;

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

/** Skeleton for a member card row */
const SkeletonMemberCard = () => (
  <View style={styles.memberCard}>
    <View style={styles.cardAccent} />
    <View style={styles.cardContent}>
      <View style={styles.topRow}>
        {/* Avatar */}
        <ShimmerBone width={56} height={56} borderRadius={16} />
        {/* Info */}
        <View style={styles.memberInfo}>
          <ShimmerBone width={120 + Math.random() * 40} height={14} borderRadius={6} />
          <ShimmerBone width={80} height={11} borderRadius={4} style={{ marginTop: 6 }} />
          <View style={styles.metaRow}>
            <ShimmerBone width={70} height={10} borderRadius={4} />
            <ShimmerBone width={50} height={10} borderRadius={4} style={{ marginLeft: 14 }} />
          </View>
        </View>
        {/* Chevron */}
        <ShimmerBone width={18} height={18} borderRadius={4} />
      </View>
    </View>
  </View>
);

/**
 * Full-screen skeleton for the family detail / "all members" screen.
 * Mirrors the header, search bar, divider, and member card layout.
 */
export default function FamilyDetailSkeleton({
  onBack,
}: {
  onBack?: () => void;
}) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrap}>
        <SafeAreaView edges={["top"]} style={styles.headerSafe}>
          {/* Back button placeholder */}
          <ShimmerBone width={38} height={38} borderRadius={12} />
          {/* Title */}
          <View style={styles.headerCenter}>
            <ShimmerBone width={140} height={18} borderRadius={6} />
            <ShimmerBone width={80} height={11} borderRadius={4} style={{ marginTop: 5 }} />
          </View>
          {/* Count chip */}
          <ShimmerBone width={40} height={40} borderRadius={12} />
        </SafeAreaView>

        {/* Sub-header */}
        <View style={styles.subHeader}>
          <ShimmerBone width={100} height={10} borderRadius={4} />
          <View style={styles.subDivider} />
          <ShimmerBone width={80} height={10} borderRadius={4} />
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <ShimmerBone width={18} height={18} borderRadius={9} />
        <ShimmerBone width={200} height={14} borderRadius={6} style={{ marginLeft: 10 }} />
      </View>

      {/* Members divider */}
      <View style={styles.membersDivider}>
        <View style={styles.membersDividerLine} />
        <ShimmerBone width={100} height={10} borderRadius={4} style={{ marginHorizontal: 12 }} />
        <View style={styles.membersDividerLine} />
      </View>

      {/* Member cards */}
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonMemberCard key={i} />
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
    paddingBottom: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 16,
  },
  headerSafe: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerCenter: {
    flex: 1,
    marginLeft: 14,
  },

  // Sub-header
  subHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "rgba(0,0,0,0.08)",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  subDivider: {
    width: 1,
    height: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginHorizontal: 16,
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
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

  // Members divider
  membersDivider: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  membersDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },

  // Member Card
  memberCard: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardAccent: {
    width: 4,
    backgroundColor: Colors.border,
  },
  cardContent: {
    flex: 1,
    padding: 14,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberInfo: {
    flex: 1,
    marginLeft: 14,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
});
