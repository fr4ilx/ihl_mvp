// Figma: Subcategories sheet. Opens from the filter button next to Search on Directory. With a category picked, the
// title is the category and its 4 to 6 subcategories show as Select tiles, two to a row. With none picked, the title
// is Narrow down and every subcategory shows under its category name (H6 Bold, text/color-secondary). Picking a tile
// narrows the list and closes the sheet. Tapping the picked one again shows the whole category.
// React Native: the shared bottom sheet (Sheet.jsx), three quarters of the screen.
import React from 'react';
import { View, Text } from '../rn';
import { useTheme, type } from '../theme';
import { SUBCATEGORIES } from '../data';
import Sheet from './Sheet';
import SelectTile, { SelectGrid } from './SelectTile';

export default function SubcategorySheet({ visible, category, value, onPick, onClose }) {
  const { c } = useTheme();
  const groups = category && category !== 'All' ? [category] : Object.keys(SUBCATEGORIES);
  const tiles = (k) => (
    <SelectGrid single>
      {SUBCATEGORIES[k].map((s) => (
        <SelectTile key={s.id} testID={`subcategory-${s.id}`} single label={s.id} icon={s.icon} selected={value === s.id} onPress={() => onPick(value === s.id ? null : s.id)} />
      ))}
    </SelectGrid>
  );
  return (
    <Sheet visible={visible} onClose={onClose} title={groups.length === 1 ? groups[0] : 'Narrow down'} testID="subcategory-sheet">
      {groups.length === 1 ? tiles(groups[0]) : (
        <View style={{ gap: 24 }}>
          {groups.map((k) => (
            <View key={k} style={{ gap: 12 }}>
              <Text style={[type('H6', 'bold'), { color: c('text/color-secondary') }]}>{k}</Text>
              {tiles(k)}
            </View>
          ))}
        </View>
      )}
    </Sheet>
  );
}
