// Figma: Service tag. One service on a listing, a row in the Services card: 56pt, the name in Body M Bold,
// text/color-primary, with a border/color-subtle divider under every row but the last. The card is an inset grouped
// card (bg/color-surface-raised, radius/16, 16pt sides, Elevation/Card), like Settings. Not tappable, so no chevron.
// Names only, the app shows no prices.
import React from 'react';
import { View, Text } from '../rn';
import { useTheme, type, elevation } from '../theme';

export default function ServiceTag({ label, divider }) {
  const { c } = useTheme();
  return (
    <View style={{ minHeight: 56, paddingVertical: 15, justifyContent: 'center' }}>
      <Text style={[type('BodyM', 'bold'), { color: c('text/color-primary') }]}>{label}</Text>
      {divider && <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 1, backgroundColor: c('border/color-subtle') }} />}
    </View>
  );
}

// Every service on a listing in one card.
export function ServiceList({ services }) {
  const { c } = useTheme();
  return (
    <View testID="service-list" style={{ backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, borderRadius: 16, paddingHorizontal: 16 }}>
      {services.map((name, i) => <ServiceTag key={name} label={name} divider={i < services.length - 1} />)}
    </View>
  );
}
