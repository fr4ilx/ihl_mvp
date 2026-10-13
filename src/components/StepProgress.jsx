// Figma: Step progress (Steps 3, 9. Current). It sits at the top right of the nav bar, so the title under it has the
// whole width: one 160 by 6pt Progress bar, bg/color-brand up to this step over border/color-default, then "3 of 9" in
// Body S Bold, 12pt after it and right aligned. The words carry the progress, so it never relies on color alone.
// Practice setup has 9 steps, the seeker quiz 3. VoiceOver reads "Step 3 of 9" or "Question 1 of 3".
// Arriving on a step, the fill grows from the step before.
// React Native: accessibilityRole="progressbar" with accessibilityValue={{ min: 0, max: total, now: step }}, passed to
// the stack header as headerRight, the fill width animated with withTiming.
import React, { useEffect, useState } from 'react';
import { View, Text } from '../rn';
import { useTheme, type } from '../theme';
import { motion } from '../theme/motion';
import ProgressBar from './ProgressBar';

export default function StepProgress({ step, total, noun = 'Step', testID = 'step-progress' }) {
  const { c, reduceMotion } = useTheme();
  const [now, setNow] = useState(reduceMotion ? step : step - 1);
  useEffect(() => {
    const t = setTimeout(() => setNow(step), reduceMotion ? 0 : motion.push.duration / 2);
    return () => clearTimeout(t);
  }, [step]);
  return (
    <View testID={testID} role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={step} accessibilityLabel={`${noun} ${step} of ${total}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <ProgressBar value={now} max={total} style={{ width: 160, alignSelf: 'center' }} />
      {/* A fixed width, so the bar stays put from "1 of 9" to "9 of 9". */}
      <Text aria-hidden style={[type('BodyS', 'bold'), { color: c('text/color-secondary'), minWidth: 44, textAlign: 'right' }]}>{step} of {total}</Text>
    </View>
  );
}
