import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import Avatar from "../../components/common/Avatar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { toTitleCase } from "../../utils/stringFormat";
import { Colors } from "../../constants/colors";
import { HindiLabel } from "../../components/common/HindiLabel";
import { useFamily } from "../../hooks/useFamily";
import { useInfinitePrimaryFamilies } from "../../hooks/useInfinitePrimaryFamilies";
import { formatDateToEnglish, formatBirthDate } from "../../utils/dateFormat";
import { AppStrings } from "../../constants/strings";
import { useRecentProfiles } from "../../hooks/useRecentProfiles";
import FamilyDetailSkeleton from "../../components/skeletons/FamilyDetailSkeleton";
import ErrorState from "../../components/common/ErrorState";
const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  Head: { bg: "rgba(232, 168, 56, 0.15)", text: "#C78C20" },
  Wife: { bg: "rgba(233, 30, 99, 0.1)", text: "#C2185B" },
  Son: { bg: "rgba(33, 150, 243, 0.1)", text: "#1565C0" },
  Daughter: { bg: "rgba(156, 39, 176, 0.1)", text: "#7B1FA2" },
  Father: { bg: "rgba(121, 85, 72, 0.12)", text: "#5D4037" },
  Mother: { bg: "rgba(0, 150, 136, 0.1)", text: "#00796B" },
};

