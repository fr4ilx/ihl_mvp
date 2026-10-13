// Figma: Location sheet. A bottom sheet with a Search field, then Use my current location and the places as outlined
// Sheet rows (a map-pin circle, the name over the area), 8pt apart.
// Typing filters the list. A place the app doesn't know shows "We couldn’t find that place. Try a city or street."
// The Search field stays in place while the places scroll under it.
// React Native: the shared bottom sheet (Sheet.jsx) with a TextInput and a FlatList, suggestions from your places API.
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from '../rn';
import { useTheme, type } from '../theme';
import { PLACES } from '../data';
import Sheet from './Sheet';
import SearchField from './SearchField';
import SheetRow from './SheetRow';
import Icon from './Icon';

export const placeLabel = (p) => `${p.name}, ${p.area}`;

export default function PlaceSheet({ visible, initialQuery = '', onPick, onLocate, locateNote, onClose }) {
  const { c } = useTheme();
  const [q, setQ] = useState(initialQuery);
  useEffect(() => { if (visible) setQ(initialQuery); }, [visible]);
  const t = q.trim().toLowerCase();
  const list = t ? PLACES.filter((p) => placeLabel(p).toLowerCase().includes(t)) : PLACES;
  return (
    <Sheet visible={visible} onClose={onClose} title="Location" scroll={false}>
      <SearchField testID="place-search" value={q} onChangeText={setQ} placeholder="City or address" />
      <ScrollView style={{ flex: 1, minHeight: 0 }} contentContainerStyle={{ gap: 8, paddingBottom: 8 }}>
        <SheetRow testID="place-locate" role="button" icon="navigator-alt" label="Use my current location" onPress={onLocate} />
        {!!locateNote && <Text testID="place-locate-note" style={[type('BodyS'), { color: c('text/color-secondary'), paddingHorizontal: 12 }]}>{locateNote}</Text>}
        {list.length ? (
          list.map((p) => (
            <SheetRow key={p.name} testID={`place-${p.name}`} role="button" icon="map-pin" label={p.name} meta={p.area} onPress={() => onPick(placeLabel(p))} />
          ))
        ) : (
          <View testID="place-not-found" style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start', paddingHorizontal: 12, paddingTop: 8 }}>
            <View style={{ height: 26, justifyContent: 'center' }}><Icon name="warning-circle" solid size={20} color={c('icon/color-error')} /></View>
            <Text style={[type('BodyM'), { color: c('text/color-primary'), flex: 1 }]}>We couldn’t find that place. Try a city or street.</Text>
          </View>
        )}
      </ScrollView>
    </Sheet>
  );
}
