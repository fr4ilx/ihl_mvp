// Your journey: Journey (stages), Badges and Quest (the season's quest). From My Profile and the Quest card on Home.
// The journey grows from Seedling to Oak by taking part: check-ins, replies, posts and visits (the first review of a listing).
// Nothing here ranks members against each other.
import React, { useRef, useState } from 'react';
import { View, Text, Image, Pressable } from '../rn';
import { useTheme, type, elevation } from '../theme';
import { useNav, useRoute } from '../app/nav';
import { useApp } from '../app/store';
import { STAGES, QUEST, QUESTS } from '../data';
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

// Figma: Quest step (Done No, Yes, Upcoming). One step of the quest: a 32pt circle with its number (border/color-strong ring)
// or a check on bg/color-success once done, the step in Body M Bold and one line, then its action
// (Secondary, Medium), or the Done badge. A quest that has not started shows its steps with no action.
function QuestStep({ step, n, done, onGo, upcoming }) {
  const { c } = useTheme();
  return (
    <View testID={`quest-step-${step.id}`} style={{ flexDirection: 'row', gap: 12, padding: 16, borderRadius: 20, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card }}>
      <View style={{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: done ? c('bg/color-success') : 'transparent', borderWidth: done ? 0 : 1.5, borderColor: c('border/color-strong') }}>
        {done
          ? <Icon name="check" size={18} strokeWidth={2} color={c('text/color-on-status')} />
          : <Text style={[type('BodyS', 'bold'), { color: c('text/color-primary') }]}>{n}</Text>}
      </View>
      <View style={{ flex: 1, gap: 4, paddingTop: 3 }}>
        <Text style={[type('BodyM', 'bold'), { color: c('text/color-primary') }]}>{step.title}</Text>
        <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{step.text}</Text>
        {!upcoming && (
          <View style={{ marginTop: 8 }}>
            {done
              ? <Badge testID={`quest-done-${step.id}`} label="Done" tone="success" icon="check-circle" />
              : <Button testID={`quest-go-${step.id}`} label={step.action} hierarchy="secondary" size="medium" onPress={onGo} />}
          </View>
        )}
      </View>
    </View>
  );
}

// The quest art: the painting when there is one, otherwise its glyph on the accent tint.
function QuestArt({ quest, size }) {
  const { c } = useTheme();
  if (quest.art) return <Image source={quest.art} resizeMode="contain" style={{ width: size, height: size }} />;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: c('bg/color-surface-raised'), alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={quest.icon} size={Math.round(size * 0.5)} color={c('icon/color-accent')} />
    </View>
  );
}

// Figma: Quest row. One season in This year's quests: the art at 48pt on a bg/color-accent-subtle tile, the name in
// Body M Bold and its dates, then Now (Success) for the running quest or a chevron. Opens that quest.
function QuestRow({ quest, live, onPress }) {
  const { c } = useTheme();
  return (
    <Pressable testID={`quest-row-${quest.id}`} onPress={onPress} accessibilityRole="button" accessibilityLabel={`${quest.name}, ${live ? 'running now' : `starts ${quest.starts}`}`} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 72, paddingVertical: 12 }, pressed && { opacity: 0.6 }]}>
      <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: c('bg/color-accent-subtle'), alignItems: 'center', justifyContent: 'center' }}>
        <QuestArt quest={quest} size={40} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[type('BodyM', 'bold'), { color: c('text/color-primary') }]}>{quest.name}</Text>
        <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{quest.dates}</Text>
      </View>
      {live ? <Badge label="Now" tone="success" /> : <Icon name="nav-arrow-right" size={20} color={c('icon/color-secondary')} />}
    </Pressable>
  );
}

// Quest: the running quest by default, or any season by id. Grove members take part in the running one, the others
// show their steps and badge ahead of time with "Starts Dec 21". Together adds up everyone who finished it, as a group
// goal, with no names and no ranks. This year's quests lists all four seasons.
export function Quest() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const { params } = useRoute().route;
  const quest = QUESTS.find((q) => q.id === params.id) || QUEST;
  const live = quest.id === QUEST.id;
  const total = quest.steps.length;
  const done = live ? quest.steps.filter((s) => app.questDone(s.id)).length : 0;
  const badge = live ? app.badges.find((b) => b.id === quest.badge) : null;
  const earned = badge && badge.earned;
  // Each step leads to where it happens. A place counts with its first review.
  const go = (step) => {
    if (step.go[0] === 'category') nav.openTab('directory', 'CategoryResults', { category: step.go[1] });
    if (step.go[0] === 'post') nav.openModal('NewPost', { quest: 'share' });
  };
  // Finishing adds you to Together.
  const together = live && done === total ? quest.together.done + 1 : quest.together.done;
  return (
    <Screen testID="screen-quest" nav={<NavBar kind="back" onBack={nav.goBack} />} bodyGap={24}>
      <View style={{ alignItems: 'center', gap: 8, padding: 24, borderRadius: 20, backgroundColor: c('bg/color-accent-subtle') }}>
        <QuestArt quest={quest} size={128} />
        <Text style={[type('H2', 'bold'), { color: c('text/color-primary'), textAlign: 'center' }]}>{quest.name}</Text>
        <Text style={[type('BodyS', 'bold'), { color: c('text/color-accent') }]}>{quest.dates}</Text>
        <Text style={[type('BodyM'), { color: c('text/color-secondary'), textAlign: 'center' }]}>{quest.about}</Text>
      </View>
      {live ? (
        <View style={{ gap: 8 }}>
          <Text testID="quest-progress" style={[type('BodyS', 'bold'), { color: c('text/color-primary') }]}>{done === total ? 'All done' : `${done} of ${total} done`}</Text>
          <ProgressBar value={done} max={total} />
        </View>
      ) : (
        <Badge testID="quest-starts" label={`Starts ${quest.starts}`} tone="info" icon="calendar" />
      )}
      <View style={{ gap: 12 }}>
        {quest.steps.map((s, i) => <QuestStep key={s.id} step={s} n={i + 1} upcoming={!live} done={live && app.questDone(s.id)} onGo={() => go(s)} />)}
      </View>
      <View testID="quest-reward" style={{ flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, borderRadius: 20, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card }}>
        <Medallion icon={quest.badgeIcon} size={64} state={earned ? 'earned' : 'progress'} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>{quest.badgeName} badge</Text>
          <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{earned ? `You earned it ${earned === 'Today' ? 'today' : `on ${earned}`}.` : live ? `Finish all three by ${quest.ends} to earn it.` : `Finish all three between ${quest.starts} and ${quest.ends} to earn it.`}</Text>
        </View>
      </View>
      {live && (
        <View testID="quest-together" style={{ gap: 8, padding: 16, borderRadius: 20, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card }}>
          <H5>Together</H5>
          <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{together} of {quest.together.goal} members finished it so far.</Text>
          <ProgressBar value={together} max={quest.together.goal} />
        </View>
      )}
      <View testID="quest-year" style={{ gap: 8 }}>
        <H5>This year’s quests</H5>
        <View style={{ paddingHorizontal: 16, borderRadius: 20, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card }}>
          {QUESTS.map((q) => <QuestRow key={q.id} quest={q} live={q.id === QUEST.id} onPress={() => (q.id === quest.id ? null : nav.navigate('Quest', { id: q.id }))} />)}
        </View>
      </View>
    </Screen>
  );
}
