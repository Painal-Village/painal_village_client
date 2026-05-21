import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { File } from "expo-file-system/next";
import { supabase } from "../lib/supabase";
import { HindiLabel } from "../components/common/HindiLabel";
import { Colors } from "../constants/colors";
import {
  currentLeaders,
  historicalLeaders,
  PoliticalLeader,
} from "../constants/leaders";

const positionColors: Record<string, { bg: string; text: string }> = {
  "मुखिया": { bg: "rgba(232,168,56,0.18)", text: "#B8860B" },
  "सरपंच": { bg: "rgba(76,175,80,0.14)", text: "#2E7D32" },
  "पैक्स": { bg: "rgba(33,150,243,0.14)", text: "#1565C0" },
  "समिति": { bg: "rgba(156,39,176,0.14)", text: "#7B1FA2" },
};

const positionTranslations: Record<string, string> = {
  "मुखिया": "Mukhiya (Village Head)",
  "सरपंच": "Sarpanch (Head of Panchayat)",
  "पैक्स": "PACS President",
  "समिति": "Panchayat Samiti",
};

const CurrentLeaderCard = ({ leader, onImagePress }: { leader: PoliticalLeader; onImagePress: (url: string) => void }) => {
  const hasImage = !!leader.imageUrl;
  const fallbackUrl = `https://api.dicebear.com/7.x/thumbs/png?seed=${encodeURIComponent(
    leader.englishName
  )}&backgroundColor=e8a838&size=120`;

  return (
    <View style={styles.sectionBoxed}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.sectionDot, { backgroundColor: Colors.accent }]} />
          <View>
            <Text style={styles.cardTitle}>
              {positionTranslations[leader.position] || leader.position}
            </Text>
            <HindiLabel style={styles.cardHindi}>{leader.position}</HindiLabel>
          </View>
        </View>
      </View>
      <View style={styles.sectionDivider} />
      <View style={styles.sarpanchBody}>
        <View style={styles.sarpanchAvatarWrap}>
          <TouchableOpacity onPress={() => onImagePress(hasImage ? leader.imageUrl : fallbackUrl)} activeOpacity={0.8}>
            <Image
              source={{ uri: hasImage ? leader.imageUrl : fallbackUrl }}
              style={styles.sarpanchAvatar}
              contentFit="cover"
              transition={200}
            />
          </TouchableOpacity>
          <View style={styles.sarpanchOnline} />
        </View>
        <View style={styles.sarpanchInfo}>
          <Text style={styles.sarpanchName}>{leader.englishName}</Text>
          <HindiLabel style={styles.sarpanchNameHi}>{leader.name}</HindiLabel>

          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={14}
              color={Colors.textMuted}
            />
            <Text style={styles.locationText}>
              {leader.place}
              {leader.hindiPlace ? `, ${leader.hindiPlace}` : ""}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const LeaderCard = ({
  leader,
  isCurrent = false,
  onImagePress,
}: {
  leader: PoliticalLeader;
  isCurrent?: boolean;
  onImagePress: (url: string) => void;
}) => {
  const hasImage = !!leader.imageUrl;
  const fallbackUrl = `https://api.dicebear.com/7.x/thumbs/png?seed=${encodeURIComponent(leader.englishName)}&backgroundColor=dbeafe&size=120`;

  const posColor = positionColors[leader.position] || {
    bg: "rgba(232,168,56,0.15)",
    text: Colors.primary,
  };

  return (
    <View style={[styles.row, isCurrent && styles.rowCurrent]}>
      {/* Avatar */}
      <View style={[styles.avatarWrap, isCurrent && styles.avatarWrapCurrent]}>
        <TouchableOpacity onPress={() => onImagePress(hasImage ? leader.imageUrl : fallbackUrl)} activeOpacity={0.8}>
          <Image
            source={{ uri: hasImage ? leader.imageUrl : fallbackUrl }}
            style={styles.avatarImage}
            contentFit="cover"
            transition={200}
          />
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.nameEn} numberOfLines={1}>
          {leader.englishName}
        </Text>
        <HindiLabel style={styles.nameHi} numberOfLines={1}>
          {leader.name}
        </HindiLabel>
        <View style={styles.badgeRow}>
          <View style={[styles.positionBadge, { backgroundColor: posColor.bg }]}>
            <Text style={[styles.positionText, { color: posColor.text }]}>
              {leader.position}
            </Text>
          </View>
          <View style={styles.placeBadge}>
            <Ionicons
              name="location-outline"
              size={10}
              color={Colors.textMuted}
            />
            <Text style={styles.placeText}>{leader.place}</Text>
          </View>
        </View>
      </View>

      {/* Active Chip */}
      {isCurrent && (
        <View style={styles.activeChip}>
          <View style={styles.activeDot} />
          <Text style={styles.activeText}>Active</Text>
        </View>
      )}
    </View>
  );
};

