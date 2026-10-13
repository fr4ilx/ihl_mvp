// Figma: Photo row. 82pt thumbnails with a dark remove pill, then a dashed add tile while there is room.
// New post takes up to 5 photos. Photos on a listing take up to 6, and the first one is the Cover.
import React from 'react';
import { View, Text, Image, Pressable } from '../rn';
import { useTheme, type } from '../theme';
import Icon from './Icon';
import DashedBorder from './DashedBorder';

export default function PhotoGrid({ photos, max, onRemove, onAdd, cover }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
      {photos.map((ph, i) => (
        <View key={i} className="fx-pop-in" style={{ width: 82, height: 82, borderRadius: 12, overflow: 'hidden' }}>
          <Image source={ph} style={{ width: 82, height: 82 }} />
          <Pressable accessibilityLabel="Remove photo" onPress={() => onRemove(i)} hitSlop={10} style={{ position: 'absolute', top: 6, right: 6, width: 28, height: 28, borderRadius: 14, backgroundColor: c('bg/color-toast'), alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="xmark" size={16} color="#FFFFFF" strokeWidth={2} />
          </Pressable>
          {cover && i === 0 && (
            <View style={{ position: 'absolute', left: 6, bottom: 6, paddingHorizontal: 8, height: 22, borderRadius: 999, backgroundColor: c('bg/color-toast'), justifyContent: 'center' }}>
              <Text style={[type('Caption', 'bold'), { color: '#FFFFFF', lineHeight: 16 }]}>Cover</Text>
            </View>
          )}
        </View>
      ))}
      {photos.length < max && (
        <Pressable testID="add-photos" accessibilityLabel="Add photos" onPress={onAdd} style={({ pressed }) => [{ width: 82, height: 82, borderRadius: 12, backgroundColor: c('bg/color-surface-raised'), alignItems: 'center', justifyContent: 'center' }, pressed && { transform: [{ scale: 0.95 }] }]}>
          <DashedBorder width={82} height={82} radius={12} />
          <Icon name="plus" size={24} color={c('icon/color-secondary')} />
        </Pressable>
      )}
    </View>
  );
}
