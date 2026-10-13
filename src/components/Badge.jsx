// Figma: Badge. Tone Success, Warning, Error, Info, Accent, Neutral. Emphasis Subtle or Solid. 28pt pill, not tappable.
// Left padding is 8 next to an icon and 12 without one. The Sponsored label on Home is Accent, Subtle, no icon.
import React from 'react';
import { View, Text } from '../rn';
import { useTheme, type } from '../theme';
import Icon from './Icon';

export default function Badge({ label, tone = 'accent', emphasis = 'subtle', icon, testID }) {
  const { c } = useTheme();
  const neutral = tone === 'neutral';
  const look = emphasis === 'solid'
    ? { bg: neutral ? 'bg/color-inverse' : `bg/color-${tone}`, fg: neutral ? 'text/color-inverse' : tone === 'accent' ? 'text/color-on-accent' : 'text/color-on-status' }
    : { bg: neutral ? 'bg/color-surface' : `bg/color-${tone}-subtle`, fg: neutral ? 'text/color-secondary' : `text/color-${tone}`, icon: neutral ? 'icon/color-secondary' : `icon/color-${tone}` };
  return (
    <View testID={testID} style={{ alignSelf: 'flex-start', height: 28, borderRadius: 999, paddingLeft: icon ? 8 : 12, paddingRight: 12, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: c(look.bg) }}>
      {icon && <Icon name={icon} solid size={16} color={c(look.icon || look.fg)} />}
      <Text style={[type('Caption', 'bold'), { color: c(look.fg) }]}>{label}</Text>
    </View>
  );
}
