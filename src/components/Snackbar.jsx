// Figma: Snackbar. Always dark (bg/color-toast), colored Solid icon, white Body M Bold, no buttons.
// Floats 16pt above the tab bar or the bottom bar, centered. Goes away on its own.
import React from 'react';
import { View, Text } from '../rn';
import { useTheme, type, elevation, primitives } from '../theme';
import Icon from './Icon';

const TONES = {
  success: { icon: 'check-circle', color: primitives['success/40'] },
  info: { icon: 'info-circle', color: primitives['info/40'] },
  error: { icon: 'warning-circle', color: primitives['error/40'] },
};

export default function Snackbar({ message, tone = 'success' }) {
  const { c } = useTheme();
  const t = TONES[tone];
  return (
    <View testID="snackbar" style={{ flexDirection: 'row', alignItems: 'center', gap: 12, height: 50, paddingLeft: 16, paddingRight: 20, borderRadius: 999, backgroundColor: c('bg/color-toast'), boxShadow: elevation.overlay, maxWidth: 370 }}>
      <Icon name={t.icon} solid size={24} color={t.color} />
      <Text numberOfLines={1} style={[type('BodyM', 'bold'), { color: primitives['neutral/0'] }]}>{message}</Text>
    </View>
  );
}
