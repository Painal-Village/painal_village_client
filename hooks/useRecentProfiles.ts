import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrimaryFamilyDTO } from '../types/family';

export interface RecentProfile {
  id: number;
  name: string;
  hindiName: string;
  profilePhoto: string | null;
  timestamp: number;
}

const RECENT_PROFILES_KEY = '@recent_profiles';

export const useRecentProfiles = () => {
  const [recentProfiles, setRecentProfiles] = useState<RecentProfile[]>([]);

  const loadRecentProfiles = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_PROFILES_KEY);
      if (stored) {
        setRecentProfiles(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load recent profiles', e);
    }
  }, []);

  useEffect(() => {
    loadRecentProfiles();
  }, [loadRecentProfiles]);

  const addRecentProfile = async (member: PrimaryFamilyDTO) => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_PROFILES_KEY);
      let profiles: RecentProfile[] = stored ? JSON.parse(stored) : [];

      // Remove if already exists to move to top
      profiles = profiles.filter(p => p.id !== member.id);

      // Add to top
      profiles.unshift({
        id: member.id,
        name: member.name,
        hindiName: member.hindiName,
        profilePhoto: member.profilePhoto,
        timestamp: Date.now(),
      });

      // Keep only top 4
      if (profiles.length > 4) {
        profiles = profiles.slice(0, 4);
      }

      await AsyncStorage.setItem(RECENT_PROFILES_KEY, JSON.stringify(profiles));
      setRecentProfiles(profiles);
    } catch (e) {
      console.error('Failed to save recent profile', e);
    }
  };

  const clearRecentProfiles = async () => {
    try {
      await AsyncStorage.removeItem(RECENT_PROFILES_KEY);
      setRecentProfiles([]);
    } catch (e) {
      console.error('Failed to clear recent profiles', e);
    }
  };

  return { recentProfiles, addRecentProfile, loadRecentProfiles, clearRecentProfiles };
};
