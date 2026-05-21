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

const SkeletonRelationCard = () => (
  <View style={styles.relationCard}>
    <ShimmerBone width={46} height={46} borderRadius={14} style={styles.relationAvatar} />
    <View style={styles.relationInfo}>
      <ShimmerBone width={100 + Math.random() * 40} height={14} borderRadius={6} />
      <ShimmerBone width={70} height={10} borderRadius={4} style={{ marginTop: 6 }} />
    </View>
    <ShimmerBone width={60} height={24} borderRadius={8} />
    <ShimmerBone width={16} height={16} borderRadius={4} style={{ marginLeft: 8 }} />
  </View>
);

export default function MemberDetailSkeleton({
  onBack,
}: {
  onBack?: () => void;
}) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrap}>
        <SafeAreaView edges={["top"]} style={styles.headerSafe}>
          <ShimmerBone width={38} height={38} borderRadius={12} />
          <View style={styles.headerCenter}>
            <ShimmerBone width={140} height={18} borderRadius={6} />
            <ShimmerBone width={80} height={12} borderRadius={4} style={{ marginTop: 5 }} />
          </View>
        </SafeAreaView>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCardWrap}>
        <View style={styles.profileCard}>
          <View style={styles.avatarSection}>
            <ShimmerBone width={110} height={110} borderRadius={32} />
          </View>
          <ShimmerBone width={160} height={22} borderRadius={6} style={{ marginTop: 16 }} />
          <ShimmerBone width={100} height={14} borderRadius={4} style={{ marginTop: 8 }} />
          <ShimmerBone width={80} height={24} borderRadius={12} style={{ marginTop: 16 }} />
        </View>
      </View>

      {/* Parent Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <ShimmerBone width={18} height={18} borderRadius={4} />
          <ShimmerBone width={80} height={14} borderRadius={4} style={{ marginLeft: 8 }} />
        </View>
        <View style={styles.sectionDivider} />
        <SkeletonRelationCard />
      </View>

      {/* Children Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <ShimmerBone width={18} height={18} borderRadius={4} />
          <ShimmerBone width={90} height={14} borderRadius={4} style={{ marginLeft: 8 }} />
        </View>
        <View style={styles.sectionDivider} />
        <SkeletonRelationCard />
        <SkeletonRelationCard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  headerWrap: {
    backgroundColor: Colors.primary,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  headerSafe: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerCenter: {
    flex: 1,
    marginLeft: 14,
  },
  profileCardWrap: {
    marginTop: -1,
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 8,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    padding: 16,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: 12,
  },
  relationCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 8,
  },
  relationAvatar: {
    marginRight: 12,
  },
  relationInfo: {
    flex: 1,
  },
});
