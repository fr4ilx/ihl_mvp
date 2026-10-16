// Figma: First week card. On Home for a new member at Seedling (V2), above the weekly check-in, until the four first steps
// are done: join the Welcome Circle, say hello there, review a place near you, then check in. It shows one step at a
// time: "Your first week" in H5 Bold, "1 of 4 done" with a Progress bar, then the next step's watercolor
// at 56pt, the step in Body M Bold and one line, and its action (Secondary, Medium). No notifications.
import React from 'react';
import { View, Text, Image } from '../rn';
import { STEP_ART } from '../data';
import { useTheme, type, elevation } from '../theme';
import Icon from './Icon';
import Button from './Button';
import ProgressBar from './ProgressBar';

// The four steps, in order. done(me) says whether a member has done it.
export const FIRST_WEEK = [
  { id: 'join', icon: 'community', title: 'Join the Welcome Circle', text: 'Where new members say hello.', action: 'Join', done: (me) => (me.groups || []).includes('welcome') },
  { id: 'hello', icon: 'chat-bubble', title: 'Say hello', text: 'Tell the Welcome Circle a little about you.', action: 'Say hello', done: (me) => !!me.replied },
  { id: 'review', icon: 'star', title: 'Review a place near you', text: 'Your first review grows you toward Sprout.', action: 'Find a place', done: (me) => (me.visited || []).length > 0 },
  { id: 'checkin', icon: 'sun-light', title: 'Check in this week', text: 'Once a week is enough.', action: 'Check in', done: (me) => !!(me.weeks || [])[(me.weeks || []).length - 1] },
];

export default function FirstWeekCard({ me, onStep, testID = 'first-week' }) {
  const { c } = useTheme();
  const done = FIRST_WEEK.filter((s) => s.done(me)).length;
  const next = FIRST_WEEK.find((s) => !s.done(me));
  if (!next) return null;
  return (
    <View testID={testID} style={{ padding: 16, borderRadius: 20, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, gap: 16 }}>
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>Your first week</Text>
          <Text testID={`${testID}-count`} style={[type('BodyS'), { color: c('text/color-secondary') }]}>{done} of {FIRST_WEEK.length} done</Text>
        </View>
        <ProgressBar value={done} max={FIRST_WEEK.length} />
      </View>
      <View testID={`${testID}-${next.id}`} style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
        <Image source={STEP_ART[next.id]} resizeMode="contain" accessibilityIgnoresInvertColors style={{ width: 56, height: 56 }} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[type('BodyM', 'bold'), { color: c('text/color-primary') }]}>{next.title}</Text>
          <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{next.text}</Text>
          <View style={{ marginTop: 8 }}>
            <Button testID={`${testID}-go`} label={next.action} hierarchy="secondary" size="medium" onPress={() => onStep(next.id)} />
          </View>
        </View>
      </View>
    </View>
  );
}
