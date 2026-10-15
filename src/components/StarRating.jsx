// Figma: Star rating (Rated No, Yes). Rating a place on its listing, where the Verified Local Business badge was.
// Five 48pt stars in a row, no words. Empty: Regular stars in icon/color-secondary. Rated: Solid stars in
// icon/color-accent up to the pick, so filled versus outline carries it, not color alone. VoiceOver reads the rating.
// Tapping another star changes it.
import React from 'react';
import { View, Pressable } from '../rn';
import { useTheme } from '../theme';
import Icon from './Icon';

export const RATING_WORDS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

export default function StarRating({ value = 0, onRate, testID = 'star-rating' }) {
  const { c } = useTheme();
  return (
    <View testID={testID} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View accessibilityRole="radiogroup" accessibilityLabel="Your rating" style={{ flexDirection: 'row', marginLeft: -8 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable key={n} testID={`rate-${n}`} accessibilityRole="radio" accessibilityState={{ checked: value === n }} accessibilityLabel={`${n} ${n === 1 ? 'star' : 'stars'}, ${RATING_WORDS[n]}`}
            onPress={() => onRate(n)} style={({ pressed }) => [{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }, pressed && { transform: [{ scale: 0.9 }] }]}>
            <Icon name="star" solid={n <= value} size={32} color={c(n <= value ? 'icon/color-accent' : 'icon/color-secondary')} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
