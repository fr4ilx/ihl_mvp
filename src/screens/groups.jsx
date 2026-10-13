// Groups: Groups (all groups, from Community), Group (one group and its posts) and AskQuestion (a full screen modal).
// Groups are forum spaces on top of the four topics, like Book Club or Ask the Experts. Their posts live in the group,
// not in the Community feed. A Seedling joins up to 3 and posts in them. Grove opens every group.
// Ask the Experts: a Grove member asks, IHL reads it first (In review), then publishes it in the group for verified
// practitioners to answer, or sends it back with a note (Needs changes).
import React, { useState } from 'react';
import { View, Text, TextInput } from '../rn';
import { useTheme, type, elevation } from '../theme';
import { useNav, useRoute } from '../app/nav';
import { useApp } from '../app/store';
import { useFeedback, SNACK } from '../app/feedback';
import { useForm } from '../app/form';
import { TOPICS, FREE_GROUPS, images } from '../data';
import Screen, { BottomBar } from '../components/Screen';
import NavBar from '../components/NavBar';
import Button from '../components/Button';
import Chip from '../components/Chip';
import Icon from '../components/Icon';
import PostCard from '../components/PostCard';
import EmptyState from '../components/EmptyState';
import ConfirmAlert from '../components/ConfirmAlert';
import TextLink from '../components/TextLink';
import { SectionLabel } from '../components/Rows';
import FieldError from '../components/FieldError';
import { GroupCard, GroupArt, AskCard, QuestionCard, members, fresh } from '../components/Groups';
import { openAuthor, usePostOptions } from './community';
import { enter } from './home';

// Joining: a Seedling at 3 groups gets the paywall instead. Returns true when joined.
export function useJoin() {
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  return (g) => {
    if (!app.joinGroup(g.id)) { fb.haptic('light'); nav.openModal('JoinGrove', { reason: 'groups' }); return false; }
    fb.snack({ message: `You joined ${g.name}`, bottom: SNACK.none });
    return true;
  };
}

// Figma: Limit card. A Seedling's groups on Groups: "2 of 3 free groups", what Grove adds and Join Grove.
function LimitCard({ used, onJoin }) {
  const { c } = useTheme();
  return (
    <View testID="limit-card" style={{ flexDirection: 'row', gap: 16, padding: 16, borderRadius: 20, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, alignItems: 'flex-start' }}>
      <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c('bg/color-accent-subtle'), alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="community" size={24} color={c('icon/color-accent')} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>{Math.min(used, FREE_GROUPS)} of {FREE_GROUPS} free groups</Text>
        <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>Grove opens every group.</Text>
        <TextLink testID="limit-join" label="Join Grove" onPress={onJoin} style={{ marginTop: 4 }} />
      </View>
    </View>
  );
}

export function Groups() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const join = useJoin();
  const mine = app.groups.filter((g) => g.joined);
  // Suggested from the quiz answers, then the rest.
  const picks = app.member ? app.suggestedGroups : [];
  const more = app.groups.filter((g) => !g.joined && !picks.some((x) => x.id === g.id));
  const seedling = app.member && !app.grove;
  const open = (g) => nav.navigate('Group', { id: g.id });
  return (
    <Screen testID="screen-groups" nav={<NavBar kind="back" title="Groups" onBack={nav.goBack} />} bodyGap={24}>
      {seedling && <LimitCard used={mine.length} onJoin={() => nav.openModal('JoinGrove', { reason: 'groups' })} />}
      {mine.length > 0 && (
        <View style={{ gap: 12 }}>
          <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>Your groups</Text>
          {mine.map((g, i) => <View key={g.id} {...enter(i)}><GroupCard group={g} onPress={() => open(g)} /></View>)}
        </View>
      )}
      {picks.length > 0 && (
        <View testID="suggested-groups" style={{ gap: 12 }}>
          <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>Suggested for you</Text>
          {picks.map((g, i) => <View key={g.id} {...enter(mine.length + i)}><GroupCard group={g} onPress={() => open(g)} onJoin={() => join(g)} /></View>)}
        </View>
      )}
      {more.length > 0 && (
        <View style={{ gap: 12 }}>
          <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>{mine.length || picks.length ? 'More groups' : 'All groups'}</Text>
          {more.map((g, i) => <View key={g.id} {...enter(mine.length + picks.length + i)}><GroupCard group={g} onPress={() => open(g)} onJoin={() => join(g)} /></View>)}
        </View>
      )}
    </Screen>
  );
}

