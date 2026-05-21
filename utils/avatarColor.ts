import { Colors } from '../constants/colors';

export const getDeterministicAvatarColor = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % Colors.avatarBackgrounds.length;
  return Colors.avatarBackgrounds[index];
};
