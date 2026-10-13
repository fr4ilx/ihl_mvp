// The iOS location permission alert, drawn for the prototype only.
// In the app this is the real system alert from expo-location. The only copy we own is the purpose line,
// set as NSLocationWhenInUseUsageDescription in app.json.
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from '../rn';
import { useTheme } from '../theme';
import { motion } from '../theme/motion';

const SYS_BLUE = '#0A84FF';
const sys = (size, weight = '400', lh) => ({ fontFamily: '-apple-system, "SF Pro Text", "Helvetica Neue", Inter, sans-serif', fontSize: size, fontWeight: weight, lineHeight: lh || Math.round(size * 1.3), letterSpacing: -0.2 });

export default function SystemAlert({ visible, onChoose }) {
  const { c, dark, reduceMotion } = useTheme();
  const [shown, setShown] = useState(false);
  useEffect(() => { if (visible) requestAnimationFrame(() => requestAnimationFrame(() => setShown(true))); else setShown(false); }, [visible]);
  if (!visible) return null;
  const d = reduceMotion ? 0 : motion.alert.duration;
  const sep = dark ? 'rgba(255,255,255,0.14)' : 'rgba(60,60,67,0.2)';
  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 80, alignItems: 'center', justifyContent: 'center' }]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: c('bg/color-overlay'), opacity: shown ? 1 : 0, transition: `opacity ${d}ms` }]} />
      <View
        testID="location-alert"
        style={{
          width: 270, borderRadius: 14, overflow: 'hidden', backgroundColor: dark ? 'rgba(44,44,46,0.96)' : 'rgba(246,246,246,0.96)',
          backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
          opacity: shown ? 1 : 0, transform: [{ scale: shown ? 1 : motion.alert.fromScale }], transition: `opacity ${d}ms ${motion.alert.easing}, transform ${d}ms ${motion.alert.easing}`,
        }}
      >
        <View style={{ paddingTop: 20, paddingBottom: 16, paddingHorizontal: 16, gap: 4 }}>
          <Text style={[sys(17, '600', 22), { textAlign: 'center', color: dark ? '#FFFFFF' : '#000000' }]}>Allow “Indy Holistic Living” to use your location?</Text>
          <Text style={[sys(13, '400', 18), { textAlign: 'center', color: dark ? '#FFFFFF' : '#000000' }]}>We use it to show practitioners and places near you.</Text>
        </View>
        <MiniMap dark={dark} />
        {['Allow Once', 'Allow While Using App', 'Don’t Allow'].map((l) => (
          <Pressable key={l} testID={`alert-${l}`} onPress={() => onChoose(l)} style={({ pressed }) => [{ height: 44, alignItems: 'center', justifyContent: 'center', borderTopWidth: 0.5, borderColor: sep }, pressed && { backgroundColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
            <Text style={[sys(17, '400'), { color: SYS_BLUE }]}>{l}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function MiniMap({ dark }) {
  const base = dark ? '#2B2D2A' : '#EDEDE7';
  const road = dark ? '#3D3F3B' : '#FFFFFF';
  return (
    <View style={{ height: 150, backgroundColor: base, overflow: 'hidden' }}>
      <View style={{ position: 'absolute', left: -30, top: 70, width: 150, height: 110, borderRadius: 75, backgroundColor: dark ? '#23382A' : '#DDEBDD' }} />
      <View style={{ position: 'absolute', left: 190, top: -30, width: 120, height: 80, borderRadius: 60, backgroundColor: dark ? '#1E3244' : '#D5E6F3' }} />
      {[[0, 62, 270, 8], [118, 0, 8, 150], [0, 112, 270, 5], [200, 0, 5, 150], [40, 0, 5, 150]].map(([x, y, w, h], i) => (
        <View key={i} style={{ position: 'absolute', left: x, top: y, width: w, height: h, backgroundColor: road }} />
      ))}
      <View className="fx-locate" style={{ position: 'absolute', left: 107, top: 47, width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(10,132,255,0.18)' }} />
      <View style={{ position: 'absolute', left: 126, top: 66, width: 18, height: 18, borderRadius: 9, backgroundColor: SYS_BLUE, borderWidth: 3, borderColor: '#FFFFFF' }} />
      <View style={{ position: 'absolute', left: 8, top: 8, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: dark ? 'rgba(44,44,46,0.9)' : 'rgba(255,255,255,0.92)' }}>
        <Text style={[sys(12, '600', 16), { color: SYS_BLUE }]}>Precise: On</Text>
      </View>
    </View>
  );
}
