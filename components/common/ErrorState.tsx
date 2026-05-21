import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";

interface ErrorStateProps {
  /** Main error title */
  title?: string;
  /** Hindi / secondary message */
  subtitle?: string;
  /** Detailed error message */
  message?: string;
  /** Called when the user taps "Try Again" */
  onRetry?: () => void;
  /** Icon name from Ionicons */
  icon?: keyof typeof Ionicons.glyphMap;
}

/**
 * Full-screen error state with a retry button.
 * Used when an API call fails due to network issues or server errors.
 */
export default function ErrorState({
  title = "Unable to Load",
  subtitle = "डेटा लोड करने में असमर्थ",
  message = "Please check your internet connection and try again.",
  onRetry,
  icon = "cloud-offline-outline",
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      {/* Header to match the screen's look */}
      <View style={styles.headerWrap}>
        <SafeAreaView edges={["top"]} style={styles.headerSafe}>
          <Text style={styles.headerTitle}>Families</Text>
          <Text style={styles.headerHindi}>परिवार</Text>
        </SafeAreaView>
      </View>

      {/* Error content */}
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={48} color={Colors.textMuted} />
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.messageBubble}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={Colors.textLight}
            style={{ marginRight: 8, marginTop: 1 }}
          />
          <Text style={styles.message}>{message}</Text>
        </View>

        {onRetry && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={onRetry}
            activeOpacity={0.8}
            accessibilityLabel="Retry loading"
          >
            <Ionicons
              name="reload"
              size={18}
              color={Colors.white}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.hint}>
          If the problem persists, check your Wi-Fi or mobile data.
        </Text>
      </View>
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

  // Content
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 36,
    paddingBottom: 60,
  },

  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textMuted,
    textAlign: "center",
    marginBottom: 20,
  },

  messageBubble: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 28,
    maxWidth: 320,
  },
  message: {
    flex: 1,
    fontSize: 13,
    color: Colors.textLight,
    lineHeight: 19,
  },

  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 20,
  },
  retryText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.white,
    letterSpacing: 0.3,
  },

  hint: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 17,
  },
});
