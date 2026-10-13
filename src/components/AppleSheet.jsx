// The iOS Sign in with Apple sheet, drawn for the prototype only (like SystemAlert).
// In the app, AppleAuthentication.signInAsync({ requestedScopes: [FULL_NAME, EMAIL] }) from expo-apple-authentication
// shows the real system sheet, then Face ID. Nothing here is ours to style. We only receive the name and the email.
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from '../rn';
import { useTheme } from '../theme';
import { motion } from '../theme/motion';
import Icon from './Icon';

const SYS_BLUE = '#0088FF'; // iOS 26 and later system blue
const sys = (size, weight = '400', lh) => ({ fontFamily: '-apple-system, "SF Pro Text", "Helvetica Neue", Inter, sans-serif', fontSize: size, fontWeight: weight, lineHeight: lh || Math.round(size * 1.3), letterSpacing: -0.2 });
export const APPLE_ACCOUNT = { name: 'Jane Miller', email: 'jane.miller@icloud.com', relay: 'k7mq2xp4dz@privaterelay.appleid.com' };

export default function AppleSheet({ visible, onContinue, onClose }) {
  const { dark, reduceMotion } = useTheme();
  const [hide, setHide] = useState(false);
  if (!visible) return null;
  const d = reduceMotion ? 0 : motion.sheet.duration;
  const bg = dark ? '#1C1C1E' : '#F2F2F7';
  const card = dark ? '#2C2C2E' : '#FFFFFF';
  const fg = dark ? '#FFFFFF' : '#000000';
  const sub = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.29)';
  const Row = ({ on, title, detail, onPress, last }) => (
    <Pressable testID={`apple-${title.startsWith('Hide') ? 'hide' : 'share'}`} onPress={onPress} style={{ minHeight: 60, paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{ flex: 1 }}>
        <Text style={[sys(17, '400', 22), { color: fg }]}>{title}</Text>
        <Text style={[sys(15, '400', 20), { color: sub }]}>{detail}</Text>
      </View>
      {on && <Icon name="check" size={22} strokeWidth={2.2} color={SYS_BLUE} />}
      {!last && <View style={{ position: 'absolute', left: 16, right: 0, bottom: 0, height: 0.5, backgroundColor: sep }} />}
    </Pressable>
  );
  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 80 }]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />
      <View testID="apple-sheet" className="fx-sheet-up" style={{ position: 'absolute', left: 8, right: 8, bottom: 8, borderRadius: 44, backgroundColor: bg, paddingTop: 16, paddingHorizontal: 16, paddingBottom: 28, gap: 20, animationDuration: `${d}ms` }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Pressable accessibilityLabel="Close" onPress={onClose} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: dark ? 'rgba(118,118,128,0.24)' : 'rgba(118,118,128,0.12)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="xmark" size={20} strokeWidth={2.2} color={sub} />
          </Pressable>
        </View>
        <View style={{ alignItems: 'center', gap: 12, marginTop: -40 }}>
          <Icon name="apple" size={56} color={fg} />
          <Text style={[sys(22, '700', 28), { color: fg, textAlign: 'center' }]}>Create an account</Text>
          <Text style={[sys(15, '400', 20), { color: sub, textAlign: 'center', paddingHorizontal: 12 }]}>Create an account for Indy Holistic Living using your Apple Account “{APPLE_ACCOUNT.email}”.</Text>
        </View>
        <View style={{ gap: 6 }}>
          <Text style={[sys(13, '400', 18), { color: sub, paddingHorizontal: 16 }]}>NAME</Text>
          <View style={{ backgroundColor: card, borderRadius: 26, minHeight: 52, paddingHorizontal: 16, justifyContent: 'center' }}>
            <Text style={[sys(17, '400', 22), { color: fg }]}>{APPLE_ACCOUNT.name}</Text>
          </View>
        </View>
        <View style={{ gap: 6 }}>
          <Text style={[sys(13, '400', 18), { color: sub, paddingHorizontal: 16 }]}>EMAIL</Text>
          <View style={{ backgroundColor: card, borderRadius: 26, overflow: 'hidden' }}>
            <Row on={!hide} title="Share My Email" detail={APPLE_ACCOUNT.email} onPress={() => setHide(false)} />
            <Row on={hide} title="Hide My Email" detail={`Forward to: ${APPLE_ACCOUNT.email}`} onPress={() => setHide(true)} last />
          </View>
        </View>
        <Pressable testID="apple-continue" onPress={() => onContinue({ name: APPLE_ACCOUNT.name, email: hide ? APPLE_ACCOUNT.relay : APPLE_ACCOUNT.email })} style={({ pressed }) => [{ height: 52, borderRadius: 26, backgroundColor: SYS_BLUE, alignItems: 'center', justifyContent: 'center' }, pressed && { opacity: 0.8 }]}>
          <Text style={[sys(17, '600', 22), { color: '#FFFFFF' }]}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}
