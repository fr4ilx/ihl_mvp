// Your journey: Journey (stages) and Badges. From My Profile.
// The journey grows from Seedling to Oak by taking part: check-ins, replies, posts and visits (I was here on a listing).
// Nothing here ranks members against each other.
import React, { useRef, useState } from 'react';
import { View, Text, Image } from '../rn';
import { useTheme, type, elevation } from '../theme';
import { useNav, useRoute } from '../app/nav';
import { useApp } from '../app/store';
import { STAGES } from '../data';
import Screen from '../components/Screen';
import NavBar from '../components/NavBar';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Icon from '../components/Icon';
import TextLink from '../components/TextLink';
import Medallion from '../components/Medallion';
import ProgressBar from '../components/ProgressBar';
import BadgeSheet from '../components/BadgeSheet';
import { StageRow, BadgeTile, BadgeRow } from '../components/Journey';

const H5 = ({ children }) => { const { c } = useTheme(); return <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>{children}</Text>; };

// Earned badges first, then the ones closest to done.
export const badgeOrder = (list) => [...list].sort((a, b) => (!!b.earned - !!a.earned) || ((b.value || 0) / (b.goal || 1)) - ((a.value || 0) / (a.goal || 1)));

export function Journey() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const j = app.journey;
  return (
    <Screen testID="screen-journey" nav={<NavBar kind="back" title="Your journey" onBack={nav.goBack} />} bodyGap={24}>
      <View style={{ alignItems: 'center', gap: 4 }}>
        <Medallion icon={j.stage.icon} size={96} />
        <Text style={[type('H2', 'bold'), { color: c('text/color-primary'), marginTop: 12 }]}>{j.stage.name}</Text>
        <Text style={[type('BodyM'), { color: c('text/color-secondary') }]}>Stage {j.index + 1} of {STAGES.length}</Text>
      </View>
      {j.next && (
        <View testID="next-stage" style={{ gap: 12 }}>
          <H5>Next: {j.next.name}</H5>
          <View style={{ backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, borderRadius: 16, paddingHorizontal: 16 }}>
            {j.steps.map((s, i) => (
              <View key={s.label} accessibilityLabel={`${s.label}, ${s.done ? 'done' : s.value || 'to do'}`} style={{ minHeight: 56, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                {s.done
                  ? <Icon name="check-circle" solid size={24} color={c('icon/color-success')} />
                  : <Icon name="circle" size={24} color={c('icon/color-secondary')} />}
                <Text style={[type('BodyM'), { color: c('text/color-primary'), flex: 1 }]}>{s.label}</Text>
                {!s.done && !!s.value && <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{s.value}</Text>}
                {i < j.steps.length - 1 && <View style={{ position: 'absolute', left: 40, right: 0, bottom: 0, height: 1, backgroundColor: c('border/color-subtle') }} />}
              </View>
            ))}
          </View>
        </View>
      )}
      <View style={{ gap: 12 }}>
        <H5>All stages</H5>
        <View style={{ padding: 16, borderRadius: 20, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card }}>
          {STAGES.map((s, i) => <StageRow key={s.id} testID={`stage-${s.id}`} stage={s} state={i < j.index ? 'done' : i === j.index ? 'current' : 'locked'} last={i === STAGES.length - 1} />)}
        </View>
      </View>
      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <H5>Badges</H5>
          <TextLink testID="see-badges" label="See all" onPress={() => nav.navigate('Badges')} />
        </View>
        <BadgeRow badges={badgeOrder(app.badges)} onPress={() => nav.navigate('Badges')} />
      </View>
    </Screen>
  );
}

export function Badges() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const { params } = useRoute().route;
  const [open, setOpen] = useState(() => (params.open ? app.badges.find((b) => b.id === params.open) : null));
  const last = useRef(null);
  if (open) last.current = open;
  const list = badgeOrder(app.badges);
  const earned = list.filter((b) => b.earned).length;
  return (
    <>
      <Screen testID="screen-badges" nav={<NavBar kind="back" title="Badges" onBack={nav.goBack} />} bodyGap={20}>
        <Text testID="badges-count" style={[type('BodyM'), { color: c('text/color-secondary') }]}>{earned} of {list.length} earned</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {list.map((b) => <BadgeTile key={b.id} badge={b} onPress={() => setOpen(b)} />)}
        </View>
      </Screen>
      <BadgeSheet visible={!!open} item={open || last.current} onClose={() => setOpen(null)} />
    </>
  );
}
