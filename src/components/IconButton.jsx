// Figma: Icon button. Style Outline, Filled, Tinted, Glass. 48pt circle. On a sheet Outline is a tonal circle with no edge.
// Glass uses a backdrop blur. In React Native wrap it in expo-blur <BlurView intensity={40} tint="systemChromeMaterial">.
import React from 'react';
import { Pressable, StyleSheet } from '../rn';
import { useTheme, elevation, useRaised, useOnSheet } from '../theme';
import { motion } from '../theme/motion';
import Icon from './Icon';

export default function IconButton({ icon, solid, variant = 'outline', onPress, disabled, accessibilityLabel, size = 48, iconSize = 24, style, color, testID, className }) {
  const { c } = useTheme();
  const raised = useRaised();
  const onSheet = useOnSheet();
  const v = {
    outline: { bg: c(raised), fg: c('icon/color-primary'), border: onSheet ? null : c('border/color-control'), bw: 1.5 },
    filled: { bg: c('bg/color-button-primary'), fg: c('text/color-on-button-primary') },
    tinted: { bg: c('bg/color-brand-subtle'), fg: c('icon/color-brand') },
    glass: { bg: c('bg/color-glass'), fg: c('icon/color-primary'), border: c('border/color-glass'), bw: 1, glass: true },
  }[variant];
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      className={className}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size, backgroundColor: disabled ? c('bg/color-surface') : v.bg },
        v.border && { borderWidth: v.bw, borderColor: v.border },
        v.glass && { backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', boxShadow: elevation.glass },
        pressed && { transform: [{ scale: 0.92 }] },
        style,
      ]}
    >
      <Icon name={icon} solid={solid} size={iconSize} color={disabled ? c('text/color-disabled') : color || v.fg} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
});
