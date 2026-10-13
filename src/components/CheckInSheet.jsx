// Figma: Check-in sheet. Opens from Check in on Home: "How was your week?" with a close button, "Only you see this.",
// the four moods as Select tiles (single choice, two by two), then Check in pinned at the bottom. Check in with no mood
// shows "Pick how your week was." under the tiles. React Native: the shared bottom sheet (Sheet.jsx).
import React, { useEffect, useState } from 'react';
import { MOODS } from '../data';
import Sheet from './Sheet';
import Button from './Button';
import FieldError from './FieldError';
import { useForm } from '../app/form';
import SelectTile, { SelectGrid } from './SelectTile';

export default function CheckInSheet({ visible, onClose, onCheckIn, initialMood = null, onPick }) {
  const [mood, setMood] = useState(initialMood);
  const form = useForm();
  useEffect(() => { if (visible) { setMood(initialMood); form.reset(); } }, [visible]);
  const errors = { mood: mood ? null : 'Pick how your week was.' };
  return (
    <Sheet visible={visible} onClose={onClose} testID="checkin-sheet" title="How was your week?" subtitle="Only you see this." closeTestID="checkin-close"
      footer={<Button testID="checkin-submit" label="Check in" fill onPress={() => form.submit(errors, () => onCheckIn(mood))} />}>
      <SelectGrid single>
        {MOODS.map((m) => (
          <SelectTile key={m.id} testID={`mood-${m.id}`} single label={m.label} icon={m.icon} iconSize={28} selected={mood === m.id} onPress={() => { setMood(m.id); onPick && onPick(); }} />
        ))}
      </SelectGrid>
      <FieldError testID="checkin-error" message={form.shown(errors).mood} />
    </Sheet>
  );
}
