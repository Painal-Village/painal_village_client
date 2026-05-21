import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HindiLabel } from "../components/common/HindiLabel";
import { Colors } from "../constants/colors";
import { AppStrings } from "../constants/strings";

interface Founder {
  id: string;
  name: string;
  hindiName: string;
  role: string;
  hindiRole: string;
  email: string;
  avatarSeed: string;
  description: string;
  hindiDescription: string;
  imageUrl: string;
}

const FOUNDERS: Founder[] = [
  {
    id: "f1",
    name: "Sabhajeet Kumar",
    hindiName: "सभाजीत कुमार",
    role: "Founder & Visionary",
    hindiRole: "संस्थापक और मार्गदर्शक",
    email: "[EMAIL_ADDRESS]",
    avatarSeed: "Sabhajeet",
    imageUrl:
      "https://pxytwvgrvlaycdnljjht.supabase.co/storage/v1/object/public/painal_village/members/1022.webp",
    description:
      "I conceived the idea of creating this app with the vision of digitally connecting my village and community. My goal is to ensure that information about the village's identity, history, family details, culture, events, and important notices can be easily accessible to everyone on a single digital platform.",
    hindiDescription:
      "इस ऐप को बनाने का विचार मेरे मन में अपने गाँव और समुदाय को डिजिटल रूप से जोड़ने के उद्देश्य से आया। मैं चाहता था कि गाँव की पहचान, इतिहास, परिवारों की जानकारी, संस्कृति, कार्यक्रम और महत्वपूर्ण सूचनाएँ एक ही डिजिटल प्लेटफ़ॉर्म पर सभी लोगों तक आसानी से पहुँच सकें।",
  },
  {
    id: "f2",
    name: "Mohit Kumar",
    hindiName: "मोहित कुमार",
    role: "App Developer",
    hindiRole: "ऐप डेवलपर",
    email: "mohitxcodes@gmail.com",
    avatarSeed: "Mohit",
    imageUrl:
      "https://pxytwvgrvlaycdnljjht.supabase.co/storage/v1/object/public/painal_village/members/1023.webp",
    description:
      "My aim in creating this app is to connect my village and community digitally, so that information about the village, history, families, culture, programs, and important information can be easily accessible to everyone.",
    hindiDescription:
      "इस ऐप को बनाने का मेरा उद्देश्य अपने गाँव और समुदाय को डिजिटल रूप से एक साथ जोड़ना है, ताकि गाँव की जानकारी, इतिहास, परिवार, संस्कृति, कार्यक्रम और महत्वपूर्ण सूचनाएँ सभी लोगों तक आसानी से पहुँच सकें।",
  },
];

export default function FoundersScreen() {
  const router = useRouter();

  const handleEmailPress = async (email: string) => {
    const url = `mailto:${email}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Error",
          "No email app installed or unable to open email client.",
        );
      }
    } catch (error) {
      console.error("An error occurred opening the email client:", error);
      Alert.alert("Error", "Could not open email client.");
    }
  };

  const renderFounderCard = (founder: Founder) => {
    return (
      <View key={founder.id} style={styles.sectionBoxed}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <View
              style={[styles.sectionDot, { backgroundColor: Colors.accent }]}
            />
            <View>
              <Text style={styles.sectionTitle}>{founder.role}</Text>
              <HindiLabel style={styles.sectionHindi}>
                {founder.hindiRole}
              </HindiLabel>
            </View>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.founderBody}>
          <View style={styles.founderAvatarWrap}>
            <Image
              source={{
                uri: founder.imageUrl,
              }}
              style={styles.founderAvatar}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.founderOnline} />
          </View>

          <View style={styles.founderInfo}>
            <Text style={styles.founderName}>{founder.name}</Text>
            <HindiLabel style={styles.founderNameHi}>
              {founder.hindiName}
            </HindiLabel>

            <View style={styles.descContainer}>
              <HindiLabel style={styles.founderDesc}>
                {founder.hindiDescription}
              </HindiLabel>
              <Text style={styles.founderDescHi}>{founder.description}</Text>
            </View>

            <TouchableOpacity
              style={styles.contactBtn}
              onPress={() => handleEmailPress(founder.email)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="email"
                size={14}
                color={Colors.white}
              />
              <Text style={styles.contactBtnText}>Contact via Email</Text>
            </TouchableOpacity>

            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={14}
                color={Colors.textMuted}
              />
              <Text style={styles.locationText}>{founder.email}</Text>
            </View>
          </View>
        </View>
      </View>
    );
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
            <Text style={styles.headerTitle}>
              {AppStrings.quickLinks.founders}
            </Text>
            <HindiLabel style={styles.headerHindi}>संस्थापक</HindiLabel>
          </View>
          <View style={styles.headerRight} />
        </SafeAreaView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsWrapper}>
          {FOUNDERS.map(renderFounderCard)}
        </View>
      </ScrollView>
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
  },

  // Content
  scrollContent: {
    paddingBottom: 40,
  },
  illustrationContainer: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(232,168,56,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 8,
  },
  introDesc: {
    fontSize: 15,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
  },

  cardsWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  // Boxed Card Layout (like Village Head)
  sectionBoxed: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionDot: {
    width: 6,
    height: 24,
    borderRadius: 3,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: 0.2,
  },
  sectionHindi: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  founderBody: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: "center",
  },
  founderAvatarWrap: {
    position: "relative",
    marginRight: 16,
  },
  founderAvatar: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  founderOnline: {
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
  founderInfo: {
    flex: 1,
  },
  founderName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  founderNameHi: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 10,
  },
  descContainer: {
    backgroundColor: "rgba(0,0,0,0.02)",
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  founderDesc: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
    opacity: 0.9,
  },
  founderDescHi: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
    lineHeight: 16,
  },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  contactBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: 4,
    flex: 1,
  },
});
