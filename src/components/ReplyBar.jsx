// Figma: Reply bar (Filled No, Yes). Docked at the bottom of a conversation on bg/color-surface-raised with a
// border/color-subtle top edge, so writing a reply sits on the same white surface as the post and its replies.
// The field is a 48pt bg/color-canvas pill, then the Filled send button. 8pt above, 42pt below (34 + 8).
// React Native: KeyboardAvoidingView (behavior "padding") keeps it right above the keyboard.
import React from 'react';
import { View, Text, TextInput, Pressable } from '../rn';
import { useTheme, type } from '../theme';
import IconButton from './IconButton';
import Icon from './Icon';

// placeholder: "Answer as Quiet Mind Massage" when a verified practitioner opens an Ask the Experts question.
// replyingTo: answering one reply (a sub-thread). "Replying to Wildroot Herbal Co." in Body S sits over the field with
// a 48pt close target that goes back to replying to the post.
export default function ReplyBar({ value, onChangeText, onSend, inputRef, placeholder = 'Write a reply', replyingTo, onCancelReply }) {
  const { c } = useTheme();
  return (
    <View testID="reply-bar" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 10, paddingTop: 8, paddingHorizontal: 16, paddingBottom: 42, backgroundColor: c('bg/color-surface-raised'), borderTopWidth: 1, borderColor: c('border/color-subtle') }}>
      {!!replyingTo && (
        <View testID="replying-to" className="fx-fade-up" style={{ flexDirection: 'row', alignItems: 'center', gap: 8, height: 40, marginTop: -4, marginBottom: 4 }}>
          <Text numberOfLines={1} style={[type('BodyS'), { color: c('text/color-secondary'), flex: 1 }]}>Replying to <Text style={[type('BodyS', 'bold'), { color: c('text/color-primary') }]}>{replyingTo}</Text></Text>
          <Pressable testID="cancel-reply" onPress={onCancelReply} hitSlop={{ top: 4, bottom: 4 }} accessibilityLabel="Reply to the post instead" style={({ pressed }) => [{ width: 48, height: 40, alignItems: 'flex-end', justifyContent: 'center' }, pressed && { opacity: 0.6 }]}>
            <Icon name="xmark" size={20} color={c('icon/color-secondary')} />
          </Pressable>
        </View>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1, height: 48, borderRadius: 999, backgroundColor: c('bg/color-canvas'), paddingHorizontal: 16, justifyContent: 'center' }}>
          <TextInput ref={inputRef} testID="reply-input" value={value} onChangeText={onChangeText} onSubmitEditing={onSend} placeholder={placeholder} placeholderTextColor={c('text/color-tertiary')} style={[type('BodyM'), { color: c('text/color-primary'), height: 46 }]} />
        </View>
        <IconButton testID="reply-send" variant="filled" icon="send" accessibilityLabel="Send reply" onPress={onSend} />
      </View>
    </View>
  );
}
