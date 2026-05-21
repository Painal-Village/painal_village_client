import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { API_ENDPOINTS } from "../constants/api";
import { HindiLabel } from "../components/common/HindiLabel";
import { useRouter as useExpoRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const router = useExpoRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.authLogin, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Save user session via context
      await login(data);
      
      Alert.alert("Success", "Logged in successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.message || "An unexpected error occurred.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          {/* Logo / Illustration */}
          <View style={styles.brandContainer}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="shield-account"
                size={48}
                color={Colors.primary}
              />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <HindiLabel style={styles.hindiTitle}>
              वापसी पर स्वागत है
            </HindiLabel>
            <Text style={styles.subtitle}>
              Sign in to manage village directories and settings.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrap}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={Colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={Colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrap}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={Colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={Colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <Text style={styles.loginBtnText}>Log In</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color={Colors.white}
                    style={{ marginLeft: 8 }}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  brandContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(232, 168, 56, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: 0.5,
  },
  hindiTitle: {
    fontSize: 14,
    color: Colors.accentDark,
    marginTop: 4,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 54,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    height: "100%",
  },
  eyeBtn: {
    padding: 8,
  },
  loginBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
