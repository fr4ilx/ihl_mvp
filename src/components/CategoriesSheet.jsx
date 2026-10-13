// Figma: Categories sheet. Opens from the menu button next to Search on Directory. A Filter sheet with one Sheet row per
// category: All places (map-pin), Practitioners (user-love), Farms (farm), Food (apple-fruit), Shops (shop).
// Picking one filters the list and closes the sheet. All places clears the filter.
// The heart on a row makes it a favorite category, which stays on top.
import React from 'react';
import FilterSheet from './FilterSheet';

export const categoryLabel = (k) => (k === 'All' ? 'All places' : k);
const ICONS = { All: 'map-pin', Practitioners: 'user-love', Farms: 'farm', Food: 'apple-fruit', Shops: 'shop' };
const OPTIONS = Object.keys(ICONS).map((k) => ({ value: k, label: categoryLabel(k), icon: ICONS[k] }));

export default function CategoriesSheet({ visible, value, onPick, onClose }) {
  return <FilterSheet visible={visible} title="Categories" options={OPTIONS} value={value} onPick={onPick} onClose={onClose} testPrefix="category" favoriteKind="category" />;
}
