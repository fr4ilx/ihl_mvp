// Figma: Listing card. Style Sponsored (Home reel, 300pt photo, Glass save, Sponsored badge),
// Featured (204pt photo, Glass save) or Compact (80pt photo left, save on the right).
// Verified: a claimed, vetted listing shows the badge-check in icon/color-accent right after the name.
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from '../rn';
import { useTheme, type, elevation } from '../theme';
import { motion } from '../theme/motion';
import IconButton from './IconButton';
import Badge from './Badge';
import Icon from './Icon';
import { usePop } from '../app/usePop';

// The verified mark is off for now. Flip this back on to show it after the name again.
const SHOW_VERIFIED = false;

// The name with the verified mark right after its last word, inside the text so it wraps with the name.
// React Native: a View inside Text is drawn inline with its bottom on the baseline, so nudge it down to center it.
export function NameRow({ name, verified, style, lines, size = 20 }) {
  const { c } = useTheme();
  return (
    <Text numberOfLines={lines} style={style}>
      {name}
      {SHOW_VERIFIED && verified && (
        <>
          {'\u00A0'}
          <View testID="verified-mark" accessibilityLabel="Verified Local Business" style={{ width: size, height: size, transform: [{ translateY: Math.round(size * 0.15) }] }}>
            <Icon name="badge-check" size={size} color={c('icon/color-accent')} />
          </View>
        </>
      )}
    </Text>
  );
}

export default function ListingCard({ item, variant = 'compact', saved, onPress, onToggleSave, showSave = true, testID }) {
  const { c } = useTheme();
  const [popCls, pop] = usePop(motion.save.duration);
  const save = () => { pop(); onToggleSave && onToggleSave(); };
  if (variant === 'sponsored') {
    // A paid partner on Home. Always labeled Sponsored. 338pt wide in the reel so the next card peeks in.
    return (
      <Pressable testID={testID} onPress={onPress} style={({ pressed }) => [styles.card, { backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, padding: 12, gap: 12 }, pressed && styles.pressed]}>
        <View style={{ height: 300, borderRadius: 16, overflow: 'hidden' }}>
          <Image source={item.photo} style={{ width: '100%', height: '100%' }} />
          {/* A featured practitioner sees their own card without a save button, like their listing. */}
          {showSave && (
            <View style={{ position: 'absolute', top: 12, right: 12 }} className={popCls}>
              <IconButton variant="glass" icon="bookmark" solid={saved} onPress={save} accessibilityLabel={saved ? 'Remove from Saved' : 'Save'} color={saved ? c('icon/color-brand') : undefined} testID={testID ? testID + '-save' : undefined} />
            </View>
          )}
        </View>
        <View style={{ paddingHorizontal: 4, paddingBottom: 4, gap: 4 }}>
          <View style={{ paddingBottom: 4 }}><Badge label="Sponsored" tone="accent" /></View>
          <Text numberOfLines={1} style={[type('BodyS', 'bold'), { color: c('text/color-brand') }]}>{item.kind}  ·  {item.area}</Text>
          <NameRow name={item.name} verified={item.verified} lines={1} size={24} style={[type('H3', 'bold'), { color: c('text/color-primary') }]} />
          <Text numberOfLines={1} style={[type('BodyS'), { color: c('text/color-secondary'), paddingTop: 4 }]}>{item.distance}  ·  {item.hours}</Text>
        </View>
      </Pressable>
    );
  }
  if (variant === 'featured') {
    return (
      <Pressable testID={testID} onPress={onPress} style={({ pressed }) => [styles.card, { backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, padding: 12, gap: 12 }, pressed && styles.pressed]}>
        <View style={{ height: 204, borderRadius: 16, overflow: 'hidden' }}>
          <Image source={item.photo} style={{ width: '100%', height: '100%' }} />
          {showSave && (
            <View style={{ position: 'absolute', top: 12, right: 12 }} className={popCls}>
              <IconButton variant="glass" icon="bookmark" solid={saved} onPress={save} accessibilityLabel={saved ? 'Remove from Saved' : 'Save'} color={saved ? c('icon/color-brand') : undefined} />
            </View>
          )}
        </View>
        <View style={{ paddingHorizontal: 4, paddingBottom: 4, gap: 4 }}>
          <Text style={[type('BodyS', 'bold'), { color: c('text/color-brand') }]}>{item.kind}  ·  {item.area}</Text>
          <NameRow name={item.name} verified={item.verified} size={20} style={[type('H4', 'bold'), { color: c('text/color-primary') }]} />
          <Text style={[type('BodyS'), { color: c('text/color-secondary'), paddingTop: 4 }]}>{item.distance}</Text>
        </View>
      </Pressable>
    );
  }
  return (
    <Pressable testID={testID} onPress={onPress} style={({ pressed }) => [styles.card, styles.compact, { backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card }, pressed && styles.pressed]}>
      <Image source={item.photo} style={{ width: 80, height: 80, borderRadius: 16 }} />
      <View style={{ flex: 1, gap: 4 }}>
        <NameRow name={item.name} verified={item.verified} lines={2} size={20} style={[type('H5', 'bold'), { color: c('text/color-primary') }]} />
        <Text numberOfLines={1} style={[type('BodyS'), { color: c('text/color-secondary') }]}>{item.kind}  ·  {item.area}</Text>
        <Text style={[type('Caption'), { color: c('text/color-tertiary') }]}>{item.distance}</Text>
      </View>
      {showSave && (
        <View className={popCls}>
          <IconButton variant={saved ? 'tinted' : 'outline'} icon="bookmark" solid={saved} onPress={save} accessibilityLabel={saved ? 'Remove from Saved' : 'Save'} testID={testID ? testID + '-save' : undefined} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20 },
  compact: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 16 },
  pressed: { transform: [{ scale: 0.985 }] },
});
