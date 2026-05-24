import React, { useState, useEffect } from 'react';
import { Image, ImageProps } from 'expo-image';
import { StyleProp, ImageStyle, DeviceEventEmitter } from 'react-native';

interface AvatarProps extends Omit<ImageProps, 'source' | 'style'> {
  url: string | null | undefined;
  fallbackSeed: string | number;
  style?: StyleProp<ImageStyle>;
}

export default function Avatar({ url, fallbackSeed, style, ...props }: AvatarProps) {
  const [error, setError] = useState(false);
  const [cacheBuster, setCacheBuster] = useState<number | null>(null);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('avatarUpdated', (updatedMemberId) => {
      if (String(updatedMemberId) === String(fallbackSeed)) {
        setCacheBuster(Date.now());
        setError(false); // Reset error state so it tries loading the newly uploaded image
      }
    });

    return () => {
      subscription.remove();
    };
  }, [fallbackSeed]);

  const fallbackUrl = `https://api.dicebear.com/7.x/thumbs/png?seed=${fallbackSeed}&backgroundColor=dbeafe&size=120`;

  let sourceUrl = (url && !error) ? url : fallbackUrl;
  
  if (cacheBuster && sourceUrl !== fallbackUrl) {
    sourceUrl = `${sourceUrl}?t=${cacheBuster}`;
  }

  return (
    <Image
      source={{ uri: sourceUrl }}
      style={style}
      onError={() => setError(true)}
      cachePolicy="disk"
      transition={200}
      contentFit="cover"
      {...props}
    />
  );
}
