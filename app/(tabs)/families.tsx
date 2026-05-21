import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ErrorState from "../../components/common/ErrorState";
import { HindiLabel } from "../../components/common/HindiLabel";
import FamiliesScreenSkeleton from "../../components/skeletons/FamiliesScreenSkeleton";
import { Colors } from "../../constants/colors";
import { AppStrings, Strings } from "../../constants/strings";
import { useFamilies } from "../../hooks/useFamilies";
import { useInfinitePrimaryFamilies } from "../../hooks/useInfinitePrimaryFamilies";
import { getDeterministicAvatarColor } from "../../utils/avatarColor";

export default function FamiliesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const { families } = useFamilies(searchQuery);
  const { totalElements, loading, error, refresh } =
    useInfinitePrimaryFamilies();
  const router = useRouter();

  // ── Loading state: show skeleton ──
  if (loading) {
    return <FamiliesScreenSkeleton />;
  }

  // ── Error state: show error with retry ──
  if (error) {
    const isTimeout = error.message === "Timeout Error";
    return (
      <ErrorState
        title={isTimeout ? "Connection Timeout" : "Unable to Load Families"}
        subtitle={isTimeout ? "कनेक्शन टाइमआउट" : "परिवार लोड करने में असमर्थ"}
        message={isTimeout
          ? "The request took too long. Please check your internet connection and try again."
          : "Something went wrong while fetching family data. Please check your internet connection and try again."}
        onRetry={refresh}
        icon={isTimeout ? "timer-outline" : "cloud-offline-outline"}
      />
    );
  }

  // ── Success state: show the family list ──
  const renderFamily = ({ item, index }: { item: any; index: number }) => {
    const isAll = item.id === "all";
    const initials = isAll ? "🏘️" : item.name.substring(0, 2).toUpperCase();
    const bgColor = isAll
      ? Colors.accent
      : getDeterministicAvatarColor(item.id);
    const membersCount = isAll ? totalElements : item.members?.length || 0;

    return (
      <TouchableOpacity
        style={[styles.row, isAll && styles.rowAll]}
        onPress={() => router.push(`/family/${item.id}`)}
        accessibilityLabel={`View details for ${item.name}`}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.avatar,
            { backgroundColor: bgColor },
            isAll && styles.avatarAll,
          ]}
        >
          {isAll ? (
            <Text style={styles.avatarEmoji}>{initials}</Text>
          ) : (
            <Text style={styles.avatarText}>{initials}</Text>
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text style={[styles.nameEn, isAll && styles.nameEnAll]}>
            {item.name}
          </Text>
          <HindiLabel style={[styles.nameHi, isAll && styles.nameHiAll]}>
            {item.hindiName}
          </HindiLabel>
        </View>
        <View style={[styles.badge, isAll && styles.badgeAll]}>
          <Text style={[styles.badgeText, isAll && styles.badgeTextAll]}>
            {membersCount}
          </Text>
          <Text style={[styles.badgeLabel, isAll && styles.badgeLabelAll]}>
            {membersCount === 1 ? "member" : "members"}
          </Text>
        </View>
        <View style={[styles.chevronWrap, isAll && styles.chevronWrapAll]}>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={isAll ? Colors.accent : Colors.textMuted}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.headerWrap}>
        <SafeAreaView edges={["top"]} style={styles.headerSafe}>
          <View>
            <Text style={styles.headerTitle}>{AppStrings.tabs.families}</Text>
            <HindiLabel style={styles.headerHindi}>
              {Strings.hi.tabs.families}
            </HindiLabel>
          </View>
          <View style={styles.headerCount}>
            <Text style={styles.headerCountNum}>{families.length}</Text>
            <Text style={styles.headerCountLabel}>family</Text>
          </View>
        </SafeAreaView>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={18}
          color={Colors.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={AppStrings.searchPlaceholder}
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            accessibilityLabel="Clear search"
            style={styles.clearBtn}
          >
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={families}
        keyExtractor={(item) => item.id}
        renderItem={renderFamily}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={
          <View style={styles.comingSoonContainer}>
            <Ionicons
              name="construct-outline"
              size={32}
              color={Colors.textMuted}
            />
            <Text style={styles.comingSoonText}>More families coming soon</Text>
            <HindiLabel style={styles.comingSoonHindi}>
              और परिवार जल्द आ रहे हैं
            </HindiLabel>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.white,
    letterSpacing: 0.3,
  },
  headerHindi: {
    fontSize: 13,
    color: Colors.accentLight,
    marginTop: 2,
  },
  headerCount: {
    alignItems: "center",
    backgroundColor: "rgba(232,168,56,0.15)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  headerCountNum: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.accent,
  },
  headerCountLabel: {
    fontSize: 10,
    color: Colors.accentLight,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
  },
  clearBtn: {
    padding: 4,
  },

  // Coming Soon
  comingSoonContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    marginTop: 20,
    opacity: 0.7,
  },
  comingSoonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textMuted,
    marginTop: 12,
  },
  comingSoonHindi: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },

  // List
  listContent: {
    paddingBottom: 20,
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
  rowAll: {
    backgroundColor: Colors.white,
    borderColor: Colors.borderLight,
    borderLeftColor: Colors.accent,
    borderWidth: 1,
    borderLeftWidth: 6,
    marginBottom: 24,
    paddingVertical: 18,
    shadowColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
  },

  // Avatar
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarAll: {
    backgroundColor: "rgba(232, 168, 56, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(232, 168, 56, 0.3)",
    width: 52,
    height: 52,
    borderRadius: 16,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  avatarEmoji: {
    fontSize: 22,
  },

  // Info
  infoContainer: {
    flex: 1,
  },
  nameEn: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: 0.1,
  },
  nameEnAll: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "800",
  },
  nameHi: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  nameHiAll: {
    color: Colors.textMuted,
  },

  // Badge
  badge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginRight: 6,
    alignItems: "center",
    minWidth: 48,
  },
  badgeAll: {
    backgroundColor: "rgba(232, 168, 56, 0.15)",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.primary,
  },
  badgeTextAll: {
    color: Colors.primary,
    fontSize: 18,
  },
  badgeLabel: {
    fontSize: 8,
    color: Colors.textMuted,
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  badgeLabelAll: {
    color: Colors.primary,
  },

  // Chevron
  chevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  chevronWrapAll: {
    backgroundColor: "rgba(232, 168, 56, 0.1)",
  },
});
