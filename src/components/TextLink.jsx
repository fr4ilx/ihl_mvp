// Figma: Text link. A text-only action in text/color-link, Body S Bold (Small) or Body M Bold (Medium).
// Left aligned with the content, no pill or padding. The hit area still reaches 48pt through hitSlop.
// Used for Forgot password? on Log in and Show more / Show less on a listing.
import React from 'react';
import { Pressable, Text } from '../rn';
import { useTheme, type } from '../theme';

export default function TextLink({ label, onPress, size = 'small', testID, style, ...rest }) {
  const { c } = useTheme();
  const slop = size === 'small' ? 13 : 11; // 22pt or 26pt line + slop = 48pt
  return (
    <Pressable testID={testID} accessibilityRole="link" onPress={onPress} hitSlop={{ top: slop, bottom: slop, left: 8, right: 8 }} style={({ pressed }) => [{ alignSelf: 'flex-start' }, pressed && { opacity: 0.6 }, style]} {...rest}>
      <Text style={[type(size === 'small' ? 'BodyS' : 'BodyM', 'bold'), { color: c('text/color-link') }]}>{label}</Text>
    </Pressable>
  );
}