export default function FamilyDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const isAll = id === "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Hooks for individual family vs all families
  const { family } = useFamily(id as string);
  const {
    data: allFamilies,
    loading,
    loadingMore,
    loadMore,
    totalElements,
    error,
    refresh,
  } = useInfinitePrimaryFamilies(debouncedQuery);

  const { recentProfiles, loadRecentProfiles } = useRecentProfiles();

  useFocusEffect(
    useCallback(() => {
      if (isAll) {
        loadRecentProfiles();
      }
    }, [isAll, loadRecentProfiles]),
  );

  // If not "all" and family not found
  if (!isAll && !family) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyHeader}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>Family not found</Text>
          <HindiLabel style={styles.emptyHindi}>परिवार नहीं मिला</HindiLabel>
        </View>
      </SafeAreaView>
    );
  }

  const renderDbMember = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={styles.memberCard}
        onPress={() => router.push(`/member/${item.id}`)}
        activeOpacity={0.7}
      >
        <View
          style={[styles.cardAccent, { backgroundColor: Colors.primary }]}
        />
        <View style={styles.cardContent}>
          <View style={styles.topRow}>
            <View style={styles.avatarContainer}>
              <Avatar
                url={item.profilePhoto}
                fallbackSeed={item.id}
                style={styles.avatar}
                accessibilityLabel={`Avatar for ${item.name}`}
              />
            </View>
            <View style={styles.memberInfo}>
              <View style={styles.nameRoleRow}>
                <Text style={styles.nameEn}>{toTitleCase(item.name)}</Text>
              </View>
              <HindiLabel style={styles.nameHi}>{item.hindiName}</HindiLabel>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons
                    name="person-outline"
                    size={13}
                    color={Colors.textMuted}
                  />
                  <Text style={styles.metaText}>
                    {item.parentName ? `S/o ${item.parentName}` : "—"}
                  </Text>
                </View>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.textMuted}
              style={{ marginLeft: 4 }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMockMember = ({ item }: { item: any }) => {
    const roleStyle = ROLE_COLORS[item.role] || {
      bg: "rgba(232, 168, 56, 0.1)",
      text: Colors.primary,
    };

    return (
      <View style={styles.memberCard}>
        <View
          style={[styles.cardAccent, { backgroundColor: roleStyle.text }]}
        />
        <View style={styles.cardContent}>
          <View style={styles.topRow}>
            <View style={styles.avatarContainer}>
              <Avatar
                url={item.profilePhoto}
                fallbackSeed={item.id || item.avatarSeed}
                style={styles.avatar}
                accessibilityLabel={`Avatar for ${item.name}`}
              />
              {item.role === "Head" && (
                <View style={styles.starBadge}>
                  <Text style={styles.starText}>⭐</Text>
                </View>
              )}
            </View>
            <View style={styles.memberInfo}>
              <View style={styles.nameRoleRow}>
                <Text style={styles.nameEn}>{toTitleCase(item.name)}</Text>
                <View
                  style={[styles.rolePill, { backgroundColor: roleStyle.bg }]}
                >
                  <Text style={[styles.roleText, { color: roleStyle.text }]}>
                    {item.role}
                  </Text>
                </View>
              </View>
              <HindiLabel style={styles.nameHi}>{item.hindiName}</HindiLabel>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons
                    name="calendar-outline"
                    size={13}
                    color={Colors.textMuted}
                  />
                  <Text style={styles.metaText}>
                    {formatDateToEnglish(item.dob)}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons
                    name={item.gender === "Female" ? "female" : "male"}
                    size={13}
                    color={Colors.textMuted}
                  />
                  <Text style={styles.metaText}>{item.gender}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerBlock}>
      <View style={styles.headerWrap}>
        <SafeAreaView edges={["top"]} style={styles.headerSafe}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {isAll ? AppStrings.allVillage : family?.name}
            </Text>
            <HindiLabel style={styles.headerHindi}>
              {isAll ? AppStrings.allVillage : family?.hindiName}
            </HindiLabel>
          </View>
          {(family || isAll) && (
            <View style={styles.headerCountChip}>
              <Text style={styles.headerCountNum}>
                {isAll ? totalElements : family?.members.length}
              </Text>
            </View>
          )}
        </SafeAreaView>

        {!isAll && family && (
          <View style={styles.subHeader}>
            <View style={styles.subItem}>
              <Ionicons
                name="person-outline"
                size={14}
                color={Colors.accentLight}
              />
              <Text style={styles.subText}>Head: {family.headName}</Text>
            </View>
            <View style={styles.subDivider} />
            <View style={styles.subItem}>
              <Ionicons
                name="people-outline"
                size={14}
                color={Colors.accentLight}
              />
              <Text style={styles.subText}>
                {family.members.length}{" "}
                {family.members.length === 1 ? "member" : "members"}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.membersDivider}>
        <View style={styles.membersDividerLine} />
        <Text style={styles.membersDividerText}>
          {isAll
            ? `MEMBERS (${totalElements})`
            : `MEMBERS (${family?.members.length})`}
        </Text>
        <View style={styles.membersDividerLine} />
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  };

  if (isAll && loading && allFamilies.length === 0) {
    return <FamilyDetailSkeleton onBack={() => router.back()} />;
  }

  if (isAll && error && allFamilies.length === 0) {
    const isTimeout = error.message === "Timeout Error";
    return (
      <ErrorState
        title={isTimeout ? "Connection Timeout" : "Unable to Load Members"}
        subtitle={isTimeout ? "कनेक्शन टाइमआउट" : "सदस्य लोड करने में असमर्थ"}
        message={isTimeout
          ? "The request took too long. Please check your internet connection and try again."
          : "Something went wrong while fetching family members. Please check your internet connection and try again."}
        onRetry={refresh}
        icon={isTimeout ? "timer-outline" : "cloud-offline-outline"}
      />
    );
  }

  return (
    <View style={styles.container}>
      {isAll && (
        <>
          <View style={styles.headerWrap}>
            <SafeAreaView edges={["top"]} style={styles.headerSafe}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backBtn}
                accessibilityLabel="Go back"
              >
                <Ionicons name="arrow-back" size={22} color={Colors.white} />
              </TouchableOpacity>
              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>{AppStrings.allVillage}</Text>
                <HindiLabel style={styles.headerHindi}>
                  {AppStrings.allVillage}
                </HindiLabel>
              </View>
              <View style={styles.headerCountChip}>
                <Text style={styles.headerCountNum}>{totalElements}</Text>
              </View>
            </SafeAreaView>

            <View style={styles.subHeader}>
              <View style={styles.subItem}>
                <Ionicons
                  name="person-outline"
                  size={14}
                  color={Colors.accentLight}
                />
                <Text style={styles.subText}>Total Family Members</Text>
              </View>
              <View style={styles.subDivider} />
              <View style={styles.subItem}>
                <Ionicons
                  name="people-outline"
                  size={14}
                  color={Colors.accentLight}
                />
                <Text style={styles.subText}>
                  {totalElements} {totalElements === 1 ? "member" : "members"}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={18}
              color={Colors.textMuted}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name in English or Hindi..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={styles.clearBtn}
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            )}
          </View>

          {isAll && recentProfiles.length > 0 && !searchQuery && (
            <View style={styles.recentSection}>
              <View style={styles.recentHeader}>
                <View style={styles.recentLine} />
                <View style={styles.recentTitleContainer}>
                  <Text style={styles.recentTitle}>Recently Viewed</Text>
                </View>
                <View style={styles.recentLine} />
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentScroll}
              >
                {recentProfiles.map((profile) => {
                  return (
                    <TouchableOpacity
                      key={profile.id}
                      style={styles.recentCard}
                      onPress={() => router.push(`/member/${profile.id}`)}
                    >
                      <Avatar
                        url={profile.profilePhoto}
                        fallbackSeed={profile.id}
                        style={styles.recentAvatar}
                      />
                      <Text style={styles.recentName} numberOfLines={1}>
                        {toTitleCase(profile.name)}
                      </Text>
                      <HindiLabel
                        style={styles.recentHindiName}
                        numberOfLines={1}
                      >
                        {profile.hindiName}
                      </HindiLabel>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          <View style={styles.membersDivider}>
            <View style={styles.membersDividerLine} />
            <Text style={styles.membersDividerText}>
              MEMBERS ({totalElements})
            </Text>
            <View style={styles.membersDividerLine} />
          </View>
        </>
      )}
      <FlatList
        data={isAll ? allFamilies : family?.members}
        keyExtractor={(item) => item.id.toString()}
        renderItem={isAll ? renderDbMember : renderMockMember}
        ListHeaderComponent={isAll ? undefined : renderHeader}
        ListFooterComponent={isAll ? renderFooter : null}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={isAll ? loadMore : undefined}
        onEndReachedThreshold={0.5}
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
  headerBlock: {
    marginBottom: 0,
  },
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
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    marginLeft: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.white,
    letterSpacing: 0.3,
  },
  headerHindi: {
    fontSize: 13,
    color: Colors.accentLight,
    marginTop: 1,
  },
  headerCountChip: {
    minWidth: 40,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(232,168,56,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCountNum: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.accent,
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
  subItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  subText: {
    fontSize: 12,
    color: Colors.accentLight,
    marginLeft: 6,
    fontWeight: "500",
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

  // Empty
  emptyHeader: {
    backgroundColor: Colors.primary,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  emptyHindi: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },

  // List
  listContent: {
    paddingBottom: 40,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
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
  },
  cardContent: {
    flex: 1,
    padding: 14,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  starBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  starText: {
    fontSize: 10,
  },
  memberInfo: {
    flex: 1,
  },
  nameRoleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  nameEn: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    flex: 1,
  },
  nameHi: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  rolePill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 8,
  },
  roleText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: 4,
    fontWeight: "500",
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
  membersDividerText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textMuted,
    paddingHorizontal: 12,
    letterSpacing: 1,
  },

  // Recent Section
  recentSection: {
    marginBottom: 8,
  },
  recentHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  recentLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  recentTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 6,
  },
  recentTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  recentScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  recentCard: {
    width: 80,
    alignItems: "center",
  },
  recentAvatar: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 6,
  },
  recentName: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
  },
  recentHindiName: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 2,
  },
});
