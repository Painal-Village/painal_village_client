import { Tabs } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Strings } from '../../constants/strings';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  // On old Android 3-button nav: insets.bottom ~48; gesture nav: ~20-34; iOS notch: ~34
  const bottomPadding = Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.primary,
          borderTopWidth: 0,
          paddingBottom: bottomPadding,
          paddingTop: 8,
          height: 64 + bottomPadding,
          shadowColor: Colors.primaryDark,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.inactiveTab,
        tabBarLabelStyle: {
          fontFamily: 'NotoSansDevanagari-Regular',
          fontSize: 11,
          marginTop: 2,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: Strings.en.tabs.home,
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.activeIconWrap]}>
              <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="families"
        options={{
          title: Strings.en.tabs.families,
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.activeIconWrap]}>
              <Ionicons name={focused ? "people" : "people-outline"} size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: Strings.en.tabs.about,
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.activeIconWrap]}>
              <Ionicons name={focused ? "information-circle" : "information-circle-outline"} size={22} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconWrap: {
    backgroundColor: 'rgba(232, 168, 56, 0.15)',
  },
});
