import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Dimensions,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  DeviceEventEmitter,
} from "react-native";
import { Image } from "expo-image";
import Avatar from "../../components/common/Avatar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { HindiLabel } from "../../components/common/HindiLabel";
import { useAuth } from "../../context/AuthContext";
import { useMemberDetail } from "../../hooks/useMemberDetail";
import { PrimaryFamilyDTO } from "../../types/family";
import { formatBirthDate } from "../../utils/dateFormat";
import { toTitleCase } from "../../utils/stringFormat";
import { useRecentProfiles } from "../../hooks/useRecentProfiles";
import MemberDetailSkeleton from "../../components/skeletons/MemberDetailSkeleton";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { File } from "expo-file-system/next";
import { supabase } from "../../lib/supabase";
import { API_ENDPOINTS } from "../../constants/api";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PLACEHOLDER_AVATAR = (id: number) =>
  `https://api.dicebear.com/7.x/thumbs/png?seed=${id}&backgroundColor=dbeafe&size=200`;

export default function MemberDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const memberId = Number(id);

  const { member, parent, children, siblings, loading, error, refetch } =
    useMemberDetail(memberId);
  const { addRecentProfile } = useRecentProfiles();

  const [localAvatar, setLocalAvatar] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  // Edit Details State
  const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
  const [isSavingDetails, setIsSavingDetails] = React.useState(false);
  const [editName, setEditName] = React.useState("");
  const [editHindiName, setEditHindiName] = React.useState("");
  const [editBirthYear, setEditBirthYear] = React.useState("");

  // Add Child State
  const [isAddChildModalVisible, setIsAddChildModalVisible] =
    React.useState(false);
  const [isAddingChild, setIsAddingChild] = React.useState(false);
  const [newChildName, setNewChildName] = React.useState("");
  const [newChildHindiName, setNewChildHindiName] = React.useState("");
  const [newChildBirthYear, setNewChildBirthYear] = React.useState("");

  // Delete State
  const [isDeletingMember, setIsDeletingMember] = React.useState(false);

  // Action Sheet & Report State
  const [isActionSheetVisible, setIsActionSheetVisible] = React.useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = React.useState(false);

  // Report Form State
  const [reportEnglishName, setReportEnglishName] = React.useState(false);
  const [correctEnglishName, setCorrectEnglishName] = React.useState("");
  const [reportHindiName, setReportHindiName] = React.useState(false);
  const [correctHindiName, setCorrectHindiName] = React.useState("");
  const [reportDob, setReportDob] = React.useState(false);
  const [correctDob, setCorrectDob] = React.useState("");
  const [reportProfilePhoto, setReportProfilePhoto] = React.useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = React.useState(false);

  React.useEffect(() => {
    if (member) {
      addRecentProfile(member);
      setEditName(member.name || "");
      setEditHindiName(member.hindiName || "");
      setEditBirthYear(member.birthYear || "");
    }
  }, [member]);

  if (loading) {
    return <MemberDetailSkeleton onBack={() => router.back()} />;
  }

  if (error || !member) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorHeader}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.centerWrap}>
          <Text style={styles.emptyEmoji}>😔</Text>
          <Text style={styles.emptyTitle}>Member not found</Text>
          <HindiLabel style={styles.emptyHindi}>सदस्य नहीं मिला</HindiLabel>
        </View>
      </SafeAreaView>
    );
  }

  // Backend now returns full URLs; only fallback to placeholder if null
  const avatarUrl =
    localAvatar || member.profilePhoto || PLACEHOLDER_AVATAR(member.id);
  const hasChildren = children.length > 0;
  const hasParent = parent !== null;
  const hasSiblings = siblings.length > 0;

  const navigateToMember = (targetId: number) => {
    router.push(`/member/${targetId}`);
  };

  const handleEditAvatar = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission required",
          "Please allow access to your photo gallery to upload an avatar.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setUploading(true);
        const asset = result.assets[0];

        // Compress and resize image
        const manipResult = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 256 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.WEBP },
        );

        const fileName = `members/${memberId}.webp`;

        // Use expo-file-system v19 File class (implements Blob natively)
        const file = new File(manipResult.uri);
        const arrayBuffer = await file.arrayBuffer();

        // Try update first (replaces existing file), fallback to upload for new files
        let uploadError;
        const { error: updateError } = await supabase.storage
          .from("painal_village")
          .update(fileName, arrayBuffer, {
            contentType: "image/webp",
            cacheControl: "0",
          });

        if (updateError) {
          // File doesn't exist yet — do a fresh upload
          const { error: createError } = await supabase.storage
            .from("painal_village")
            .upload(fileName, arrayBuffer, {
              contentType: "image/webp",
              cacheControl: "0",
            });
          uploadError = createError;
        }

        if (uploadError) {
          throw uploadError;
        }

        // Save path to PostgreSQL via Spring Boot
        // const apiResponse = await fetch(
        //   API_ENDPOINTS.primaryFamilyAvatar(memberId),
        //   {
        //     method: "PATCH",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ avatarPath: fileName }),
        //   },
        // );

        // if (!apiResponse.ok) {
        //   throw new Error("Failed to save avatar path to database");
        // }

        // Clear the image cache
        await Image.clearMemoryCache();
        await Image.clearDiskCache();

        // Emit global event to trigger all Avatar components to bust their URL caches
        DeviceEventEmitter.emit('avatarUpdated', memberId);

        Alert.alert("Success", "Avatar updated successfully!");
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to update avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDetails = async () => {
    Alert.alert("Static Data", "Cannot save details in static mode.");
    /*
    if (!editName.trim() || !editHindiName.trim()) {
      Alert.alert("Validation Error", "Name and Hindi Name are required.");
      return;
    }

    try {
      setIsSavingDetails(true);
      const apiResponse = await fetch(
        API_ENDPOINTS.primaryFamilyDetails(memberId),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editName.trim(),
            hindiName: editHindiName.trim(),
            birthYear: editBirthYear.trim(),
          }),
        },
      );

      if (!apiResponse.ok) {
        throw new Error("Failed to save member details");
      }

      setIsEditModalVisible(false);
      await refetch();
      Alert.alert("Success", "Member details updated successfully!");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to update details");
    } finally {
      setIsSavingDetails(false);
    }
    */
  };

  const handleAddChild = async () => {
    if (!newChildName.trim() || !newChildBirthYear.trim()) {
      Alert.alert("Validation Error", "Name and Date of Birth are required.");
      return;
    }

    try {
      setIsAddingChild(true);
      const apiResponse = await fetch(API_ENDPOINTS.requestAddChild, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId,
          childName: newChildName.trim(),
          childDob: newChildBirthYear.trim(),
        }),
      });

      if (!apiResponse.ok) {
        throw new Error("Failed to submit request");
      }

      setIsAddChildModalVisible(false);
      // Reset form
      setNewChildName("");
      setNewChildBirthYear("");

      Alert.alert("Success", "Child request submitted successfully!");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to submit request");
    } finally {
      setIsAddingChild(false);
    }
  };

  const handleDeleteMember = async () => {
    Alert.alert("Static Data", "Cannot delete member in static mode.");
    /*
    // 1. Fast-fail validation: Do not allow deletion if the member has children.
    if (children && children.length > 0) {
      Alert.alert(
        "Delete Not Possible",
        "This member has children. You cannot delete a member who has children."
      );
      return;
    }

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this member? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeletingMember(true);
              const response = await fetch(
                API_ENDPOINTS.deletePrimaryFamilyMember(memberId),
                { method: "DELETE" }
              );

              if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to delete member");
              }

              Alert.alert("Success", "Member deleted successfully");
              router.back();
            } catch (err: any) {
              console.error("Failed to delete member", err);
              Alert.alert("Error", err.message || "Failed to delete member");
              setIsDeletingMember(false);
            }
          },
        },
      ]
    );
    */
  };

  const handleSubmitReport = async () => {
    if (!reportEnglishName && !reportHindiName && !reportDob && !reportProfilePhoto) {
      Alert.alert("Error", "Please select at least one incorrect detail to report.");
      return;
    }

    try {
      setIsSubmittingReport(true);
      const payload = {
        memberId,
        incorrectEnglishName: reportEnglishName,
        correctEnglishName: reportEnglishName ? correctEnglishName.trim() : null,
        incorrectHindiName: reportHindiName,
        correctHindiName: reportHindiName ? correctHindiName.trim() : null,
        incorrectDob: reportDob,
        correctDob: reportDob ? correctDob.trim() : null,
        incorrectProfilePhoto: reportProfilePhoto,
      };

      const apiResponse = await fetch(API_ENDPOINTS.reportMemberDetails, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!apiResponse.ok) {
        throw new Error("Failed to submit report");
      }

      Alert.alert("Success", "Your report has been submitted successfully!");
      setIsReportModalVisible(false);

      // Reset form
      setReportEnglishName(false);
      setCorrectEnglishName("");
      setReportHindiName(false);
      setCorrectHindiName("");
      setReportDob(false);
      setCorrectDob("");
      setReportProfilePhoto(false);

    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to submit report");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const renderRelationCard = (
    person: PrimaryFamilyDTO,
    relation: string,
    hindiRelation: string,
  ) => {
    return (
      <TouchableOpacity
        key={person.id}
        style={styles.relationCard}
        onPress={() => navigateToMember(person.id)}
        activeOpacity={0.7}
      >
        <Avatar url={person.profilePhoto} fallbackSeed={person.id} style={styles.relationAvatar} />
        <View style={styles.relationInfo}>

          <Text style={styles.relationName} numberOfLines={1}>
            {person.name}
          </Text>
          <HindiLabel style={styles.relationHindiName} numberOfLines={1}>
            {person.hindiName}
          </HindiLabel>

        </View>
        <View style={styles.relationBadge}>
          <Text style={styles.relationBadgeText}>{relation}</Text>
          <HindiLabel style={styles.relationBadgeHindi}>
            {hindiRelation}
          </HindiLabel>
        </View>
        <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with avatar */}
      <View style={styles.headerWrap}>
        <SafeAreaView edges={["top"]} style={styles.headerSafe}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Member Details</Text>
            <HindiLabel style={styles.headerHindi}>सदस्य विवरण</HindiLabel>
          </View>
          <View style={styles.headerRightActions}>
            <TouchableOpacity
              onPress={() => setIsActionSheetVisible(true)}
              style={styles.headerIconBtn}
            >
              <Ionicons name="ellipsis-vertical" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View style={styles.profileCardWrap}>
          <View style={styles.profileCard}>
            {/* Edit Details Button */}
            {/* {isAdmin && (
              <TouchableOpacity
                onPress={() => setIsEditModalVisible(true)}
                style={styles.editDetailsBtn}
              >
                <Ionicons name="pencil" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            )} */}

            <View style={styles.avatarSection}>
              <View style={styles.avatarRing}>
                <TouchableOpacity
                  onPress={() => setIsFullScreen(true)}
                  activeOpacity={0.8}
                >
                  <Avatar
                    url={localAvatar || member.profilePhoto}
                    fallbackSeed={member.id}
                    style={styles.profileAvatar}
                  />
                </TouchableOpacity>
                {uploading && (
                  <View style={styles.uploadingOverlay}>
                    <ActivityIndicator size="small" color={Colors.white} />
                  </View>
                )}
              </View>
              {isAdmin && (
                <TouchableOpacity
                  style={styles.editAvatarBtn}
                  onPress={handleEditAvatar}
                  disabled={uploading}
                >
                  <Ionicons name="camera" size={16} color={Colors.white} />
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.profileName}>{toTitleCase(member.name)}</Text>
            <HindiLabel style={styles.profileHindiName} weight="bold">
              {member.hindiName}
            </HindiLabel>

            {/* Birth Year Badge */}
            <View style={styles.idBadge}>
              <Ionicons
                name="calendar-outline"
                size={13}
                color={Colors.primary}
              />
              <Text style={styles.idBadgeText}>
                {formatBirthDate(member.birthYear)}
              </Text>
            </View>
          </View>
        </View>

        {/* Parent Section */}
        {hasParent && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="person-outline"
                size={18}
                color={Colors.primary}
              />
              <Text style={styles.sectionTitle}>Father</Text>
              <HindiLabel style={styles.sectionHindiTitle}>पिता</HindiLabel>
            </View>
            <View style={styles.sectionDivider} />
            {renderRelationCard(parent!, "Father", "पिता")}
          </View>
        )}

        {/* Children Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people-outline" size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>
              Children {hasChildren ? `(${children.length})` : ""}
            </Text>
            <HindiLabel style={styles.sectionHindiTitle}>संतान</HindiLabel>
          </View>
          <View style={styles.sectionDivider} />
          {hasChildren ? (
            children.map((child) => renderRelationCard(child, "Child", "संतान"))
          ) : (
            <View style={styles.emptySection}>
              <Text style={styles.emptySectionText}>No children</Text>
              <HindiLabel style={styles.emptySectionHindi}>
                कोई संतान नहीं
              </HindiLabel>
            </View>
          )}
        </View>

        {/* Siblings Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="git-branch-outline"
              size={18}
              color={Colors.primary}
            />
            <Text style={styles.sectionTitle}>
              Brothers {hasSiblings ? `(${siblings.length})` : ""}
            </Text>
            <HindiLabel style={styles.sectionHindiTitle}>भाई</HindiLabel>
          </View>
          <View style={styles.sectionDivider} />
          {hasSiblings ? (
            siblings.map((sibling) =>
              renderRelationCard(sibling, "Brother", "भाई"),
            )
          ) : (
            <View style={styles.emptySection}>
              <Text style={styles.emptySectionText}>No brothers</Text>
              <HindiLabel style={styles.emptySectionHindi}>
                कोई भाई नहीं
              </HindiLabel>
            </View>
          )}
        </View>

        {/* Bottom Spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Full Screen Avatar Modal */}
      <Modal
        visible={isFullScreen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsFullScreen(false)}
      >
        <View style={styles.fullScreenContainer}>
          <Avatar
            url={localAvatar || member.profilePhoto}
            fallbackSeed={member.id}
            style={styles.fullScreenImage}
            contentFit="contain"
          />
          <TouchableOpacity
            style={styles.fullScreenCloseBtn}
            onPress={() => setIsFullScreen(false)}
          >
            <Ionicons name="close" size={32} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Edit Details Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity
            style={styles.bottomSheetBackdrop}
            activeOpacity={1}
            onPress={() => setIsEditModalVisible(false)}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.bottomSheetContainer}
          >
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Edit Details</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Ionicons
                  name="close-circle"
                  size={28}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.bottomSheetContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>English Name</Text>
                <TextInput
                  style={styles.input}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Enter english name"
                  placeholderTextColor={Colors.textLight}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Hindi Name</Text>
                <TextInput
                  style={styles.input}
                  value={editHindiName}
                  onChangeText={setEditHindiName}
                  placeholder="Enter hindi name"
                  placeholderTextColor={Colors.textLight}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date of Birth</Text>
                <TextInput
                  style={styles.input}
                  value={editBirthYear}
                  onChangeText={setEditBirthYear}
                  placeholder="e.g. 15/08/1995"
                  keyboardType="default"
                  placeholderTextColor={Colors.textLight}
                  maxLength={10}
                />
              </View>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveDetails}
                disabled={isSavingDetails}
              >
                {isSavingDetails ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Add Child Modal */}
      <Modal
        visible={isAddChildModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsAddChildModalVisible(false)}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity
            style={styles.bottomSheetBackdrop}
            activeOpacity={1}
            onPress={() => setIsAddChildModalVisible(false)}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.bottomSheetContainer}
          >
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle} numberOfLines={2}>Request to add a child for {toTitleCase(member.name)}</Text>
              <TouchableOpacity
                onPress={() => setIsAddChildModalVisible(false)}
              >
                <Ionicons
                  name="close-circle"
                  size={28}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.bottomSheetContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Child's Name</Text>
                <TextInput
                  style={styles.input}
                  value={newChildName}
                  onChangeText={setNewChildName}
                  placeholder="Enter name"
                  placeholderTextColor={Colors.textLight}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date of Birth</Text>
                <TextInput
                  style={styles.input}
                  value={newChildBirthYear}
                  onChangeText={setNewChildBirthYear}
                  placeholder="e.g. 15/08/2010"
                  keyboardType="default"
                  placeholderTextColor={Colors.textLight}
                  maxLength={10}
                />
              </View>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleAddChild}
                disabled={isAddingChild}
              >
                {isAddingChild ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.saveBtnText}>Submit Request</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Action Sheet Modal */}
      <Modal
        visible={isActionSheetVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsActionSheetVisible(false)}
      >
        <TouchableOpacity
          style={styles.actionSheetOverlay}
          activeOpacity={1}
          onPress={() => setIsActionSheetVisible(false)}
        >
          <View style={styles.actionSheetContainer}>
            <View style={styles.actionSheetIndicator} />
            <TouchableOpacity
              style={styles.actionSheetOption}
              onPress={() => {
                setIsActionSheetVisible(false);
                setIsReportModalVisible(true);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="warning-outline" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.actionSheetText}>Report Incorrect {toTitleCase(member.name)} Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionSheetOption}
              onPress={() => {
                setIsActionSheetVisible(false);
                setIsAddChildModalVisible(true);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="person-add-outline" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.actionSheetText}>Request to Add Child of {toTitleCase(member.name)}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Report Modal */}
      <Modal
        visible={isReportModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsReportModalVisible(false)}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity
            style={styles.bottomSheetBackdrop}
            activeOpacity={1}
            onPress={() => setIsReportModalVisible(false)}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.bottomSheetContainer}
          >
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Report Incorrect Details</Text>
              <TouchableOpacity onPress={() => setIsReportModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.bottomSheetContent}>
              <Text style={styles.reportSubtitle}>Select the details that are incorrect and provide the correct information:</Text>

              {/* English Name Checkbox */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setReportEnglishName(!reportEnglishName)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={reportEnglishName ? "checkbox" : "square-outline"}
                  size={24}
                  color={reportEnglishName ? Colors.primary : Colors.textMuted}
                />
                <Text style={styles.checkboxText}>English Name is incorrect</Text>
              </TouchableOpacity>
              {reportEnglishName && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Correct English Name</Text>
                  <TextInput
                    style={styles.input}
                    value={correctEnglishName}
                    onChangeText={setCorrectEnglishName}
                    placeholder="Enter correct name"
                    placeholderTextColor={Colors.textLight}
                  />
                </View>
              )}

              {/* Hindi Name Checkbox */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setReportHindiName(!reportHindiName)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={reportHindiName ? "checkbox" : "square-outline"}
                  size={24}
                  color={reportHindiName ? Colors.primary : Colors.textMuted}
                />
                <Text style={styles.checkboxText}>Hindi Name is incorrect</Text>
              </TouchableOpacity>
              {reportHindiName && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Correct Hindi Name</Text>
                  <TextInput
                    style={styles.input}
                    value={correctHindiName}
                    onChangeText={setCorrectHindiName}
                    placeholder="Enter correct hindi name"
                    placeholderTextColor={Colors.textLight}
                  />
                </View>
              )}

              {/* DOB Checkbox */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setReportDob(!reportDob)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={reportDob ? "checkbox" : "square-outline"}
                  size={24}
                  color={reportDob ? Colors.primary : Colors.textMuted}
                />
                <Text style={styles.checkboxText}>Date of Birth is incorrect</Text>
              </TouchableOpacity>
              {reportDob && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Correct Date of Birth</Text>
                  <TextInput
                    style={styles.input}
                    value={correctDob}
                    onChangeText={setCorrectDob}
                    placeholder="e.g. 15/08/1995"
                    placeholderTextColor={Colors.textLight}
                  />
                </View>
              )}

              {/* Profile Photo Checkbox */}
              <TouchableOpacity
                style={[styles.checkboxRow, { marginBottom: 20 }]}
                onPress={() => setReportProfilePhoto(!reportProfilePhoto)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={reportProfilePhoto ? "checkbox" : "square-outline"}
                  size={24}
                  color={reportProfilePhoto ? Colors.primary : Colors.textMuted}
                />
                <Text style={styles.checkboxText}>Profile Photo is incorrect</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSubmitReport}
                disabled={isSubmittingReport}
              >
                {isSubmittingReport ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.saveBtnText}>Submit Report</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
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
  scrollContent: {
    paddingBottom: 20,
  },

  // Loading & Error
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorHeader: {
    backgroundColor: Colors.primary,
    padding: 20,
  },
  centerWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  emptyHindi: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
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
    flex: 1,
    marginLeft: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.white,
    letterSpacing: 0.3,
  },
  headerHindi: {
    fontSize: 13,
    color: Colors.accentLight,
    marginTop: 1,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconBtnDanger: {
    backgroundColor: "rgba(255,59,48,0.2)",
  },
  headerRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  // Full Screen Modal
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenCloseBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 25,
  },
  fullScreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },

  // Profile Card
  profileCardWrap: {
    marginTop: -1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    position: "relative",
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  editDetailsBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  avatarSection: {
    marginBottom: 16,
  },
  avatarRing: {
    width: 108,
    height: 108,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: Colors.accent,
    padding: 3,
  },
  profileAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    resizeMode: "cover",
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: -6,
    right: -6,
    backgroundColor: Colors.accent,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: 0.3,
    textAlign: "center",

  },
  profileHindiName: {
    fontSize: 18,
    color: Colors.textMuted,
    marginTop: 4,
    textAlign: "center",
  },
  idBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "rgba(92, 64, 51, 0.06)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
  },
  idBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
    letterSpacing: 0.5,
  },

  // Section Card
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 18,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
  },
  sectionHindiTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textMuted,
    marginLeft: 4,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 14,
  },

  // Info Rows
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  infoIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(92, 64, 51, 0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  infoTextWrap: {
    flex: 1,
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
    fontWeight: "600",
    color: Colors.text,
  },

  // Relation Cards
  relationCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  relationAvatar: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    marginRight: 12,
  },
  relationInfo: {
    flex: 1,
  },
  relationName: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "700",
  },
  relationHindiName: {
    fontSize: 16,
    color: Colors.textMuted,
    fontWeight: "600",
    marginTop: 2,
  },
  relationBadge: {
    alignItems: "center",
    backgroundColor: "rgba(232, 168, 56, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  relationBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.accentDark,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  relationBadgeHindi: {
    fontSize: 9,
    color: Colors.accentDark,
  },

  // Empty Section
  emptySection: {
    alignItems: "center",
    paddingVertical: 16,
  },
  emptySectionEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  emptySectionText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textMuted,
  },
  emptySectionHindi: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },

  // Bottom Sheet Drawer
  bottomSheetOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  bottomSheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheetContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  bottomSheetContent: {
    paddingBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textMuted,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
  },

  // Action Sheet
  actionSheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  actionSheetContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  actionSheetIndicator: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  actionSheetOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(232, 168, 56, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  actionSheetText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: "600",
  },

  // Report form
  reportSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 20,
    lineHeight: 20,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkboxText: {
    fontSize: 15,
    color: Colors.text,
    marginLeft: 10,
  },
});
