// Figma: Medallion (State Earned, In progress, Locked, Award. Size 40 to 96). The round badge for journey stages and
// badges. Earned: bg/color-accent-subtle with a 2pt border/color-accent ring (3pt from 96) and the full color Medallion
// art. In progress and Locked: bg/color-surface with a border/color-default ring and the grey copy of the art at 80%,
// so a badge never looks earned before it is. Locked adds a small lock. The art fills 62% of the circle. The name and
// status always sit next to it in words, so the state never relies on the picture or the color.
// The art is looked up by the icon id (MEDALLION_ART in data.js). An icon without art falls back to the Iconoir glyph.
import React from 'react';
import { View, Image } from '../rn';
import { useTheme } from '../theme';
import Icon from './Icon';
import { MEDALLION_ART } from '../data';

export default function Medallion({ icon, size = 64, state = 'earned', halo, testID, accessibilityLabel }) {
  const { c } = useTheme();
  const on = state === 'earned';
  const art = MEDALLION_ART[icon];
  const ring = size >= 96 ? 3 : 2;
  const disc = (
    <View
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      style={{
        width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center',
        backgroundColor: c(on ? 'bg/color-accent-subtle' : 'bg/color-surface'),
        borderWidth: ring, borderColor: c(on ? 'border/color-accent' : 'border/color-default'),
      }}
    >
      {art
        ? <Image source={on ? art.art : art.grey} resizeMode="contain" style={{ width: Math.round(size * 0.62), height: Math.round(size * 0.62), opacity: on ? 1 : 0.8 }} />
        : <Icon name={icon} size={Math.round(size * 0.5)} strokeWidth={size >= 96 ? 1.6 : 1.5} color={c(on ? 'icon/color-accent' : 'icon/color-secondary')} />}
      {state === 'locked' && (
        <View style={{ position: 'absolute', right: -2, bottom: -2, width: Math.max(20, size * 0.34), height: Math.max(20, size * 0.34), borderRadius: 999, backgroundColor: c('bg/color-surface'), alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="lock" size={Math.max(12, Math.round(size * 0.2))} color={c('icon/color-secondary')} />
        </View>
      )}
    </View>
  );
  if (!halo) return disc;
  // Award moments: two soft rings behind the medallion in the accent tint.
  const h = size * 1.75;
  return (
    <View style={{ width: h, height: h, alignItems: 'center', justifyContent: 'center' }}>
      <View className="fx-breathe" style={{ position: 'absolute', width: h, height: h, borderRadius: h / 2, backgroundColor: c('bg/color-accent-subtle'), opacity: 0.6 }} />
      <View style={{ position: 'absolute', width: size * 1.36, height: size * 1.36, borderRadius: size, backgroundColor: c('bg/color-accent-subtle') }} />
      {disc}
    </View>
  );
}
