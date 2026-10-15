// The journey pieces. Figma: Journey card, Stage row, Badge tile, Badge row and Quest card.
// Stages and badges always show their name and state in words next to the Medallion, never by color alone.
import React from 'react';
import { View, Text, Image, Pressable } from '../rn';
import { useTheme, type, elevation } from '../theme';
import { STAGES, QUEST } from '../data';
import Icon from './Icon';
import Badge from './Badge';
import Medallion from './Medallion';
import ProgressBar from './ProgressBar';

const card = (c) => ({ padding: 16, borderRadius: 20, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card });
const pressedScale = { transform: [{ scale: 0.985 }] };

// What the bar toward the next stage means, in words: the counts when every step has one, otherwise how many are done.
export const nextLine = (j) => (j.steps.every((s) => s.value) ? j.steps.map((s) => s.value).join('  ·  ') : `${j.done} of ${j.steps.length} steps done`);

// Figma: Journey card. My Profile: the stage Medallion at 56pt, the stage in H5 Bold over "Stage 2 of 6", a chevron,
// then "Next: Root" with a Progress bar and what is left in words. Opens Your journey.
export function JourneyCard({ journey: j, onPress, testID = 'journey-card' }) {
  const { c } = useTheme();
  return (
    <Pressable testID={testID} onPress={onPress} accessibilityLabel={`Your journey, ${j.stage.name}, stage ${j.index + 1} of ${STAGES.length}`} style={({ pressed }) => [card(c), { gap: 16 }, pressed && pressedScale]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <Medallion icon={j.stage.icon} size={56} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>{j.stage.name}</Text>
          <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>Stage {j.index + 1} of {STAGES.length}</Text>
        </View>
        <Icon name="nav-arrow-right" size={20} color={c('icon/color-secondary')} />
      </View>
      {j.next ? (
        <View style={{ gap: 8 }}>
          <Text style={[type('BodyS', 'bold'), { color: c('text/color-primary') }]}>Next: {j.next.name}</Text>
          <ProgressBar value={j.part} max={1} />
          <Text testID="journey-next" style={[type('BodyS'), { color: c('text/color-secondary') }]}>{nextLine(j)}</Text>
        </View>
      ) : (
        <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>You’ve reached every stage.</Text>
      )}
    </Pressable>
  );
}

// "Add a short bio, reply to a post, visit a local place": a stage's steps as one line.
export const stepsLine = (steps) => steps.map((s, i) => (i ? s[0].toLowerCase() + s.slice(1) : s)).join(', ');

// Figma: Stage row (State Done, Current, Locked). Your journey lists all six in one card: the Medallion at 48pt,
// a 2pt line down to the next stage (border/color-accent once passed, border/color-default ahead), the name in
// Body M Bold and its steps in Body S. Done has a Solid check-circle, Current the "You’re here" badge, Locked the lock.
export function StageRow({ stage, state, last, testID }) {
  const { c } = useTheme();
  return (
    <View testID={testID} accessibilityLabel={`${stage.name}, ${state === 'done' ? 'done' : state === 'current' ? 'you’re here' : 'locked'}`} style={{ flexDirection: 'row', gap: 16 }}>
      <View style={{ width: 48, alignItems: 'center' }}>
        <Medallion icon={stage.icon} size={48} state={state === 'locked' ? 'locked' : 'earned'} />
        {!last && <View style={{ flex: 1, width: 2, minHeight: 20, marginVertical: 4, borderRadius: 1, backgroundColor: c(state === 'done' ? 'border/color-accent' : 'border/color-default') }} />}
      </View>
      <View style={{ flex: 1, gap: 2, paddingTop: 2, paddingBottom: last ? 0 : 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 28 }}>
          <Text style={[type('BodyM', 'bold'), { color: c(state === 'locked' ? 'text/color-secondary' : 'text/color-primary'), flex: 1 }]}>{stage.name}</Text>
          {state === 'done' && <Icon name="check-circle" solid size={24} color={c('icon/color-success')} />}
          {state === 'current' && <Badge testID="stage-current" label="You’re here" tone="accent" />}
        </View>
        <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{stepsLine(stage.steps)}</Text>
      </View>
    </View>
  );
}

// Figma: Badge tile (State Earned, In progress). Badges, two to a row: the Medallion at 64pt, the name in Body M Bold,
// then "Earned Sep 14" in Caption Bold text/color-accent, or a Progress bar with "6 of 10 places". Opens the Badge sheet.
export function BadgeTile({ badge: b, onPress }) {
  const { c } = useTheme();
  const earned = !!b.earned;
  return (
    <Pressable testID={`badge-${b.id}`} onPress={onPress} accessibilityLabel={`${b.name}, ${earned ? `earned ${b.earned}` : `${Math.min(b.value, b.goal)} of ${b.goal} ${b.unit}`}`} style={({ pressed }) => [card(c), { width: 179, height: 184, alignItems: 'center', justifyContent: 'center', gap: 8 }, pressed && { transform: [{ scale: 0.97 }] }]}>
      <Medallion icon={b.icon} size={64} state={earned ? 'earned' : 'progress'} />
      <Text numberOfLines={1} style={[type('BodyM', 'bold'), { color: c('text/color-primary'), textAlign: 'center', alignSelf: 'stretch', marginTop: 4 }]}>{b.name}</Text>
      {earned ? (
        <Text style={[type('Caption', 'bold'), { color: c('text/color-accent') }]}>Earned {b.earned}</Text>
      ) : (
        <View style={{ alignSelf: 'stretch', gap: 6, paddingHorizontal: 8 }}>
          <ProgressBar value={Math.min(b.value, b.goal)} max={b.goal} />
          <Text style={[type('Caption'), { color: c('text/color-secondary'), textAlign: 'center' }]}>{Math.min(b.value, b.goal)} of {b.goal} {b.unit}</Text>
        </View>
      )}
    </Pressable>
  );
}

// Figma: Badge row. Up to four badges in one card, each a 48pt Medallion over its name in Caption. My Profile shows
// earned ones first, then the closest ones in progress, and the card opens Badges. A member profile shows earned only.
export function BadgeRow({ badges, onPress, testID = 'badge-row' }) {
  const { c } = useTheme();
  const inner = badges.slice(0, 4).map((b) => (
    <View key={b.id} style={{ width: 76, alignItems: 'center', gap: 8 }}>
      <Medallion icon={b.icon} size={48} state={b.earned === false || (b.earned == null && b.goal) ? 'progress' : 'earned'} />
      <Text numberOfLines={1} style={[type('Caption'), { color: c('text/color-secondary'), textAlign: 'center', alignSelf: 'stretch' }]}>{b.name}</Text>
    </View>
  ));
  const style = [card(c), { flexDirection: 'row', justifyContent: badges.length >= 4 ? 'space-between' : 'flex-start', gap: badges.length >= 4 ? 0 : 12 }];
  return onPress
    ? <Pressable testID={testID} onPress={onPress} accessibilityLabel="Badges" style={({ pressed }) => [...style, pressed && pressedScale]}>{inner}</Pressable>
    : <View testID={testID} style={style}>{inner}</View>;
}

// Figma: Quest card (Locked No, Yes). The season's quest on Home: the quest art on a 72pt bg/color-accent-subtle tile,
// the name in H5 Bold, "1 of 3 done  ·  Ends Dec 20" and a Progress bar, then a chevron. For a Seedling it reads
// "For Grove members" with the Grove badge, and opens the paywall.
export function QuestCard({ done, locked, onPress, testID = 'quest-card' }) {
  const { c } = useTheme();
  const total = QUEST.steps.length;
  return (
    <Pressable testID={testID} onPress={onPress} accessibilityLabel={`${QUEST.name}, ${locked ? 'for Grove members' : `${done} of ${total} done`}`} style={({ pressed }) => [card(c), { flexDirection: 'row', alignItems: 'center', gap: 16 }, pressed && pressedScale]}>
      <View style={{ width: 72, height: 72, borderRadius: 16, backgroundColor: c('bg/color-accent-subtle'), alignItems: 'center', justifyContent: 'center' }}>
        <Image source={QUEST.art} resizeMode="contain" style={{ width: 60, height: 60 }} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>{QUEST.name}</Text>
        {locked ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Badge label="Grove" tone="accent" icon="lock" />
            <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>Ends {QUEST.ends}</Text>
          </View>
        ) : (
          <>
            <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{done === total ? 'All done' : `${done} of ${total} done`}  ·  Ends {QUEST.ends}</Text>
            <ProgressBar value={done} max={total} style={{ marginTop: 4 }} />
          </>
        )}
      </View>
      <Icon name="nav-arrow-right" size={20} color={c('icon/color-secondary')} />
    </Pressable>
  );
}
