// Figma: Thread row. A conversation in one row: 40pt avatar, the post in Body S Bold (two lines at most),
// then who, how many replies and when. Rows sit in an inset grouped card, the divider starts under the text.
import React from 'react';
import { View, Text, Pressable } from '../rn';
import { useTheme, type } from '../theme';
import Avatar from './Avatar';

export const replies = (n) => `${n} ${n === 1 ? 'reply' : 'replies'}`;

// meta: the line under the post. By default who, how many replies and when. Questions for you say how many answers.
export default function ThreadRow({ post, author, meta, onPress, divider, testID, className, style }) {
  const { c } = useTheme();
  return (
    <Pressable testID={testID} onPress={onPress} className={className} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 12 }, pressed && { opacity: 0.6 }, style]}>
      <Avatar person={author} size={40} />
      <View style={{ flex: 1, gap: 4 }}>
        <Text numberOfLines={2} style={[type('BodyS', 'bold'), { color: c('text/color-primary') }]}>{post.text}</Text>
        <Text numberOfLines={1} style={[type('Caption'), { color: c('text/color-tertiary') }]}>{meta || `${author.name}  ·  ${replies(post.replyCount)}  ·  ${post.time}`}</Text>
      </View>
      {divider && <View style={{ position: 'absolute', left: 52, right: 0, bottom: 0, height: 1, backgroundColor: c('border/color-subtle') }} />}
    </Pressable>
  );
}
