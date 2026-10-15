// Figma: Review sheet. Opens from Add a review on a listing: "Add a review" (or "Edit your review") with a close button
// and the place's name, five 48pt stars, the rating in words under them, a message box for what stood out (optional),
// then Post review pinned at the bottom. Post review with no stars shows "Pick a rating." under the stars.
// Stars fill in icon/color-accent (Solid) up to the pick, the rest stay Regular in icon/color-secondary, and the word
// under them says the rating, so it never rests on color alone. React Native: the shared bottom sheet (Sheet.jsx).
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, TextInput } from '../rn';
import { useTheme, type } from '../theme';
import Sheet from './Sheet';
import Button from './Button';
import Icon from './Icon';
import FieldError from './FieldError';
import { useForm } from '../app/form';

export const RATING_WORDS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

export function Stars({ value, size = 20, gap = 2 }) {
  const { c } = useTheme();
  return (
    <View accessibilityLabel={`${value} of 5 stars`} style={{ flexDirection: 'row', gap }}>
      {[1, 2, 3, 4, 5].map((n) => <Icon key={n} name="star" solid={n <= value} size={size} color={c(n <= value ? 'icon/color-accent' : 'icon/color-secondary')} />)}
    </View>
  );
}

export default function ReviewSheet({ visible, name, initial, onClose, onPost }) {
  const { c } = useTheme();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const form = useForm();
  useEffect(() => { if (visible) { setRating(initial ? initial.rating : 0); setText(initial ? initial.text : ''); form.reset(); } }, [visible]);
  const errors = { rating: rating ? null : 'Pick a rating.' };
  return (
    <Sheet visible={visible} onClose={onClose} testID="review-sheet" title={initial ? 'Edit your review' : 'Add a review'} subtitle={name} closeTestID="review-close"
      footer={<Button testID="review-post" label={initial ? 'Save review' : 'Post review'} fill onPress={() => form.submit(errors, () => onPost({ rating, text: text.trim() }))} />}>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', gap: 4 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Pressable key={n} testID={`review-star-${n}`} accessibilityRole="radio" accessibilityState={{ checked: rating === n }} accessibilityLabel={`${n} ${n === 1 ? 'star' : 'stars'}, ${RATING_WORDS[n]}`}
              onPress={() => setRating(n)} style={({ pressed }) => [{ width: 56, height: 56, alignItems: 'center', justifyContent: 'center' }, pressed && { transform: [{ scale: 0.9 }] }]}>
              <Icon name="star" solid={n <= rating} size={40} color={c(n <= rating ? 'icon/color-accent' : 'icon/color-secondary')} />
            </Pressable>
          ))}
        </View>
        <Text testID="review-word" style={[type('BodyM', 'bold'), { color: c(rating ? 'text/color-primary' : 'text/color-tertiary') }]}>{rating ? RATING_WORDS[rating] : 'Tap a star'}</Text>
        <FieldError testID="review-error" message={form.shown(errors).rating} />
      </View>
      <View style={{ height: 176, borderRadius: 16, backgroundColor: c('bg/color-sheet-raised'), padding: 16 }}>
        <TextInput testID="review-text" multiline value={text} onChangeText={setText} placeholder="What stood out? (optional)" placeholderTextColor={c('text/color-tertiary')} style={[type('BodyM'), { color: c('text/color-primary'), flex: 1, height: '100%' }]} />
      </View>
    </Sheet>
  );
}
