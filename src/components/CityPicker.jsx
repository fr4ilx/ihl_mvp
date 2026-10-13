// Figma: City picker. Replaces the Near you title on Directory: the city in H5 Bold with a nav-arrow-down, 48pt tall.
// It opens the City sheet: Near me first, then Indiana's 10 largest cities, as small Chips that wrap 8 apart, one at a
// time. It opens on the person's profile city, which joins the list when it is not one of the 10.
// React Native: Near me asks for location with expo-location the first time, like Use my current location.
import React from 'react';
import { View, Text, Pressable } from '../rn';
import { useTheme, type, useRaised } from '../theme';
import { INDIANA_CITIES, NEAR_ME } from '../data';
import Sheet from './Sheet';
import Chip from './Chip';
import Icon from './Icon';

export function CityButton({ value, onPress }) {
  const { c } = useTheme();
  return (
    <Pressable
      testID="open-city"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Showing ${value}. Change city`}
      style={({ pressed }) => [{ minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', marginVertical: -12 }, pressed && { opacity: 0.6 }]}
    >
      <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>{value}</Text>
      <Icon name="nav-arrow-down" size={20} color={c('icon/color-primary')} />
    </Pressable>
  );
}

export function CitySheet({ visible, value, home, onPick, onClose }) {
  const cities = home && !INDIANA_CITIES.includes(home) ? [home, ...INDIANA_CITIES] : INDIANA_CITIES;
  return (
    <Sheet visible={visible} onClose={onClose} title="Show places in" testID="city-sheet">
      <View accessibilityRole="radiogroup" accessibilityLabel="Show places in" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {[NEAR_ME, ...cities].map((x) => <Chip key={x} testID={`city-${x}`} label={x} small selected={value === x} onPress={() => onPick(x)} />)}
      </View>
    </Sheet>
  );
}

// Figma: Radius pill. At the right of the City picker row: a 40pt pill on the idle Chip fill with the distance in
// Caption Bold and a nav-arrow-down. It reads "Any distance" until one is picked, then "Within 10 mi" and fills with
// bg/color-brand. 48pt hit area. It opens the Radius sheet, small Chips one at a time.
// The prototype counts miles from the person, the distance on each card. The app decides how a picked city counts.
export const RADII = [null, 5, 10, 25, 50];
export const radiusLabel = (r) => (r ? `Within ${r} mi` : 'Any distance');

export function RadiusButton({ value, onPress }) {
  const { c } = useTheme();
  const raised = useRaised();
  const on = !!value;
  const fg = c(on ? 'text/color-on-brand' : 'text/color-primary');
  return (
    <Pressable
      testID="open-radius"
      onPress={onPress}
      hitSlop={{ top: 4, bottom: 4 }}
      accessibilityRole="button"
      accessibilityLabel={`${radiusLabel(value)}. Change distance`}
      style={({ pressed }) => [
        { height: 40, paddingLeft: 12, paddingRight: 8, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 4, marginVertical: -8 },
        on ? { backgroundColor: c('bg/color-brand') } : { backgroundColor: c(raised), borderWidth: 1, borderColor: c('border/color-control-subtle') },
        pressed && { transform: [{ scale: 0.95 }] },
      ]}
    >
      <Text style={[type('Caption', 'bold'), { color: fg }]}>{radiusLabel(value)}</Text>
      <Icon name="nav-arrow-down" size={16} color={fg} />
    </Pressable>
  );
}

export function RadiusSheet({ visible, value, onPick, onClose }) {
  return (
    <Sheet visible={visible} onClose={onClose} title="How far" testID="radius-sheet">
      <View accessibilityRole="radiogroup" accessibilityLabel="How far" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {RADII.map((r) => <Chip key={r || 'any'} testID={`radius-${r || 'any'}`} label={r ? `${r} mi` : 'Any distance'} small selected={value === r} onPress={() => onPick(r)} />)}
      </View>
    </Sheet>
  );
}
