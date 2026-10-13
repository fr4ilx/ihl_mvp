// Figma: Post card. Who and when, text (Body S, up to four lines in the feed, Body M in full in a conversation), optional photos, then Like and Reply with
// counts and the topic as a Neutral badge at the end of the same row. The time stays with the author and the topic
// with the content, so the two never share a line or a style.
// A practitioner posts as their practice: the Practitioner badge (Success, Subtle) starts the line under the name.
// A promotion adds the Promotion badge (Accent, like Sponsored). An Ask the Experts question adds that badge (Info).
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from '../rn';
import { useTheme, type, elevation } from '../theme';
import { motion } from '../theme/motion';
import Icon from './Icon';
import Avatar from './Avatar';
import Badge from './Badge';
import { usePop } from '../app/usePop';

// inGroup: on a group page, where the Ask the Experts badge would repeat the page title. Group posts have no topic.
// onMore: More opens the post options (Report and Block, or Delete on your own post). Without it, as in a
// conversation where the nav bar holds More, the card has no More.
export default function PostCard({ post, author, onPress, onLike, onAuthor, onPhoto, onMore, full, inGroup, testID }) {
  const { c } = useTheme();
  const [pop, trigger] = usePop(motion.like.duration);
  const like = () => { trigger(); onLike && onLike(); };
  const photos = post.photos || [];
  const card = [styles.card, { backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card }];
  const inner = (
    <>
      <View style={styles.header}>
        <Pressable testID="post-author" onPress={onAuthor} accessibilityLabel={`Open ${author.name}`} hitSlop={{ top: 4, bottom: 4 }} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
          <Avatar person={author} size={40} />
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={[type('BodyS', 'bold'), { color: c('text/color-primary') }]}>{author.name}</Text>
            {/* The meta line wraps as a whole under the badge when it runs out of room (larger text sizes). */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 8 }}>
              {author.practitioner && <Badge label="Practitioner" tone="success" />}
              {post.promo && <Badge testID="promo-badge" label="Promotion" tone="accent" />}
              {post.ask && !inGroup && <Badge testID="ask-badge" label="Ask the Experts" tone="info" />}
              <Text style={[type('Caption'), { color: c('text/color-tertiary') }]}>{post.time}</Text>
            </View>
          </View>
        </Pressable>
        {/* Figma: More is the 24pt icon on the card's right padding, with hitSlop for a 48pt target. */}
        {onMore && (
          <Pressable testID={testID ? testID + '-more' : 'post-card-more'} onPress={onMore} accessibilityLabel="More" hitSlop={{ top: 4, bottom: 4, left: 12, right: 12 }} style={({ pressed }) => [{ width: 24, height: 40, alignItems: 'center', justifyContent: 'center' }, pressed && { opacity: 0.6 }]}>
            <Icon name="more-horiz" size={24} color={c('icon/color-secondary')} />
          </Pressable>
        )}
      </View>
      <Text numberOfLines={full ? undefined : 4} style={[type(full ? 'BodyM' : 'BodyS'), { color: c('text/color-primary') }]}>{post.text}</Text>
      {photos.length > 0 && (
        <Pressable onPress={() => onPhoto && onPhoto(0)} accessibilityLabel="Open photo" style={{ height: 200, borderRadius: 16, overflow: 'hidden' }}>
          <Image source={photos[0]} style={{ width: '100%', height: '100%' }} />
          {photos.length > 1 && (
            <View style={[styles.count, { backgroundColor: c('bg/color-toast') }]}>
              <Text style={[type('Caption', 'bold'), { color: '#FFFFFF' }]}>1 of {photos.length}</Text>
            </View>
          )}
        </Pressable>
      )}
      <View style={styles.actions}>
        <Pressable onPress={like} accessibilityLabel={post.liked ? 'Unlike' : 'Like'} testID={testID ? testID + '-like' : undefined} hitSlop={4} style={styles.action}>
          <View className={pop}>
            <Icon name="heart" solid={post.liked} size={24} color={post.liked ? c('icon/color-brand') : c('icon/color-secondary')} />
          </View>
          <Text style={[type('BodyS', 'bold'), { color: post.liked ? c('text/color-brand') : c('text/color-secondary') }]}>{post.likes}</Text>
        </Pressable>
        <Pressable onPress={onPress} disabled={!onPress} accessibilityLabel="Replies" hitSlop={4} style={styles.action}>
          <Icon name="chat-bubble" size={24} color={c('icon/color-secondary')} />
          <Text style={[type('BodyS', 'bold'), { color: c('text/color-secondary') }]}>{post.replyCount}</Text>
        </Pressable>
        {!!post.topic && <View style={{ marginLeft: 'auto' }}><Badge testID="post-topic" label={post.topic} tone="neutral" /></View>}
      </View>
    </>
  );
  // In the feed the whole card opens the conversation. In the conversation it is a plain View.
  return onPress
    ? <Pressable testID={testID} onPress={onPress} style={({ pressed }) => [...card, pressed && { transform: [{ scale: 0.99 }] }]}>{inner}</Pressable>
    : <View testID={testID} style={card}>{inner}</View>;
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, padding: 16, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 20, height: 40 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
  count: { position: 'absolute', right: 12, bottom: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
});
