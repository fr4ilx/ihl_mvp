// Figma: Date sheet. A bottom sheet with month, day and year wheels in the middle of the sheet, for Date of birth.
// 44pt rows, seven visible, the middle row sits in a bg/color-surface band. Done, pinned at the bottom, saves.
// The X closes without saving.
// Month and day wrap around like the iOS picker, the year does not.
// React Native: @react-native-community/datetimepicker with display="spinner" inside the shared bottom sheet.
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, ScrollView } from '../rn';
import { useTheme, type } from '../theme';
import { useFeedback } from '../app/feedback';
import Sheet from './Sheet';
import Button from './Button';

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEARS = Array.from({ length: 2008 - 1920 + 1 }, (_, i) => 1920 + i);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
export const ROW = 44;

export const formatDate = ({ m, d, y }) => `${MONTHS[m]} ${d}, ${y}`;
export function parseDate(s) {
  const hit = /^([A-Za-z]+) (\d{1,2}), (\d{4})$/.exec((s || '').trim());
  const m = hit ? MONTHS.indexOf(hit[1]) : -1;
  return m >= 0 ? { m, d: +hit[2], y: +hit[3] } : { m: 0, d: 1, y: 1955 };
}
const daysIn = (m, y) => new Date(y, m + 1, 0).getDate();

// One wheel column. Also used by the Hours sheet. rows: how many rows show, the middle one is picked.
// loop: the column wraps around like the iOS date picker, so December sits above January and 31 above 1.
// It draws the items 7 times, starts in the middle copy and quietly moves back to it once scrolling stops.
const COPIES = 7;
export const WHEEL_ROWS = 7;
export function Wheel({ items, index, onChange, width, testID, loop, rows: visible = WHEEL_ROWS }) {
  const { c } = useTheme();
  const fb = useFeedback();
  const ref = useRef();
  const last = useRef(index);
  const settle = useRef();
  const n = items.length;
  const base = loop ? Math.floor(COPIES / 2) * n : 0;
  const rows = loop ? Array.from({ length: COPIES * n }, (_, k) => k % n) : items.map((_, i) => i);
  useLayoutEffect(() => { if (ref.current) ref.current.scrollTop = (base + index) * ROW; }, []);
  // A new index from outside (the day clamped to a shorter month) scrolls the wheel to it.
  useEffect(() => {
    const el = ref.current;
    if (!el || index === last.current) return;
    last.current = index;
    const at = Math.round(el.scrollTop / ROW);
    const k = loop ? at + ((((index - at) % n) + n + Math.floor(n / 2)) % n) - Math.floor(n / 2) : index;
    el.scrollTop = k * ROW;
  }, [index]);
  return (
    <ScrollView
      ref={ref}
      testID={testID}
      style={{ width, height: ROW * visible, scrollSnapType: 'y mandatory', scrollbarWidth: 'none' }}
      contentContainerStyle={{ paddingVertical: ROW * Math.floor(visible / 2) }}
      onScroll={(e) => {
        const at = Math.round(e.nativeEvent.contentOffset.y / ROW);
        const i = loop ? ((at % n) + n) % n : Math.max(0, Math.min(n - 1, at));
        if (i !== last.current) { last.current = i; fb.haptic('selection'); onChange(i); }
        if (loop) {
          clearTimeout(settle.current);
          settle.current = setTimeout(() => {
            const el = ref.current;
            if (el && Math.abs(Math.round(el.scrollTop / ROW) - (base + i)) >= n) el.scrollTop = (base + i) * ROW;
          }, 160);
        }
      }}
    >
      {rows.map((i, k) => (
        <View key={k} style={{ height: ROW, justifyContent: 'center', alignItems: 'center', scrollSnapAlign: 'center' }}>
          <Text style={[type('H4', i === index ? 'bold' : 'medium'), { color: i === index ? c('text/color-primary') : c('text/color-tertiary') }]}>{items[i]}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

export default function DateSheet({ visible, value, title = 'Date of birth', onDone, onClose }) {
  const { c } = useTheme();
  const [v, setV] = useState(() => parseDate(value));
  const [open, setOpen] = useState(visible);
  if (visible !== open) { setOpen(visible); if (visible) setV(parseDate(value)); }
  const set = (patch) => setV((o) => { const n = { ...o, ...patch }; return { ...n, d: Math.min(n.d, daysIn(n.m, n.y)) }; });
  return (
    <Sheet visible={visible} onClose={onClose} title={title} center footer={<Button testID="date-done" label="Done" fill onPress={() => onDone(formatDate(v))} />}>
      <View style={{ height: ROW * WHEEL_ROWS, flexDirection: 'row', justifyContent: 'center' }}>
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: ROW * Math.floor(WHEEL_ROWS / 2), height: ROW, borderRadius: 12, backgroundColor: c('bg/color-surface') }} />
        {open && <>
          <Wheel testID="wheel-month" loop items={MONTHS} index={v.m} onChange={(m) => set({ m })} width={170} />
          <Wheel testID="wheel-day" loop items={DAYS} index={v.d - 1} onChange={(i) => set({ d: i + 1 })} width={70} />
          <Wheel testID="wheel-year" items={YEARS} index={YEARS.indexOf(v.y)} onChange={(i) => set({ y: YEARS[i] })} width={100} />
        </>}
      </View>
    </Sheet>
  );
}
