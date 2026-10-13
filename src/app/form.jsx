// Every form keeps its main button on, so a tap always gets an answer. Tapping it with something missing or wrong
// shows a message under each field or group that needs it (FieldError, or the Text field's Error state), fires the
// error haptic and scrolls the first message into view. From then on the messages are live, so each one goes as soon
// as it is fixed. Nothing shows before that first tap, except an unfinished email once the person leaves the field.
// Only a button that is busy (Posting…) is ever disabled.
// React Native: the same state. Note each message's y with onLayout and scroll to the first one with
// scrollRef.current.scrollTo({ y }). FieldError has accessibilityRole="alert", so VoiceOver reads it.
import { useState } from 'react';
import { useFeedback } from './feedback';

export function useForm(initiallyTried = false) {
  const fb = useFeedback();
  const [tried, setTried] = useState(initiallyTried);
  // errors: { field: 'Message.' or null }. go() runs when there are none.
  const submit = (errors, go) => {
    setTried(true);
    if (!Object.values(errors).some(Boolean)) { go(); return; }
    fb.haptic('error');
    setTimeout(revealFirstError, 40);
  };
  // What to show: nothing until the first tap.
  const shown = (errors) => (tried ? errors : {});
  // A sheet starts fresh each time it opens.
  const reset = () => setTried(false);
  return { tried, submit, shown, reset };
}

// Web only: scroll the screen or sheet in the phone so the first message sits under the nav bar with its field.
function revealFirstError() {
  const phone = document.querySelector('[data-testid=phone]');
  const box = phone ? phone.getBoundingClientRect() : { left: -1e9, right: 1e9 };
  const el = [...document.querySelectorAll('[data-field-error]')].find((e) => {
    const r = e.getBoundingClientRect();
    return r.width > 0 && r.left >= box.left - 1 && r.right <= box.right + 1;
  });
  if (!el) return;
  let sc = el.parentElement;
  while (sc && !(sc.classList.contains('rn-scroll') && sc.scrollHeight > sc.clientHeight)) sc = sc.parentElement;
  if (!sc) return;
  const scale = sc.getBoundingClientRect().height / sc.offsetHeight || 1;
  const top = (el.getBoundingClientRect().top - sc.getBoundingClientRect().top) / scale;
  // In view means clear of the nav bar at the top and the button bar at the bottom.
  if (top < 150 || top > sc.clientHeight - 160) sc.scrollTo({ top: Math.max(0, sc.scrollTop + top - 220), behavior: 'smooth' });
}
