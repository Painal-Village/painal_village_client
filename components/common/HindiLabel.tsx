import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface HindiLabelProps extends TextProps {
  children: React.ReactNode;
  weight?: 'regular' | 'bold';
}

export const HindiLabel: React.FC<HindiLabelProps> = ({ children, weight = 'regular', style, ...props }) => {
  const fontFamily = weight === 'bold' ? 'NotoSansDevanagari-Bold' : 'NotoSansDevanagari-Regular';
  
  return (
    <Text style={[styles.text, { fontFamily }, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    // Default styles, if any
  }
});
