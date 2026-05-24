import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import { Stack, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { FullPDFViewer } from "../components/common/FullPDFViewer";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HindiLabel } from "../components/common/HindiLabel";
import { Colors } from "../constants/colors";
import { AppStrings, Strings } from "../constants/strings";

const { width } = Dimensions.get("window");

export default function VillageBookScreen() {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [pdfUri, setPdfUri] = useState<string | null>(null);

  const resolvePdfUri = async () => {
    const asset = Asset.fromModule(require("../assets/book/painal_book.pdf"));
    await asset.downloadAsync();
    
    if (!asset.localUri) return null;
    
    // Read the file as base64 since WebViews can't directly read file:// URIs on devices
    const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    return `data:application/pdf;base64,${base64}`;
  };

  const handleReadInApp = async () => {
    try {
      setIsDownloading(true);
      const uri = await resolvePdfUri();
      if (!uri) throw new Error("Could not resolve URI");
      setPdfUri(uri);
      setIsReading(true);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not load the book for reading.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadAndRead = async () => {
    try {
      setIsDownloading(true);

      // Load the asset
      const asset = Asset.fromModule(require("../assets/book/painal_book.pdf"));
      await asset.downloadAsync(); // Ensure it's downloaded/cached locally

      if (!asset.localUri) {
        throw new Error("Could not locate the local file URI for the book.");
      }

      // On physical devices, Sharing/OS requires a explicit file extension to open properly.
      // Copy the file from localUri to a temp file in cache directory with .pdf extension.
      const tempPdfUri = `${FileSystem.cacheDirectory}painal_book.pdf`;

      // Delete existing temp file if it exists to avoid errors
      const fileInfo = await FileSystem.getInfoAsync(tempPdfUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(tempPdfUri, { idempotent: true });
      }

      await FileSystem.copyAsync({
        from: asset.localUri,
        to: tempPdfUri,
      });

      // Check if sharing is available on this device
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert(
          "Not Supported",
          "Sharing/Viewing files is not supported on this device.",
        );
        return;
      }

      // Share/Open the temp file
      await Sharing.shareAsync(tempPdfUri, {
        mimeType: "application/pdf",
        dialogTitle: "Open Village Book",
        UTI: "com.adobe.pdf", // Important for iOS identifying it as a PDF
      });
    } catch (error) {
      console.error("Error opening book:", error);
      Alert.alert(
        "Error",
        "There was a problem opening the book. Please make sure to restart your Expo server (npx expo start -c) to reload the Metro bundler with PDF support.",
      );
    } finally {
      setIsDownloading(false);
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
            <Text style={styles.headerTitle}>
              {AppStrings.quickLinks.villageBook}
            </Text>
            <HindiLabel style={styles.headerHindi}>ग्राम निर्देशिका</HindiLabel>
          </View>
          <View style={styles.headerRight} />
        </SafeAreaView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Book Cover Design */}
        <View style={styles.coverWrapper}>
          <View style={styles.bookCover}>
            <View style={styles.bookBinding} />
            <View style={styles.coverContent}>
              <View style={styles.coverIconWrap}>
                <MaterialCommunityIcons
                  name="shield-home-outline"
                  size={48}
                  color={Colors.primary}
                />
              </View>
              <Text style={styles.coverTitle}>Painal Village</Text>
              <Text style={styles.coverSubtitle}>Official Book</Text>
              <View style={styles.coverDivider} />
              <HindiLabel style={styles.coverHindi}>पैनाल ग्राम</HindiLabel>
            </View>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>The Painal Book</Text>
          <HindiLabel style={styles.hindiTitle}>
            {Strings.hi.quickLinks.villageBook}
          </HindiLabel>

          <Text style={styles.description}>
            This book contains the historical records and detailed directories
            of the families residing in Painal.
          </Text>
        </View>

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleReadInApp}
            disabled={isDownloading}
            activeOpacity={0.8}
          >
            {isDownloading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <>
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={Colors.white}
                  style={styles.btnIcon}
                />
                <Text style={styles.btnText}>Read in App</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleDownloadAndRead}
            disabled={isDownloading}
            activeOpacity={0.8}
          >
            <Ionicons
              name="download-outline"
              size={18}
              color={Colors.primary}
              style={styles.btnIcon}
            />
            <Text style={styles.secondaryBtnText}>Share / Export PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Full Screen PDF Reader Modal */}
      <Modal
        visible={isReading}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsReading(false)}
      >
        <SafeAreaView style={styles.modalContainer} edges={["top", "bottom"]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setIsReading(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Village Book</Text>
            <View style={styles.headerRight} />
          </View>

          <View style={styles.pdfContainer}>
            {pdfUri && <FullPDFViewer uri={pdfUri} />}
          </View>
        </SafeAreaView>
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
    paddingBottom: 10,
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

  // Cover Design
  coverWrapper: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 32,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 4, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  bookCover: {
    width: width * 0.65,
    height: width * 0.9,
    backgroundColor: "#FDF2E9",
    borderRadius: 12,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  bookBinding: {
    width: 14,
    height: "100%",
    backgroundColor: Colors.primary,
    borderRightWidth: 1,
    borderRightColor: "rgba(0,0,0,0.1)",
  },
  coverContent: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  coverIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(232,168,56,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  coverTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.primary,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  coverSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginTop: 8,
  },
  coverDivider: {
    width: 40,
    height: 2,
    backgroundColor: Colors.accent,
    marginVertical: 16,
    borderRadius: 1,
  },
  coverHindi: {
    fontSize: 18,
    color: Colors.primary,
  },

  // Info Section
  infoSection: {
    paddingHorizontal: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    textAlign: "center",
  },
  hindiTitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.text,
    textAlign: "center",
    opacity: 0.8,
    marginBottom: 24,
  },

  // Meta Details
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.primary,
    marginLeft: 6,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },

  // Action Button
  actionContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnIcon: {
    marginRight: 8,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.white,
    letterSpacing: 0.3,
  },
  secondaryButton: {
    flexDirection: "row",
    backgroundColor: "transparent",
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(232,168,56,0.3)",
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.primary,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  closeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  closeText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
});
