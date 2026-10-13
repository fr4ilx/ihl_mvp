// Figma: Page dots. Shows which card of a reel is in view. The current dot is a 20 x 8 brand pill,
// the others are 8pt dots in border/color-strong (3:1 on the canvas). Not tappable, swiping moves the reel.
// React Native: animate the width with Reanimated withTiming(…, { duration: 180 }).
import React from 'react';
import { View } from '../rn';
import { useTheme } from '../theme';
import { motion } from '../theme/motion';

export default function PageDots({ count, index, testID }) {
  const { c, reduceMotion } = useTheme();
  if (count < 2) return null;
  return (
    <View testID={testID} accessibilityLabel={`${index + 1} of ${count}`} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, height: 8 }}>
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={{
            width: i === index ? 20 : 8, height: 8, borderRadius: 4,
            backgroundColor: c(i === index ? 'bg/color-brand' : 'border/color-strong'),
            transition: reduceMotion ? 'none' : `width ${motion.select.duration}ms ${motion.select.easing}, background-color ${motion.select.duration}ms`,
          }}
        />
      ))}
    </View>
  );
}
