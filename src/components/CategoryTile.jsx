// Figma: Category tile (Selected: No, Yes). The four broad categories at the top of Directory, two to a row with a
// 12pt gap: a 72pt tile on bg/color-surface-raised, radius/16, a soft border/color-control-subtle edge in Light only,
// a 40pt bg/color-brand-subtle circle with the icon in icon/color-brand, then the label in Body S Medium, which may
// wrap to two lines. Selected fills the tile with bg/color-selected, a 2pt border/color-brand edge, the circle in
// bg/color-brand with the icon in icon/color-on-brand and the label in Bold, so the state never rests on color alone.
// Tapping the selected tile again shows every place.
import React from 'react';
import { View, Text, Pressable } from '../rn';
import { useTheme, type } from '../theme';
import Icon from './Icon';

export const CATEGORY_ICONS = { 'Holistic Business': 'user-love', Food: 'apple-fruit', Shop: 'shop', Services: 'tools' };

export default function CategoryTile({ label, selected, onPress, testID }) {
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
          flex: 1, minHeight: 72, paddingHorizontal: selected ? 11 : 12, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 12,
          backgroundColor: c(selected ? 'bg/color-selected' : 'bg/color-surface-raised'),
          borderWidth: selected ? 2 : 1, borderColor: c(selected ? 'border/color-brand' : 'border/color-control-subtle'),
        },
        pressed && { transform: [{ scale: 0.97 }] },
      ]}
    >
      <View style={{ width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: c(selected ? 'bg/color-brand' : 'bg/color-brand-subtle') }}>
        <Icon name={CATEGORY_ICONS[label]} size={24} color={c(selected ? 'icon/color-on-brand' : 'icon/color-brand')} />
      </View>
      <Text numberOfLines={2} style={[type('BodyS', selected ? 'bold' : 'medium'), { color: c('text/color-primary'), flex: 1 }]}>{label}</Text>
    </Pressable>
  );
}

// The 2 by 2 grid of tiles.
export function CategoryTiles({ value, onPick }) {
  const keys = Object.keys(CATEGORY_ICONS);
  const tile = (k) => <CategoryTile key={k} testID={`category-tile-${k}`} label={k} selected={value === k} onPress={() => onPick(value === k ? 'All' : k)} />;
  return (
    <View testID="category-tiles" style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 12 }}>{keys.slice(0, 2).map(tile)}</View>
      <View style={{ flexDirection: 'row', gap: 12 }}>{keys.slice(2).map(tile)}</View>
    </View>
  );
}
