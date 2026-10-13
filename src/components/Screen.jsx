// Screen shell: plain canvas background, a sticky nav bar, a scroll body,
// and an optional fixed bottom area (tab bar, sticky button bar or composer).
// The nav bar stays put. When content scrolls under it, a canvas fill with blur fades in (motion.navFill).
// React Native: SafeAreaView edges, a ScrollView with contentContainerStyle paddings, BlurView for the fill.
import React, { useState, useLayoutEffect } from 'react';
import { View, ScrollView, StyleSheet } from '../rn';
import { useTheme, withAlpha } from '../theme';
import { motion } from '../theme/motion';

export const STATUS_BAR = 62;
export const NAV_BAR = 56;

// Review panel only: open a screen scrolled so the element with `testID` sits `top` pt from the top.
// 138 tucks the section above it (20pt gap) fully under the 118pt nav fill.
export function useScrollTo(ref, testID, top = 138) {
  useLayoutEffect(() => {
    if (!testID) return undefined;
    const go = () => {
      const box = ref.current;
      const el = box && box.querySelector(`[data-testid="${testID}"]`);
      if (el) box.scrollTop += el.getBoundingClientRect().top - box.getBoundingClientRect().top - top;
    };
    go();
    const t = setTimeout(go, 300);
    return () => clearTimeout(t);
  }, []);
}

// True once the content has scrolled past `threshold` pt.
export function useScrolled(threshold = 4) {
  const [on, setOn] = useState(false);
  const onScroll = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    if (y > threshold !== on) setOn(y > threshold);
  };
  return [on, onScroll];
}

// The scroll edge, as in iOS 26: content softens over 16pt where it meets a bar instead of stopping at a hard line.
export const EDGE = 16;
const fade = (color, to) => `linear-gradient(to ${to}, ${withAlpha(color, 0)}, ${color})`;

// Canvas fill behind the status bar and nav bar, solid so nothing shows through, with the scroll edge under it.
// It fades in once content scrolls under the bar.
export function HeaderFill({ visible, height = STATUS_BAR + NAV_BAR }) {
  const { c, reduceMotion } = useTheme();
  const canvas = c('bg/color-canvas');
  return (
    <View
      pointerEvents="none"
      style={{
        // 2pt above the top edge so no hairline of content shows at the screen edge.
        position: 'absolute', top: -2, left: 0, right: 0, height: height + EDGE + 2,
        backgroundImage: `linear-gradient(to bottom, ${canvas} ${height + 2}px, ${withAlpha(canvas, 0)})`,
        opacity: visible ? 1 : 0,
        transition: reduceMotion ? 'none' : `opacity ${motion.navFill.duration}ms ${motion.navFill.easing}`,
      }}
    />
  );
}

// bodyTop: 24 under a Back bar (content starts at y 142), 12 under a Title bar on the tab screens (y 130).
// statusFill: no nav bar, but the canvas fills in behind the status bar once content scrolls under it (Directory).
export default function Screen({ nav, statusFill, children, bottom, bodyPadding = 16, bodyGap = 20, bodyTop = 24, bottomSpace = 140, background, scrollRef, testID, center }) {
  const { c } = useTheme();
  const [scrolled, onScroll] = useScrolled();
  return (
    <View testID={testID} style={[StyleSheet.absoluteFill, { backgroundColor: background || c('bg/color-canvas'), overflow: 'hidden' }]}>
      <ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        style={StyleSheet.absoluteFill}
        contentContainerStyle={{ paddingTop: STATUS_BAR + (nav ? NAV_BAR : 0), paddingBottom: bottomSpace, minHeight: 874 }}
      >
        <View style={[{ paddingHorizontal: bodyPadding, paddingTop: bodyTop, gap: bodyGap }, center && { flex: 1, justifyContent: 'center', paddingBottom: 60 }]}>{children}</View>
      </ScrollView>
      {!nav && statusFill && (
        <View pointerEvents="none" style={[styles.header, { paddingTop: 0 }]}>
          <HeaderFill visible={scrolled} height={STATUS_BAR} />
        </View>
      )}
      {nav && (
        <View pointerEvents="box-none" style={styles.header}>
          <HeaderFill visible={scrolled} />
          {nav}
        </View>
      )}
      {bottom}
    </View>
  );
}

// Bottom bar. Two kinds in Figma:
//   default: a canvas filled bar (12 top, 34 bottom) that content scrolls under, with the scroll edge above it.
//            Button top at y 784.
//   plain:   no fill, for short forms that never scroll. Button top at y 772 (46 above the bottom edge).
export function BottomBar({ children, style, border, plain, className }) {
  const { c } = useTheme();
  const canvas = c('bg/color-canvas');
  return (
    <View className={className} style={[styles.bottom, plain ? styles.plain : { backgroundColor: canvas }, border && { borderTopWidth: 1, borderColor: c('border/color-subtle') }, style]}>
      {!plain && !border && <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: -EDGE, height: EDGE, backgroundImage: fade(canvas, 'bottom') }} />}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { position: 'absolute', top: 0, left: 0, right: 0, paddingTop: STATUS_BAR, zIndex: 20 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingTop: 12, paddingHorizontal: 16, paddingBottom: 34, gap: 12, zIndex: 10 },
  plain: { paddingTop: 0, paddingBottom: 46 },
});
