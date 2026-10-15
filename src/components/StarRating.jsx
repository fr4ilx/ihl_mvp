// Figma: Star rating (Rated No, Yes). Five stars, no words. Empty: Regular stars in icon/color-secondary. Rated: Solid
// stars in icon/color-accent up to the pick, so filled versus outline carries it, not color alone. VoiceOver reads it.
// With onRate each star is a 56pt button (the Review sheet). Without it the stars only show the rating (a listing).
import React from 'react';
import { View, Pressable } from '../rn';
import { useTheme } from '../theme';
import Icon from './Icon';

export const RATING_WORDS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

export default function StarRating({ value = 0, onRate, size = 40, testID = 'star-rating' }) {
  const { c } = useTheme();
  const star = (n) => <Icon name="star" solid={n <= value} size={size} color={c(n <= value ? 'icon/color-accent' : 'icon/color-secondary')} />;
  if (!onRate) {
    return <View testID={testID} accessibilityLabel={`${value} of 5 stars`} style={{ flexDirection: 'row', gap: 4 }}>{[1, 2, 3, 4, 5].map((n) => <View key={n}>{star(n)}</View>)}</View>;
  }
  return (
    <View testID={testID} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View accessibilityRole="radiogroup" accessibilityLabel="Your rating" style={{ flexDirection: 'row', gap: 4 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable key={n} testID={`rate-${n}`} accessibilityRole="radio" accessibilityState={{ checked: value === n }} accessibilityLabel={`${n} ${n === 1 ? 'star' : 'stars'}, ${RATING_WORDS[n]}`}
            onPress={() => onRate(n)} style={({ pressed }) => [{ width: 56, height: 56, alignItems: 'center', justifyContent: 'center' }, pressed && { transform: [{ scale: 0.9 }] }]}>
            {star(n)}
          </Pressable>
        ))}
      </View>
    </View>
  );
}
