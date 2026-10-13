// Subcategory map. 280pt tall, about a third of the 874pt iPhone 17, the content width with radius/16, under the
// City picker and over the list on a subcategory page. One brand pin per place in the list, so it follows the city
// and the search. A pin opens that listing. The drawing uses the bg/color-map-* tokens so it flips with
// Light and Dark.
// React Native: show a real map instead. react-native-maps MapView (Apple Maps on iOS) with a Marker per place,
// fitted to the markers with fitToCoordinates. Keep the size, radius and accessibility labels.
import React from 'react';
import { View, Pressable, Svg, Rect, Path, Circle } from '../rn';
import { useTheme } from '../theme';

export const RESULTS_MAP_H = 280;
// Where pins land on the drawing, as a share of the box. The prototype has no coordinates, the app uses each address.
const SPOTS = [[0.5, 0.42], [0.24, 0.3], [0.76, 0.5], [0.38, 0.74], [0.64, 0.22], [0.14, 0.6], [0.84, 0.8]];

export default function ResultsMap({ places, onOpen, testID }) {
  const { c } = useTheme();
  const road = c('bg/color-map-road');
  return (
    <View testID={testID} accessibilityLabel={`Map, ${places.length} ${places.length === 1 ? 'place' : 'places'}`} style={{ height: RESULTS_MAP_H, borderRadius: 16, overflow: 'hidden', backgroundColor: c('bg/color-map-land') }}>
      <Svg width="100%" height="100%" viewBox="0 0 370 437" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', top: 0, left: 0 }}>
        <Rect x="0" y="0" width="370" height="437" fill={c('bg/color-map-land')} />
        <Path d="M0 352 C52 336 92 362 136 370 C176 377 200 410 214 437 L0 437 Z" fill={c('bg/color-map-water')} />
        <Path d="M370 40 C340 60 330 96 346 128 C356 148 370 152 370 152 Z" fill={c('bg/color-map-water')} />
        <Rect x="238" y="186" width="104" height="72" rx="10" fill={c('bg/color-map-park')} />
        <Rect x="22" y="66" width="58" height="44" rx="8" fill={c('bg/color-map-park')} />
        <Rect x="184" y="300" width="70" height="46" rx="8" fill={c('bg/color-map-park')} />
        <Path d="M-10 48 H228 M96 48 V447 M186 164 H380 M330 164 V447 M-10 288 H160 M232 288 V447 M-10 400 H380" stroke={road} strokeWidth="5" strokeLinecap="round" fill="none" />
        <Path d="M300 -10 L150 447" stroke={road} strokeWidth="6" strokeLinecap="round" fill="none" />
        <Path d="M150 -10 V447" stroke={road} strokeWidth="8" strokeLinecap="round" fill="none" />
        <Path d="M-10 226 H380" stroke={road} strokeWidth="10" strokeLinecap="round" fill="none" />
      </Svg>
      {places.slice(0, SPOTS.length).map((p, i) => (
        // A 48pt target around a 36 by 46 pin. The tip of the pin sits on the place.
        <Pressable
          key={p.id}
          testID={`map-pin-${p.id}`}
          onPress={() => onOpen(p)}
          accessibilityLabel={`${p.name}, ${p.area}`}
          style={({ pressed }) => [{ position: 'absolute', left: `${SPOTS[i][0] * 100}%`, top: SPOTS[i][1] * RESULTS_MAP_H - 47, marginLeft: -24, width: 48, height: 48, alignItems: 'center', justifyContent: 'flex-end', filter: 'drop-shadow(0 1px 3px rgba(26,26,20,0.16)) drop-shadow(0 4px 12px rgba(26,26,20,0.12))' }, pressed && { transform: [{ scale: 0.92 }] }]}
        >
          <Svg width="36" height="46" viewBox="0 0 36 46">
            <Path d="M18 44 C18 44 34 28 34 17 A16 16 0 1 0 2 17 C2 28 18 44 18 44 Z" fill={c('bg/color-brand')} stroke={c('bg/color-thumb')} strokeWidth="2.5" />
            <Circle cx="18" cy="17" r="6" fill={c('bg/color-thumb')} />
          </Svg>
        </Pressable>
      ))}
    </View>
  );
}
