// The Directory filter row under Search: a round Filter pill with the sliders icon, then the four broad categories as
// Chips (Holistic Business, Food, Shop, Services), 8 apart with 8pt sides so the row fits in 370pt. The Filter pill
// opens the Subcategories sheet. It is 40pt like the Chips, idle on the raised fill with the soft Light edge, and
// fills with brand once a subcategory is picked. Selected Chips fill with brand and turn Bold. Tapping the selected
// one again shows every place.
import React from 'react';
import { View, Pressable } from '../rn';
import { useTheme, useRaised } from '../theme';
import Chip from './Chip';
import Icon from './Icon';

export const DIRECTORY_CATEGORIES = ['Holistic Business', 'Food', 'Shop', 'Services'];

export default function CategoryChips({ value, onPick, filterOn, filterLabel, onFilter }) {
  const { c } = useTheme();
  const raised = useRaised();
  return (
    <View testID="category-chips" style={{ flexDirection: 'row', gap: 8 }}>
      <Pressable
        testID="open-subcategories"
        onPress={onFilter}
        hitSlop={{ top: 4, bottom: 4 }}
        accessibilityRole="button"
        accessibilityLabel={filterLabel}
        style={({ pressed }) => [
          { width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
          filterOn ? { backgroundColor: c('bg/color-brand') } : { backgroundColor: c(raised), borderWidth: 1, borderColor: c('border/color-control-subtle') },
          pressed && { transform: [{ scale: 0.95 }] },
        ]}
      >
        <Icon name="sliders" size={20} color={c(filterOn ? 'icon/color-on-brand' : 'icon/color-primary')} />
      </Pressable>
      {DIRECTORY_CATEGORIES.map((k) => <Chip key={k} testID={`category-${k}`} label={k} selected={value === k} style={{ paddingHorizontal: 8, flexShrink: 0 }} onPress={() => onPick(value === k ? 'All' : k)} />)}
    </View>
  );
}
