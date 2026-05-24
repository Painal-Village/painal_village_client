import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { NotoSansDevanagari_400Regular, NotoSansDevanagari_700Bold } from '@expo-google-fonts/noto-sans-devanagari';
import { NotoSerifDevanagari_400Regular, NotoSerifDevanagari_700Bold } from '@expo-google-fonts/noto-serif-devanagari';
import { AuthProvider } from '../context/AuthContext';
import Constants from 'expo-constants';
import { compareVersions } from '../utils/version';
import { ForceUpdateModal } from '../components/common/ForceUpdateModal';
import { useState } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'NotoSansDevanagari-Regular': NotoSansDevanagari_400Regular,
    'NotoSansDevanagari-Bold': NotoSansDevanagari_700Bold,
    'NotoSerifDevanagari-Regular': NotoSerifDevanagari_400Regular,
    'NotoSerifDevanagari-Bold': NotoSerifDevanagari_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      // Hide the native splash screen as we have our custom reanimated splash
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  const [updateRequired, setUpdateRequired] = useState(false);
  const [updateConfig, setUpdateConfig] = useState({ message: '', playStoreUrl: '' });

  useEffect(() => {
    const checkAppVersion = async () => {
      try {
        // Prevent caching by using a timestamp query param
        const url = `https://pxytwvgrvlaycdnljjht.supabase.co/storage/v1/object/public/painal_village/app_config.json?t=${Date.now()}`;
        const response = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
        if (response.ok) {
          const config = await response.json();
          // Fallback if running outside of managed workflow
          const currentVersion = Constants.expoConfig?.version || '1.0.0';
          
          if (config.minAndroidVersion && compareVersions(config.minAndroidVersion, currentVersion) > 0) {
            setUpdateConfig({
              message: config.forceUpdateMessage || 'A new version of Painal Village is available. Please update to continue using the app.',
              playStoreUrl: config.playStoreUrl || 'market://details?id=com.mohitxcodes.painal'
            });
            setUpdateRequired(true);
          }
        }
      } catch (e) {
        console.error('Failed to check app config:', e);
      }
    };
    
    checkAppVersion();
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="family/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="member/[id]" options={{ headerShown: false }} />
      </Stack>

      <ForceUpdateModal
        visible={updateRequired}
        message={updateConfig.message}
        playStoreUrl={updateConfig.playStoreUrl}
      />
    </AuthProvider>
  );
}
