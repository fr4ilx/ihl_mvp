// Figma: Interest card (onboarding and Edit interests) and Interest tile (My Profile, Member profile).
import React from 'react';
import { View, Text, Image, Pressable } from '../rn';
import { useTheme, type, elevation } from '../theme';
import { interestArt } from '../data';
import Icon from './Icon';
import DashedBorder from './DashedBorder';

// 179 x 158pt, two per row with a 12pt gap. Selected: brand border, brand-subtle fill, check.
// The type cards on Your practice reuse it as a single choice: label and art passed in, role radio.
export function InterestCard({ id, label = id, art, selected, onPress, testID, single }) {
  const { c } = useTheme();
  return (
    <Pressable
      testID={testID || `interest-${id}`}
      accessibilityRole={single ? 'radio' : 'checkbox'}
      aria-checked={selected}
      onPress={onPress}
      style={({ pressed }) => [
        { width: 179, height: 158, borderRadius: 20, padding: 12, gap: 8, alignItems: 'center', justifyContent: 'center' },
        selected
          ? { backgroundColor: c('bg/color-brand-subtle'), borderWidth: 2, borderColor: c('border/color-brand') }
          : { backgroundColor: c('bg/color-surface-raised'), borderWidth: 1, borderColor: c('border/color-control') },
        pressed && { transform: [{ scale: 0.96 }] },
      ]}
    >
      <Image source={art || interestArt[id]} resizeMode="contain" style={{ width: 104, height: 104 }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, alignSelf: 'stretch' }}>
        <Text numberOfLines={1} style={[type('BodyS', selected ? 'bold' : 'medium'), { color: c('text/color-primary'), width: 120, textAlign: 'center' }]}>{label}</Text>
        {selected && <View className="fx-check-in"><Icon name="check" size={20} color={c('icon/color-brand')} strokeWidth={2} /></View>}
      </View>
    </Pressable>
  );
}

// Quarter width tile, left aligned, wraps in rows of four.
export function InterestTile({ id }) {
  const { c } = useTheme();
  return (
    <View style={{ width: 83.5, height: 104, borderRadius: 16, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 12 }}>
      <Image source={interestArt[id]} resizeMode="contain" style={{ width: 52, height: 52 }} />
      <Text numberOfLines={1} style={[type('BodyS'), { color: c('text/color-primary') }]}>{id}</Text>
    </View>
  );
}

export function EditTile({ onPress }) {
  const { c } = useTheme();
  return (
    <Pressable testID="edit-interests" onPress={onPress} accessibilityLabel="Edit interests" style={({ pressed }) => [{ width: 83.5, height: 104, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 8 }, pressed && { transform: [{ scale: 0.96 }] }]}>
      <DashedBorder width={83.5} height={104} radius={16} />
      <Icon name="edit-pencil" size={24} color={c('icon/color-brand')} />
      <Text style={[type('BodyS'), { color: c('text/color-brand') }]}>Edit</Text>
    </Pressable>
  );
}

export function InterestTiles({ ids, onEdit }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
      {ids.map((id) => <InterestTile key={id} id={id} />)}
      {onEdit && <EditTile onPress={onEdit} />}
    </View>
  );
}
