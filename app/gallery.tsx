import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImageViewing from "react-native-image-viewing";
import { SafeAreaView } from "react-native-safe-area-context";
import { HindiLabel } from "../components/common/HindiLabel";
import { Colors } from "../constants/colors";
import { AppStrings } from "../constants/strings";

const { width } = Dimensions.get("window");

// Using high quality placeholders representative of a village/rural setting
const GALLERY_IMAGES = [""];

// Formatting for the full-screen image viewer
const formattedImages = GALLERY_IMAGES.map((uri) => ({ uri }));

export default function GalleryScreen() {
  const router = useRouter();
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setIsViewerVisible(true);
  };

  const renderGrid = () => {
    // Custom Masonry/Collage layout logic
    // Pattern: 1 full-width, 2 half-width, 2 half-width, 1 full-width...
    const rows = [];
    let i = 0;

    const validImages = GALLERY_IMAGES.filter((url) => url.trim() !== "");
    if (validImages.length === 0) {
      return (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="images-outline" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No Photos Yet</Text>
          <HindiLabel style={styles.emptyHindi}>
            ग्राम की झलकियाँ अभी उपलब्ध नहीं हैं
          </HindiLabel>
          <Text style={styles.emptyDesc}>
            Photos of the village will appear here once uploaded.
          </Text>
        </View>
      );
    }

    while (i < GALLERY_IMAGES.length) {
      const patternIndex = rows.length % 3; // 0: full, 1: half/half, 2: half/half

      if (patternIndex === 0 && i < GALLERY_IMAGES.length) {
        // Full width row
        const index = i;
        rows.push(
          <TouchableOpacity
            key={`row-${rows.length}`}
            activeOpacity={0.8}
            onPress={() => openImageViewer(index)}
            style={[styles.imageWrap, styles.fullWidth]}
          >
            <Image
              source={{ uri: GALLERY_IMAGES[index] }}
              style={styles.image}
              contentFit="cover"
              transition={300}
            />
          </TouchableOpacity>,
        );
        i += 1;
      } else if (i + 1 < GALLERY_IMAGES.length) {
        // Two half-width images in a row
        const index1 = i;
        const index2 = i + 1;
        rows.push(
          <View key={`row-${rows.length}`} style={styles.halfWidthContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => openImageViewer(index1)}
              style={[styles.imageWrap, styles.halfWidth]}
            >
              <Image
                source={{ uri: GALLERY_IMAGES[index1] }}
                style={styles.image}
                contentFit="cover"
                transition={300}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => openImageViewer(index2)}
              style={[styles.imageWrap, styles.halfWidth]}
            >
              <Image
                source={{ uri: GALLERY_IMAGES[index2] }}
                style={styles.image}
                contentFit="cover"
                transition={300}
              />
            </TouchableOpacity>
          </View>,
        );
        i += 2;
      } else if (i < GALLERY_IMAGES.length) {
        // Fallback for remaining single image at the end
        const index = i;
        rows.push(
          <TouchableOpacity
            key={`row-${rows.length}`}
            activeOpacity={0.8}
            onPress={() => openImageViewer(index)}
            style={[styles.imageWrap, styles.fullWidth]}
          >
            <Image
              source={{ uri: GALLERY_IMAGES[index] }}
              style={styles.image}
              contentFit="cover"
              transition={300}
            />
          </TouchableOpacity>,
        );
        i += 1;
      }
    }
    return rows;
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
              {AppStrings.quickLinks.gallery}
            </Text>
            <HindiLabel style={styles.headerHindi}>ग्राम की झलकियाँ</HindiLabel>
          </View>
          <View style={styles.headerRight} />
        </SafeAreaView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>{renderGrid()}</View>
      </ScrollView>

      {/* Full Screen Image Viewer */}
      <ImageViewing
        images={formattedImages}
        imageIndex={currentImageIndex}
        visible={isViewerVisible}
        onRequestClose={() => setIsViewerVisible(false)}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
      />
    </View>
  );
}

const SPACING = 12;

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
  scrollContent: {
    paddingBottom: 40,
  },
  gridContainer: {
    paddingHorizontal: SPACING,
    paddingTop: SPACING,
  },
  imageWrap: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: SPACING,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
    backgroundColor: Colors.white,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fullWidth: {
    width: width - SPACING * 2,
    height: 220, // Tall prominent image
  },
  halfWidthContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: (width - SPACING * 3) / 2, // Accounting for middle spacing
    height: 160, // Shorter square-ish image
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(232,168,56,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(232,168,56,0.2)",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  emptyHindi: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  emptyDesc: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
});
