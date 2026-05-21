import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HindiLabel } from "../../components/common/HindiLabel";
import { Colors } from "../../constants/colors";
import { AppStrings, Strings } from "../../constants/strings";

const { width } = Dimensions.get("window");

const VILLAGE_INFO = [
  { icon: "map-marker-radius", label: "District", value: "Patna" },
  { icon: "city-variant-outline", label: "Block", value: "Bihta" },
  { icon: "post-outline", label: "Pin Code", value: "801111" },
];

const STATS = [
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

export default function AboutScreen() {
  const data = [
    { type: "history" },
    { type: "villageInfo" },
    { type: "demographics" },
  ];

  const renderItem = ({ item }: { item: { type: string } }) => {
    switch (item.type) {
      case "history":
        return (
          <View style={styles.sectionBoxed}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <View style={styles.sectionDot} />
                <View>
                  <Text style={styles.sectionTitle}>About Village</Text>
                  <HindiLabel style={styles.sectionHindi}>
                    गाँव के बारे में
                  </HindiLabel>
                </View>
              </View>
            </View>
            <View style={styles.sectionDivider} />
            <View style={styles.sectionContent}>
              <HindiLabel style={styles.paragraphEn}>
                पाइनल भारत के बिहार राज्य के पटना जिले के बिहटा ब्लॉक में एक
                गाँव है। यह पटना प्रमंडल के अंतर्गत आता है। यह जिला मुख्यालय
                पटना से 21 किमी पश्चिम, बिहटा से 9 किमी और राज्य की राजधानी पटना
                से 21 किमी दूर स्थित है।
                {"\n\n"}
                मखदुमपुर (2 किमी), बेला (2 किमी), सादिसोपुर (4 किमी), बिशुनपुरा
                (5 किमी) और सिंघारा (5 किमी) पाइनल के नजदीकी गाँव हैं। पाइनल
                पश्चिम में बिहटा ब्लॉक, दक्षिण में नौबतपुर ब्लॉक और पूर्व में
                दानापुर व फुलवारी ब्लॉक से घिरा हुआ है।
              </HindiLabel>

              <View style={styles.sectionDivider} />
              <Text style={styles.paragraphHi}>
                Painal is a Village in Bihta Block in Patna District of Bihar
                State, India. It belongs to Patna Division. It is located 21 KM
                towards west from District head quarters Patna. 9 KM from Bihta.
                21 KM from State capital Patna.
                {"\n\n"}
                Makhdumpur (2 KM), Bela (2 KM), Sadisopur (4 KM), Bishunpura (5
                KM), Singhara (5 KM) are the nearby Villages to Painal. Painal
                is surrounded by Bihta Block towards west, Naubatpur Block
                towards South, Dinapur Block towards East, Phulwari Block
                towards East.
              </Text>
            </View>
          </View>
        );

      case "villageInfo":
        return (
          <View style={styles.sectionBoxed}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <View style={styles.sectionDot} />
                <View>
                  <Text style={styles.sectionTitle}>Village Info</Text>
                  <HindiLabel style={styles.sectionHindi}>
                    ग्राम की जानकारी
                  </HindiLabel>
                </View>
              </View>
            </View>
            <View style={styles.sectionDivider} />
            <View style={styles.infoGrid}>
              {VILLAGE_INFO.map((info, idx) => (
                <View key={`info-${idx}`} style={styles.statCard}>
                  <View style={styles.statIconWrap}>
                    <MaterialCommunityIcons
                      name={info.icon as any}
                      size={22}
                      color={Colors.accent}
                    />
                  </View>
                  <Text
                    style={styles.statValue}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {info.value}
                  </Text>
                  <Text style={styles.statTitle}>{info.label}</Text>
                  <HindiLabel style={styles.statSubtitle}>
                    {info.label === "District"
                      ? "ज़िला"
                      : info.label === "Block"
                        ? "ब्लॉक"
                        : "पिन कोड"}
                  </HindiLabel>
                </View>
              ))}
              {STATS.map((s, i) => (
                <View key={`stat-${i}`} style={styles.statCard}>
                  <View style={styles.statIconWrap}>
                    <MaterialCommunityIcons
                      name={s.icon as any}
                      size={22}
                      color={Colors.accent}
                    />
                  </View>
                  <Text
                    style={styles.statValue}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {s.value}
                  </Text>
                  <Text style={styles.statTitle}>{s.title}</Text>
                  <HindiLabel style={styles.statSubtitle}>
                    {s.subtitle}
                  </HindiLabel>
                </View>
              ))}
            </View>
          </View>
        );

      case "demographics":
        const DEMO_STATS = [
          {
            title: "Local Language",
            value: "Magahi",
            icon: "translate",
            subtitle: "स्थानीय भाषा",
          },
          {
            title: "Female Population",
            value: "47.0%",
            icon: "gender-female",
            subtitle: "महिला जनसंख्या",
          },
          {
            title: "Literacy Rate",
            value: "60.3%",
            icon: "book-education-outline",
            subtitle: "साक्षरता दर",
          },
          {
            title: "Female Literacy",
            value: "24.0%",
            icon: "school-outline",
            subtitle: "महिला साक्षरता",
          },
        ];

        return (
          <View style={styles.sectionBoxed}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <View
                  style={[
                    styles.sectionDot,
                    { backgroundColor: Colors.accent },
                  ]}
                />
                <View>
                  <Text style={styles.sectionTitle}>Demographics (2011)</Text>
                  <HindiLabel style={styles.sectionHindi}>
                    जनसांख्यिकी (2011 जनगणना)
                  </HindiLabel>
                </View>
              </View>
            </View>
            <View style={styles.sectionDivider} />
            <View style={styles.demoListContainer}>
              {DEMO_STATS.map((s, i) => (
                <View key={`demo-${i}`} style={styles.demoRow}>
                  <View style={styles.demoRowLeft}>
                    <View style={styles.demoRowIconWrap}>
                      <MaterialCommunityIcons
                        name={s.icon as any}
                        size={20}
                        color={Colors.primary}
                      />
                    </View>
                    <View>
                      <Text style={styles.demoRowTitle}>{s.title}</Text>
                      <HindiLabel style={styles.demoRowSubtitle}>
                        {s.subtitle}
                      </HindiLabel>
                    </View>
                  </View>
                  <Text style={styles.demoRowValue}>{s.value}</Text>
                </View>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrap}>
        <SafeAreaView edges={["top"]} style={styles.headerSafe}>
          <View>
            <Text style={styles.headerTitle}>{AppStrings.tabs.about}</Text>
            <HindiLabel style={styles.headerHindi}>
              {Strings.hi.tabs.about}
            </HindiLabel>
          </View>
          <View style={styles.headerChip}>
            <Text style={styles.headerChipEmoji}>🏘️</Text>
            <Text style={styles.headerChipText}>Painal</Text>
          </View>
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
  headerChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(232,168,56,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  headerChipEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  headerChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.accent,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },

  // Sections (Shared with Home)
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

  // Common Content Block
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  paragraphEn: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.text,
    fontWeight: "400",
    marginBottom: 12,
  },
  paragraphHi: {
    fontSize: 13,
    lineHeight: 21,
    color: Colors.textMuted,
  },

  // Village Info Grid
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  infoItem: {
    width: (width - 84) / 3,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomWidth: 3,
    borderBottomColor: Colors.primaryLight,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.primary,
  },

  // Stats (matching Home screen)
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  statCard: {
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    width: (width - 84) / 3,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(232, 168, 56, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.primary,
  },
  statTitle: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 3,
    fontWeight: "500",
  },
  statSubtitle: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },

  demoListContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  demoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  demoRowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  demoRowIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(232, 168, 56, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  demoRowTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  demoRowSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  demoRowValue: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
  },
});
