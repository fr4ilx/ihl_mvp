// Figma: Search field. 48pt pill on bg/color-surface-raised, soft edge in Light only. On a sheet: bg/color-sheet-raised, no edge.
import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from '../rn';
import { useTheme, type, useRaised, useOnSheet } from '../theme';
import Icon from './Icon';

export default function SearchField({ value, onChangeText, placeholder = 'Search people and places', testID }) {
  const { c } = useTheme();
  const raised = useRaised();
  const onSheet = useOnSheet();
  return (
    <View style={[styles.base, { backgroundColor: c(raised), borderColor: onSheet ? 'transparent' : c('border/color-control-subtle') }]}>
      <Icon name="search" size={24} color={c('icon/color-secondary')} />
      <TextInput
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c('text/color-tertiary')}
        returnKeyType="search"
        style={[type('BodyM'), { flex: 1, color: c('text/color-primary'), height: 46 }]}
      />
      {!!value && (
        <Pressable accessibilityLabel="Clear search" onPress={() => onChangeText('')} hitSlop={8} style={{ padding: 4, marginRight: -4 }}>
          <Icon name="xmark-circle" solid size={24} color={c('icon/color-secondary')} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { height: 48, borderRadius: 999, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 16, paddingRight: 12 },
});
