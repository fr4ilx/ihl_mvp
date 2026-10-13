// Figma: dashed stroke on the Edit tile and the Add photos tile. 1.5pt, dashes 6 and gaps 4, inside, border/color-default.
// CSS and React Native dashed borders can't set the dash length, so this draws it with react-native-svg.
import React from 'react';
import { Svg, Rect } from '../rn';
import { useTheme } from '../theme';

export default function DashedBorder({ width, height, radius, color }) {
  const { c } = useTheme();
  const w = 1.5;
  return (
    <Svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0 }} pointerEvents="none">
      <Rect x={w / 2} y={w / 2} width={width - w} height={height - w} rx={radius - w / 2} ry={radius - w / 2} fill="none" stroke={color || c('border/color-default')} strokeWidth={w} strokeDasharray="6 4" />
    </Svg>
  );
}
