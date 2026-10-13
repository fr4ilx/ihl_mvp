// Figma: City picker. Replaces the Near you title on Directory: the city in H5 Bold with a nav-arrow-down, 48pt tall.
// It opens the City sheet, a Filter sheet with Near me (navigator-alt) first, then Indiana's 10 largest cities
// (map-pin), one at a time. It opens on the person's profile city, which joins the list when it is not one of the 10.
// React Native: Near me asks for location with expo-location the first time, like Use my current location.
import React from 'react';
import { Text, Pressable } from '../rn';
import { useTheme, type } from '../theme';
import { INDIANA_CITIES, NEAR_ME } from '../data';
import FilterSheet from './FilterSheet';
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
  const options = [{ value: NEAR_ME, label: NEAR_ME, icon: 'navigator-alt' }, ...cities.map((x) => ({ value: x, label: x, icon: 'map-pin' }))];
  return <FilterSheet visible={visible} title="Show places in" options={options} value={value} onPick={onPick} onClose={onClose} testPrefix="city" />;
}
