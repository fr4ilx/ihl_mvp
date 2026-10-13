// Figma: Radio. 24pt circle. Off: 1.5pt border/color-strong ring. On: bg/color-brand with a 10pt bg/color-thumb dot.
// Visual only: the whole row it sits in is the button.
import React from 'react';
import { View } from '../rn';
import { useTheme } from '../theme';

export default function Radio({ selected, disabled }) {
  const { c } = useTheme();
  const on = selected && !disabled;
  return (
    <View style={{ width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: selected ? c(disabled ? 'bg/color-surface' : 'bg/color-brand') : 'transparent', borderWidth: selected ? 0 : 1.5, borderColor: c(disabled ? 'border/color-subtle' : 'border/color-strong') }}>
      {selected && <View className={on ? 'fx-check-in' : ''} style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c(disabled ? 'text/color-disabled' : 'bg/color-thumb') }} />}
    </View>
  );
}
