// Figma: Review sheet. Opens from Add a review on a listing, or from the stars once rated: a short sheet with "Add a review"
// (or "Your review"), the place's name and a close button, the five stars, then Post review. Nothing else, no text.
// Post review with no stars shows "Pick a rating." under them. React Native: the shared bottom sheet (Sheet.jsx) sized
// to its content.
import React, { useEffect, useState } from 'react';
import { View } from '../rn';
import Sheet from './Sheet';
import Button from './Button';
import FieldError from './FieldError';
import StarRating from './StarRating';
import { useForm } from '../app/form';

export default function ReviewSheet({ visible, name, initial = 0, onClose, onPost }) {
  const [rating, setRating] = useState(initial);
  // Kept from when it opened, so the title doesn't change while it closes after posting.
  const [editing, setEditing] = useState(!!initial);
  const form = useForm();
  useEffect(() => { if (visible) { setRating(initial); setEditing(!!initial); form.reset(); } }, [visible]);
  const errors = { rating: rating ? null : 'Pick a rating.' };
  return (
    <Sheet visible={visible} onClose={onClose} fit testID="review-sheet" title={editing ? 'Your review' : 'Add a review'} subtitle={name} closeTestID="review-close"
      footer={<Button testID="review-post" label={editing ? 'Save review' : 'Post review'} fill onPress={() => form.submit(errors, () => onPost(rating))} />}>
      <View style={{ alignItems: 'center', gap: 8, paddingVertical: 8 }}>
        <StarRating testID="review-stars" value={rating} onRate={setRating} />
        <FieldError testID="review-error" message={form.shown(errors).rating} />
      </View>
    </Sheet>
  );
}
