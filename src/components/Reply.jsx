// Figma: Reply. Sits under a Post card in a conversation. Practitioners get the Practitioner badge after the name.
// expert: a verified practitioner answering an Ask the Experts question gets the Expert badge (Success, badge-check) instead.
// Reply answers this reply one level down (a sub-thread): the Reply bar shows who you're answering. Replies to a reply
// sit under it, indented 44pt so the avatars line up with its text, and have no Reply of their own.
import React from 'react';
import { View, Text, Pressable, StyleSheet } from '../rn';
import { useTheme, type } from '../theme';
import { motion } from '../theme/motion';
import Icon from './Icon';
import Avatar from './Avatar';
import Badge from './Badge';
import { usePop } from '../app/usePop';

export default function Reply({ reply, author, expert, onLike, onAuthor, onReply, className, testID, children }) {
  const { c } = useTheme();
  const [pop, trigger] = usePop(motion.like.duration);
  return (
    <View testID={testID} style={styles.row} className={className}>
      <Pressable onPress={onAuthor} accessibilityLabel={`Open ${author.name}`} hitSlop={8}>
        <Avatar person={author} size={32} />
      </Pressable>
      <View style={{ flex: 1, gap: 4 }}>
        {/* Wraps as a whole when the name, badge and time run out of room (a long name, larger text sizes). */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 8, rowGap: 4 }}>
          <Text numberOfLines={1} style={[type('BodyS', 'bold'), { color: c('text/color-primary'), maxWidth: '100%' }]}>{author.name}</Text>
          {expert ? <Badge testID="expert-badge" label="Expert" tone="success" icon="badge-check" /> : author.practitioner && <Badge label="Practitioner" tone="success" />}
          <Text numberOfLines={1} style={[type('Caption'), { color: c('text/color-tertiary') }]}>{reply.time}</Text>
        </View>
        <Text style={[type('BodyM'), { color: c('text/color-primary') }]}>{reply.text}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, height: 40 }}>
          <Pressable onPress={() => { trigger(); onLike && onLike(); }} accessibilityLabel="Like reply" hitSlop={{ top: 4, bottom: 4, left: 6, right: 6 }} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 }}>
            <View className={pop}><Icon name="heart" solid={reply.liked} size={24} color={reply.liked ? c('icon/color-brand') : c('icon/color-secondary')} /></View>
            <Text style={[type('BodyS', 'bold'), { color: reply.liked ? c('text/color-brand') : c('text/color-secondary') }]}>{reply.likes}</Text>
          </Pressable>
          {onReply && (
            <Pressable testID={testID ? `${testID}-reply` : undefined} onPress={onReply} accessibilityRole="button" accessibilityLabel={`Reply to ${author.name}`} hitSlop={{ top: 5, bottom: 5, left: 8, right: 8 }} style={({ pressed }) => [{ paddingVertical: 8 }, pressed && { opacity: 0.6 }]}>
              <Text style={[type('BodyS', 'bold'), { color: c('text/color-secondary') }]}>Reply</Text>
            </Pressable>
          )}
        </View>
        {!!children && <View style={{ gap: 20, marginTop: 12 }}>{children}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
});
