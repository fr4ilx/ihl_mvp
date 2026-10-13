// Figma: Map box. Where the place is, on a listing: a 200pt map with radius/16, a brand pin in the middle
// and a Directions pill. The whole box is one button that opens Get directions, the iOS action sheet.
// The drawing uses the bg/color-map-* tokens so it flips with Light and Dark.
// React Native: show a real map instead. react-native-maps MapView (Apple Maps on iOS) with scrollEnabled,
// zoomEnabled, rotateEnabled and pitchEnabled off, pointerEvents="none", a Marker drawn like this pin,
// wrapped in a Pressable. Keep the size, radius, pill and accessibility label.
import React from 'react';
import { View, Text, Pressable, Svg, Rect, Path, Circle } from '../rn';
import { useTheme, type, elevation } from '../theme';
import Icon from './Icon';

export const MAP_H = 200;

// preview: the map without the Directions pill and not pressable, under the address on Where people find you.
export default function MapBox({ address, onPress, testID, preview }) {
  const { c } = useTheme();
  const road = c('bg/color-map-road');
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={preview}
      accessibilityLabel={preview ? `Map of ${address}` : `Get directions to ${address}`}
      style={({ pressed }) => [{ height: MAP_H, borderRadius: 16, overflow: 'hidden', backgroundColor: c('bg/color-map-land') }, pressed && { transform: [{ scale: 0.985 }] }]}
    >
      <Svg width="100%" height="100%" viewBox="0 0 370 200" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', top: 0, left: 0 }}>
        <Rect x="0" y="0" width="370" height="200" fill={c('bg/color-map-land')} />
        <Path d="M0 158 C48 146 86 168 128 174 C162 179 178 192 188 200 L0 200 Z" fill={c('bg/color-map-water')} />
        <Rect x="238" y="22" width="104" height="64" rx="10" fill={c('bg/color-map-park')} />
        <Rect x="22" y="66" width="58" height="38" rx="8" fill={c('bg/color-map-park')} />
        <Path d="M-10 48 H228 M96 48 V210 M186 164 H380 M330 88 V210" stroke={road} strokeWidth="5" strokeLinecap="round" fill="none" />
        <Path d="M300 -10 L196 210" stroke={road} strokeWidth="6" strokeLinecap="round" fill="none" />
        <Path d="M150 -10 V210" stroke={road} strokeWidth="8" strokeLinecap="round" fill="none" />
        <Path d="M-10 126 H380" stroke={road} strokeWidth="10" strokeLinecap="round" fill="none" />
      </Svg>
      {/* Pin: the tip sits on the place, 8pt below the middle of the box */}
      <View pointerEvents="none" style={{ position: 'absolute', left: '50%', top: MAP_H / 2 + 8 - 46, marginLeft: -18, filter: 'drop-shadow(0 1px 3px rgba(26,26,20,0.16)) drop-shadow(0 4px 12px rgba(26,26,20,0.12))' }}>
        <Svg width="36" height="46" viewBox="0 0 36 46">
          <Path d="M18 44 C18 44 34 28 34 17 A16 16 0 1 0 2 17 C2 28 18 44 18 44 Z" fill={c('bg/color-brand')} stroke={c('bg/color-thumb')} strokeWidth="2.5" />
          <Circle cx="18" cy="17" r="6" fill={c('bg/color-thumb')} />
        </Svg>
      </View>
      {!preview && <View pointerEvents="none" style={{ position: 'absolute', right: 12, bottom: 12, paddingVertical: 8, paddingLeft: 12, paddingRight: 16, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.raised }}>
        <Icon name="maps-arrow-diagonal" size={20} color={c('icon/color-brand')} />
        <Text style={[type('BodyS', 'bold'), { color: c('text/color-link') }]}>Directions</Text>
      </View>}
    </Pressable>
  );
}
