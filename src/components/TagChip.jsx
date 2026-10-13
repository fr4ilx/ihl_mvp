// Figma: Tag chip. One tag on a listing, under Specialties or Approach: a 40pt bg/color-brand-subtle pill with a 1pt
// border/color-brand-subtle edge, so it stands off the beige canvas, 16pt sides and the tag in Body S Bold,
// text/color-brand. Tapping it opens every place with that tag (Tag results). The touch area reaches
// 48pt (4pt above and below), so rows sit 8pt apart and their touch areas meet without overlapping.
// It reads as a link, never as a filter: no check, no selected state. tone="sage" is the deeper green for
// Specialties: a bg/color-accent fill, text/color-on-accent and a border/color-accent edge. Approach keeps the light one.
import React from 'react';
import { Pressable, Text } from '../rn';
import { useTheme, type } from '../theme';

export default function TagChip({ label, onPress, testID, tone = 'brand' }) {
  const { c } = useTheme();
  const sage = tone === 'sage';
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      hitSlop={{ top: 4, bottom: 4 }}
      accessibilityRole="link"
      accessibilityLabel={label}
      accessibilityHint="Shows every place with this tag"
      style={({ pressed }) => [
        { height: 40, paddingHorizontal: 16, borderRadius: 999, flexDirection: 'row', alignItems: 'center', backgroundColor: c(sage ? 'bg/color-accent' : 'bg/color-brand-subtle'), borderWidth: 1, borderColor: c(sage ? 'border/color-accent' : 'border/color-brand-subtle') },
        pressed && { transform: [{ scale: 0.95 }] },
      ]}
    >
      <Text numberOfLines={1} style={[type('BodyS', 'bold'), { color: c(sage ? 'text/color-on-accent' : 'text/color-brand') }]}>{label}</Text>
    </Pressable>
  );
}
