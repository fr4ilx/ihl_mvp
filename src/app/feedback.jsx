// Snackbar host and haptics. snack() shows one Snackbar at a time, haptic() fires expo-haptics in the app.
// award() opens the Badge sheet for a badge or stage just earned, over whatever is on screen, with a success haptic.
// actionSheet() and confirm() show the iOS action sheet and the iOS alert over the whole screen (More on a post).
// In the prototype haptics are shown as a small tag next to the phone.
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View } from '../rn';
import Snackbar from '../components/Snackbar';
import BadgeSheet from '../components/BadgeSheet';
import ActionSheet from '../components/ActionSheet';
import ConfirmAlert from '../components/ConfirmAlert';
import { useTheme } from '../theme';
import { motion } from '../theme/motion';

const FeedbackContext = createContext(null);
export const useFeedback = () => useContext(FeedbackContext);

// Where the snackbar sits: 16pt above whatever is at the bottom (bottom edge of the snackbar, from the screen bottom).
export const SNACK = {
  tabBar: 874 - 784 + 16, // 106, above the floating tab bar
  bottomBar: 874 - 772 + 16, // 118, above a button bar (canvas bar top or plain button top at y 772)
  twoButtons: 874 - 704 + 16, // 186, above a plain bar with two stacked buttons (top button at y 704)
  listingBar: 874 - 758 + 16, // 132, above the Website and Call bar on a listing
  composer: 874 - 775 + 16, // 115, above the reply composer
  none: 34 + 16, // 50, above the home indicator
};

// routeKey: the focused screen. A snackbar older than 400ms fades out when the screen changes.
export function FeedbackProvider({ children, onEvent, routeKey }) {
  const [snack, setSnack] = useState(null);
  const timers = useRef([]);
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const haptic = useCallback((kind) => { onEvent && onEvent({ type: 'haptic', kind }); }, [onEvent]);

  const show = useCallback(({ message, tone = 'success', bottom = SNACK.tabBar, hapticKind }) => {
    clear();
    const id = Date.now();
    setSnack({ id, message, tone, bottom, phase: 'enter' });
    haptic(hapticKind || (tone === 'error' ? 'error' : tone === 'success' ? 'success' : 'light'));
    onEvent && onEvent({ type: 'motion', key: 'snackbar' });
    timers.current.push(setTimeout(() => setSnack((s) => s && s.id === id ? { ...s, phase: 'shown' } : s), 20));
    timers.current.push(setTimeout(() => setSnack((s) => s && s.id === id ? { ...s, phase: 'exit' } : s), motion.snackbar.visibleFor));
    timers.current.push(setTimeout(() => setSnack((s) => s && s.id === id ? null : s), motion.snackbar.visibleFor + motion.snackbar.outDuration));
  }, [haptic, onEvent]);

  const hide = useCallback(() => { clear(); setSnack(null); }, []);
  // item: { kind: 'badge' or 'stage', icon, title, line }
  const [award, setAward] = useState(null);
  const lastAward = useRef(null);
  if (award) lastAward.current = award;
  const showAward = useCallback((item) => { haptic('success'); onEvent && onEvent({ type: 'motion', key: 'sheet' }); setAward({ ...item, award: true }); }, [haptic, onEvent]);
  // { options: [{ label, destructive, testID, onPress }], title, message, testID }
  const [sheet, setSheet] = useState(null);
  const lastSheet = useRef(null);
  if (sheet) lastSheet.current = sheet;
  const actionSheet = useCallback((s) => { haptic('light'); onEvent && onEvent({ type: 'motion', key: 'actionSheet' }); setSheet(s); }, [haptic, onEvent]);
  // { title, message, action: { label, onPress }, testID }. Cancel sits on the left, the action in red on the right.
  const [alert, setAlert] = useState(null);
  const confirm = useCallback((a) => { onEvent && onEvent({ type: 'motion', key: 'alert' }); setAlert(a); }, [onEvent]);
  useEffect(() => clear, []);
  useEffect(() => {
    setSnack((s) => {
      if (!s || s.phase === 'exit' || Date.now() - s.id < 400) return s;
      clear();
      timers.current.push(setTimeout(() => setSnack((x) => (x && x.id === s.id ? null : x)), motion.snackbar.outDuration));
      return { ...s, phase: 'exit' };
    });
  }, [routeKey]);

  return (
    <FeedbackContext.Provider value={{ snack: show, hideSnack: hide, haptic, award: showAward, actionSheet, confirm }}>
      {children}
      <SnackLayer snack={snack} />
      <BadgeSheet testID="award-sheet" visible={!!award} item={award || lastAward.current} onClose={() => setAward(null)} />
      <ActionSheet
        visible={!!sheet}
        {...(sheet || lastSheet.current || {})}
        onPick={(o) => { setSheet(null); if (o.onPress) setTimeout(o.onPress, motion.actionSheet.duration / 2); }}
        onClose={() => setSheet(null)}
      />
      <ConfirmAlert
        visible={!!alert}
        testID={alert && alert.testID}
        title={alert && alert.title}
        message={alert && alert.message}
        actions={alert ? [
          { label: 'Cancel', style: 'cancel', onPress: () => setAlert(null) },
          { label: alert.action.label, style: 'destructive', onPress: () => { setAlert(null); alert.action.onPress(); } },
        ] : []}
      />
    </FeedbackContext.Provider>
  );
}

function SnackLayer({ snack }) {
  const { reduceMotion } = useTheme();
  if (!snack) return null;
  const m = motion.snackbar;
  const shown = snack.phase === 'shown';
  const exit = snack.phase === 'exit';
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: snack.bottom, alignItems: 'center', zIndex: 90 }}>
      <View
        style={{
          opacity: shown ? 1 : 0,
          transform: [{ translateY: shown ? 0 : m.fromY }, { scale: shown ? 1 : 0.96 }],
          transition: reduceMotion ? 'opacity 200ms' : exit ? `opacity ${m.outDuration}ms ${m.easingOut}, transform ${m.outDuration}ms ${m.easingOut}` : `opacity ${m.inDuration}ms ${m.easingIn}, transform ${m.inDuration}ms ${m.easingIn}`,
        }}
      >
        <Snackbar message={snack.message} tone={snack.tone} />
      </View>
    </View>
  );
}

// After an action that can earn something: a new stage first, then a new badge, otherwise the Snackbar.
// result: { earned (a badge), grew (a stage) }, from checkIn, visit, addReply and addPost in the store.
export function celebrate(fb, result, snack) {
  const { earned, grew } = result || {};
  if (grew) fb.award({ kind: 'stage', icon: grew.icon, title: `You reached ${grew.name}`, line: 'A new stage on your journey.' });
  else if (earned) fb.award({ kind: 'badge', icon: earned.icon, title: `You earned ${earned.name}`, line: earned.how });
  else if (snack) fb.snack(snack);
}
