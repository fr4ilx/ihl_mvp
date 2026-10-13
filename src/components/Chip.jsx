// Figma: Chip. 40pt pill, 16pt side padding. Idle is a quiet raised pill, Selected fills with brand.
// On a sheet the idle chip is bg/color-sheet-raised with no edge.
import React from 'react';
import { Pressable, Text, StyleSheet } from '../rn';
import { useTheme, type, useRaised, useOnSheet } from '../theme';
import Icon from './Icon';

export default function Chip({ label, selected, showCheck, onPress, testID }) {
  const { c } = useTheme();
  const raised = useRaised();
  const onSheet = useOnSheet();
  const fg = selected ? c('text/color-on-brand') : c('text/color-primary');
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      hitSlop={{ top: 4, bottom: 4 }}
      accessibilityRole="button"
      aria-pressed={selected}
      style={({ pressed }) => [
        styles.base,
        selected
          ? { backgroundColor: c('bg/color-brand') }
          : { backgroundColor: c(raised), borderWidth: onSheet ? 0 : 1, borderColor: c('border/color-control-subtle') },
        pressed && { transform: [{ scale: 0.95 }] },
      ]}
    >
      {selected && showCheck && <Icon name="check" size={20} color={fg} strokeWidth={2} />}
      <Text numberOfLines={1} style={[type('BodyS', selected ? 'bold' : 'medium'), { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { height: 40, paddingHorizontal: 16, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 8 },
});
