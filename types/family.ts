export interface Member {
  id: string;
  name: string;
  hindiName: string;
  dob: string; // ISO format: YYYY-MM-DD
  role: string;
  hindiRole: string;
  avatarSeed: string;
  gender: 'Male' | 'Female' | 'Other';
}

export interface Family {
  id: string;
  name: string;
  hindiName: string;
  headName: string;
  members: Member[];
}

export interface PrimaryFamilyDTO {
  id: number;
  parentId: number | null;
  parentName: string | null;
  name: string;
  hindiName: string;
  birthYear: string;
  profilePhoto: string | null;
  hasChildren: boolean;
  lastUpdated: string;
}
