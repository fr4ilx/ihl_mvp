// Figma: Category tile (Selected: No, Yes). The four broad categories at the top of Directory, two to a row with a
// 12pt gap, styled like the listing cards under them: a 72pt tile on bg/color-surface-raised, radius/20, Elevation/Card
// and no edge,
// a 40pt bg/color-brand-subtle circle with the icon in icon/color-brand, then the label in Body S Medium, which may
// wrap to three lines (four with a watercolor), and the tile grows to fit it. Selected fills the tile with bg/color-selected, a 2pt border/color-brand edge, the circle in
// bg/color-brand with the icon in icon/color-on-brand and the label in Bold, so the state never rests on color alone.
// On a category page the same tiles hold its subcategories. Tapping the selected tile again shows every place.
import React from 'react';
import { View, Text, Pressable, Image } from '../rn';
import { useTheme, type, elevation } from '../theme';
import Icon from './Icon';
import { CATEGORY_ART } from '../data';

export const CATEGORY_ICONS = { 'Holistic Business': 'user-love', Food: 'apple-fruit', Shop: 'shop', Services: 'tools' };

// art or thumb: a watercolor instead of the card. Just the painting with its name under it (see below).
export default function CategoryTile({ label, icon, thumb, art = thumb ? undefined : CATEGORY_ART[label], selected, onPress, testID }) {
  const { c } = useTheme();
  const pic = art || thumb;
  // With a watercolor the tile is just the art centered with its name under it, on the canvas with no card or wash.
  // Selected is the only time it gets a surface: bg/color-selected with a 2pt border/color-brand edge and a Bold name.
  // Four to a row like a Yelp category grid: 72pt art over the name in Caption Bold, up to four lines.
  if (pic) {
    return (
      <Pressable
        testID={testID}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        accessibilityLabel={label}
        style={({ pressed }) => [
          {
            flex: 1, paddingVertical: 8, paddingHorizontal: 0, borderRadius: 16, alignItems: 'center', gap: 4,
            ...(selected ? { backgroundColor: c('bg/color-selected'), borderWidth: 2, borderColor: c('border/color-brand'), paddingVertical: 6, paddingHorizontal: 0 } : {}),
          },
          pressed && { transform: [{ scale: 0.97 }] },
        ]}
      >
        <Image source={pic} resizeMode="contain" accessibilityIgnoresInvertColors style={{ width: 72, height: 72, marginBottom: 0 }} />
        <Text numberOfLines={4} style={[type('Caption', 'bold'), { color: c('text/color-primary'), textAlign: 'center' }]}>{label}</Text>
      </Pressable>
    );
  }
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={({ pressed }) => [
        {
          flex: 1, minHeight: 72, paddingHorizontal: selected ? 10 : 12, paddingVertical: selected ? 10 : 12, borderRadius: 20,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
          backgroundColor: c(selected ? 'bg/color-selected' : 'bg/color-surface-raised'), boxShadow: elevation.card,
          ...(selected ? { borderWidth: 2, borderColor: c('border/color-brand') } : {}),
        },
        pressed && { transform: [{ scale: 0.97 }] },
      ]}
    >
      <View style={{ width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: c(selected ? 'bg/color-brand' : 'bg/color-brand-subtle') }}>
        <Icon name={icon || CATEGORY_ICONS[label]} size={24} color={c(selected ? 'icon/color-on-brand' : 'icon/color-brand')} />
      </View>
      <Text numberOfLines={3} style={[type('BodyS', selected ? 'bold' : 'medium'), { color: c('text/color-primary'), flex: 1 }]}>{label}</Text>
    </Pressable>
  );
}

// Tiles two to a row. items: [{ label, icon }]. Directory's four categories by default.
export function CategoryTiles({ items = Object.keys(CATEGORY_ICONS).map((k) => ({ label: k, icon: CATEGORY_ICONS[k] })), value, onPick, testPrefix = 'category-tile' }) {
  const pic = items.some((it) => it.thumb || CATEGORY_ART[it.label]);
  const rows = [];
  const per = pic ? 4 : 2;
  for (let i = 0; i < items.length; i += per) rows.push(items.slice(i, i + per));
  return (
    <View testID={`${testPrefix}s`} style={{ gap: pic ? 16 : 12 }}>
      {rows.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row', gap: pic ? 6 : 12 }}>
          {row.map((it) => <CategoryTile key={it.label} testID={`${testPrefix}-${it.label}`} label={it.label} icon={it.icon} thumb={it.thumb} selected={value === it.label} onPress={() => onPick(value === it.label ? null : it.label)} />)}
          {Array.from({ length: per - row.length }, (_, k) => <View key={`pad${k}`} style={{ flex: 1 }} />)}
        </View>
      ))}
    </View>
  );
}
