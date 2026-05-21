import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HindiLabel } from "../components/common/HindiLabel";
import { Colors } from "../constants/colors";

const APP_VERSION = Constants.expoConfig?.version ?? "1.0.0";

interface SettingItem {
  id: string;
  icon: string;
  iconPack: "ionicons" | "material";
  label: string;
  hindiLabel: string;
  subtitle?: string;
  onPress: () => void;
  color?: string;
  showChevron?: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { user: userSession, logout } = useAuth();

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          "Check out the Painal App — a digital initiative for Painal Village! Download now: https://play.google.com/store/apps/details?id=com.mohitxcodes.painal",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleRateApp = () => {
    Linking.openURL(
      "https://play.google.com/store/apps/details?id=com.mohitxcodes.painal",
    );
  };

  const handleContactSupport = () => {
    Linking.openURL("mailto:mohtixcodes@gmail.com?subject=Painal App Feedback");
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      "Privacy Policy",
      "This app collects minimal data necessary for village directory functionality. Your information is stored securely and is not shared with third parties.\n\nFor questions, contact mohitxcodes@gmail.com",
      [{ text: "OK" }],
    );
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          Alert.alert("Logged out", "You have been logged out successfully.");
        },
      },
    ]);
  };

  const generalSettings: SettingItem[] = [
    {
      id: "share",
      icon: "share-social-outline",
      iconPack: "ionicons",
      label: "Share App",
      hindiLabel: "ऐप शेयर करें",
      subtitle: "Invite friends & family",
      onPress: handleShareApp,
      showChevron: true,
    },
    {
      id: "rate",
      icon: "star-outline",
      iconPack: "ionicons",
      label: "Rate the App",
      hindiLabel: "ऐप को रेट करें",
      subtitle: "Leave a review on Play Store",
      onPress: handleRateApp,
      showChevron: true,
    },
    {
      id: "contact",
      icon: "email-outline",
      iconPack: "material",
      label: "Contact & Feedback",
      hindiLabel: "संपर्क और प्रतिक्रिया",
      subtitle: "mohitxcodes@gmail.com",
      onPress: handleContactSupport,
      showChevron: true,
    },
  ];

  const appSettings: SettingItem[] = [
    ...(userSession
      ? [
          {
            id: "logout",
            icon: "log-out-outline",
            iconPack: "ionicons" as const,
            label: "Log Out",
            hindiLabel: "लॉग आउट करें",
            subtitle: `Logged in as ${userSession.name}`,
            onPress: handleLogout,
            showChevron: false,
          },
        ]
      : [
          {
            id: "login",
            icon: "log-in-outline",
            iconPack: "ionicons" as const,
            label: "Log In",
            hindiLabel: "लॉग इन करें",
            subtitle: "Manage village data",
            onPress: () => router.push("/login"),
            showChevron: true,
          },
        ]),

    {
      id: "privacy",
      icon: "shield-checkmark-outline",
      iconPack: "ionicons" as const,
      label: "Privacy Policy",
      hindiLabel: "गोपनीयता नीति",
      onPress: handlePrivacyPolicy,
      showChevron: true,
    },
  ];

  const renderSettingItem = (item: SettingItem, isLast: boolean) => {
    const iconColor = item.color ?? Colors.primary;
    const iconBg = item.color ? `${item.color}15` : "rgba(232,168,56,0.12)";

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.settingRow, !isLast && styles.settingRowBorder]}
        onPress={item.onPress}
        activeOpacity={0.6}
      >
        <View style={[styles.settingIconWrap, { backgroundColor: iconBg }]}>
          {item.iconPack === "ionicons" ? (
            <Ionicons name={item.icon as any} size={20} color={iconColor} />
          ) : (
            <MaterialCommunityIcons
              name={item.icon as any}
              size={20}
              color={iconColor}
            />
          )}
        </View>
        <View style={styles.settingInfo}>
          <Text
            style={[styles.settingLabel, item.color && { color: item.color }]}
          >
            {item.label}
          </Text>
          {item.subtitle && (
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          )}
        </View>
        {item.showChevron && (
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        )}
      </TouchableOpacity>
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
            <Text style={styles.headerTitle}>Settings</Text>
            <HindiLabel style={styles.headerHindi}>सेटिंग्स</HindiLabel>
          </View>
          <View style={styles.headerRight} />
        </SafeAreaView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* General Section */}
        <View style={styles.sectionLabelWrap}>
          <Text style={styles.sectionLabel}>GENERAL</Text>
        </View>
        <View style={styles.card}>
          {generalSettings.map((item, i) =>
            renderSettingItem(item, i === generalSettings.length - 1),
          )}
        </View>

        {/* App Section */}
        <View style={styles.sectionLabelWrap}>
          <Text style={styles.sectionLabel}>APP</Text>
        </View>
        <View style={styles.card}>
          {appSettings.map((item, i) =>
            renderSettingItem(item, i === appSettings.length - 1),
          )}
        </View>

        {/* Version Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerVersion}>Version {APP_VERSION}</Text>
          <Text style={styles.footerCopyright}>
            Made with ❤️ for Painal Village
          </Text>
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

  // Section Labels
  sectionLabelWrap: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 10,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textMuted,
    letterSpacing: 1,
  },

  // Settings Card
  card: {
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  settingSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },

  // Footer
  footer: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
  },
  footerIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(232,168,56,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  footerAppName: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: 0.5,
  },
  footerHindi: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  footerVersion: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 12,
  },
  footerCopyright: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
