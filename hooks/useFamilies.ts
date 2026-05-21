import { useState, useMemo } from 'react';
import { AppStrings } from '../constants/strings';

export const useFamilies = (searchQuery: string) => {
  const families = useMemo(() => {
    const allVillageFamily = {
      id: 'all',
      name: AppStrings.allVillage,
      hindiName: AppStrings.allVillage,
      headName: AppStrings.allVillageSub,
      members: [],
    };

    const combinedFamilies = [allVillageFamily];

    if (!searchQuery.trim()) {
      return combinedFamilies;
    }

    const query = searchQuery.toLowerCase();
    return combinedFamilies.filter(f => 
      f.name.toLowerCase().includes(query) || 
      f.hindiName.includes(query)
    );
  }, [searchQuery]);

  return { families };
};
