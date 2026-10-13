// Figma: About on Listing profile. Body M text cut to 3 lines with an ellipsis, then a Show more link
// (Body S Bold, text/color-link, 8pt below). Show more grows the text to its full height, Show less shrinks it back.
// The link only shows when the text is longer than 3 lines.
//
// React Native:
//   <Animated.View layout={LinearTransition.duration(280)}>
//     <Text numberOfLines={open ? undefined : 3} onTextLayout={(e) => setLong(e.nativeEvent.lines.length > 3)}>...</Text>
//   </Animated.View>
//   <Pressable hitSlop={12} onPress={() => setOpen(!open)}><Text>{open ? 'Show less' : 'Show more'}</Text></Pressable>
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, Pressable } from '../rn';
import { useTheme, type } from '../theme';
import TextLink from './TextLink';
import { motion } from '../theme/motion';

const LINE = 26; // Body M line height

export default function ShowMoreText({ text, lines = motion.expand.lines, initiallyOpen = false, testID }) {
  const { c, reduceMotion } = useTheme();
  const collapsed = lines * LINE;
  const [open, setOpen] = useState(initiallyOpen);
  const [clamp, setClamp] = useState(!initiallyOpen);
  const [height, setHeight] = useState(null); // a number only while animating
  const [long, setLong] = useState(true);
  const box = useRef();
  const timer = useRef();
  const D = reduceMotion ? 0 : motion.expand.duration;
  const fullHeight = () => { const el = box.current && box.current.firstChild; return el ? el.scrollHeight : collapsed; };

  useLayoutEffect(() => { setLong(fullHeight() > collapsed + 1); }, [text]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const toggle = () => {
    clearTimeout(timer.current);
    const full = fullHeight();
    if (!open) {
      setOpen(true); setClamp(false); setHeight(collapsed);
      requestAnimationFrame(() => requestAnimationFrame(() => setHeight(full)));
      timer.current = setTimeout(() => setHeight(null), D + 40);
    } else {
      setOpen(false); setHeight(full);
      requestAnimationFrame(() => requestAnimationFrame(() => setHeight(collapsed)));
      timer.current = setTimeout(() => { setClamp(true); setHeight(null); }, D + 40);
    }
  };

  return (
    <View style={{ gap: 8 }}>
      <View ref={box} style={{ overflow: 'hidden', height: height == null ? undefined : height, transition: height == null || !D ? 'none' : `height ${D}ms ${motion.expand.easing}` }}>
        <Text testID={testID} numberOfLines={clamp ? lines : undefined} style={[type('BodyM'), { color: c('text/color-primary') }]}>{text}</Text>
      </View>
      {long && (
        <TextLink testID={testID ? testID + '-toggle' : undefined} onPress={toggle} aria-expanded={open} label={open ? 'Show less' : 'Show more'} />
      )}
    </View>
  );
}
