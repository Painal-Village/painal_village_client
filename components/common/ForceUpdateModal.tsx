import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { Colors } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

interface ForceUpdateModalProps {
  visible: boolean;
  message: string;
  playStoreUrl: string;
}

export const ForceUpdateModal: React.FC<ForceUpdateModalProps> = ({
  visible,
  message,
  playStoreUrl,
}) => {
  const handleUpdate = () => {
    Linking.openURL(playStoreUrl).catch((err) =>
      console.error("Failed to open Play Store:", err)
    );
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* App Logo or Update Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="cloud-download" size={80} color={Colors.primary} />
          </View>

          <Text style={styles.title}>Update Required</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdate}
            activeOpacity={0.8}
          >
            <Ionicons
              name="logo-google-playstore"
              size={20}
              color={Colors.white}
              style={styles.btnIcon}
            />
            <Text style={styles.updateButtonText}>Update Now</Text>
          </TouchableOpacity>

          {Platform.OS === "ios" && (
            <Text style={styles.noteText}>
              Note: The iOS version may require an update through TestFlight or the App Store.
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 32,
    borderRadius: 24,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(232,168,56,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  updateButton: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: "100%",
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
  updateButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  noteText: {
    marginTop: 20,
    fontSize: 12,
    color: Colors.textLight,
    textAlign: "center",
  },
});
