// Figma: Check your listing. Send for review on My Practice opens it, so the practitioner sees the listing the way
// seekers will once IHL approves it, before it goes: first its card in the Directory, then the listing itself with
// its photos (they swipe), every section and the buttons at its bottom. Nothing in the preview reacts to a tap.
// A page sheet 72pt from the top on bg/color-canvas, the listing's own background, so everything on it looks the way
// it does on the listing in Light and Dark. The Slide button at the bottom sends it, so a stray tap never does.
// Close or swipe down to go back and fix something.
// React Native: a pageSheet route (expo-router presentation 'pageSheet') with the same parts.
import React from 'react';
import { View, Text } from '../rn';
import { useTheme, type } from '../theme';
import Sheet, { PAGE_SHEET_HEIGHT } from './Sheet';
import ListingCard from './ListingCard';
import PhotoPager from './PhotoPager';
import ListingSections, { ListingActions } from './ListingSections';
import SlideButton from './SlideButton';

// 370pt wide, the listing photo's 402 by 300 shape.
const PHOTO_HEIGHT = 276;

function Label({ children }) {
  const { c } = useTheme();
  return <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>{children}</Text>;
}

export default function ListingReviewSheet({ visible, listing, onClose, onSend }) {
  if (!listing) return null;
  // Every approved listing carries the Verified Local Business badge, so the preview shows it.
  const item = { ...listing, verified: true };
  const photos = (item.photos || []).length ? item.photos : item.photo ? [item.photo] : [];
  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      testID="review-sheet"
      closeTestID="review-close"
      title="Check your listing"
      subtitle="Seekers will see it like this. Make sure everything is right."
      height={PAGE_SHEET_HEIGHT}
      surface="bg/color-canvas"
      footer={<SlideButton testID="slide-send" label="Slide to send for review" actionLabel="Send for review" onConfirm={onSend} />}
    >
      {/* 40pt under the last part, so the listing's own buttons stay clear of the Slide button. */}
      <View style={{ gap: 40, paddingTop: 8, paddingBottom: 24 }}>
        <View style={{ gap: 12 }}>
          <Label>In the Directory</Label>
          <View pointerEvents="none">
            <ListingCard testID="review-card" item={item} showSave={false} />
          </View>
        </View>
        <View testID="review-listing" style={{ gap: 12 }}>
          <Label>Your listing</Label>
          <View style={{ gap: 24 }}>
            {photos.length > 0 && (
              <View style={{ borderRadius: 20, overflow: 'hidden' }}>
                <PhotoPager testID="review-photos" photos={photos} width={370} height={PHOTO_HEIGHT} />
              </View>
            )}
            <View style={{ gap: 40 }}>
              <ListingSections item={item} preview />
              <View pointerEvents="none" style={{ flexDirection: 'row', gap: 12 }}>
                <ListingActions item={item} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Sheet>
  );
}