export function Group() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const options = usePostOptions();
  const join = useJoin();
  const { params } = useRoute().route;
  const g = app.groups.find((x) => x.id === params.id) || app.groups[0];
  const [leave, setLeave] = useState(!!params.confirmLeave);
  const posts = app.groupPosts(g.id);
  const experts = g.id === 'experts';
  // Members ask. A practitioner answers from Questions for you on My Practice.
  const asking = experts && app.member;
  const ask = () => (app.grove ? nav.openModal('AskQuestion') : nav.openModal('JoinGrove', { reason: 'experts' }));
  const newPost = () => nav.openModal('NewPost', { group: g.id });
  const answers = (postId) => { const p = postId && app.post(postId); return p ? p.replyCount : 0; };
  return (
    <>
      <Screen
        testID="screen-group"
        nav={<NavBar kind="back" onBack={nav.goBack} actions={g.joined && !experts ? [{ icon: 'plus', variant: 'filled', onPress: newPost, accessibilityLabel: `New post in ${g.name}`, testID: 'group-new-post' }] : []} />}
        bodyGap={24}
      >
        <View style={{ alignItems: 'center', gap: 8 }}>
          <GroupArt group={g} size={120} />
          <Text style={[type('H2', 'bold'), { color: c('text/color-primary'), textAlign: 'center' }]}>{g.name}</Text>
          <Text style={[type('BodyS'), { color: c('text/color-secondary'), textAlign: 'center' }]}>{members(g.members)}  ·  {fresh(g.fresh)}</Text>
          <Text style={[type('BodyM'), { color: c('text/color-secondary'), textAlign: 'center' }]}>{g.about}</Text>
          <View style={{ alignSelf: 'stretch', marginTop: 8 }}>
            {g.joined
              ? <Button testID="group-joined" label="Joined" hierarchy="secondary" leadingIcon="check" fill onPress={() => { fb.haptic('light'); setLeave(true); }} />
              : <Button testID="group-join" label="Join group" fill onPress={() => join(g)} />}
          </View>
        </View>
        {asking && <AskCard locked={!app.grove} quiet={!g.joined} onAsk={ask} />}
        {asking && app.grove && app.myQuestions.length > 0 && (
          <View testID="my-questions" style={{ gap: 12 }}>
            <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>Your questions</Text>
            {app.myQuestions.map((q) => (
              <QuestionCard key={q.id} question={q} answers={answers(q.postId)} onOpen={() => nav.navigate('Conversation', { postId: q.postId, from: g.id })} onEdit={() => nav.openModal('AskQuestion', { edit: q.id })} />
            ))}
          </View>
        )}
        <View style={{ gap: 12 }}>
          <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>{experts ? 'Recent questions' : 'Posts'}</Text>
          {posts.length ? (
            <View style={{ gap: 20 }}>
              {posts.map((p, i) => (
                <View key={p.id} {...enter(p.fresh ? 0 : i)}>
                  <PostCard
                    testID={`group-post-${p.id}`}
                    post={p}
                    inGroup
                    author={app.person(p.author)}
                    onPress={() => nav.navigate('Conversation', { postId: p.id, from: g.id })}
                    onLike={() => { app.toggleLike(p.id); fb.haptic('light'); }}
                    onAuthor={() => openAuthor(nav, app.person(p.author))}
                    onPhoto={(idx) => nav.openViewer(p.photos, idx)}
                    onMore={() => options(p)}
                  />
                </View>
              ))}
            </View>
          ) : (
            <EmptyState testID="group-empty" illustration={images.illustrations.circle} title="No posts yet" message={g.joined ? 'Start the first one.' : 'Join to start the first one.'} action={g.joined ? 'New post' : null} onAction={newPost} />
          )}
        </View>
      </Screen>
      <ConfirmAlert
        testID="leave-alert"
        visible={leave}
        title={`Leave ${g.name}?`}
        message="You can join again anytime."
        actions={[{ label: 'Cancel', style: 'cancel', onPress: () => setLeave(false) }, { label: 'Leave', style: 'destructive', onPress: () => { setLeave(false); app.leaveGroup(g.id); fb.snack({ message: `You left ${g.name}`, tone: 'info', bottom: SNACK.none }); } }]}
      />
    </>
  );
}

