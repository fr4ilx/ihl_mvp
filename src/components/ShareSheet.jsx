// Share: the native iOS share sheet, drawn for the prototype only. Opens from the share button on a listing.
// The header previews what is shared (the listing photo, its name and the app name), then a row of places to
// send it and a Copy action. The real sheet lists the person's own apps and contacts.
// React Native: iOS draws the real one.
//   Share.share({ title: name, message: `${name}, ${address}`, url: listingLink })
// listingLink is a universal link to the listing (it needs a domain from IHL). Without the app it opens the web
// page or the App Store.
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from '../rn';
import { useTheme } from '../theme';
import { motion } from '../theme/motion';
import Icon from './Icon';

const sys = (size, weight = '400', lh) => ({ fontFamily: '-apple-system, "SF Pro Text", "Helvetica Neue", Inter, sans-serif', fontSize: size, fontWeight: weight, lineHeight: lh || Math.round(size * 1.3), letterSpacing: -0.2 });
// Generic targets with Iconoir glyphs, not the real app icons.
const TARGETS = [['chat-bubble', 'Messages'], ['mail', 'Mail'], ['page', 'Notes'], ['more-horiz', 'More']];

export default function ShareSheet({ visible, title, subtitle, photo, onPick, onClose }) {
  const { c, dark, reduceMotion } = useTheme();
  const [shown, setShown] = useState(false);
  useEffect(() => { if (visible) requestAnimationFrame(() => requestAnimationFrame(() => setShown(true))); else setShown(false); }, [visible]);
  if (!visible) return null;
  const d = reduceMotion ? 0 : motion.shareSheet.duration;
  const bg = dark ? '#1C1C1E' : '#F2F2F7';
  const card = dark ? '#2C2C2E' : '#FFFFFF';
  const label = dark ? '#FFFFFF' : '#000000';
  const sub = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.29)';
  const tile = dark ? '#3A3A3C' : '#E5E5EA';
  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 80 }]}>
      <Pressable accessibilityLabel="Close" onPress={onClose} style={[StyleSheet.absoluteFill, { backgroundColor: c('bg/color-overlay'), opacity: shown ? 1 : 0, transition: `opacity ${d}ms` }]} />
      <View testID="share-sheet" style={{ position: 'absolute', left: 8, right: 8, bottom: 8, borderRadius: 44, backgroundColor: bg, paddingTop: 20, paddingHorizontal: 16, paddingBottom: 28, gap: 20, transform: [{ translateY: shown || reduceMotion ? 0 : 420 }], transition: reduceMotion ? 'none' : `transform ${d}ms ${motion.shareSheet.easing}` }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {photo ? <Image source={photo} style={{ width: 48, height: 48, borderRadius: 10 }} /> : <View style={{ width: 48, height: 48, borderRadius: 10, backgroundColor: tile }} />}
          <View style={{ flex: 1, gap: 2 }}>
            <Text numberOfLines={1} style={[sys(17, '600', 22), { color: label }]}>{title}</Text>
            <Text numberOfLines={1} style={[sys(15, '400', 20), { color: sub }]}>{subtitle}</Text>
          </View>
          <Pressable testID="share-close" accessibilityLabel="Close" onPress={onClose} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: dark ? 'rgba(118,118,128,0.24)' : 'rgba(118,118,128,0.12)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="xmark" size={20} color={sub} strokeWidth={2} />
          </Pressable>
        </View>
        <View style={{ height: 0.5, backgroundColor: sep, marginHorizontal: -16 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 }}>
          {TARGETS.map(([icon, name]) => (
            <Pressable key={name} testID={`share-${name.toLowerCase()}`} onPress={() => onPick(name)} style={({ pressed }) => [{ width: 72, alignItems: 'center', gap: 8 }, pressed && { opacity: 0.6 }]}>
              <View style={{ width: 60, height: 60, borderRadius: 14, backgroundColor: tile, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={icon} size={28} color={label} />
              </View>
              <Text style={[sys(12, '400', 16), { color: label }]}>{name}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable testID="share-copy" onPress={() => onPick('Copy')} style={({ pressed }) => [{ height: 52, borderRadius: 26, backgroundColor: card, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }, pressed && { opacity: 0.7 }]}>
          <Text style={[sys(17, '400', 22), { color: label, flex: 1 }]}>Copy</Text>
          <Icon name="copy" size={22} color={label} />
        </Pressable>
      </View>
    </View>
  );
}
