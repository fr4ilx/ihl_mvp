// Figma: Topics sheet and Categories sheet, built from Sheet rows. One choice at a time from the menu button next to
// Search: the title in H3 Bold and a close button, then one outlined Sheet row per option, 8pt apart. Picking one
// filters the list and closes the sheet. The first option (All topics, All places) clears the filter.
// Favorites: every row but the first ends in a 48pt heart. Tapping it keeps the sheet open, fills the heart and moves
// the row up under the first option, newest favorite first. Tapping again puts it back.
// React Native: the shared bottom sheet (Sheet.jsx), three quarters of the screen. Save favorites with the account.
import React from 'react';
import { View, Text, Pressable } from '../rn';
import { useTheme, type } from '../theme';
import { useApp } from '../app/store';
import { useFeedback } from '../app/feedback';
import Sheet from './Sheet';
import SheetRow, { SheetRows } from './SheetRow';
import Icon from './Icon';

export default function FilterSheet({ visible, title, options, value, onPick, onClose, testPrefix, favoriteKind }) {
  const { c } = useTheme();
  const app = useApp();
  const fb = useFeedback();
  const favs = (favoriteKind && app.favorites[favoriteKind]) || [];
  const [first, ...rest] = options;
  const ordered = [first, ...favs.map((v) => rest.find((o) => o.value === v)).filter(Boolean), ...rest.filter((o) => !favs.includes(o.value))];
  return (
    <Sheet visible={visible} onClose={onClose} title={title}>
      <View style={{ gap: 12 }}>
        {!!favoriteKind && <Text testID={`${testPrefix}-favorites-hint`} style={[type('BodyS'), { color: c('text/color-secondary') }]}>Tap a heart to keep a favorite on top.</Text>}
        <SheetRows accessibilityRole="radiogroup" accessibilityLabel={title}>
          {ordered.map((o) => {
            const fav = favs.includes(o.value);
            return (
              <SheetRow
                key={o.value}
                testID={`${testPrefix}-${o.value}`}
                icon={o.icon}
                label={o.label}
                selected={value === o.value}
                onPress={() => onPick(o.value)}
                trailing={favoriteKind && o !== first ? (
                  <Pressable
                    testID={`${testPrefix}-favorite-${o.value}`}
                    accessibilityRole="switch"
                    aria-checked={fav}
                    accessibilityLabel={`Favorite ${o.label}`}
                    onPress={() => { app.toggleFavorite(favoriteKind, o.value); fb.haptic('selection'); }}
                    style={({ pressed }) => [{ width: 48, height: 48, marginVertical: -4, marginRight: -8, alignItems: 'center', justifyContent: 'center' }, pressed && { opacity: 0.6 }]}
                  >
                    <Icon name="heart" solid={fav} size={24} color={c(fav ? 'icon/color-brand' : 'icon/color-secondary')} />
                  </Pressable>
                ) : null}
              />
            );
          })}
        </SheetRows>
      </View>
    </Sheet>
  );
}