// ---------- Ask the Experts (full screen modal) ----------
// A topic, the question and two reminders, then Send for review. Opened with edit, it reopens a question that needs
// changes with IHL's note on top, and Send again.
export function AskQuestion() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const p = useRoute().route.params || {};
  const editing = p.edit ? app.myQuestions.find((q) => q.id === p.edit) : null;
  const [topic, setTopic] = useState(p.topic || (editing && editing.topic) || null);
  const [text, setText] = useState(p.text ?? (editing ? editing.text : ''));
  const form = useForm(!!p.validate);
  const errors = {
    topic: topic ? null : 'Pick a topic.',
    text: !text.trim() ? 'Write your question.' : editing && text.trim() === editing.text ? 'Edit your question to send it again.' : null,
  };
  const shown = form.shown(errors);
  const send = () => form.submit(errors, () => {
    if (editing) app.resendQuestion(editing.id, text.trim());
    else app.askQuestion({ topic, text: text.trim() });
    fb.haptic('success');
    nav.closeModal();
    setTimeout(() => fb.snack({ message: 'Sent for review', bottom: SNACK.none }), 420);
  });
  const tip = (icon, line) => (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
      <Icon name={icon} size={20} color={c('icon/color-secondary')} style={{ marginTop: 1 }} />
      <Text style={[type('BodyS'), { color: c('text/color-secondary'), flex: 1 }]}>{line}</Text>
    </View>
  );
  return (
    <Screen
      testID="screen-ask"
      nav={<NavBar kind="back" backIcon="xmark" title={editing ? 'Edit question' : 'Ask the Experts'} onBack={nav.closeModal} />}
      bodyGap={24}
      bottom={<BottomBar plain><Button testID="ask-send" label={editing ? 'Send again' : 'Send for review'} fill onPress={send} /></BottomBar>}
    >
      {editing && editing.note && (
        <View testID="ask-note" style={{ padding: 12, borderRadius: 12, backgroundColor: c('bg/color-warning-subtle'), gap: 4 }}>
          <Text style={[type('BodyS', 'bold'), { color: c('text/color-warning') }]}>Note from IHL</Text>
          <Text style={[type('BodyS'), { color: c('text/color-primary') }]}>{editing.note}</Text>
        </View>
      )}
      <View style={{ gap: 8 }}>
        <SectionLabel error={!!shown.topic}>Topic</SectionLabel>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {TOPICS.filter((t) => t !== 'All').map((t) => <Chip key={t} testID={`ask-topic-${t}`} label={t} selected={topic === t} onPress={() => { setTopic(t); fb.haptic('selection'); }} />)}
        </View>
        <FieldError testID="ask-topic-error" message={shown.topic} />
      </View>
      <View style={{ gap: 8 }}>
        <View style={{ height: 220, borderRadius: 16, borderWidth: shown.text ? 2 : 1, borderColor: c(shown.text ? 'border/color-error' : 'border/color-control'), backgroundColor: c('bg/color-surface-raised'), padding: shown.text ? 15 : 16 }}>
          <TextInput testID="ask-text" multiline value={text} onChangeText={setText} placeholder="What would you like to ask?" placeholderTextColor={c('text/color-tertiary')} style={[type('BodyM'), { color: c('text/color-primary'), flex: 1, height: '100%' }]} />
        </View>
        <FieldError testID="ask-text-error" message={shown.text} />
      </View>
      <View style={{ gap: 12 }}>
        {tip('shield-check', 'Leave out names, medicines and health records.')}
        {tip('info-circle', 'Answers share general information, not medical advice.')}
      </View>
    </Screen>
  );
}
