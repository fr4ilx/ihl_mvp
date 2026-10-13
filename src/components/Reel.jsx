// Home reel: a row of big cards that snaps one card at a time, with Page dots under it.
// Cards are 338pt wide with a 12pt gap, so the next one peeks in from the right. No autoplay: people move it themselves.
// React Native: FlatList horizontal, snapToInterval={350}, decelerationRate="fast", disableIntervalMomentum,
// contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32, gap: 12 }} with marginTop -12 and
// marginBottom -32, so the card shadow has room and the spacing stays the same,, showsHorizontalScrollIndicator={false},
// and onMomentumScrollEnd sets the dot from Math.round(x / 350).
// The pointer drag below only exists so a mouse can swipe the reel in the prototype.
import React, { useRef, useState } from 'react';
import { View, ScrollView } from '../rn';
import PageDots from './PageDots';

export const REEL_CARD = 338;
const STEP = REEL_CARD + 12;

export default function Reel({ items, renderItem, testID }) {
  const [index, setIndex] = useState(0);
  const ref = useRef();
  const drag = useRef(null);
  const moved = useRef(false);
  const last = items.length - 1;

  const onScroll = (e) => setIndex(Math.max(0, Math.min(last, Math.round(e.nativeEvent.contentOffset.x / STEP))));
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const el = ref.current;
    const scale = el.getBoundingClientRect().width / el.offsetWidth || 1;
    drag.current = { x: e.clientX, left: el.scrollLeft, scale, start: index };
    moved.current = false;
    el.style.scrollSnapType = 'none';
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = (e.clientX - d.x) / d.scale;
    if (Math.abs(dx) > 6) moved.current = true;
    ref.current.scrollLeft = d.left - dx;
  };
  const onPointerUp = (e) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    const el = ref.current;
    const dx = (e.clientX - d.x) / d.scale;
    const to = Math.max(0, Math.min(last, dx < -40 ? d.start + 1 : dx > 40 ? d.start - 1 : d.start));
    el.scrollTo({ left: to * STEP, behavior: 'smooth' });
    setTimeout(() => { if (!drag.current) el.style.scrollSnapType = 'x mandatory'; }, 450);
  };

  return (
    <View testID={testID} style={{ gap: 12 }}>
      <ScrollView
        ref={ref}
        horizontal
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onClickCapture={(e) => { if (moved.current) { e.stopPropagation(); e.preventDefault(); moved.current = false; } }}
        style={{ marginHorizontal: -16, marginTop: -12, marginBottom: -32, scrollSnapType: 'x mandatory', scrollPaddingLeft: 16, scrollPaddingRight: 16, cursor: 'grab' }}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32, alignSelf: 'flex-start' }}
      >
        {items.map((item, i) => (
          <View key={item.id} style={{ width: REEL_CARD, scrollSnapAlign: 'start' }}>{renderItem(item, i)}</View>
        ))}
      </ScrollView>
      <PageDots count={items.length} index={index} testID={testID ? `${testID}-dots` : undefined} />
    </View>
  );
}
