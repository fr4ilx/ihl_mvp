// Figma: Answer card and Questions note. Questions for you on Community, for a practitioner.
// Answer card: one Ask the Experts question waiting for this practice. Who asked and when, the question in Body M Bold
// up to three lines, then how many answers it has and Answer (Secondary, Medium). The card opens the conversation,
// Answer opens it with the Reply bar ready. It leaves the list once the practice answers.
// Questions note: what the section says when no card shows. Live with nothing waiting: a Solid check-circle on
// bg/color-success-subtle. Before the listing is live: chat-bubble-question on bg/color-info-subtle, and a draft opens
// My Practice to finish it.
import React from 'react';
import { View, Text, Pressable } from '../rn';
import { useTheme, type, elevation } from '../theme';
import Avatar from './Avatar';
import Button from './Button';
import Icon from './Icon';

const answers = (n) => (n ? `${n} ${n === 1 ? 'answer' : 'answers'}` : 'No answers yet');

export function AnswerCard({ question, author, onOpen, onAnswer, testID, className, style }) {
  const { c } = useTheme();
  return (
    <Pressable
      testID={testID}
      className={className}
      onPress={onOpen}
      accessibilityLabel={`${author.name} asked: ${question.text}`}
      style={({ pressed }) => [{ gap: 16, padding: 16, borderRadius: 20, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card }, pressed && { transform: [{ scale: 0.985 }] }, style]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Avatar person={author} size={40} />
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={[type('BodyS', 'bold'), { color: c('text/color-primary') }]}>{author.name}</Text>
          <Text style={[type('Caption'), { color: c('text/color-tertiary') }]}>Asked {question.time} ago</Text>
        </View>
      </View>
      <Text numberOfLines={3} style={[type('BodyM', 'bold'), { color: c('text/color-primary') }]}>{question.text}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <Text style={[type('BodyS'), { color: c('text/color-secondary'), flexShrink: 1 }]}>{answers(question.replyCount)}</Text>
        <Button testID={testID ? `${testID}-answer` : undefined} label="Answer" hierarchy="secondary" size="medium" leadingIcon="chat-bubble" onPress={onAnswer} />
      </View>
    </Pressable>
  );
}

// tone: 'done' (nothing waiting) or 'later' (not live yet). onPress makes the whole card a link with a chevron.
export function QuestionsNote({ tone, title, message, onPress, testID }) {
  const { c } = useTheme();
  const done = tone === 'done';
  return (
    <Pressable
      testID={testID}
      disabled={!onPress}
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, borderRadius: 20, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card }, pressed && { transform: [{ scale: 0.985 }] }]}
    >
      <View style={{ width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: c(done ? 'bg/color-success-subtle' : 'bg/color-info-subtle') }}>
        <Icon name={done ? 'check-circle' : 'chat-bubble-question'} solid={done} size={24} color={c(done ? 'icon/color-success' : 'icon/color-info')} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[type('BodyM', 'bold'), { color: c('text/color-primary') }]}>{title}</Text>
        <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{message}</Text>
      </View>
      {onPress && <Icon name="nav-arrow-right" size={20} color={c('icon/color-secondary')} />}
    </Pressable>
  );
}
