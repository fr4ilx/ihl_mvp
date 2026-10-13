// Figma: City picker. Replaces the Near you title on Directory: the city in H5 Bold with a nav-arrow-down, 48pt tall.
// It opens the City sheet: Near me first, then Indiana's 10 largest cities, as small Chips that wrap 8 apart, one at a
// time. It opens on the person's profile city, which joins the list when it is not one of the 10.
// React Native: Near me asks for location with expo-location the first time, like Use my current location.
import React from 'react';
import { View, Text, Pressable } from '../rn';
import { useTheme, type } from '../theme';
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
