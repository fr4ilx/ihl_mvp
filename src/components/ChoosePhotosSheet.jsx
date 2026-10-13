// Figma: Choose photos sheet. Take a photo as a Sheet row, then Recents with numbered picks, scrolling above the Add
// button pinned at the bottom. Add with nothing picked shows "Pick at least one photo." under Recents.
// Used by New post (up to 5 photos) and by Photos on a listing (up to 6).
// React Native: ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true, selectionLimit: room }) and launchCameraAsync.
import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable } from '../rn';
import { useTheme, type } from '../theme';
import { useFeedback } from '../app/feedback';
import { useForm } from '../app/form';
import { RECENT_PHOTOS } from '../data';
import Sheet, { SHEET_CONTENT } from './Sheet';
import Button from './Button';
import SheetRow from './SheetRow';
import { SectionLabel } from './Rows';
import FieldError from './FieldError';

// Three photos to a row, 8pt apart, across the sheet's content width.
const TILE = (SHEET_CONTENT - 16) / 3;

export default function ChoosePhotosSheet({ visible, room, initialPicks = [], onAdd, onClose }) {
  const { c } = useTheme();
  const fb = useFeedback();
  const [picks, setPicks] = useState(initialPicks);
  const form = useForm();
  useEffect(() => { if (!visible) { setPicks([]); form.reset(); } }, [visible]);
  const errors = { picks: picks.length ? null : 'Pick at least one photo.' };
  const toggle = (i) => {
    setPicks((s) => (s.includes(i) ? s.filter((x) => x !== i) : s.length < room ? [...s, i] : s));
    fb.haptic('selection');
  };
  const close = () => { setPicks([]); onClose(); };
  return (
    <Sheet visible={visible} onClose={close} title="Choose photos"
      footer={<Button testID="add-picked" label={picks.length ? `Add ${picks.length} ${picks.length === 1 ? 'photo' : 'photos'}` : 'Add photos'} fill onPress={() => form.submit(errors, () => { onAdd(picks.map((i) => RECENT_PHOTOS[i])); setPicks([]); })} />}>
      <SheetRow testID="take-photo" role="button" icon="camera" label="Take a photo" onPress={() => fb.haptic('light')} />
      <View style={{ gap: 8 }}>
        <SectionLabel error={!!form.shown(errors).picks}>Recents</SectionLabel>
        <FieldError testID="photos-error" message={form.shown(errors).picks} />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {RECENT_PHOTOS.map((ph, i) => {
          const n = picks.indexOf(i);
          return (
            <Pressable key={i} testID={`pick-${i}`} onPress={() => toggle(i)} style={({ pressed }) => [{ width: TILE, height: TILE, borderRadius: 8, overflow: 'hidden' }, pressed && { transform: [{ scale: 0.96 }] }]}>
              <Image source={ph} style={{ width: TILE, height: TILE, opacity: n >= 0 ? 0.85 : 1 }} />
              <View style={{ position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: '#FFFFFF', backgroundColor: n >= 0 ? c('bg/color-brand') : 'rgba(0,0,0,0.18)', alignItems: 'center', justifyContent: 'center' }} className={n >= 0 ? 'fx-pop-once' : ''}>
                {n >= 0 && <Text style={[type('Caption', 'bold'), { color: c('text/color-on-brand') }]}>{n + 1}</Text>}
              </View>
            </Pressable>
          );
        })}
      </View>
    </Sheet>
  );
}
