import { useMemo } from 'react';
import { familiesData } from '../data/families';
import { AppStrings } from '../constants/strings';

export const useFamily = (id: string | string[]) => {
  const familyId = Array.isArray(id) ? id[0] : id;

  const family = useMemo(() => {
    if (familyId === 'all') {
      const allMembers = familiesData.flatMap(f => 
        f.members.map(m => ({ ...m, familyName: f.name, familyHindiName: f.hindiName }))
      );
      return {
        id: 'all',
        name: AppStrings.allVillage,
        hindiName: AppStrings.allVillage,
        headName: AppStrings.allVillageSub,
        members: allMembers as any,
      };
    }
    return familiesData.find(f => f.id === familyId);
  }, [familyId]);

  return { family };
};
