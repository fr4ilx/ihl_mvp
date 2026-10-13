// Figma: Hours sheet. Opens from a day on Hours. The day as the title, an Open toggle, then Opens and Closes
// wheels (every 30 minutes, 6:00 AM to 10:00 PM) with a bg/color-surface band on the middle row, and Done pinned
// at the bottom. A closing time before the opening time shows a Field error, and Done answers it with the error haptic.
// React Native: two @react-native-community/datetimepicker pickers in mode="time" with display="spinner"
// and minuteInterval={30}, or the same two wheels.
import React, { useState } from 'react';
import { View } from '../rn';
import { useTheme } from '../theme';
import { useFeedback } from '../app/feedback';
import { TIMES } from '../data';
import Sheet, { SHEET_CONTENT } from './Sheet';
import Button from './Button';
import Toggle from './Toggle';
import FieldError from './FieldError';
import { Wheel, ROW, WHEEL_ROWS } from './DateSheet';
import { SettingRow, SectionLabel } from './Rows';

const DEFAULT = ['9:00 AM', '5:00 PM'];

export default function HoursSheet({ visible, day, value, onDone, onClose }) {
  const { c } = useTheme();
  const fb = useFeedback();
  // value: undefined for a day with no hours yet (opens with Open on), null for Closed, or [opens, closes].
  const [open, setOpen] = useState(value !== null);
  const [range, setRange] = useState(value || DEFAULT);
  const [shown, setShown] = useState(visible);
  // Fresh values each time the sheet opens for a day.
  if (visible !== shown) { setShown(visible); if (visible) { setOpen(value !== null); setRange(value || DEFAULT); } }
  const at = (t) => Math.max(0, TIMES.indexOf(t));
  const backwards = open && at(range[1]) <= at(range[0]);
  return (
    <Sheet visible={visible} onClose={onClose} title={day} footer={<Button testID="hours-done" label="Done" fill onPress={() => (backwards ? fb.haptic('error') : onDone(open ? range : null))} />}>
      <View style={{ backgroundColor: c('bg/color-sheet-raised'), borderRadius: 16, paddingHorizontal: 16 }}>
        <SettingRow label="Open" trailing={<Toggle testID="hours-open" on={open} onChange={(v) => { setOpen(v); fb.haptic('selection'); }} accessibilityLabel={`Open on ${day}`} />} />
      </View>
      {open && shown && (
        <View>
          <View style={{ flexDirection: 'row' }}>
            <SectionLabel style={{ flex: 1, textAlign: 'center' }}>Opens</SectionLabel>
            <SectionLabel style={{ flex: 1, textAlign: 'center' }}>Closes</SectionLabel>
          </View>
          <View style={{ height: ROW * WHEEL_ROWS, flexDirection: 'row', justifyContent: 'center' }}>
            <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: ROW * Math.floor(WHEEL_ROWS / 2), height: ROW, borderRadius: 12, backgroundColor: c('bg/color-surface') }} />
            <Wheel testID="wheel-opens" items={TIMES} index={at(range[0])} onChange={(i) => setRange((r) => [TIMES[i], r[1]])} width={SHEET_CONTENT / 2} />
            <Wheel testID="wheel-closes" items={TIMES} index={at(range[1])} onChange={(i) => setRange((r) => [r[0], TIMES[i]])} width={SHEET_CONTENT / 2} />
          </View>
          <FieldError testID="hours-error" message={backwards ? 'Pick a closing time after it opens.' : null} style={{ paddingTop: 8 }} />
        </View>
      )}
    </Sheet>
  );
}
