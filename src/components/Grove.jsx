// Grove membership pieces. Figma: Perk row, Plan card and Membership card.
// Seedling is the free membership: up to 3 groups. Grove is paid: every group, Ask the Experts, member offers.
// Prices come from StoreKit in the app.
import React from 'react';
import { View, Text, Pressable } from '../rn';
import { useTheme, type, elevation } from '../theme';
import Icon from './Icon';
import Badge from './Badge';
import Button from './Button';
import Radio from './Radio';

// Figma: Perk row. A 40pt bg/color-brand-subtle circle with the icon in icon/color-brand, the perk in Body M Bold and
// one line in Body S. Rows sit 16pt apart in one card.
export function PerkRow({ perk: p }) {
  const { c } = useTheme();
  return (
    <View testID={`perk-${p.id}`} style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c('bg/color-brand-subtle'), alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={p.icon} size={20} color={c('icon/color-brand')} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[type('BodyM', 'bold'), { color: c('text/color-primary') }]}>{p.title}</Text>
        <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{p.text}</Text>
      </View>
    </View>
  );
}

export function PerkList({ perks, testID = 'perks' }) {
  const { c } = useTheme();
  return (
    <View testID={testID} style={{ padding: 16, borderRadius: 20, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, gap: 16 }}>
      {perks.map((p) => <PerkRow key={p.id} perk={p} />)}
    </View>
  );
}

// Figma: Plan card (Selected No, Yes). One plan on Join Grove, a radio card like the Choice card: the Radio, the plan in
// Body M Bold with Save 33% (Accent badge) and its monthly price in Body S, then the price in H5 Bold over "a year".
export function PlanCard({ plan: p, selected, onPress }) {
  const { c } = useTheme();
  return (
    <Pressable
      testID={`plan-${p.id}`}
      accessibilityRole="radio"
      aria-checked={selected}
      accessibilityLabel={`${p.label}, ${p.price} a ${p.per}`}
      onPress={onPress}
      style={({ pressed }) => [
        { flexDirection: 'row', alignItems: 'center', gap: 16, minHeight: 84, paddingVertical: 16, paddingHorizontal: 16, borderRadius: 20 },
        selected
          ? { backgroundColor: c('bg/color-brand-subtle'), borderWidth: 2, borderColor: c('border/color-brand') }
          : { backgroundColor: c('bg/color-surface-raised'), borderWidth: 1, borderColor: c('border/color-control') },
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
    >
      <Radio selected={selected} />
      <View style={{ flex: 1, gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Text style={[type('BodyM', 'bold'), { color: c('text/color-primary') }]}>{p.label}</Text>
          {!!p.save && <Badge label={p.save} tone="accent" />}
        </View>
        <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{p.note}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>{p.price}</Text>
        <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>a {p.per}</Text>
      </View>
    </Pressable>
  );
}

// Figma: Membership card (Tier Seedling, Grove). On My Profile. Seedling: a 48pt bg/color-surface circle with soil-alt,
// "Seedling membership" and what it includes, then Join Grove (Secondary, Medium). Grove: tree on bg/color-accent-subtle,
// "Grove membership" and the renewal date, and the card opens Membership.
export function MembershipCard({ grove, renews, onJoin, onOpen }) {
  const { c } = useTheme();
  const head = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c(grove ? 'bg/color-accent-subtle' : 'bg/color-surface'), alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={grove ? 'tree' : 'soil-alt'} size={24} color={c(grove ? 'icon/color-accent' : 'icon/color-secondary')} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>{grove ? 'Grove membership' : 'Seedling membership'}</Text>
        <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{grove ? `Renews ${renews}` : 'Free, with up to 3 groups'}</Text>
      </View>
      {grove && <Icon name="nav-arrow-right" size={20} color={c('icon/color-secondary')} />}
    </View>
  );
  const style = { padding: 16, borderRadius: 20, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, gap: 16 };
  if (grove) return <Pressable testID="membership-card" onPress={onOpen} accessibilityLabel={`Grove membership, renews ${renews}`} style={({ pressed }) => [style, pressed && { transform: [{ scale: 0.985 }] }]}>{head}</Pressable>;
  return (
    <View testID="membership-card" style={style}>
      {head}
      <Button testID="join-grove" label="Join Grove" hierarchy="secondary" size="medium" fill onPress={onJoin} />
    </View>
  );
}
