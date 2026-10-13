// Figma: Slide button. A 64pt bg/color-button-primary track with a 56pt knob 4pt inside it: the knob in
// text/color-on-button-primary with an arrow in the track color, and the label in Body M Bold, centered in the space
// after the knob. Sliding the knob to the end runs the action, so a stray tap can't send anything.
// The label fades as the knob moves. Let go before 85% of the way and the knob slides back. At the end the arrow turns
// into a check, which shows for a moment before the action runs. The drag can start anywhere on the track, so the whole
// bar is the target. The knob nudges right twice when it appears, to show which way it goes.
// VoiceOver: a button named after the action. Double tap runs it (accessibilityActions activate), as Enter does here.
// React Native: Gesture.Pan from react-native-gesture-handler moving a Reanimated translateX clamped to the track,
// withTiming to the end past 85%, withSpring(0) before, then runOnJS(onConfirm) once the check has shown.
import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from '../rn';
import { useTheme, type } from '../theme';
import { motion } from '../theme/motion';
import Icon from './Icon';

const HEIGHT = 64;
const KNOB = 56;
const INSET = (HEIGHT - KNOB) / 2;

export default function SlideButton({ label, actionLabel, onConfirm, testID = 'slide-button' }) {
  const { c, reduceMotion } = useTheme();
  const track = useRef();
  const drag = useRef(null);
  const [x, setX] = useState(0);
  const [moving, setMoving] = useState(false);
  const [done, setDone] = useState(false);
  const [touched, setTouched] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const travel = () => (track.current ? track.current.offsetWidth - KNOB - INSET * 2 : 306);
  const finish = () => {
    setTouched(true);
    setMoving(false);
    setX(travel());
    setDone(true);
    timer.current = setTimeout(onConfirm, reduceMotion ? 0 : motion.slide.hold);
  };
  const onPointerDown = (e) => {
    if (done) return;
    const el = track.current;
    el.setPointerCapture && el.setPointerCapture(e.pointerId);
    drag.current = { from: e.clientX, scale: el.getBoundingClientRect().width / el.offsetWidth || 1, max: travel() };
    setTouched(true);
    setMoving(true);
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    setX(Math.max(0, Math.min(d.max, (e.clientX - d.from) / d.scale)));
  };
  const onPointerUp = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    if (x >= d.max * motion.slide.threshold) finish();
    else { setMoving(false); setX(0); }
  };
  const max = travel();
  const fade = Math.max(0, 1 - x / (max * 0.6));
  const ease = `${reduceMotion ? 0 : motion.slide.back}ms ${motion.slide.easing}`;
  return (
    <View
      ref={track}
      testID={testID}
      role="button"
      tabIndex={0}
      aria-label={actionLabel || label}
      aria-disabled={done || undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={(e) => { if (!done && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); finish(); } }}
      style={{ height: HEIGHT, borderRadius: 999, backgroundColor: c('bg/color-button-primary'), justifyContent: 'center', touchAction: 'none', userSelect: 'none', cursor: done ? 'default' : moving ? 'grabbing' : 'grab' }}
    >
      <View pointerEvents="none" style={{ position: 'absolute', left: INSET + KNOB, right: INSET, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', opacity: done ? 0 : fade, transition: moving ? 'none' : `opacity ${ease}` }}>
        <Text numberOfLines={1} style={[type('BodyM', 'bold'), { color: c('text/color-on-button-primary') }]}>{label}</Text>
      </View>
      <View testID={`${testID}-knob`} pointerEvents="none" style={{ position: 'absolute', left: INSET, top: INSET, transform: [{ translateX: x }], transition: moving ? 'none' : `transform ${ease}` }}>
        <View className={touched ? '' : 'fx-nudge'} style={{ width: KNOB, height: KNOB, borderRadius: KNOB / 2, backgroundColor: c('text/color-on-button-primary'), alignItems: 'center', justifyContent: 'center' }}>
          {done
            ? <View className="fx-check-in"><Icon name="check" size={28} strokeWidth={2} color={c('bg/color-button-primary')} /></View>
            : <Icon name="arrow-right" size={28} strokeWidth={2} color={c('bg/color-button-primary')} />}
        </View>
      </View>
    </View>
  );
}
