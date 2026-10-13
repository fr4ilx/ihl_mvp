// Figma: Button. Hierarchy Primary, Secondary, Tertiary, Destructive. Size Large 56pt, Medium 48pt.
// Primary is the brand turquoise with white text. Secondary is white with a Light Grey Turquoise edge and a turquoise
// label in Light, the deep turquoise fill in Dark (bg/color-button-*, border/color-button-secondary). The brand guide
// keeps Light Grey Turquoise for fills and inactive states, so a button filled with it read as disabled.
import React from 'react';
import { Pressable, Text, View, StyleSheet } from '../rn';
import { useTheme, type } from '../theme';
import { motion } from '../theme/motion';
import Icon from './Icon';

export default function Button({ label, hierarchy = 'primary', size = 'large', leadingIcon, trailingIcon, disabled, onPress, fill, style, testID }) {
  const { c } = useTheme();
  const h = size === 'large' ? 56 : 48;
  const look = {
    primary: { bg: c('bg/color-button-primary'), fg: c('text/color-on-button-primary'), border: null },
    secondary: { bg: c('bg/color-button-secondary'), fg: c('text/color-on-button-secondary'), border: c('border/color-button-secondary') },
    tertiary: { bg: 'transparent', fg: c('text/color-link'), border: null },
    destructive: { bg: c('bg/color-error'), fg: c('text/color-on-status'), border: null },
  }[hierarchy];
  const off = disabled && {
    bg: hierarchy === 'tertiary' ? 'transparent' : c('bg/color-surface'),
    fg: c('text/color-disabled'),
    border: null,
  };
  const L = off || look;
  return (
    <Pressable
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        { height: h, backgroundColor: L.bg, paddingHorizontal: size === 'large' ? 24 : 20 },
        L.border && { borderWidth: 1.5, borderColor: L.border },
        fill && { alignSelf: 'stretch' },
        pressed && { transform: [{ scale: motion.press.scale }], opacity: hierarchy === 'tertiary' ? 0.6 : 1 },
        style,
      ]}
    >
      {leadingIcon && <Icon name={leadingIcon} size={size === 'large' ? 24 : 20} color={L.fg} />}
      <Text style={[type(size === 'large' ? 'BodyM' : 'BodyS', 'bold'), { color: L.fg }]}>{label}</Text>
      {trailingIcon && <Icon name={trailingIcon} size={size === 'large' ? 24 : 20} color={L.fg} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 999, alignSelf: 'flex-start' },
});
