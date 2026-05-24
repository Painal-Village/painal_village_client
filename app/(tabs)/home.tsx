import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HindiLabel } from "../../components/common/HindiLabel";
import { Colors } from "../../constants/colors";
import { AppStrings, Strings } from "../../constants/strings";

const { width } = Dimensions.get("window");

const QUICK_LINK_ICONS: Record<string, { icon: string; bg: string }> = {
  "Family List": { icon: "account-group-outline", bg: "#FDEBD0" },
  Leaders: { icon: "crown-outline", bg: "#D5F5E3" },
  "Village Book": { icon: "book-open-outline", bg: "#D6EAF8" },
  Gallery: { icon: "image-multiple-outline", bg: "#E8DAEF" },
  Founders: { icon: "shield-star-outline", bg: "#FADBD8" },
  Settings: { icon: "cog-outline", bg: "#FDF2E9" },
};

const QuickLink = ({
  title,
  hindiTitle,
  icon,
  bg,
  onPress,
}: {
  title: string;
  hindiTitle: string;
  icon: string;
  bg: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={styles.quickLink}
    onPress={onPress}
    accessibilityLabel={title}
    activeOpacity={0.7}
  >
    <View style={[styles.quickLinkIcon, { backgroundColor: bg }]}>
      <MaterialCommunityIcons
        name={icon as any}
        size={26}
        color={Colors.primary}
      />
    </View>
    <Text style={styles.quickLinkTitle} numberOfLines={1}>
      {title}
    </Text>
    <HindiLabel style={styles.quickLinkHindi} numberOfLines={1}>
      {hindiTitle}
    </HindiLabel>
  </TouchableOpacity>
);

const getWeatherEmojiAndDesc = (code: number) => {
  if (code === 0) return { emoji: "☀️", desc: "Clear sky", hindi: "साफ आसमान" };
  if (code === 1 || code === 2 || code === 3)
    return { emoji: "🌤️", desc: "Partly cloudy", hindi: "आंशिक बादल" };
  if (code === 45 || code === 48)
    return { emoji: "🌫️", desc: "Fog", hindi: "कोहरा" };
  if (code >= 51 && code <= 67)
    return { emoji: "🌧️", desc: "Rain", hindi: "बारिश" };
  if (code >= 71 && code <= 77)
    return { emoji: "❄️", desc: "Snow", hindi: "बर्फबारी" };
  if (code >= 80 && code <= 82)
    return { emoji: "🌦️", desc: "Rain showers", hindi: "बारिश की बौछारें" };
  if (code >= 95)
    return { emoji: "⛈️", desc: "Thunderstorm", hindi: "आंधी तूफान" };
  return { emoji: "☁️", desc: "Cloudy", hindi: "बादल" };
};

export default function HomeScreen() {
  const router = useRouter();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=25.56&longitude=84.97&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto",
        );
        const data = await res.json();
        setWeatherData(data.current);
      } catch (err) {
        console.error("Failed to fetch weather", err);
      } finally {
        setWeatherLoading(false);
      }
    };
    fetchWeather();
  }, []);

  const stats = [
    {
      title: AppStrings.population,
      value: "9,618",
      icon: "account-group",
      subtitle: Strings.hi.population,
    },
    {
      title: AppStrings.houses,
      value: "1,601",
      icon: "home-group",
      subtitle: Strings.hi.houses,
    },
    {
      title: AppStrings.area,
      value: "4.2km²",
      icon: "map-marker-radius",
      subtitle: Strings.hi.area,
    },
  ];

  const qlHindi = Strings.hi.quickLinks;
  const quickLinks = [
    {
      title: AppStrings.quickLinks.familyList,
      hindiTitle: qlHindi.familyList,
      route: "/(tabs)/families",
    },
    {
      title: AppStrings.quickLinks.leaders,
      hindiTitle: qlHindi.leaders,
      route: "/leaders",
    },
    {
      title: AppStrings.quickLinks.villageBook,
      hindiTitle: qlHindi.villageBook,
      route: "/village-book",
    },
    {
      title: AppStrings.quickLinks.gallery,
      hindiTitle: qlHindi.gallery,
      route: "/gallery",
    },
    {
      title: AppStrings.quickLinks.founders,
      hindiTitle: qlHindi.founders,
      route: "/founders",
    },
    {
      title: AppStrings.quickLinks.settings,
      hindiTitle: qlHindi.settings,
      route: "/settings",
    },
  ];

  const data = [
    { type: "intro" },
    { type: "banner" },
    { type: "quickLinksSection" },
    { type: "weather" },
  ];

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case "intro":
        return (
          <View style={styles.introSection}>
            <View style={styles.greetingChip}>
              <Text style={styles.greetingText}>नमस्ते 🙏</Text>
            </View>
            <Text style={styles.introTitle}>Welcome to Painal Village</Text>
            <HindiLabel style={styles.introHindiTitle}>
              पैनाल ग्राम में आपका स्वागत है
            </HindiLabel>
            <Text style={styles.introDesc}>
              Discover our roots, explore our rich heritage, and stay connected
              with the community.
            </Text>
          </View>
        );

      case "banner":
        return (
          <View style={styles.section}>
            <View style={styles.banner}>
              <View style={styles.bannerAccent} />
              <View style={styles.bannerIconWrap}>
                <Ionicons name="megaphone" size={20} color={Colors.white} />
              </View>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>Announcement</Text>
                <Text style={styles.bannerText}>{AppStrings.announcement}</Text>
              </View>
            </View>
          </View>
        );
      case "quickLinksSection":
        return (
          <View style={styles.sectionBoxed}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <View style={styles.sectionDot} />
                <View>
                  <Text style={styles.sectionTitle}>Quick Access</Text>
                  <HindiLabel style={styles.sectionHindi}>
                    त्वरित पहुँच
                  </HindiLabel>
                </View>
              </View>
            </View>
            <View style={styles.sectionDivider} />
            <View style={styles.quickLinksContainer}>
              {quickLinks.map((ql, i) => {
                const meta = QUICK_LINK_ICONS[ql.title] || {
                  icon: "dots-horizontal",
                  bg: "#F0E6D8",
                };
                return (
                  <QuickLink
                    key={i}
                    title={ql.title}
                    hindiTitle={ql.hindiTitle}
                    icon={meta.icon}
                    bg={meta.bg}
                    onPress={() =>
                      ql.route ? router.push(ql.route as any) : null
                    }
                  />
                );
              })}
            </View>
          </View>
        );
      case "weather": {
        if (weatherLoading || !weatherData) {
          return (
            <View style={styles.section}>
              <View
                style={[
                  styles.weatherWidget,
                  {
                    justifyContent: "center",
                    alignItems: "center",
                    height: 120,
                  },
                ]}
              >
                <ActivityIndicator size="small" color={Colors.white} />
              </View>
            </View>
          );
        }

        const condition = getWeatherEmojiAndDesc(weatherData.weather_code);

        return (
          <View style={styles.section}>
            <View style={styles.weatherWidget}>
              <View style={styles.weatherLeft}>
                <Text style={styles.weatherLabel}>TODAY&apos;S WEATHER</Text>
                <View style={styles.weatherTempRow}>
                  <Text style={styles.weatherTemp}>
                    {Math.round(weatherData.temperature_2m)}°
                  </Text>
                  <Text style={styles.weatherUnit}>C</Text>
                </View>
                <Text style={styles.weatherDesc}>{condition.desc}</Text>
                <HindiLabel style={styles.weatherHindi}>
                  {condition.hindi}
                </HindiLabel>
              </View>
              <View style={styles.weatherDividerVert} />
              <View style={styles.weatherRight}>
                <Text style={styles.weatherEmoji}>{condition.emoji}</Text>
                <View style={styles.weatherMeta}>
                  <View style={styles.weatherMetaRow}>
                    <Ionicons
                      name="water-outline"
                      size={14}
                      color={Colors.accentLight}
                    />
                    <Text style={styles.weatherMetaText}>
                      {weatherData.relative_humidity_2m}%
                    </Text>
                  </View>
                  <View style={styles.weatherMetaRow}>
                    <Ionicons
                      name="speedometer-outline"
                      size={14}
                      color={Colors.accentLight}
                    />
                    <Text style={styles.weatherMetaText}>
                      {weatherData.wind_speed_10m} km/h
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        );
      }
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrap}>
        <SafeAreaView edges={["top"]} style={styles.headerSafe}>
          <View style={styles.headerLeft}>
            <View style={styles.headerAvatar}>
              <Image
                source={require("../../assets/logo/painal_logo_new.png")}
                style={styles.headerLogo}
                resizeMode="cover"
              />
            </View>
            <View>
              <Text style={styles.villageTitle}>{AppStrings.villageName}</Text>
              <Text style={styles.villageSub}>{AppStrings.villageSub}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.headerBell}
            accessibilityLabel="Settings"
            activeOpacity={0.7}
            onPress={() => router.push("/settings")}
          >
            <Ionicons
              name="settings-outline"
              size={22}
              color={Colors.surface}
            />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.type}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const CARD_RADIUS = 16;
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
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  headerSafe: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(232, 168, 56, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerLogo: { width: 40, height: 40, borderRadius: 12 },
  villageTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.white,
    letterSpacing: 0.3,
  },
  villageSub: {
    fontSize: 12,
    color: Colors.accentLight,
    marginTop: 1,
    letterSpacing: 0.2,
  },
  headerBell: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  bellDot: {
    position: "absolute",
    top: 8,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 24,
  },

  // Sections - consistent wrappers
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  // Intro Section
  introSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    alignItems: "flex-start",
  },
  greetingChip: {
    backgroundColor: "rgba(232, 168, 56, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(232, 168, 56, 0.3)",
    alignSelf: "flex-start",
  },
  greetingText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.primary,
  },
  introTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.primary,
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  introHindiTitle: {
    fontSize: 15,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  introDesc: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
    opacity: 0.8,
  },

  sectionBoxed: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 18,
    paddingTop: 16,
    paddingBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionBoxedAlt: {
    backgroundColor: "#FFF9F0",
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 18,
    paddingTop: 16,
    paddingBottom: 12,
    borderWidth: 1.5,
    borderColor: "rgba(232, 168, 56, 0.25)",
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  sectionHeaderLeft: {
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
  sectionDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
    letterSpacing: 0.2,
  },
  sectionHindi: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.accent,
  },

  // Banner
  banner: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  bannerAccent: {
    width: 5,
    backgroundColor: Colors.accent,
  },
  bannerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 14,
    alignSelf: "center",
  },
  bannerContent: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  bannerTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.accent,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 19,
  },

  // Quick Links
  quickLinksContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },
  quickLink: {
    width: (width - 80) / 3,
    alignItems: "center",
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  quickLinkIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  quickLinkTitle: {
    fontSize: 11,
    color: Colors.text,
    textAlign: "center",
    fontWeight: "600",
  },
  quickLinkHindi: {
    fontSize: 9,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 1,
  },

  // Weather
  weatherWidget: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  weatherLeft: {},
  weatherLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.accentLight,
    letterSpacing: 1,
    marginBottom: 4,
    opacity: 0.7,
  },
  weatherTempRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  weatherTemp: {
    fontSize: 42,
    fontWeight: "200",
    color: Colors.white,
  },
  weatherUnit: {
    fontSize: 18,
    fontWeight: "300",
    color: Colors.accentLight,
    marginTop: 6,
  },
  weatherDesc: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
    marginTop: 2,
  },
  weatherHindi: {
    fontSize: 13,
    color: Colors.accentLight,
    marginTop: 2,
  },
  weatherDividerVert: {
    width: 1,
    height: 60,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  weatherRight: {
    alignItems: "center",
  },
  weatherEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  weatherMeta: {},
  weatherMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  weatherMetaText: {
    fontSize: 12,
    color: Colors.accentLight,
    marginLeft: 6,
    fontWeight: "500",
  },
});
