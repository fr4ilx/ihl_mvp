// Figma: Badge sheet (State Earned, In progress, Award). One badge or stage, centered on a sheet: the Medallion at
// 96pt, a line above the title in Body S Bold text/color-accent (when it was earned, or New badge and New stage for the
// moment it happens), the name in H2 Bold, how to earn it in Body M, and for a badge in progress a Progress bar with
// "6 of 10 places", all in the middle of the sheet. Done, pinned at the bottom, closes it.
// Award: the Medallion gets its breathing halo and the sheet opens with a success haptic, from Check in, a rating,
// a reply or a post. In the app: the shared bottom sheet and expo-haptics notificationAsync(Success).
import React from 'react';
import { View, Text } from '../rn';
import { useTheme, type } from '../theme';
import Sheet from './Sheet';
import Medallion from './Medallion';
import Button from './Button';
import ProgressBar from './ProgressBar';

export default function BadgeSheet({ visible, onClose, item, testID = 'badge-sheet' }) {
  const { c } = useTheme();
  const it = item || {};
  const earned = it.award || !!it.earned;
  const progress = !earned && it.goal ? { value: Math.min(it.value || 0, it.goal), max: it.goal } : null;
  const eyebrow = it.award ? (it.kind === 'stage' ? 'New stage' : 'New badge') : it.earned ? `Earned ${it.earned}` : null;
  return (
    <Sheet visible={visible} onClose={onClose} center footer={<Button testID="badge-done" label="Done" fill onPress={onClose} />}>
      <View testID={testID} style={{ alignItems: 'center', gap: 8 }}>
        <View style={{ marginBottom: it.award ? 0 : 16 }}>
          <Medallion icon={it.icon || 'soil-alt'} size={96} state={earned ? 'earned' : 'progress'} halo={it.award} />
        </View>
        {!!eyebrow && <Text testID="badge-eyebrow" style={[type('BodyS', 'bold'), { color: c('text/color-accent') }]}>{eyebrow}</Text>}
        <Text style={[type('H2', 'bold'), { color: c('text/color-primary'), textAlign: 'center' }]}>{it.title || it.name}</Text>
        {!!(it.line || it.how) && <Text style={[type('BodyM'), { color: c('text/color-secondary'), textAlign: 'center', paddingHorizontal: 8 }]}>{it.line || it.how}</Text>}
      </View>
      {progress && (
        <View testID="badge-progress" style={{ gap: 8, paddingTop: 8 }}>
          <ProgressBar value={progress.value} max={progress.max} />
          <Text style={[type('BodyS', 'bold'), { color: c('text/color-secondary'), textAlign: 'center' }]}>{progress.value} of {progress.max} {it.unit}</Text>
        </View>
      )}
    </Sheet>
  );
}
