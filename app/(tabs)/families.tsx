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
import { useRouter, useFocusEffect } from "expo-router";
import { toTitleCase } from "../../utils/stringFormat";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { HindiLabel } from "../../components/common/HindiLabel";
import { useInfinitePrimaryFamilies } from "../../hooks/useInfinitePrimaryFamilies";
import { AppStrings } from "../../constants/strings";
import { useRecentProfiles } from "../../hooks/useRecentProfiles";
import FamilyDetailSkeleton from "../../components/skeletons/FamilyDetailSkeleton";
import ErrorState from "../../components/common/ErrorState";

export default function FamiliesScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

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
      loadRecentProfiles();
    }, [loadRecentProfiles])
  );

  const renderDbMember = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={styles.memberCard}
        onPress={() => router.push(`/member/${item.id}`)}
        activeOpacity={0.7}
      >
        <View style={[styles.cardAccent, { backgroundColor: Colors.primary }]} />
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
                  <Ionicons name="person-outline" size={13} color={Colors.textMuted} />
                  <Text style={styles.metaText}>
                    {item.parentName ? `S/o ${item.parentName}` : "—"}
                  </Text>
                </View>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} style={{ marginLeft: 4 }} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  };

  if (loading && allFamilies.length === 0) {
    // When no data is loaded yet, show the skeleton
    // FamilyDetailSkeleton usually handles back button on its own if we don't pass onBack
    return <FamilyDetailSkeleton />;
  }

  if (error && allFamilies.length === 0) {
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
      <View style={styles.headerWrap}>
        <SafeAreaView edges={["top"]} style={styles.headerSafe}>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{AppStrings.allVillage}</Text>
            <HindiLabel style={styles.headerHindi}>{AppStrings.allVillage}</HindiLabel>
          </View>
          <View style={styles.headerCountChip}>
            <Text style={styles.headerCountNum}>{totalElements}</Text>
          </View>
        </SafeAreaView>

        <View style={styles.subHeader}>
          <View style={styles.subItem}>
            <Ionicons name="person-outline" size={14} color={Colors.accentLight} />
            <Text style={styles.subText}>Total Village Members</Text>
          </View>
          <View style={styles.subDivider} />
          <View style={styles.subItem}>
            <Ionicons name="people-outline" size={14} color={Colors.accentLight} />
            <Text style={styles.subText}>
              {totalElements} {totalElements === 1 ? "member" : "members"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name in English or Hindi..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {recentProfiles.length > 0 && !searchQuery && (
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
                  <HindiLabel style={styles.recentHindiName} numberOfLines={1}>
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
        <Text style={styles.membersDividerText}>MEMBERS ({totalElements})</Text>
        <View style={styles.membersDividerLine} />
      </View>

      <FlatList
        data={allFamilies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDbMember}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  headerWrap: { backgroundColor: Colors.primary, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerSafe: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: Colors.white, marginBottom: 2 },
  headerHindi: { fontSize: 13, color: "rgba(255,255,255,0.8)" },
  headerCountChip: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  headerCountNum: { color: Colors.white, fontSize: 14, fontWeight: "700" },
  subHeader: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 20, marginTop: 5 },
  subItem: { flexDirection: "row", alignItems: "center" },
  subText: { color: "rgba(255,255,255,0.9)", fontSize: 13, marginLeft: 6, fontWeight: "500" },
  subDivider: { width: 1, height: 12, backgroundColor: "rgba(255,255,255,0.3)", marginHorizontal: 12 },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, marginHorizontal: 16, marginTop: 16, borderRadius: 12, paddingHorizontal: 12, height: 46, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: Colors.borderLight },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: Colors.text, height: "100%", fontFamily: "NotoSansDevanagari-Regular" },
  clearBtn: { padding: 4 },
  recentSection: { marginTop: 24, marginBottom: 8 },
  recentHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginBottom: 12 },
  recentLine: { flex: 1, height: 1, backgroundColor: Colors.borderLight },
  recentTitleContainer: { paddingHorizontal: 12, backgroundColor: Colors.surface },
  recentTitle: { fontSize: 12, fontWeight: "600", color: Colors.textMuted, textTransform: "uppercase", letterSpacing: 0.5 },
  recentScroll: { paddingHorizontal: 16, gap: 12 },
  recentCard: { width: 85, alignItems: "center", backgroundColor: Colors.white, padding: 12, borderRadius: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: Colors.borderLight },
  recentAvatar: { width: 56, height: 56, borderRadius: 28, marginBottom: 8, backgroundColor: Colors.surface },
  recentName: { fontSize: 13, fontWeight: "600", color: Colors.text, textAlign: "center", marginBottom: 2 },
  recentHindiName: { fontSize: 11, color: Colors.textMuted, textAlign: "center" },
  membersDivider: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginTop: 24, marginBottom: 12 },
  membersDividerLine: { flex: 1, height: 1, backgroundColor: Colors.borderLight },
  membersDividerText: { marginHorizontal: 12, fontSize: 12, fontWeight: "600", color: Colors.textMuted, letterSpacing: 0.5 },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  memberCard: { flexDirection: "row", backgroundColor: Colors.white, borderRadius: 16, marginBottom: 12, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: Colors.borderLight },
  cardAccent: { width: 4 },
  cardContent: { flex: 1, padding: 12 },
  topRow: { flexDirection: "row", alignItems: "center" },
  avatarContainer: { position: "relative", marginRight: 12 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.surface },
  memberInfo: { flex: 1, justifyContent: "center" },
  nameRoleRow: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  nameEn: { fontSize: 16, fontWeight: "700", color: Colors.text, flex: 1, marginRight: 8 },
  nameHi: { fontSize: 13, color: Colors.textLight, marginBottom: 6 },
  metaRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 12 },
  metaItem: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.surface, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  metaText: { fontSize: 12, color: Colors.textMuted, marginLeft: 4, fontWeight: "500" },
  footerLoader: { paddingVertical: 20, alignItems: "center" },
});
