// Figma: Progress bar. A 6pt bar for progress toward a badge or the next stage: bg/color-brand for what is
// done over border/color-default, like Step progress. The words next to it ("6 of 10 places") carry the value, so the
// bar never stands alone. React Native: a View with a width percentage, animated with withTiming over 360 ms.
import React from 'react';
import { View } from '../rn';
import { useTheme } from '../theme';
import { motion } from '../theme/motion';

export default function ProgressBar({ value = 0, max = 1, testID, style }) {
  const { c, reduceMotion } = useTheme();
  const pct = Math.max(0, Math.min(1, max ? value / max : 0));
  return (
    <View testID={testID} accessibilityRole="progressbar" aria-valuenow={value} aria-valuemax={max} style={[{ height: 6, borderRadius: 999, backgroundColor: c('border/color-default'), overflow: 'hidden', alignSelf: 'stretch' }, style]}>
      <View style={{ width: `${pct * 100}%`, height: 6, borderRadius: 999, backgroundColor: c('bg/color-brand'), transition: reduceMotion ? 'none' : `width ${motion.listEnter.duration}ms ${motion.listEnter.easing}` }} />
    </View>
  );
}
