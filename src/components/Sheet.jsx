// Bottom sheet: full width and attached to the bottom edge, three quarters of the screen tall (656pt on the 874pt
// iPhone 17), with radius/40 top corners on bg/color-sheet (the canvas beige in Light, a lifted sand/90 in Dark).
// A grabber, then the title in H3 Bold with a close button, the content, and the action pinned at the bottom,
// 48pt above the screen edge. 16pt sides and 16pt between parts. Content that runs past the space scrolls: a hairline
// shows under the title once it scrolls under, and it softens over 16pt above the action.
// Fields, rows and the close button on it use bg/color-sheet-raised, one tonal step away.
// React Native: @gorhom/bottom-sheet's BottomSheetModal with snapPoints ['75%'], a BottomSheetBackdrop in
// bg/color-overlay, backgroundStyle bg/color-sheet with 40pt top corners, the handle in border/color-default,
// a BottomSheetScrollView for the content and footerComponent for the action. iOS 26's own formSheet floats a
// partial height sheet off the screen edges, so it would not match.
// Motion values come from motion.sheet.
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from '../rn';
import { useTheme, type, elevation, withAlpha, OnSheet } from '../theme';
import { motion } from '../theme/motion';
import IconButton from './IconButton';

// Three quarters of the 874pt screen.
export const SHEET_HEIGHT = 656;
// A page sheet starts 72pt from the top, under the status bar (Check your listing).
export const PAGE_SHEET_HEIGHT = 874 - 72;
// Content width on a 402pt screen with 16pt sides.
export const SHEET_CONTENT = 402 - 2 * 16;

// title: the header with a close button. subtitle: one line under it. footer: the action, pinned at the bottom.
// center: the content sits in the middle of the space (the Badge sheet). scroll={false}: the content manages its own
// scrolling (the Location sheet keeps its search field in place and scrolls the places).
// height: PAGE_SHEET_HEIGHT for a page sheet. surface: bg/color-canvas when the sheet previews a screen, so what is
// on it looks the way it does on that screen (controls then keep their canvas look instead of bg/color-sheet-raised).
// A canvas sheet adds a 1pt border/color-glass rim along its top, so it still lifts off the dimmed screen in Dark.
export default function Sheet({ visible, onClose, title, subtitle, closeTestID, footer, center, scroll = true, height = SHEET_HEIGHT, surface = 'bg/color-sheet', testID, children }) {
  const { c, reduceMotion } = useTheme();
  const [mounted, setMounted] = useState(visible);
  const [shown, setShown] = useState(false);
  const [under, setUnder] = useState(false);
  useEffect(() => {
    if (visible) { setMounted(true); setUnder(false); requestAnimationFrame(() => requestAnimationFrame(() => setShown(true))); }
    else { setShown(false); const t = setTimeout(() => setMounted(false), reduceMotion ? 0 : motion.sheet.duration); return () => clearTimeout(t); }
  }, [visible]);
  if (!mounted) return null;
  const d = reduceMotion ? 0 : motion.sheet.duration;
  const sheet = c(surface);
  const body = [{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, gap: 16 }, center && { flexGrow: 1, justifyContent: 'center' }];
  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 60 }]}>
      <Pressable accessibilityLabel="Close" onPress={onClose} style={[StyleSheet.absoluteFill, { backgroundColor: c('bg/color-overlay'), opacity: shown ? 1 : 0, transition: `opacity ${d}ms ${motion.sheet.easing}`, cursor: 'default' }]} />
      <View
        testID="sheet"
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height,
          backgroundColor: sheet, borderTopLeftRadius: 40, borderTopRightRadius: 40, overflow: 'hidden',
          ...(surface === 'bg/color-sheet' ? null : { borderWidth: 1, borderBottomWidth: 0, borderColor: c('border/color-glass') }),
          paddingTop: 12, paddingBottom: 48, boxShadow: elevation.overlay,
          transform: [{ translateY: shown ? 0 : '100%' }], transition: `transform ${d}ms ${motion.sheet.easing}`,
        }}
      >
        <View style={{ alignSelf: 'center', width: 36, height: 5, borderRadius: 3, backgroundColor: c('border/color-default') }} />
        <OnSheet.Provider value={surface === 'bg/color-sheet'}>
          <View style={{ paddingTop: 16 }}>
            {!!title && (
              <View testID={testID} style={{ paddingHorizontal: 16, gap: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <Text style={[type('H3', 'bold'), { color: c('text/color-primary'), flex: 1 }]}>{title}</Text>
                  <IconButton testID={closeTestID} icon="xmark" accessibilityLabel="Close" onPress={onClose} />
                </View>
                {!!subtitle && <Text style={[type('BodyM'), { color: c('text/color-secondary') }]}>{subtitle}</Text>}
              </View>
            )}
            {/* The hairline under the title once content scrolls under it, as on the Waiver sheet. */}
            <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 1, backgroundColor: c('border/color-subtle'), opacity: under ? 1 : 0, transition: `opacity ${motion.navFill.duration}ms` }} />
          </View>
          {scroll ? (
            <View style={{ flex: 1, minHeight: 0 }}>
              <ScrollView
                style={{ flex: 1, minHeight: 0 }}
                contentContainerStyle={[...body, !title && { paddingTop: 0 }]}
                onScroll={(e) => { const y = e.nativeEvent.contentOffset.y > 4; if (y !== under) setUnder(y); }}
              >
                {children}
              </ScrollView>
              {/* The scroll edge above the action: content softens over 16pt instead of stopping at a line. */}
              {!!footer && <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 16, backgroundImage: `linear-gradient(to bottom, ${withAlpha(sheet, 0)}, ${sheet})` }} />}
            </View>
          ) : (
            <View style={[{ flex: 1, minHeight: 0 }, ...body, !title && { paddingTop: 0 }]}>{children}</View>
          )}
          {!!footer && <View style={{ paddingHorizontal: 16, gap: 16 }}>{footer}</View>}
        </OnSheet.Provider>
      </View>
    </View>
  );
}
