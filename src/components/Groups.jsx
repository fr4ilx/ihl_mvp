// Groups and Ask the Experts. Figma: Group tile, Group card, Ask card and Question card.
// Groups are forum spaces on top of the topics. Their posts live in the group.
import React from 'react';
import { View, Text, Image, Pressable } from '../rn';
import { useTheme, type, elevation } from '../theme';
import Icon from './Icon';
import Badge from './Badge';
import Button from './Button';
import DashedBorder from './DashedBorder';

export const members = (n) => `${n.toLocaleString('en-US')} members`;

// Figma: Group art. The group's illustration, or for Ask the Experts its icon on a bg/color-info-subtle circle.
export function GroupArt({ group: g, size = 56 }) {
  const { c } = useTheme();
  if (g.art) return <Image source={g.art} resizeMode="contain" style={{ width: size, height: size }} />;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: c('bg/color-info-subtle'), alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={g.icon} size={Math.round(size * 0.45)} color={c('icon/color-info')} />
    </View>
  );
}
export const fresh = (n) => (n ? `${n} new` : 'No new posts');

// Figma: Group tile. Your groups on Community, in a row that scrolls sideways: a 136 by 152pt bg/color-surface-raised
// tile with radius/16, the group art at 56pt, the name in Body S Bold (two lines) and the new posts in Caption Bold
// text/color-brand. Find groups closes the row as a dashed tile. At 136pt, 12 apart, two tiles and most of a third
// show, so the row reads as one that scrolls.
const TILE_W = 136;

export function GroupTile({ group: g, onPress }) {
  const { c } = useTheme();
  return (
    <Pressable testID={`group-tile-${g.id}`} onPress={onPress} accessibilityLabel={`${g.name}, ${fresh(g.fresh)}`} style={({ pressed }) => [{ width: TILE_W, height: 152, borderRadius: 16, padding: 12, gap: 8, alignItems: 'center', backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card }, pressed && { transform: [{ scale: 0.96 }] }]}>
      <GroupArt group={g} size={56} />
      <Text numberOfLines={2} style={[type('BodyS', 'bold'), { color: c('text/color-primary'), textAlign: 'center', alignSelf: 'stretch', flex: 1 }]}>{g.name}</Text>
      <Text numberOfLines={1} style={[type('Caption', g.fresh ? 'bold' : 'medium'), { color: c(g.fresh ? 'text/color-brand' : 'text/color-tertiary') }]}>{fresh(g.fresh)}</Text>
    </Pressable>
  );
}

export function FindGroupsTile({ onPress }) {
  const { c } = useTheme();
  return (
    <Pressable testID="find-groups" onPress={onPress} accessibilityLabel="Find groups" style={({ pressed }) => [{ width: TILE_W, height: 152, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 8 }, pressed && { transform: [{ scale: 0.96 }] }]}>
      <DashedBorder width={TILE_W} height={152} radius={16} />
      <Icon name="plus" size={28} color={c('icon/color-brand')} />
      <Text style={[type('BodyS', 'bold'), { color: c('text/color-brand') }]}>Find groups</Text>
    </Pressable>
  );
}

// Figma: Group card (Joined No, Yes). A row on Groups: the art at 56pt, the name in Body M Bold, members and new posts
// in Body S, then Join (Secondary, Medium) or a chevron once joined. The card opens the group.
export function GroupCard({ group: g, onPress, onJoin }) {
  const { c } = useTheme();
  return (
    <Pressable testID={`group-${g.id}`} onPress={onPress} accessibilityLabel={`${g.name}, ${members(g.members)}${g.joined ? ', joined' : ''}`} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, borderRadius: 20, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card }, pressed && { transform: [{ scale: 0.985 }] }]}>
      <GroupArt group={g} size={56} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text numberOfLines={2} style={[type('BodyM', 'bold'), { color: c('text/color-primary') }]}>{g.name}</Text>
        <Text numberOfLines={1} style={[type('BodyS'), { color: c('text/color-secondary') }]}>{members(g.members)}{g.joined && g.fresh ? `  ·  ${g.fresh} new` : ''}</Text>
      </View>
      {g.joined
        ? <Icon name="nav-arrow-right" size={20} color={c('icon/color-secondary')} />
        : <Button testID={`join-${g.id}`} label="Join" hierarchy="secondary" size="medium" onPress={onJoin} />}
    </Pressable>
  );
}

// Figma: Ask card. On top of Ask the Experts, under the group's header: "Ask a local expert" in H5 Bold and one line,
// then Ask a question (Primary, or Secondary while Join group is the page's Primary). A Seedling sees the Grove badge
// with a lock and the same button opens the paywall.
// quiet: Ask a question turns Secondary while Join group is the page's Primary button.
export function AskCard({ locked, quiet, onAsk }) {
  const { c } = useTheme();
  return (
    <View testID="ask-card" style={{ padding: 16, borderRadius: 20, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, gap: 16 }}>
      <View style={{ gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <Text style={[type('H5', 'bold'), { color: c('text/color-primary'), flexShrink: 1 }]}>Ask a local expert</Text>
          {locked && <Badge label="Grove" tone="accent" icon="lock" />}
        </View>
        <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>Verified local practitioners answer.</Text>
      </View>
      <Button testID="ask-question" label="Ask a question" hierarchy={quiet ? 'secondary' : 'primary'} fill onPress={onAsk} />
    </View>
  );
}

// Figma: Question card. One of your questions, live in the group: the day, the question in Body M, then how many
// answers it has (or See your question) and a chevron. The whole card opens the conversation.
export function QuestionCard({ question: q, answers, onOpen }) {
  const { c } = useTheme();
  return (
    <Pressable testID={`question-${q.id}`} className={q.fresh ? 'fx-list-in' : ''} onPress={onOpen} style={({ pressed }) => [{ padding: 16, borderRadius: 20, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, gap: 12 }, pressed && { transform: [{ scale: 0.985 }] }]}>
      <Text style={[type('Caption'), { color: c('text/color-tertiary') }]}>{q.when}</Text>
      <Text style={[type('BodyM'), { color: c('text/color-primary') }]}>{q.text}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={[type('BodyS', 'bold'), { color: c('text/color-link') }]}>{answers ? `${answers} ${answers === 1 ? 'answer' : 'answers'}` : 'See your question'}</Text>
        <Icon name="nav-arrow-right" size={20} color={c('icon/color-secondary')} />
      </View>
    </Pressable>
  );
}

