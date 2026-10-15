// Figma: Select tile (Selected No, Yes). One answer in the seeker quiz and one mood in the weekly check-in.
// 179 by 104pt, two per row with a 12pt gap, like the Interest card: a 48pt icon circle over the label in Body S.
// Idle: bg/color-surface-raised with the border/color-control edge (Light only), the circle in bg/color-brand-subtle.
// Selected: bg/color-brand-subtle with a 2pt border/color-brand edge, the circle turns raised so it still reads, the
// label turns Bold and a Solid check-circle sits in the top right corner. On a sheet the idle tile uses
// bg/color-sheet-raised with no edge. single: a radio (the mood), otherwise a checkbox (quiz answers).
import React from 'react';
import { View, Text, Pressable, Image } from '../rn';
import { useTheme, type, useRaised, useOnSheet } from '../theme';
import Icon from './Icon';

export default function SelectTile({ label, icon, art, iconSize = 24, selected, onPress, single, testID }) {
  const { c } = useTheme();
  const raised = useRaised();
  const onSheet = useOnSheet();
  return (
    <Pressable
      testID={testID}
      accessibilityRole={single ? 'radio' : 'checkbox'}
      aria-checked={!!selected}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        { width: 179, height: 104, borderRadius: 20, paddingHorizontal: 12, gap: 8, alignItems: 'center', justifyContent: 'center' },
        selected
          ? { backgroundColor: c('bg/color-brand-subtle'), borderWidth: 2, borderColor: c('border/color-brand') }
          : { backgroundColor: c(raised), borderWidth: onSheet ? 0 : 1, borderColor: c('border/color-control') },
        pressed && { transform: [{ scale: 0.96 }] },
      ]}
    >
      {/* art: the watercolor at 56pt with no circle, in place of the icon. */}
      {art ? (
        <Image source={art} resizeMode="contain" accessibilityIgnoresInvertColors style={{ width: 56, height: 56 }} />
      ) : (
        <View style={{ width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: c(selected ? raised : 'bg/color-brand-subtle') }}>
          <Icon name={icon} size={iconSize} color={c('icon/color-brand')} />
        </View>
      )}
      <Text numberOfLines={1} style={[type('BodyS', selected ? 'bold' : 'medium'), { color: c('text/color-primary'), textAlign: 'center', alignSelf: 'stretch' }]}>{label}</Text>
      {selected && (
        <View className="fx-check-in" style={{ position: 'absolute', top: 10, right: 10 }}>
          <Icon name="check-circle" solid size={24} color={c('icon/color-brand')} />
        </View>
      )}
    </Pressable>
  );
}

// Tiles wrap two to a row.
export function SelectGrid({ children, single }) {
  return <View accessibilityRole={single ? 'radiogroup' : undefined} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>{children}</View>;
}
