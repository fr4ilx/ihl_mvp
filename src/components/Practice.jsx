// Practitioner pieces on My Practice.
// Figma: Practice card, Stat tile and Feature card (State None, Requested, Featured).
import React from 'react';
import { View, Text, Image, Pressable } from '../rn';
import { useTheme, type, elevation } from '../theme';
import Icon from './Icon';
import Badge from './Badge';
import Button from './Button';
import TextLink from './TextLink';
import { NameRow } from './ListingCard';

// Where the listing is: Draft while the checklist is open, In review once sent, Live in the Directory.
export const STATUS = {
  draft: { label: 'Draft', tone: 'neutral' },
  review: { label: 'In review', tone: 'info' },
  live: { label: 'Live', tone: 'success' },
};

// The practice photo, or a quiet tile with the shop icon before any photo is added.
export function PracticePhoto({ photo, size = 56 }) {
  const { c } = useTheme();
  return photo
    ? <Image source={photo} style={{ width: size, height: size, borderRadius: 12 }} />
    : <View style={{ width: size, height: size, borderRadius: 12, backgroundColor: c('bg/color-surface'), alignItems: 'center', justifyContent: 'center' }}><Icon name="shop" size={24} color={c('icon/color-secondary')} /></View>;
}

// Figma: Practice card. Like the profile card on My Profile: photo, name, kind and area, the status badge, a chevron.
// A live listing has the verified mark after the name. Tapping it opens the listing the way seekers see it.
export function PracticeCard({ practice, listing, onPress, testID }) {
  const { c } = useTheme();
  const s = STATUS[practice.status];
  return (
    <Pressable testID={testID} onPress={onPress} accessibilityLabel={`Preview ${practice.name}, ${s.label}`} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16, paddingHorizontal: 16, borderRadius: 16, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card }, pressed && { transform: [{ scale: 0.985 }] }]}>
      <PracticePhoto photo={practice.photos[0]} />
      <View style={{ flex: 1, gap: 8 }}>
        <View>
          <NameRow name={practice.name} verified={practice.status === 'live'} lines={1} size={20} style={[type('BodyM', 'bold'), { color: c('text/color-primary') }]} />
          <Text numberOfLines={1} style={[type('BodyS'), { color: c('text/color-secondary') }]}>{listing.kind}  ·  {listing.area}</Text>
        </View>
        <Badge testID="practice-status" label={s.label} tone={s.tone} />
      </View>
      <Icon name="nav-arrow-right" size={20} color={c('icon/color-secondary')} />
    </Pressable>
  );
}

// Figma: Stat tile. One number for this month and what it counts.
export function StatTile({ value, label }) {
  const { c } = useTheme();
  return (
    <View style={{ flex: 1, padding: 16, borderRadius: 16, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, gap: 4 }}>
      <Text style={[type('H3', 'bold'), { color: c('text/color-primary') }]}>{value}</Text>
      <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{label}</Text>
    </View>
  );
}

// Figma: Feature card. Get featured on Home: a request, then Requested, then Featured with the end date.
export function FeatureCard({ feature, onRequest, onSeeHome }) {
  const { c } = useTheme();
  const state = !feature ? 'none' : feature.status === 'live' ? 'featured' : 'requested';
  return (
    <View testID={`feature-${state}`} style={{ padding: 16, borderRadius: 20, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, gap: 16 }}>
      <View style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c('bg/color-accent-subtle'), alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="sparks" solid={state === 'featured'} size={24} color={c('icon/color-accent')} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>{state === 'featured' ? 'Featured on Home' : 'Get featured on Home'}</Text>
          <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>
            {state === 'none' && 'Your card shows first on Home for seekers nearby.'}
            {state === 'requested' && 'We’ll email you within 2 business days to set it up.'}
            {state === 'featured' && `Until ${feature.until}.`}
          </Text>
        </View>
      </View>
      {state === 'none' && <Button testID="request-feature" label="Request a feature" hierarchy="secondary" size="medium" fill onPress={onRequest} />}
      {state === 'requested' && <Badge label={`Requested  ·  ${feature.length}`} tone="info" />}
      {state === 'featured' && <TextLink testID="see-on-home" label="See it on Home" onPress={onSeeHome} />}
    </View>
  );
}