export default function LeadersScreen() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);

  const handleUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setUploading(true);
        const asset = result.assets[0];

        const manipResult = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 500 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.WEBP },
        );

        const fileName = `leaders/${Date.now()}.webp`;
        const file = new File(manipResult.uri);
        const arrayBuffer = await file.arrayBuffer();

        const { error: uploadError } = await supabase.storage
          .from("painal_village")
          .upload(fileName, arrayBuffer, {
            contentType: "image/webp",
            cacheControl: "0",
          });

        if (uploadError) throw uploadError;

        Alert.alert("Success", `Photo uploaded to Supabase as ${fileName}! You can now copy its URL from the dashboard.`);
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.headerWrap}>
        <SafeAreaView edges={["top"]} style={styles.headerSafe}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Village Leaders</Text>
            <HindiLabel style={styles.headerHindi}>ग्राम नेता</HindiLabel>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerActionBtn}
              onPress={handleUpload}
              disabled={uploading}
              activeOpacity={0.7}
            >
              {uploading ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Ionicons name="cloud-upload-outline" size={22} color={Colors.white} />
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Leaders Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconWrap}>
              <MaterialCommunityIcons
                name="crown-outline"
                size={18}
                color={Colors.accent}
              />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Current Leaders</Text>
              <HindiLabel style={styles.sectionTitleHi}>
                वर्तमान नेता
              </HindiLabel>
            </View>
          </View>

          {currentLeaders.map((leader, index) => (
            <CurrentLeaderCard key={`current-${index}`} leader={leader} onImagePress={setSelectedImage} />
          ))}
        </View>

        {/* Historical Leaders Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconWrap}>
              <MaterialCommunityIcons
                name="history"
                size={18}
                color={Colors.accent}
              />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Historical Leaders</Text>
              <HindiLabel style={styles.sectionTitleHi}>
                ऐतिहासिक नेता
              </HindiLabel>
            </View>
          </View>

          {historicalLeaders.map((termData, tIndex) => (
            <View key={`term-${tIndex}`} style={styles.termBlock}>
              <View style={styles.termHeader}>
                <View style={styles.termLine} />
                <View style={styles.termBadge}>
                  <Ionicons
                    name="calendar-outline"
                    size={12}
                    color={Colors.primary}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.termText}>{termData.term}</Text>
                </View>
                <View style={styles.termLine} />
              </View>

              {termData.leaders.map((leader, lIndex) => (
                <LeaderCard
                  key={`hist-${tIndex}-${lIndex}`}
                  leader={leader}
                  isCurrent={false}
                  onImagePress={setSelectedImage}
                />
              ))}
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <MaterialCommunityIcons
            name="shield-star-outline"
            size={28}
            color={Colors.textMuted}
          />
          <Text style={styles.footerText}>
            Honoring those who served our village
          </Text>
          <HindiLabel style={styles.footerHindi}>
            हमारे गाँव की सेवा करने वालों को सम्मान
          </HindiLabel>
        </View>
      </ScrollView>

      {/* Fullscreen Image Modal */}
      <Modal visible={!!selectedImage} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={() => setSelectedImage(null)}
          >
            <Ionicons name="close" size={28} color={Colors.white} />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullScreenImage}
              contentFit="contain"
            />
          )}
        </View>
      </Modal>
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
    zIndex: 10,
  },
  headerSafe: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
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
    alignItems: "center",
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.white,
    letterSpacing: 0.3,
  },
  headerHindi: {
    fontSize: 12,
    color: Colors.accentLight,
    marginTop: 1,
  },
  headerRight: {
    width: 38,
    alignItems: "flex-end",
  },
  headerActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  sectionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(232,168,56,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.primary,
    letterSpacing: 0.2,
  },
  sectionTitleHi: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },

  // Current Leader Card (Boxed Style)
  sectionBoxed: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginBottom: 14,
    borderRadius: 16,
    paddingTop: 10,
    paddingBottom: 2,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionDot: {
    width: 4,
    height: 28,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
    letterSpacing: 0.2,
  },
  cardHindi: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
  },
  sarpanchBody: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 10,
    alignItems: "center",
  },
  sarpanchAvatarWrap: {
    position: "relative",
    marginRight: 12,
  },
  sarpanchAvatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  sarpanchOnline: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2.5,
    borderColor: Colors.white,
  },
  sarpanchInfo: {
    flex: 1,
  },
  sarpanchName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
  },
  sarpanchNameHi: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: 4,
    fontWeight: "500",
  },

  // Row Card — matches families screen row style
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
  rowCurrent: {
    borderColor: Colors.accent,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOpacity: 0.12,
    elevation: 3,
  },

  // Avatar
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    overflow: "hidden",
    marginRight: 14,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  avatarWrapCurrent: {
    borderWidth: 2,
    borderColor: Colors.accent,
    borderRadius: 16,
    width: 52,
    height: 52,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
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
  nameHi: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 6,
  },
  positionBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  positionText: {
    fontSize: 10,
    fontWeight: "700",
  },
  placeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 6,
  },
  placeText: {
    fontSize: 9,
    color: Colors.textMuted,
    marginLeft: 2,
    fontWeight: "500",
  },

  // Active Chip
  activeChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76,175,80,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 6,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4CAF50",
    marginRight: 4,
  },
  activeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#2E7D32",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  // Timeline
  termBlock: {
    marginBottom: 16,
  },
  termHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 4,
    paddingHorizontal: 20,
  },
  termLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  termBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginHorizontal: 12,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 1,
  },
  termText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: 0.8,
  },

  // Footer
  footerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    marginTop: 8,
    opacity: 0.7,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textMuted,
    marginTop: 10,
  },
  footerHindi: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
  },
  fullScreenImage: {
    width: "100%",
    height: "80%",
  },
});
