// The native iOS action sheet, drawn for the prototype only: an optional small title and message, the options in
// one group, then Cancel in its own group. A destructive option is red. Get directions and More on a post use it.
// React Native: iOS draws the real one.
//   ActionSheetIOS.showActionSheetWithOptions({ title, message, options: [...labels, 'Cancel'],
//     destructiveButtonIndex, cancelButtonIndex }, (i) => ...)
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from '../rn';
import { useTheme } from '../theme';
import { motion } from '../theme/motion';

const SYS_BLUE = '#0A84FF';
const sys = (size, weight = '400', lh) => ({ fontFamily: '-apple-system, "SF Pro Text", "Helvetica Neue", Inter, sans-serif', fontSize: size, fontWeight: weight, lineHeight: lh || Math.round(size * 1.3), letterSpacing: -0.2 });

// options: [{ label, destructive, testID }]. onPick gets the option.
export default function ActionSheet({ visible, title, message, options = [], onPick, onClose, testID = 'action-sheet', cancelTestID }) {
  const { c, dark, reduceMotion } = useTheme();
  const [shown, setShown] = useState(false);
  useEffect(() => { if (visible) requestAnimationFrame(() => requestAnimationFrame(() => setShown(true))); else setShown(false); }, [visible]);
  if (!visible) return null;
  const d = reduceMotion ? 0 : motion.actionSheet.duration;
  const ease = motion.actionSheet.easing;
  // iOS system materials, not app tokens: the sheet is drawn by iOS in the app.
  const group = dark ? 'rgba(44,44,46,0.94)' : 'rgba(246,246,246,0.94)';
  const cancelBg = dark ? '#2C2C2E' : '#FFFFFF';
  const sub = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.29)';
  const press = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const red = dark ? '#FF453A' : '#FF3B30';
  const row = { height: 57, alignItems: 'center', justifyContent: 'center' };
  const head = !!(title || message);
  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 80 }]}>
      <Pressable accessibilityLabel="Cancel" onPress={onClose} style={[StyleSheet.absoluteFill, { backgroundColor: c('bg/color-overlay'), opacity: shown ? 1 : 0, transition: `opacity ${d}ms` }]} />
      <View
        testID={testID}
        style={{ position: 'absolute', left: 8, right: 8, bottom: 34, gap: 8, transform: [{ translateY: shown || reduceMotion ? 0 : 320 }], opacity: reduceMotion && !shown ? 0 : 1, transition: reduceMotion ? `opacity ${d}ms` : `transform ${d}ms ${ease}` }}
      >
        <View style={{ borderRadius: 26, overflow: 'hidden', backgroundColor: group, backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)' }}>
          {head && (
            <View style={{ paddingTop: 14, paddingBottom: 14, paddingHorizontal: 16, gap: 2 }}>
              {!!title && <Text style={[sys(13, '600', 18), { textAlign: 'center', color: sub }]}>{title}</Text>}
              {!!message && <Text style={[sys(13, '400', 18), { textAlign: 'center', color: sub }]}>{message}</Text>}
            </View>
          )}
          {options.map((o, i) => (
            <Pressable key={o.label} testID={o.testID} onPress={() => onPick(o)} style={({ pressed }) => [row, (head || i > 0) && { borderTopWidth: 0.5, borderColor: sep }, pressed && { backgroundColor: press }]}>
              <Text style={[sys(20, '400', 25), { color: o.destructive ? red : SYS_BLUE }]}>{o.label}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable testID={cancelTestID || `${testID}-cancel`} onPress={onClose} style={({ pressed }) => [row, { borderRadius: 26, backgroundColor: cancelBg }, pressed && { backgroundColor: dark ? '#3A3A3C' : '#EBEBEB' }]}>
          <Text style={[sys(20, '600', 25), { color: SYS_BLUE }]}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}
