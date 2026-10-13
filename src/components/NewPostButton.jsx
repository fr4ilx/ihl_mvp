// Figma: New post button. Community only: a 56pt circle on bg/color-button-primary with a plus in
// text/color-on-button-primary and Elevation/Card, 16pt from the right edge and 12pt above the floating tab bar
// (its bottom at y 772). It opens New post.
import React from 'react';
import { Pressable } from '../rn';
import { useTheme, elevation } from '../theme';
import Icon from './Icon';

export default function NewPostButton({ onPress }) {
  const { c } = useTheme();
  return (
    <Pressable
      testID="new-post"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="New post"
      style={({ pressed }) => [
        { position: 'absolute', right: 16, bottom: 874 - 784 + 12, width: 56, height: 56, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: c('bg/color-button-primary'), boxShadow: elevation.card, zIndex: 15 },
        pressed && { transform: [{ scale: 0.94 }] },
      ]}
    >
      <Icon name="plus" size={28} strokeWidth={2} color={c('text/color-on-button-primary')} />
    </Pressable>
  );
}
