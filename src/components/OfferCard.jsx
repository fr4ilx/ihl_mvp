// Figma: Offer card. A member offer on a listing: a 48pt bg/color-brand-subtle circle with the gift icon in
// icon/color-brand, the offer in Body M Bold and how to use it in Body S, on a bg/color-surface-raised card with radius/20.
// Not tappable. Shows under the Member offer title on the listing and as the preview on the Member offer step.
// locked: a Seedling sees the offer with "For Grove members" in place of how to use it, and Join Grove. The whole card
// opens the Grove paywall then.
import React from 'react';
import { View, Text, Pressable } from '../rn';
import { useTheme, type, elevation } from '../theme';
import Icon from './Icon';
import TextLink from './TextLink';

export default function OfferCard({ offer, locked, onUnlock, testID = 'offer-card' }) {
  const { c } = useTheme();
  if (locked) {
    return (
      <Pressable testID={testID} onPress={onUnlock} accessibilityLabel={`${offer.title}. For Grove members. Join Grove`} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, borderRadius: 20, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card }, pressed && { transform: [{ scale: 0.985 }] }]}>
        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c('bg/color-accent-subtle'), alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="lock" size={24} color={c('icon/color-accent')} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[type('BodyM', 'bold'), { color: c('text/color-primary') }]}>{offer.title}</Text>
          <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>For Grove members</Text>
          <TextLink testID="offer-join" label="Join Grove" onPress={onUnlock} style={{ marginTop: 4 }} />
        </View>
      </Pressable>
    );
  }
  return (
    <View testID={testID} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, borderRadius: 20, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card }}>
      <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c('bg/color-brand-subtle'), alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="gift" size={24} color={c('icon/color-brand')} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={[type('BodyM', 'bold'), { color: c('text/color-primary') }]}>{offer.title}</Text>
        {!!offer.details && <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{offer.details}</Text>}
      </View>
    </View>
  );
}
