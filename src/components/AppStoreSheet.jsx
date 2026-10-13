// The App Store subscription sheet, drawn for the prototype only (like AppleSheet and SystemAlert).
// In the app StoreKit draws it: Purchases.purchasePackage (RevenueCat) or requestSubscription (react-native-iap) with
// the Grove product, then the person confirms with Face ID or the side button. Nothing here is ours to style.
// Subscribe stands in for that confirmation: a spinner, then Done, then the app shows Welcome to Grove.
import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from '../rn';
import { useTheme } from '../theme';
import { motion } from '../theme/motion';
import { images } from '../data';
import Icon from './Icon';

const SYS_BLUE = '#0088FF'; // iOS 26 and later system blue
const sys = (size, weight = '400', lh) => ({ fontFamily: '-apple-system, "SF Pro Text", "Helvetica Neue", Inter, sans-serif', fontSize: size, fontWeight: weight, lineHeight: lh || Math.round(size * 1.3), letterSpacing: -0.2 });

export default function AppStoreSheet({ visible, plan, email, renews, onDone, onClose }) {
  const { dark, reduceMotion } = useTheme();
  const [phase, setPhase] = useState('idle'); // idle, working, done
  useEffect(() => { if (visible) setPhase('idle'); }, [visible]);
  useEffect(() => {
    if (phase === 'working') { const t = setTimeout(() => setPhase('done'), 900); return () => clearTimeout(t); }
    if (phase === 'done') { const t = setTimeout(onDone, 700); return () => clearTimeout(t); }
  }, [phase]);
  if (!visible || !plan) return null;
  const d = reduceMotion ? 0 : motion.sheet.duration;
  const bg = dark ? '#1C1C1E' : '#F2F2F7';
  const card = dark ? '#2C2C2E' : '#FFFFFF';
  const fg = dark ? '#FFFFFF' : '#000000';
  const sub = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.29)';
  const period = plan.per === 'year' ? 'year' : 'month';
  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 80 }]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />
      <View testID="appstore-sheet" className="fx-sheet-up" style={{ position: 'absolute', left: 8, right: 8, bottom: 8, borderRadius: 44, backgroundColor: bg, paddingTop: 16, paddingHorizontal: 16, paddingBottom: 28, gap: 20, animationDuration: `${d}ms` }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 44 }}>
          <View style={{ width: 44 }} />
          <Text style={[sys(17, '600', 22), { color: fg }]}>App Store</Text>
          <Pressable testID="appstore-close" accessibilityLabel="Close" onPress={onClose} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: dark ? 'rgba(118,118,128,0.24)' : 'rgba(118,118,128,0.12)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="xmark" size={20} strokeWidth={2.2} color={sub} />
          </Pressable>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <Image source={images.appIcon} style={{ width: 64, height: 64, borderRadius: 15 }} />
          <View style={{ flex: 1 }}>
            <Text style={[sys(17, '600', 22), { color: fg }]}>Grove {plan.label}</Text>
            <Text style={[sys(15, '400', 20), { color: sub }]}>Indy Holistic Living</Text>
            <Text style={[sys(13, '400', 18), { color: sub }]}>Subscription</Text>
          </View>
        </View>
        <View style={{ backgroundColor: card, borderRadius: 26, paddingHorizontal: 16 }}>
          <View style={{ paddingVertical: 14, gap: 4 }}>
            <Text style={[sys(17, '600', 22), { color: fg }]}>{plan.price} per {period}</Text>
            <Text style={[sys(13, '400', 18), { color: sub }]}>Starting today. Renews {renews}. Plan automatically renews for {plan.price}/{period} until canceled. Cancel in Settings at least a day before each renewal date.</Text>
          </View>
          <View style={{ height: 0.5, backgroundColor: sep }} />
          <View style={{ paddingVertical: 14 }}>
            <Text style={[sys(15, '400', 20), { color: sub }]}>Account: <Text style={[sys(15, '400', 20), { color: fg }]}>{email}</Text></Text>
          </View>
        </View>
        <Pressable testID="appstore-subscribe" disabled={phase !== 'idle'} onPress={() => setPhase('working')} style={({ pressed }) => [{ height: 52, borderRadius: 26, backgroundColor: phase === 'done' ? (dark ? '#30D158' : '#34C759') : SYS_BLUE, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }, pressed && { opacity: 0.8 }]}>
          {phase === 'idle' && <Text style={[sys(17, '600', 22), { color: '#FFFFFF' }]}>Subscribe</Text>}
          {phase === 'working' && <View className="sys-spinner" style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.35)', borderTopColor: '#FFFFFF' }} />}
          {phase === 'done' && <><Icon name="check" size={22} strokeWidth={2.4} color="#FFFFFF" /><Text style={[sys(17, '600', 22), { color: '#FFFFFF' }]}>Done</Text></>}
        </Pressable>
      </View>
    </View>
  );
}
