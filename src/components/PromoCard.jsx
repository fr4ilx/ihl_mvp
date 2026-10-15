// Figma: Promotion card. A practice's promotion: a 48pt bg/color-accent-subtle circle with the megaphone in
// icon/color-accent, the promotion in Body M Bold and when it ends in Body S, on bg/color-surface-raised with radius/20.
// Not tappable on a listing. On a practitioner's Directory it adds a Remove link (Edit promotion is the button there).
import React from 'react';
import { View, Text } from '../rn';
import { useTheme, type, elevation } from '../theme';
import Icon from './Icon';
import TextLink from './TextLink';

// "Ends Sun, Oct 11" from an ISO day.
export const promoEnds = (iso) => `Ends ${new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`;

const Circle = () => {
  const { c } = useTheme();
  return (
    <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c('bg/color-accent-subtle'), alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="megaphone" size={24} color={c('icon/color-accent')} />
    </View>
  );
};

export default function PromoCard({ promo, onEdit, onRemove, testID = 'promo-card' }) {
  const { c } = useTheme();
  return (
    <View testID={testID} style={{ padding: 16, borderRadius: 20, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <Circle />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[type('BodyM', 'bold'), { color: c('text/color-primary') }]}>{promo.text}</Text>
          <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{promoEnds(promo.ends)}</Text>
        </View>
      </View>
      {(onEdit || onRemove) && (
        <View style={{ flexDirection: 'row', gap: 24, paddingLeft: 64 }}>
          {onEdit && <TextLink testID="promo-edit" label="Edit" onPress={onEdit} />}
          {onRemove && <TextLink testID="promo-remove" label="Remove" onPress={onRemove} />}
        </View>
      )}
    </View>
  );
}
