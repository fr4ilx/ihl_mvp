// Results map. On Directory search results, between the Search field and the list, when the search finds places
// (Farms, Food, Shops). Practitioners offer services, so they get no pin. A 200pt map with radius/16 and one brand pin
// per place. A pin opens that listing. The drawing uses the bg/color-map-* tokens so it flips with Light and Dark.
// React Native: show a real map instead. react-native-maps MapView (Apple Maps on iOS) with a Marker per place,
// fitted to the markers with fitToCoordinates. Keep the size, radius and accessibility labels.
import React from 'react';
import { View, Pressable, Svg, Rect, Path, Circle } from '../rn';
import { useTheme } from '../theme';

export const RESULTS_MAP_H = 200;
// Where pins land on the drawing, as a share of the box. The prototype has no coordinates, the app uses each address.
const SPOTS = [[0.5, 0.56], [0.24, 0.42], [0.76, 0.5], [0.38, 0.84], [0.64, 0.3], [0.14, 0.78], [0.86, 0.82]];

export default function ResultsMap({ places, onOpen, testID }) {
  const { c } = useTheme();
  const road = c('bg/color-map-road');
  return (
    <View testID={testID} accessibilityLabel={`Map, ${places.length} ${places.length === 1 ? 'place' : 'places'}`} style={{ height: RESULTS_MAP_H, borderRadius: 16, overflow: 'hidden', backgroundColor: c('bg/color-map-land') }}>
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
