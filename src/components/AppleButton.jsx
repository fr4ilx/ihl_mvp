// Continue with Apple. Apple's colors and logo, our button shape and type so it lines up with Sign up with email.
// Black with a white logo and title in Light, white with black in Dark (Apple does not allow black on a dark background,
// and never brand colors). 56pt pill, Apple logo at 24pt, title in Body M Bold, 8pt gap, like Button Large.
// In the app this is a custom Pressable with the same look that calls AppleAuthentication.signInAsync().
// App Review checks custom Sign in with Apple buttons. Colors, logo and the "Continue with Apple" title follow Apple's rules.
import React from 'react';
import { Pressable, Text } from '../rn';
import { useTheme, type } from '../theme';
import { motion } from '../theme/motion';
import Icon from './Icon';

export default function AppleButton({ onPress, testID }) {
  const { dark } = useTheme();
  const bg = dark ? '#FFFFFF' : '#000000'; // Apple's required colors, not brand tokens
  const fg = dark ? '#000000' : '#FFFFFF';
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel="Continue with Apple"
      onPress={onPress}
      style={({ pressed }) => [{ height: 56, borderRadius: 999, backgroundColor: bg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 24, alignSelf: 'stretch' }, pressed && { transform: [{ scale: motion.press.scale }] }]}
    >
      <Icon name="apple" size={24} color={fg} />
      <Text style={[type('BodyM', 'bold'), { color: fg }]}>Continue with Apple</Text>
    </Pressable>
  );
}
