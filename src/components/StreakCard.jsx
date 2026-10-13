// Figma: Streak card (Checked in No, Yes). The weekly check-in on Home. Once a week is enough, there is no daily streak.
// A 48pt bg/color-accent-subtle circle with sun-light in icon/color-accent, "Weekly check-in" in H5 Bold and the streak in
// Body S. Then the last six weeks, oldest first: a 32pt circle per week, bg/color-brand with a check for a week with a
// check-in, a 1.5pt border/color-strong ring for this week while it is open, bg/color-surface for a week that was missed,
// each over the Sunday it starts on in Caption (this week in Bold text/color-brand). Then Check in (Secondary, Medium),
// or "You checked in this week" with a Solid check-circle once it is done. Weeks start on Sunday, US style.
import React from 'react';
import { View, Text } from '../rn';
import { useTheme, type, elevation } from '../theme';
import { TODAY } from '../data';
import Icon from './Icon';
import Button from './Button';

// The Sundays that start the last n weeks, like "Sep 27". The app uses the phone's calendar.
export function weekStarts(n = 6, today = TODAY) {
  const d = new Date(`${today}T12:00:00`);
  d.setDate(d.getDate() - d.getDay());
  return Array.from({ length: n }, (_, i) => {
    const x = new Date(d);
    x.setDate(d.getDate() - (n - 1 - i) * 7);
    return x.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
}

export default function StreakCard({ weeks, streak, onCheckIn, testID = 'streak-card' }) {
  const { c } = useTheme();
  const labels = weekStarts(weeks.length);
  const done = weeks[weeks.length - 1];
  return (
    <View testID={testID} style={{ padding: 16, borderRadius: 20, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, gap: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c('bg/color-accent-subtle'), alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="sun-light" size={24} color={c('icon/color-accent')} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>Weekly check-in</Text>
          <Text testID="streak-count" style={[type('BodyS'), { color: c('text/color-secondary') }]}>{streak ? `${streak} ${streak === 1 ? 'week' : 'weeks'} in a row` : 'Once a week is enough'}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {weeks.map((on, i) => {
          const now = i === weeks.length - 1;
          return (
            <View key={labels[i]} accessibilityLabel={`Week of ${labels[i]}, ${on ? 'checked in' : now ? 'open' : 'missed'}`} style={{ width: 52, alignItems: 'center', gap: 6 }}>
              <View
                className={on && now ? 'fx-pop-in' : ''}
                style={{
                  width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: on ? c('bg/color-brand') : now ? 'transparent' : c('bg/color-surface'),
                  borderWidth: !on && now ? 1.5 : 0, borderColor: c('border/color-strong'),
                }}
              >
                {on && <Icon name="check" size={18} strokeWidth={2} color={c('icon/color-on-brand')} />}
              </View>
              <Text numberOfLines={1} style={[type('Caption', now ? 'bold' : 'medium'), { color: c(now ? 'text/color-brand' : 'text/color-tertiary') }]}>{labels[i]}</Text>
            </View>
          );
        })}
      </View>
      {done ? (
        <View testID="checked-in" className="fx-fade-up" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48 }}>
          <Icon name="check-circle" solid size={24} color={c('icon/color-success')} />
          <Text style={[type('BodyM', 'bold'), { color: c('text/color-primary') }]}>You checked in this week</Text>
        </View>
      ) : (
        <Button testID="check-in" label="Check in" hierarchy="secondary" size="medium" fill onPress={onCheckIn} />
      )}
    </View>
  );
}
