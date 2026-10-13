// Figma: Subcategories sheet. Opens from the filter button next to Search on Directory. With a category picked, the
// title is the category and its 4 to 6 subcategories show as text Sheet rows, 8pt apart. With none picked, the title
// is Narrow down and every subcategory shows under its category name (H6 Bold, text/color-secondary). Every row ends
// in the favorite heart, and favorites move to the top of their category. Picking a row narrows the list and closes
// the sheet. Tapping the picked one again shows the whole category.
// React Native: the shared bottom sheet (Sheet.jsx), three quarters of the screen. Save favorites with the account.
import React from 'react';
import { View, Text } from '../rn';
import { useTheme, type } from '../theme';
import { useApp } from '../app/store';
import { SUBCATEGORIES } from '../data';
import Sheet from './Sheet';
import SheetRow, { SheetRows } from './SheetRow';
import { FavoriteButton, favoritesFirst } from './FilterSheet';

export default function SubcategorySheet({ visible, category, value, onPick, onClose }) {
  const { c } = useTheme();
  const app = useApp();
  const favs = app.favorites.subcategory || [];
  const groups = category && category !== 'All' ? [category] : Object.keys(SUBCATEGORIES);
  const rows = (k) => (
    <SheetRows accessibilityRole="radiogroup" accessibilityLabel={k}>
      {favoritesFirst(SUBCATEGORIES[k], favs).map((s) => (
        <SheetRow
          key={s}
          testID={`subcategory-${s}`}
          label={s}
          selected={value === s}
          onPress={() => onPick(value === s ? null : s)}
          trailing={<FavoriteButton kind="subcategory" value={s} label={s} testID={`subcategory-favorite-${s}`} />}
        />
      ))}
    </SheetRows>
  );
  return (
    <Sheet visible={visible} onClose={onClose} title={groups.length === 1 ? groups[0] : 'Narrow down'} testID="subcategory-sheet">
      <View style={{ gap: 24 }}>
        <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>Tap a heart to keep a favorite on top.</Text>
        {groups.length === 1 ? rows(groups[0]) : groups.map((k) => (
          <View key={k} style={{ gap: 12 }}>
            <Text style={[type('H6', 'bold'), { color: c('text/color-secondary') }]}>{k}</Text>
            {rows(k)}
          </View>
        ))}
      </View>
    </Sheet>
  );
}
