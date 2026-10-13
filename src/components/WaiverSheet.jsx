// Figma: Waiver sheet. The liability waiver everyone accepts before the account is made, after Create account on
// Sign up and after the Apple sheet. A tall sheet that can't be swiped away: the title with a close button, the waiver
// in a scroll view, then a hint and I agree. I agree before the text has been scrolled to the end turns the hint into
// an error ("Scroll to the end to agree" in text/color-error with a warning icon) with the error haptic.
// Closing it makes no account. React Native: a pageSheet modal with gestureEnabled false (isModalInPresentation),
// a ScrollView whose onScroll compares contentOffset.y + layoutMeasurement.height with contentSize.height.
// If the text fits without scrolling (large text off, big phone), it counts as read.
// Save WAIVER.version and the time of I agree with the account.
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from '../rn';
import { useTheme, type, elevation, OnSheet } from '../theme';
import { motion } from '../theme/motion';
import { WAIVER } from '../data';
import { useFeedback } from '../app/feedback';
import Button from './Button';
import IconButton from './IconButton';
import Icon from './Icon';

// The waiver text, shared with the Liability waiver page under Privacy. agreed: the page, read again after
// sign up, so it says when it was agreed to and drops the I agree line.
export function WaiverText({ agreed }) {
  const { c } = useTheme();
  return (
    <View style={{ gap: 24 }}>
      <Text style={[type('BodyM'), { color: c('text/color-secondary') }]}>{agreed ? WAIVER.agreed : WAIVER.intro}</Text>
      {WAIVER.sections.map(([title, text]) => (
        <View key={title} style={{ gap: 8 }}>
          <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>{title}</Text>
          <Text style={[type('BodyM'), { color: c('text/color-primary') }]}>{text}</Text>
        </View>
      ))}
      {!agreed && <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{WAIVER.outro}</Text>}
    </View>
  );
}

const TOP = 72; // under the status bar, like an iOS page sheet

export default function WaiverSheet({ visible, onAgree, onClose, startAtEnd, startEarly }) {
  const { c, reduceMotion } = useTheme();
  const fb = useFeedback();
  const [mounted, setMounted] = useState(visible);
  const [shown, setShown] = useState(false);
  const [read, setRead] = useState(false);
  // I agree was tapped before the end.
  const [early, setEarly] = useState(!!startEarly);
  // Once the text scrolls under the title, a hairline separates them, like the one above I agree.
  const [under, setUnder] = useState(!!startAtEnd);
  const scroll = useRef();
  useEffect(() => {
    if (visible) { setMounted(true); requestAnimationFrame(() => requestAnimationFrame(() => setShown(true))); }
    else { setShown(false); const t = setTimeout(() => { setMounted(false); setRead(false); setEarly(false); }, reduceMotion ? 0 : motion.sheet.duration); return () => clearTimeout(t); }
  }, [visible]);
  // Review panel only: open already scrolled to the end. Also covers text short enough to need no scrolling.
  useLayoutEffect(() => {
    const el = scroll.current;
    if (!mounted || !el) return;
    if (startAtEnd) el.scrollTop = el.scrollHeight;
    if (el.scrollHeight - el.clientHeight <= 24) setRead(true);
  }, [mounted]);
  if (!mounted) return null;
  const d = reduceMotion ? 0 : motion.sheet.duration;
  const onScroll = (e) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    if (contentOffset.y > 4 !== under) setUnder(contentOffset.y > 4);
    if (!read && contentOffset.y + layoutMeasurement.height >= contentSize.height - 24) setRead(true);
  };
  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 70 }]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: c('bg/color-overlay'), opacity: shown ? 1 : 0, transition: `opacity ${d}ms ${motion.sheet.easing}` }]} />
      <View
        testID="waiver-sheet"
        accessibilityViewIsModal
        style={{
          position: 'absolute', left: 0, right: 0, top: TOP, bottom: 0,
          backgroundColor: c('bg/color-sheet'), borderTopLeftRadius: 40, borderTopRightRadius: 40, overflow: 'hidden', boxShadow: elevation.overlay,
          transform: [{ translateY: shown ? 0 : 874 - TOP }], transition: `transform ${d}ms ${motion.sheet.easing}`,
        }}
      >
        <OnSheet.Provider value={true}>
          <View testID="waiver-header" style={{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingTop: 20, paddingBottom: 8, paddingHorizontal: 16 }}>
            <Text style={[type('H3', 'bold'), { color: c('text/color-primary'), flex: 1 }]}>{WAIVER.title}</Text>
            <IconButton testID="waiver-close" icon="xmark" variant="outline" accessibilityLabel="Close" onPress={onClose} />
            <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 1, backgroundColor: c('border/color-subtle'), opacity: under ? 1 : 0, transition: reduceMotion ? 'none' : `opacity ${motion.navFill.duration}ms ${motion.navFill.easing}` }} />
          </View>
          <ScrollView ref={scroll} testID="waiver-scroll" onScroll={onScroll} style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}>
            <WaiverText />
          </ScrollView>
          <View style={{ paddingTop: 12, paddingHorizontal: 16, paddingBottom: 34, gap: 12, borderTopWidth: 1, borderColor: c('border/color-subtle') }}>
            {/* The words change with the icon, so the state never relies on color. */}
            <View testID="waiver-hint" role={early && !read ? 'alert' : undefined} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 22 }}>
              {read
                ? <View className="fx-check-in"><Icon name="check-circle" solid size={20} color={c('icon/color-success')} /></View>
                : early
                  ? <Icon name="warning-circle" solid size={20} color={c('icon/color-error')} />
                  : <Icon name="arrow-down" size={20} color={c('icon/color-secondary')} />}
              <Text style={[type('BodyS'), { color: c(early && !read ? 'text/color-error' : 'text/color-secondary') }]}>{read ? 'You’ve read it all' : 'Scroll to the end to agree'}</Text>
            </View>
            <Button testID="waiver-agree" label="I agree" fill onPress={() => { if (read) { onAgree(); return; } setEarly(true); fb.haptic('error'); }} />
          </View>
        </OnSheet.Provider>
      </View>
    </View>
  );
}
