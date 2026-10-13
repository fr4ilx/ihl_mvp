// Figma: Category tile (Selected: No, Yes). The four broad categories at the top of Directory, two to a row with a
// 12pt gap, styled like the listing cards under them: a 72pt tile on bg/color-surface-raised, radius/20, Elevation/Card
// and no edge,
// a 40pt bg/color-brand-subtle circle with the icon in icon/color-brand, then the label in Body S Medium, which may
// wrap to three lines, and the tile grows to fit it. Selected fills the tile with bg/color-selected, a 2pt border/color-brand edge, the circle in
// bg/color-brand with the icon in icon/color-on-brand and the label in Bold, so the state never rests on color alone.
// On a category page the same tiles hold its subcategories. Tapping the selected tile again shows every place.
import React from 'react';
import { View, Text, Pressable, Image } from '../rn';
import { useTheme, type, elevation } from '../theme';
import Icon from './Icon';
import { CATEGORY_ART } from '../data';

export const CATEGORY_ICONS = { 'Holistic Business': 'user-love', Food: 'apple-fruit', Shop: 'shop', Services: 'tools' };

// art: a watercolor in place of the icon circle, 48pt with no circle. The four categories have one so far.
export default function CategoryTile({ label, icon, art = CATEGORY_ART[label], selected, onPress, testID }) {
  const { c } = useTheme();
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={({ pressed }) => [
        {
          flex: 1, minHeight: 72, paddingHorizontal: selected ? 10 : 12, paddingVertical: selected ? 10 : 12, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 12,
          backgroundColor: c(selected ? 'bg/color-selected' : 'bg/color-surface-raised'), boxShadow: elevation.card,
          ...(selected ? { borderWidth: 2, borderColor: c('border/color-brand') } : {}),
        },
        pressed && { transform: [{ scale: 0.97 }] },
      ]}
    >
      {art ? (
        <Image source={art} resizeMode="contain" accessibilityIgnoresInvertColors style={{ width: 48, height: 48 }} />
      ) : (
      <View style={{ width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: c(selected ? 'bg/color-brand' : 'bg/color-brand-subtle') }}>
        <Icon name={icon || CATEGORY_ICONS[label]} size={24} color={c(selected ? 'icon/color-on-brand' : 'icon/color-brand')} />
      </View>
      )}
      <Text numberOfLines={3} style={[type('BodyS', selected ? 'bold' : 'medium'), { color: c('text/color-primary'), flex: 1 }]}>{label}</Text>
    </Pressable>
  );
}

// Tiles two to a row. items: [{ label, icon }]. Directory's four categories by default.
export function CategoryTiles({ items = Object.keys(CATEGORY_ICONS).map((k) => ({ label: k, icon: CATEGORY_ICONS[k] })), value, onPick, testPrefix = 'category-tile' }) {
  const rows = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
  return (
    <View testID={`${testPrefix}s`} style={{ gap: 12 }}>
      {rows.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row', gap: 12 }}>
          {row.map((it) => <CategoryTile key={it.label} testID={`${testPrefix}-${it.label}`} label={it.label} icon={it.icon} selected={value === it.label} onPress={() => onPick(value === it.label ? null : it.label)} />)}
          {row.length === 1 && <View style={{ flex: 1 }} />}
        </View>
      ))}
    </View>
  );
}
