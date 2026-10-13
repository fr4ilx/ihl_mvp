// Figma: the photos at the top of a listing. One photo fills the 300pt hero. With more than one, they swipe one at a
// time and a "1 of 3" pill (bg/color-toast, Body S Bold in white) sits 16pt from the bottom right corner.
// Tapping a photo opens the full screen Photo viewer on it. Without onOpen (Check your listing) they only swipe.
// width: 402 on the listing, 370 inside Check your listing.
// React Native: a horizontal FlatList with pagingEnabled, the count from onMomentumScrollEnd, each photo in a
// Pressable that opens the viewer route. The parallax moves the whole row (translateY = scrollY x 0.4).
// The pointer drag below only exists so a mouse can swipe the photos in the prototype.
import React, { useRef, useState } from 'react';
import { View, Text, Image, Pressable, ScrollView } from '../rn';
import { useTheme, type, primitives } from '../theme';

export default function PhotoPager({ photos, width: W = 402, height = 300, offset = 0, onOpen, testID = 'listing-photos' }) {
  const { c } = useTheme();
  const [index, setIndex] = useState(0);
  const ref = useRef();
  const drag = useRef(null);
  const moved = useRef(false);
  const last = photos.length - 1;
  const onScroll = (e) => setIndex(Math.max(0, Math.min(last, Math.round(e.nativeEvent.contentOffset.x / W))));
  const onPointerDown = (e) => {
    moved.current = false;
    if (e.pointerType !== 'mouse' || !ref.current || last < 1) return;
    const el = ref.current;
    drag.current = { x: e.clientX, left: el.scrollLeft, scale: el.getBoundingClientRect().width / el.offsetWidth || 1, start: index };
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
    el.scrollTo({ left: to * W, behavior: 'smooth' });
    setTimeout(() => { if (!drag.current) el.style.scrollSnapType = 'x mandatory'; }, 450);
  };
  return (
    <View testID={testID} style={{ height, transform: [{ translateY: offset }] }}>
      <ScrollView
        ref={ref}
        horizontal
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onClickCapture={(e) => { if (moved.current) { e.stopPropagation(); e.preventDefault(); moved.current = false; } }}
        style={{ width: W, height, scrollSnapType: 'x mandatory', cursor: last > 0 ? 'grab' : onOpen ? 'pointer' : 'default' }}
      >
        {photos.map((ph, i) => onOpen ? (
          <Pressable key={i} testID={`${testID}-${i}`} accessible accessibilityLabel={`Photo ${i + 1} of ${photos.length}`} onPress={() => onOpen(i)} style={{ width: W, height, scrollSnapAlign: 'start' }}>
            <Image source={ph} style={{ width: W, height }} />
          </Pressable>
        ) : (
          <View key={i} testID={`${testID}-${i}`} accessibilityLabel={`Photo ${i + 1} of ${photos.length}`} style={{ width: W, height, scrollSnapAlign: 'start' }}>
            <Image source={ph} style={{ width: W, height }} />
          </View>
        ))}
      </ScrollView>
      {last > 0 && (
        <View pointerEvents="none" testID={`${testID}-count`} style={{ position: 'absolute', right: 16, bottom: 16, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, backgroundColor: c('bg/color-toast') }}>
          <Text style={[type('BodyS', 'bold'), { color: primitives['neutral/0'] }]}>{index + 1} of {photos.length}</Text>
        </View>
      )}
    </View>
  );
}
