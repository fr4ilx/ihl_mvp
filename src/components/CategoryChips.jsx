// The four broad Directory categories as Chips in one row under Search, 8 apart: Holistic Business, Food, Shop and
// Services. 12pt sides instead of the Chip's 16 so all four fit in 370pt. Selected fills with brand and turns Bold.
// Tapping the selected one again shows every place. IHL adds subcategories later.
import React from 'react';
import { View } from '../rn';
import Chip from './Chip';

export const DIRECTORY_CATEGORIES = ['Holistic Business', 'Food', 'Shop', 'Services'];

export default function CategoryChips({ value, onPick }) {
  return (
    <View testID="category-chips" style={{ flexDirection: 'row', gap: 8 }}>
      {DIRECTORY_CATEGORIES.map((k) => <Chip key={k} testID={`category-${k}`} label={k} selected={value === k} style={{ paddingHorizontal: 12, flexShrink: 0 }} onPress={() => onPick(value === k ? 'All' : k)} />)}
    </View>
  );
}
