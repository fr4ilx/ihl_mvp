// Figma: Sheet row (Selected No, Yes). One row on a sheet, outlined so it reads as a choice on the beige sheet:
// a 1pt border/color-default edge, then a 40pt circle in bg/color-sheet-raised with the icon in icon/color-brand,
// the label in Body M and an optional meta line in Body S. At least 56pt tall, radius/16, 12pt inside, 16pt between
// the circle and the text, rows 8pt apart.
// Selected (one choice in Topics or Categories): the row fills with bg/color-selected and its edge turns
// border/color-brand-subtle, the circle turns bg/color-brand with the icon in icon/color-on-brand, the label turns
// Bold and a check in icon/color-brand closes the row.
// Pressing a row that is not selected shows bg/color-sheet-raised under it. Without an icon the row is text only
// (the Subcategories sheet).
import React from 'react';
import { View, Text, Pressable } from '../rn';
import { useTheme, type } from '../theme';
import Icon from './Icon';

// trailing: an extra control at the end of the row, like the favorite heart on Topics and Categories.
export default function SheetRow({ icon, label, meta, selected, onPress, role = 'radio', testID, trailing }) {
  const { c } = useTheme();
  return (
    <Pressable
      testID={testID}
      accessibilityRole={role}
      aria-checked={role === 'radio' ? !!selected : undefined}
      accessibilityLabel={meta ? `${label}, ${meta}` : label}
      onPress={onPress}
      style={({ pressed }) => [
        { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1 },
        selected
          ? { backgroundColor: c('bg/color-selected'), borderColor: c('border/color-brand-subtle') }
          : { backgroundColor: pressed ? c('bg/color-sheet-raised') : 'transparent', borderColor: c('border/color-default') },
      ]}
    >
      {!!icon && (
      <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: c(selected ? 'bg/color-brand' : 'bg/color-sheet-raised') }}>
        <Icon name={icon} size={24} color={c(selected ? 'icon/color-on-brand' : 'icon/color-brand')} />
      </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={[type('BodyM', selected ? 'bold' : 'medium'), { color: c('text/color-primary') }]}>{label}</Text>
        {!!meta && <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{meta}</Text>}
      </View>
      {selected && <Icon name="check" size={24} strokeWidth={2} color={c('icon/color-brand')} />}
      {trailing}
    </Pressable>
  );
}

// Rows sit 8pt apart, so each outline stands on its own.
export function SheetRows({ children, style, ...rest }) {
  return <View style={[{ gap: 8 }, style]} {...rest}>{children}</View>;
}
