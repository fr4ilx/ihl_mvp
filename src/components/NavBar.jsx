// Figma: Navigation bar. Type Title (large title left, one action right) or Back (back button, centered title, actions).
// Sits at y 62 under the status bar, 56pt tall, 16pt side padding. right: something other than buttons at the right,
// like Step progress on the setup steps and the quiz.
import React from 'react';
import { View, Text, StyleSheet } from '../rn';
import { useTheme, type } from '../theme';
import IconButton from './IconButton';

export default function NavBar({ kind = 'title', title, onBack, backIcon = 'nav-arrow-left', actions = [], right, transparent }) {
  const { c } = useTheme();
  if (kind === 'title') {
    return (
      <View style={styles.bar}>
        <Text style={[type('H2'), { color: c('text/color-primary') }]}>{title}</Text>
        <View style={styles.actions}>
          {actions.map((a) => <IconButton key={a.icon} {...a} />)}
        </View>
      </View>
    );
  }
  return (
    <View style={styles.bar}>
      <IconButton icon={backIcon} onPress={onBack} accessibilityLabel={backIcon === 'xmark' ? 'Close' : 'Back'} variant={transparent ? 'glass' : 'outline'} testID="nav-back" />
      {!!title && (
        <View style={styles.center} pointerEvents="none">
          <Text numberOfLines={1} style={[type('BodyM', 'bold'), { color: c('text/color-primary') }]}>{title}</Text>
        </View>
      )}
      {right || (
        <View style={styles.actions}>
          {actions.map((a) => <IconButton key={a.icon} {...a} />)}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  center: { position: 'absolute', left: 80, right: 80, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', gap: 12, minWidth: 48 },
});
