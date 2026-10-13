// Figma: Toggle. 52 x 32pt. Off: bg/color-sunken track with a border/color-strong edge. On: bg/color-brand.
// The 24pt knob is bg/color-thumb and slides 20pt. React Native: Switch with trackColor and thumbColor from the theme.
import React from 'react';
import { Pressable, View } from '../rn';
import { useTheme, elevation } from '../theme';
import { motion } from '../theme/motion';

export default function Toggle({ on, onChange, accessibilityLabel, testID }) {
  const { c, reduceMotion } = useTheme();
  const t = reduceMotion ? 'none' : `transform ${motion.select.duration}ms ${motion.select.easing}, background-color ${motion.select.duration}ms`;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="switch"
      aria-checked={on}
      accessibilityLabel={accessibilityLabel}
      onPress={() => onChange(!on)}
      hitSlop={8}
      style={{ width: 52, height: 32, borderRadius: 999, padding: on ? 4 : 3, backgroundColor: c(on ? 'bg/color-brand' : 'bg/color-sunken'), borderWidth: on ? 0 : 1, borderColor: c('border/color-strong'), justifyContent: 'center', transition: t }}
    >
      <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: c('bg/color-thumb'), boxShadow: elevation.raised, transform: [{ translateX: on ? 20 : 0 }], transition: t }} />
    </Pressable>
  );
}
