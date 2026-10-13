// An iOS alert that asks before something that can't be undone, drawn for the prototype only (Delete account).
// Cancel on the left, the destructive action in red on the right.
// React Native: iOS draws the real one.
//   Alert.alert(title, message, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress }])
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from '../rn';
import { useTheme } from '../theme';
import { motion } from '../theme/motion';

const sys = (size, weight = '400', lh) => ({ fontFamily: '-apple-system, "SF Pro Text", "Helvetica Neue", Inter, sans-serif', fontSize: size, fontWeight: weight, lineHeight: lh || Math.round(size * 1.3), letterSpacing: -0.2 });

export default function ConfirmAlert({ visible, title, message, actions, testID }) {
  const { c, dark, reduceMotion } = useTheme();
  const [shown, setShown] = useState(false);
  useEffect(() => { if (visible) requestAnimationFrame(() => requestAnimationFrame(() => setShown(true))); else setShown(false); }, [visible]);
  if (!visible) return null;
  const d = reduceMotion ? 0 : motion.alert.duration;
  const sep = dark ? 'rgba(255,255,255,0.14)' : 'rgba(60,60,67,0.2)';
  const blue = '#0A84FF';
  const red = dark ? '#FF453A' : '#FF3B30';
  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 80, alignItems: 'center', justifyContent: 'center' }]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: c('bg/color-overlay'), opacity: shown ? 1 : 0, transition: `opacity ${d}ms` }]} />
      <View
        testID={testID}
        style={{
          width: 270, borderRadius: 14, overflow: 'hidden', backgroundColor: dark ? 'rgba(44,44,46,0.96)' : 'rgba(246,246,246,0.96)',
          backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
          opacity: shown ? 1 : 0, transform: [{ scale: shown ? 1 : motion.alert.fromScale }], transition: `opacity ${d}ms ${motion.alert.easing}, transform ${d}ms ${motion.alert.easing}`,
        }}
      >
        <View style={{ paddingTop: 20, paddingBottom: 18, paddingHorizontal: 16, gap: 4 }}>
          <Text style={[sys(17, '600', 22), { textAlign: 'center', color: dark ? '#FFFFFF' : '#000000' }]}>{title}</Text>
          {!!message && <Text style={[sys(13, '400', 18), { textAlign: 'center', color: dark ? '#FFFFFF' : '#000000' }]}>{message}</Text>}
        </View>
        <View style={{ flexDirection: 'row', borderTopWidth: 0.5, borderColor: sep }}>
          {actions.map((a, i) => (
            <Pressable key={a.label} testID={`alert-${a.label.toLowerCase()}`} onPress={a.onPress} style={({ pressed }) => [{ flex: 1, height: 44, alignItems: 'center', justifyContent: 'center', borderLeftWidth: i ? 0.5 : 0, borderColor: sep }, pressed && { backgroundColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
              <Text style={[sys(17, a.style === 'cancel' ? '600' : '400'), { color: a.style === 'destructive' ? red : blue }]}>{a.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
