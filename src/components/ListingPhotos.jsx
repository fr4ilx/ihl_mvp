// Figma: Photo tile (Size Cover, Small. State Photo, Add) and the listing photo layout on Photos.
// Empty: one big dashed Add photos tile that fills the width. With photos: the first one as a 220pt Cover tile,
// the rest in a row of three 115pt squares, then a dashed add tile while there is room (up to 6).
// Each photo has a 32pt dark remove button (a 44pt target). The cover carries a Cover pill.
// React Native: the tiles open ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true,
// selectionLimit: 6 - photos.length }) through the Choose photos sheet.
import React from 'react';
import { View, Text, Image, Pressable } from '../rn';
import { useTheme, type } from '../theme';
import Icon from './Icon';
import DashedBorder from './DashedBorder';

const W = 370;
const SMALL = (W - 24) / 3;
const COVER_H = 220;
const EMPTY_H = 300;

function Remove({ onPress }) {
  const { c } = useTheme();
  return (
    <Pressable accessibilityLabel="Remove photo" hitSlop={8} onPress={onPress} style={({ pressed }) => [{ position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: 16, backgroundColor: c('bg/color-toast'), alignItems: 'center', justifyContent: 'center' }, pressed && { opacity: 0.7 }]}>
      <Icon name="xmark" size={18} color="#FFFFFF" strokeWidth={2} />
    </Pressable>
  );
}

export function PhotoTile({ photo, cover, onRemove, onAdd, testID }) {
  const { c } = useTheme();
  const w = cover ? W : SMALL;
  const h = cover ? COVER_H : SMALL;
  if (!photo) {
    return (
      <Pressable testID={testID} accessibilityLabel="Add photos" onPress={onAdd} style={({ pressed }) => [{ width: w, height: h, borderRadius: 16, backgroundColor: c('bg/color-surface-raised'), alignItems: 'center', justifyContent: 'center' }, pressed && { transform: [{ scale: 0.96 }] }]}>
        <DashedBorder width={w} height={h} radius={16} />
        <Icon name="plus" size={28} color={c('icon/color-secondary')} />
      </Pressable>
    );
  }
  return (
    <View className="fx-pop-in" style={{ width: w, height: h, borderRadius: 16, overflow: 'hidden' }}>
      <Image source={photo} style={{ width: w, height: h }} />
      <Remove onPress={onRemove} />
      {cover && (
        <View style={{ position: 'absolute', left: 12, bottom: 12, paddingHorizontal: 12, height: 28, borderRadius: 999, backgroundColor: c('bg/color-toast'), justifyContent: 'center' }}>
          <Text style={[type('Caption', 'bold'), { color: '#FFFFFF' }]}>Cover</Text>
        </View>
      )}
    </View>
  );
}

// The empty state: one big tile that says what to do.
function AddPhotos({ onPress }) {
  const { c } = useTheme();
  return (
    <Pressable testID="add-photos" accessibilityLabel="Add photos" onPress={onPress} style={({ pressed }) => [{ width: W, height: EMPTY_H, borderRadius: 20, backgroundColor: c('bg/color-surface-raised'), alignItems: 'center', justifyContent: 'center', gap: 16 }, pressed && { transform: [{ scale: 0.98 }] }]}>
      <DashedBorder width={W} height={EMPTY_H} radius={20} />
      <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: c('bg/color-brand-subtle'), alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="media-image-plus" size={32} color={c('icon/color-brand')} />
      </View>
      <View style={{ alignItems: 'center', gap: 4 }}>
        <Text style={[type('BodyM', 'bold'), { color: c('text/color-brand') }]}>Add photos</Text>
        <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>Choose from your library or take one</Text>
      </View>
    </Pressable>
  );
}

export default function ListingPhotos({ photos, max, onAdd, onRemove }) {
  const { c } = useTheme();
  if (!photos.length) return <AddPhotos onPress={onAdd} />;
  const [first, ...rest] = photos;
  return (
    <View style={{ gap: 12 }}>
      <PhotoTile cover photo={first} onRemove={() => onRemove(0)} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {rest.map((ph, i) => <PhotoTile key={i + 1} photo={ph} onRemove={() => onRemove(i + 1)} />)}
        {photos.length < max && <PhotoTile testID="add-photos" onAdd={onAdd} />}
      </View>
      <Text style={[type('Caption'), { color: c('text/color-tertiary') }]}>{photos.length} of {max} photos</Text>
    </View>
  );
}
