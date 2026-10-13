// Figma: Choice card (Selected No, Yes). A big single-choice card: the Radio first, then the Role illustration,
// a title and one line. Used on Which one are you? (Seeker or Practitioner). Selected: brand border and brand-subtle
// fill like the Interest card. The Radio leads, where people expect it. The whole card is the radio button.
import React from 'react';
import { View, Text, Image, Pressable } from '../rn';
import { useTheme, type } from '../theme';
import Radio from './Radio';

export default function ChoiceCard({ title, text, art, selected, onPress, testID }) {
  const { c } = useTheme();
  return (
    <Pressable
      testID={testID}
      accessibilityRole="radio"
      aria-checked={selected}
      onPress={onPress}
      style={({ pressed }) => [
        { flexDirection: 'row', alignItems: 'center', gap: 16, minHeight: 120, padding: 16, borderRadius: 20 },
        selected
          ? { backgroundColor: c('bg/color-brand-subtle'), borderWidth: 2, borderColor: c('border/color-brand') }
          : { backgroundColor: c('bg/color-surface-raised'), borderWidth: 1, borderColor: c('border/color-control') },
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
    >
      <Radio selected={selected} />
      <Image source={art} resizeMode="contain" style={{ width: 80, height: 80 }} />
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>{title}</Text>
        <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{text}</Text>
      </View>
    </Pressable>
  );
}
