// Small feedback pop (like, save). Returns [className, trigger].
// React Native: a Reanimated shared value, withSequence(withTiming(1.25, {duration: 120}), withSpring(1)).
import { useRef, useState } from 'react';

export function usePop(duration = 360) {
  const [on, setOn] = useState(false);
  const t = useRef();
  const trigger = () => {
    setOn(false);
    requestAnimationFrame(() => {
      setOn(true);
      clearTimeout(t.current);
      t.current = setTimeout(() => setOn(false), duration);
    });
  };
  return [on ? 'fx-pop' : '', trigger];
}
