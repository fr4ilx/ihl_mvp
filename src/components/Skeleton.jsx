// Figma: Skeleton. Line (radius full), Block (radius 16), Circle. bg/color-surface, pulsing.
// The layouts below copy the Home, Directory and Feed loading screens in Figma.
import React from 'react';
import { View } from '../rn';
import { useTheme, elevation } from '../theme';

export default function Skeleton({ width = '100%', height = 14, shape = 'line', style }) {
  const { c } = useTheme();
  const r = shape === 'block' ? 16 : 999;
  return <View className="fx-pulse" style={[{ width, height, borderRadius: r, backgroundColor: c('bg/color-surface') }, style]} />;
}

// Stands in for the Home reel: a Sponsored card (338 x 460) with the next one peeking in.
export function ReelSkeleton() {
  const { c } = useTheme();
  const card = (key) => (
    <View key={key} style={{ width: 338, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, borderRadius: 20, padding: 12, gap: 12 }}>
      <Skeleton shape="block" height={300} />
      <View style={{ paddingHorizontal: 4, paddingBottom: 4, gap: 12 }}>
        <Skeleton width={96} height={28} />
        <Skeleton width={150} height={14} />
        <Skeleton width={230} height={22} />
        <Skeleton width={200} height={14} />
      </View>
    </View>
  );
  return (
    <View style={{ flexDirection: 'row', gap: 12, marginRight: -16, marginLeft: -16, paddingLeft: 16, marginTop: -12, paddingTop: 12, marginBottom: -32, paddingBottom: 32, overflow: 'hidden' }}>
      {card('a')}{card('b')}
    </View>
  );
}

// Stands in for Top discussions: a label and three Thread rows in a grouped card.
export function ThreadsSkeleton() {
  const { c } = useTheme();
  return (
    <View style={{ gap: 12 }}>
      <Skeleton width={150} height={18} />
      <View style={{ backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, borderRadius: 16, paddingHorizontal: 16 }}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 12, paddingVertical: 12 }}>
            <Skeleton shape="circle" width={40} height={40} />
            <View style={{ flex: 1, gap: 8, paddingTop: 4 }}>
              <Skeleton height={14} />
              <Skeleton width={160} height={12} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// Stands in for a Featured listing card (370 x 312).
export function CardSkeleton() {
  const { c } = useTheme();
  return (
    <View style={{ backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, borderRadius: 20, padding: 12, gap: 12 }}>
      <Skeleton shape="block" height={204} />
      <Skeleton width={110} height={14} />
      <Skeleton width={240} height={20} />
      <Skeleton width={180} height={14} />
    </View>
  );
}

// Stands in for a Compact listing card (370 x 104).
export function RowSkeleton() {
  const { c } = useTheme();
  return (
    <View style={{ backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, borderRadius: 20, padding: 12, gap: 16, flexDirection: 'row', alignItems: 'center' }}>
      <Skeleton shape="block" width={80} height={80} />
      <View style={{ flex: 1, gap: 12 }}>
        <Skeleton height={16} />
        <Skeleton width={150} height={14} />
      </View>
    </View>
  );
}

// Stands in for a Post card (370 x 364 with a photo, 152 without).
export function PostSkeleton({ photo = true }) {
  const { c } = useTheme();
  return (
    <View style={{ backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, borderRadius: 20, padding: 16, gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', height: 40 }}>
        <Skeleton shape="circle" width={40} height={40} />
        <View style={{ gap: 8, flex: 1 }}>
          <Skeleton width={120} height={14} />
          <Skeleton width={80} height={12} />
        </View>
      </View>
      <Skeleton height={14} />
      <Skeleton width={220} height={14} />
      {photo && <Skeleton shape="block" height={200} />}
      <View style={{ flexDirection: 'row', gap: 20 }}>
        <Skeleton width={60} height={16} />
        <Skeleton width={60} height={16} />
      </View>
    </View>
  );
}
