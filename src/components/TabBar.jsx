// Figma: Tab bar. Floating Liquid Glass capsule, 370 x 64pt, 16pt from each side, top at y 784. Four tabs, three for a practitioner.
// Each tab is as wide as its label in Bold plus an equal share of the space left, so a long label like My Practice
// sits inside its pill with room to spare, the way iOS 26 sizes its tab bar items. The selected pill is 4pt inside
// the capsule on every side, so its ends follow the capsule's curve.
// Material follows Apple's Liquid Glass (iOS and iPadOS 27 kit): light blur so content shows through, a specular top edge,
// a hairline rim and a soft 8pt shadow. React Native: a custom tabBar for @react-navigation/bottom-tabs with
// GlassView from expo-glass-effect on iOS 26 and later, and expo-blur BlurView as the fallback.
import React from 'react';
import { View, Text, Pressable, StyleSheet } from '../rn';
import { useTheme, type, elevation } from '../theme';
import { useApp } from '../app/store';
import Icon from './Icon';

// A seeker has four tabs, the last My Profile. A practitioner has three, with no Home: My Practice (shop icon) first,
// Community, then Reach, where they add a promotion or get featured. Figma: Tab bar, Account Seeker or Practitioner.
export const TABS = [
  { id: 'home', label: 'Home', icon: 'home-simple' },
  { id: 'directory', label: 'Directory', icon: 'map' },
  { id: 'community', label: 'Community', icon: 'community' },
  { id: 'profile', label: 'My Profile', icon: 'user-circle' },
];
const PRACTICE_TAB = { id: 'profile', label: 'My Practice', icon: 'shop' };
// A practitioner's Directory tab is Reach: add a promotion or get featured.
const REACH_TAB = { id: 'directory', label: 'Reach', icon: 'antenna-signal' };

export default function TabBar({ active, onChange }) {
  const { c, dark } = useTheme();
  const app = useApp();
  const tabs = app && app.practitioner ? [PRACTICE_TAB, TABS[2], REACH_TAB] : TABS;
  return (
    <View style={[styles.bar, { backgroundColor: c('bg/color-glass'), borderColor: c('border/color-glass'), boxShadow: `${elevation.glass}, inset 0 1px 0.5px ${c('border/color-glass-highlight')}, inset 0 -1px 0.5px rgba(255,255,255,${dark ? 0.06 : 0.35}), 0 0 0 0.5px rgba(0,0,0,0.06)`, backdropFilter: 'blur(10px) saturate(190%) brightness(1.04)', WebkitBackdropFilter: 'blur(10px) saturate(190%) brightness(1.04)' }]}>
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <Pressable
            key={t.id}
            testID={`tab-${t.id}`}
            accessibilityRole="tab"
            aria-selected={on}
            accessibilityLabel={t.label}
            onPress={() => onChange(t.id)}
            style={({ pressed }) => [styles.item, on && { backgroundColor: c('bg/color-selected') }, pressed && { transform: [{ scale: 0.96 }] }]}
          >
            <Icon name={t.icon} size={28} color={on ? c('icon/color-brand') : c('icon/color-secondary')} />
            <View style={{ alignItems: 'center' }}>
              {/* Sized by the label in Bold, so a tab keeps its width when it is picked. */}
              <Text aria-hidden style={[type('Caption', 'bold'), { height: 0, opacity: 0 }]}>{t.label}</Text>
              <Text numberOfLines={1} style={[type('Caption', on ? 'bold' : 'medium'), { color: on ? c('text/color-brand') : c('text/color-secondary') }]}>{t.label}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // 1pt rim plus 3pt padding puts every pill 4pt inside the capsule.
  bar: { position: 'absolute', left: 16, right: 16, top: 784, height: 64, borderRadius: 999, borderWidth: 1, padding: 3, flexDirection: 'row', alignItems: 'center', zIndex: 20 },
  item: { flexGrow: 1, flexBasis: 'auto', height: 56, borderRadius: 999, alignItems: 'center', justifyContent: 'center', gap: 4 },
});
