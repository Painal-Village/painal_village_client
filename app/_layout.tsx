import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { NotoSansDevanagari_400Regular, NotoSansDevanagari_700Bold } from '@expo-google-fonts/noto-sans-devanagari';
import { NotoSerifDevanagari_400Regular, NotoSerifDevanagari_700Bold } from '@expo-google-fonts/noto-serif-devanagari';
import { AuthProvider } from '../context/AuthContext';

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
    </AuthProvider>
  );
}
