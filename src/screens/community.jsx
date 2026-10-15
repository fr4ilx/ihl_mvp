// Community tab: Community (feed), Conversation, MemberProfile. Modals: NewPost, PhotoViewer.
// Community shows Your groups above the feed (V2). Group posts live in their group (groups.jsx), so the feed holds the rest.
// A practitioner reads, replies and answers, and never starts a post: Questions for you leads their Community instead
// of Your groups, and there is no New post button.
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, TextInput, StyleSheet } from '../rn';
import { useTheme, type, elevation } from '../theme';
import { motion } from '../theme/motion';
import { useNav, useRoute } from '../app/nav';
import { useApp, useLoad } from '../app/store';
import { useFeedback, SNACK, celebrate } from '../app/feedback';
import { useForm } from '../app/form';
import { TOPICS, images } from '../data';
import Screen, { BottomBar } from '../components/Screen';
import NavBar from '../components/NavBar';
import TabBar from '../components/TabBar';
import NewPostButton from '../components/NewPostButton';
import Chip from '../components/Chip';
import PostCard from '../components/PostCard';
import Reply from '../components/Reply';
import ReplyBar from '../components/ReplyBar';
import Avatar from '../components/Avatar';
import EmptyState from '../components/EmptyState';
import { PostSkeleton } from '../components/Skeleton';
import { InterestTiles, } from '../components/Interests';
import { SectionLabel } from '../components/Rows';
import FieldError from '../components/FieldError';
import IconButton from '../components/IconButton';
import Button from '../components/Button';
import Icon from '../components/Icon';
import SearchField from '../components/SearchField';
import TextLink from '../components/TextLink';
import TopicsSheet from '../components/TopicsSheet';
import ShareSheet from '../components/ShareSheet';
import ChoosePhotosSheet from '../components/ChoosePhotosSheet';
import PhotoGrid from '../components/PhotoGrid';
import Badge from '../components/Badge';
import { GroupTile, FindGroupsTile, GroupArt } from '../components/Groups';
import { AnswerCard, QuestionsNote } from '../components/Questions';
import { BadgeRow } from '../components/Journey';
import { STAGES, BADGES, QUEST } from '../data';
import { enter } from './home';

// More on a post opens the iOS action sheet. Your own post: Delete post. Someone else's: Report post and Block, which
// App Review asks of an app where members post (guideline 1.2). Delete and Block ask first with the iOS alert.
// bottom: where the Snackbar sits. gone: runs when the post leaves the screen (a conversation goes back).
export function usePostOptions() {
  const app = useApp();
  const fb = useFeedback();
  // step: 'block' opens the Block alert straight away (review panel only).
  return (post, { bottom = SNACK.none, gone, step } = {}) => {
    const author = app.person(post.author);
    const done = (message) => { if (gone) gone(); fb.snack({ message, bottom: gone ? SNACK.tabBar : bottom, hapticKind: 'success' }); };
    const block = () => fb.confirm({
      testID: 'block-alert', title: `Block ${author.name}?`, message: 'You won’t see their posts or replies. They won’t be told.',
      action: { label: 'Block', onPress: () => { app.block(post.author); done(`${author.name} blocked`); } },
    });
    if (step === 'block') { block(); return; }
    if (post.author === 'jane') {
      fb.actionSheet({ testID: 'post-options', options: [{ label: 'Delete post', destructive: true, testID: 'post-delete', onPress: () => fb.confirm({
        testID: 'delete-post-alert', title: 'Delete this post?', message: post.replyCount ? 'Its replies go with it. This can’t be undone.' : 'This can’t be undone.',
        action: { label: 'Delete', onPress: () => { app.deletePost(post.id); done('Post deleted'); } },
      }) }] });
      return;
    }
    fb.actionSheet({ testID: 'post-options', options: [
      { label: 'Report post', testID: 'post-report', onPress: () => fb.snack({ message: 'Thanks. IHL will review this post.', tone: 'info', bottom, hapticKind: 'light' }) },
      { label: `Block ${author.name}`, destructive: true, testID: 'post-block', onPress: block },
    ] });
  };
}

// A practitioner's name or photo opens their listing. A seeker's opens their member profile.
export const openAuthor = (nav, person) => (person.practitioner
  ? nav.navigate('ListingProfile', { id: person.listingId })
  : nav.navigate('MemberProfile', { personId: person.id }));

// Community: Search plus a menu button that opens the Topics sheet (one topic at a time), then the feed.
export function Community() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const { params } = useRoute().route;
  const [topic, setTopic] = useState(params.topic || 'All');
  const [query, setQuery] = useState(params.query || '');
  const [sheet, setSheet] = useState(!!params.openTopics);
  const [state, retry] = useLoad(app.network);
  const q = query.trim().toLowerCase();
  const pro = app.practitioner;
  const posts = app.feed.filter((p) => (topic === 'All' || p.topic === topic) && (!q || [p.text, p.topic, app.person(p.author).name].join(' ').toLowerCase().includes(q)));
  const pick = (t) => { setTopic(t); setSheet(false); fb.haptic('selection'); };
  const options = usePostOptions();
  // Review panel only: open with More on a post already tapped, or straight on its Block alert.
  useEffect(() => {
    const id = params.options || params.block;
    const p = id && app.post(id);
    if (!p) return undefined;
    const t = setTimeout(() => options(p, { bottom: SNACK.tabBar, step: params.block ? 'block' : undefined }), 400);
    return () => clearTimeout(t);
  }, []);

  let body;
  if (state === 'loading') body = <><PostSkeleton /><PostSkeleton photo={false} /></>;
  // Figma: feed messages sit 56pt lower than the first card would.
  else if (state === 'error') body = <><View style={{ height: 56 }} /><EmptyState testID="feed-error" tone="error" illustration={images.illustrations.error} title="Can’t load the feed" message="Check your connection and try again." action="Try again" onAction={() => { fb.haptic('light'); retry(); }} /></>;
  else if (!app.feed.length) body = <><View style={{ height: 56 }} /><EmptyState testID="feed-empty" illustration={images.illustrations.circle} title="No posts yet" message={pro ? 'Members’ posts show up here.' : 'Be the first to start one.'} action={pro ? null : 'New post'} onAction={() => nav.openModal('NewPost')} /></>;
  else if (!posts.length && q) body = <><View style={{ height: 56 }} /><EmptyState testID="feed-no-results" illustration={images.illustrations.noResults} title={`No posts for “${query.trim()}”`} message="Try another word or topic." action="Clear search" onAction={() => { setQuery(''); setTopic('All'); }} /></>;
  else if (!posts.length) body = <><View style={{ height: 56 }} /><EmptyState testID="feed-topic-empty" illustration={images.illustrations.circle} title={`No ${topic.toLowerCase()} posts yet`} message={pro ? 'Members’ posts show up here.' : 'Start the first one.'} action={pro ? null : 'New post'} onAction={() => nav.openModal('NewPost', { topic })} /></>;
  else body = posts.map((p, i) => (
    <View key={p.id} {...enter(p.fresh ? 0 : i)}>
      <PostCard
        testID={`post-${p.id}`}
        post={p}
        author={app.person(p.author)}
        onPress={() => nav.navigate('Conversation', { postId: p.id })}
        onLike={() => { app.toggleLike(p.id); fb.haptic('light'); }}
        onAuthor={() => openAuthor(nav, app.person(p.author))}
        onPhoto={(idx) => nav.openViewer(p.photos, idx)}
        onMore={() => options(p, { bottom: SNACK.tabBar })}
      />
    </View>
  ));
  const showCount = state === 'ready' && posts.length > 0 && (topic !== 'All' || !!q);
  // Your groups, or Questions for you for a practitioner, sits above the feed until a search or a topic narrows it.
  // V1 has no groups.
  const top = state === 'ready' && topic === 'All' && !q;
  const showGroups = app.v2 && !pro && top;
  const showQuestions = pro && top;
  const mine = app.groups.filter((g) => g.joined);
  const listed = state === 'ready' && posts.length > 0;

  return (
    <>
      <Screen
        testID="screen-community"
        bodyTop={12}
        statusFill
        bottomSpace={pro ? 140 : 186}
        bottom={<>{!pro && <NewPostButton onPress={() => nav.openModal('NewPost')} />}<TabBar active="community" onChange={nav.switchTab} /></>}
      >
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <SearchField testID="community-search" value={query} onChangeText={setQuery} placeholder="Search conversations" />
            </View>
            <IconButton testID="open-topics" icon="menu" variant={topic === 'All' ? 'outline' : 'filled'} accessibilityLabel={topic === 'All' ? 'Topics' : `Topics, ${topic}`} onPress={() => setSheet(true)} />
          </View>
          {showCount && (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text testID="feed-count" style={[type('BodyS'), { color: c('text/color-secondary') }]}>{posts.length} {posts.length === 1 ? 'post' : 'posts'}{topic === 'All' ? '' : ` in ${topic}`}</Text>
              {topic !== 'All' && <TextLink testID="clear-topic" label="Clear" onPress={() => { setTopic('All'); fb.haptic('selection'); }} />}
            </View>
          )}
        </View>
        {showGroups && (
          <View testID="your-groups" style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>{mine.length ? 'Your groups' : 'Groups'}</Text>
              <TextLink testID="see-groups" label="See all" onPress={() => nav.navigate('Groups')} />
            </View>
            {mine.length ? (
              <ScrollView horizontal style={{ marginHorizontal: -16, marginTop: -12, marginBottom: -32 }} contentContainerStyle={{ gap: 12, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 }}>
                {mine.map((g) => <GroupTile key={g.id} group={g} onPress={() => nav.navigate('Group', { id: g.id })} />)}
                <FindGroupsTile onPress={() => nav.navigate('Groups')} />
              </ScrollView>
            ) : (
              <JoinGroupsCard onPress={() => nav.navigate('Groups')} />
            )}
          </View>
        )}
        {showQuestions && <QuestionsForYou />}
        {(showGroups || showQuestions) && listed ? (
          <View style={{ gap: 12 }}>
            <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>Latest posts</Text>
            <View style={{ gap: 20 }}>{body}</View>
          </View>
        ) : body}
      </Screen>
      <TopicsSheet visible={sheet} value={topic} onPick={pick} onClose={() => setSheet(false)} />
    </>
  );
}

// Questions for you: Ask the Experts questions that match this practice's specialties, waiting for its answer.
// Each card opens the conversation, Answer opens it with the Reply bar ready. Once answered a question leaves the list.
// Nothing waiting, or a listing that isn't live yet, shows one Questions note instead.
function QuestionsForYou() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const status = app.practice.status;
  const waiting = app.questions;
  const open = (q, focus) => { if (focus) fb.haptic('light'); nav.navigate('Conversation', { postId: q.id, focus }); };
  let body;
  if (status === 'draft') body = <QuestionsNote testID="questions-later" title="Questions start once you’re live" message="Finish your listing on My Practice." onPress={() => nav.switchTab('profile')} />;
  else if (status !== 'live') body = <QuestionsNote testID="questions-later" title="Questions start once you’re live" message="We’re checking your listing now." />;
  else if (!waiting.length) body = <QuestionsNote testID="questions-done" tone="done" title="You’re all caught up" message="New questions show up here." />;
  else body = waiting.map((q, i) => <AnswerCard key={q.id} testID={`answer-${q.id}`} {...enter(i)} question={q} author={app.person(q.author)} onOpen={() => open(q)} onAnswer={() => open(q, true)} />);
  return (
    <View testID="questions-for-you" style={{ gap: 12 }}>
      <View style={{ gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>Questions for you</Text>
          {status === 'live' && waiting.length > 0 && <Text testID="questions-waiting" style={[type('BodyS', 'bold'), { color: c('text/color-brand') }]}>{waiting.length} waiting</Text>}
        </View>
        {status === 'live' && waiting.length > 0 && <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>Your answers show the Expert badge.</Text>}
      </View>
      {body}
    </View>
  );
}

// Figma: Join groups card. Community before any group is joined: a 48pt bg/color-brand-subtle circle with community,
// "Join a group" in H5 Bold, a few names in Body S and a chevron. Opens Groups.
function JoinGroupsCard({ onPress }) {
  const { c } = useTheme();
  return (
    <Pressable testID="join-groups" onPress={onPress} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, borderRadius: 20, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card }, pressed && { transform: [{ scale: 0.985 }] }]}>
      <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c('bg/color-brand-subtle'), alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="community" size={24} color={c('icon/color-brand')} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>Join a group</Text>
        <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>Book Club, Herbal Medicine and more.</Text>
      </View>
      <Icon name="nav-arrow-right" size={20} color={c('icon/color-secondary')} />
    </Pressable>
  );
}

export function Conversation() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const { route, focused } = useRoute();
  // The last post seen stays on screen while a deleted or blocked post slides away.
  const kept = useRef(null);
  const live = app.post(route.params.postId);
  if (live) kept.current = live;
  const post = live || kept.current || app.post('p1');
  const options = usePostOptions();
  const [share, setShare] = useState(false);
  const [text, setText] = useState(route.params.draft || '');
  // A reply being answered (a sub-thread), or null for the post itself.
  const [to, setTo] = useState(route.params.replyTo || null);
  const scroll = useRef();
  const input = useRef();
  useEffect(() => { if (!route.params.autoSend) return; const t = setTimeout(() => send(), 600); return () => clearTimeout(t); }, []);
  // Answer on Questions for you: the Reply bar is ready once the push settles.
  useEffect(() => { if (!route.params.focus) return; const t = setTimeout(() => input.current && input.current.focus(), 520); return () => clearTimeout(t); }, []);
  useEffect(() => {
    if (route.params.justPosted) {
      const t = setTimeout(() => fb.snack({ message: 'Your post is live', bottom: SNACK.composer }), 560);
      return () => clearTimeout(t);
    }
  }, []);
  if (!post) return null;
  const send = () => {
    if (!text.trim()) { if (input.current) input.current.focus(); return; }
    if (app.network === 'offline') { fb.snack({ message: 'Couldn’t send. Try again.', tone: 'error', bottom: SNACK.composer }); return; }
    const result = app.addReply(post.id, text.trim(), target ? target.id : null);
    setText('');
    setTo(null);
    celebrate(fb, result, { message: answering ? 'Answer posted' : 'Reply posted', bottom: SNACK.composer });
    if (!target) setTimeout(() => { if (scroll.current) scroll.current.scrollTo({ top: 99999, behavior: 'smooth' }); }, 60);
  };
  const target = to ? post.replies.find((r) => r.id === to) : null;
  const group = app.v2 && post.group ? app.groups.find((g) => g.id === post.group) : null;
  const replyTo = (r) => { setTo(r.id); fb.haptic('selection'); setTimeout(() => input.current && input.current.focus(), 0); };
  // Replies to replies count as shown too.
  const more = post.replyCount - post.replies.reduce((n, r) => n + 1 + (r.replies || []).length, 0);
  // Ask the Experts: a verified practitioner answers as their practice, and the answer shows the Expert badge.
  const me = app.person('jane');
  const answering = post.ask && me.practitioner && me.verified;
  const noun = post.ask ? 'answer' : 'reply';
  const isExpert = (person) => !!(post.ask && person.practitioner && person.verified);
  const author = app.person(post.author);
  return (
    <>
    <Screen
      testID="screen-conversation"
      scrollRef={scroll}
      nav={<NavBar kind="back" onBack={nav.goBack} actions={[
        // Share opens the iOS share sheet, as on a listing. More holds the post options.
        { icon: 'share-ios', accessibilityLabel: 'Share', testID: 'post-share', onPress: () => { fb.haptic('light'); setShare(true); } },
        { icon: 'more-horiz', accessibilityLabel: 'More', testID: 'post-more', onPress: () => options(post, { bottom: SNACK.composer, gone: nav.goBack }) },
      ]} />}
      bodyTop={20}
      bottomSpace={target ? 174 : 130}
      bottom={<ReplyBar value={text} onChangeText={setText} onSend={send} inputRef={input} placeholder={answering && !target ? `Answer as ${me.name}` : 'Write a reply'} replyingTo={target ? app.person(target.author).name : null} onCancelReply={() => setTo(null)} />}
    >
      {/* A group post says where it lives. From the group itself it is a label, elsewhere it opens the group. */}
      {!!group && (
        <Pressable testID="post-group" hitSlop={{ top: 8, bottom: 8 }} disabled={route.params.from === group.id} onPress={() => nav.navigate('Group', { id: group.id })} accessibilityRole={route.params.from === group.id ? undefined : 'link'} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 32, alignSelf: 'flex-start', marginBottom: -4 }, pressed && { opacity: 0.6 }]}>
          <GroupArt group={group} size={28} />
          <Text style={[type('BodyS', 'bold'), { color: c(route.params.from === group.id ? 'text/color-secondary' : 'text/color-link') }]}>{group.name}</Text>
          {route.params.from !== group.id && <Icon name="nav-arrow-right" size={16} color={c('text/color-link')} />}
        </Pressable>
      )}
      {/* Figma: the thread card. The post and its replies share one bg/color-surface-raised card with radius/20,
          the replies under a border/color-subtle divider, so the conversation reads as one piece. */}
      <View testID="thread" style={{ backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, borderRadius: 20, overflow: 'hidden' }}>
        <PostCard
          post={post}
          full
          inGroup={!!group}
          author={app.person(post.author)}
          onLike={() => { app.toggleLike(post.id); fb.haptic('light'); }}
          onAuthor={() => openAuthor(nav, app.person(post.author))}
          onPhoto={(idx) => nav.openViewer(post.photos, idx)}
        />
        <View style={{ paddingHorizontal: 16, paddingBottom: 20, gap: 16 }}>
          <View style={{ height: 1, backgroundColor: c('border/color-subtle') }} />
          {post.replyCount === 0 ? (
            <Text testID="no-replies" style={[type('BodyS'), { color: c('text/color-secondary') }]}>{post.ask ? 'No answers yet.' : 'No replies yet. We’ll let you know when someone answers.'}</Text>
          ) : (
            <Text style={[type('H6', 'bold'), { color: c('text/color-primary') }]}>{post.replyCount} {post.replyCount === 1 ? noun : `${noun === 'reply' ? 'replies' : 'answers'}`}</Text>
          )}
          {post.replies.length > 0 && (
            <View style={{ gap: 20 }}>
              {post.replies.map((r) => (
                <Reply key={r.id} testID={`reply-${r.id}`} className={r.fresh || r.loaded ? 'fx-list-in' : ''} reply={r} author={app.person(r.author)} expert={isExpert(app.person(r.author))} onLike={() => { app.toggleReplyLike(post.id, r.id); fb.haptic('light'); }} onAuthor={() => openAuthor(nav, app.person(r.author))} onReply={() => replyTo(r)}>
                  {(r.replies || []).length > 0 && r.replies.map((x) => (
                    <Reply key={x.id} testID={`reply-${x.id}`} className={x.fresh ? 'fx-list-in' : ''} reply={x} author={app.person(x.author)} expert={isExpert(app.person(x.author))} onLike={() => { app.toggleReplyLike(post.id, x.id); fb.haptic('light'); }} onAuthor={() => openAuthor(nav, app.person(x.author))} />
                  ))}
                </Reply>
              ))}
            </View>
          )}
          {more > 0 && <TextLink testID="see-more-replies" label={`See ${more} more ${more === 1 ? noun : noun === 'reply' ? 'replies' : 'answers'}`} onPress={() => { app.loadReplies(post.id); fb.haptic('light'); }} />}
        </View>
      </View>
    </Screen>
    {/* In the app: Share.share({ message: the post's first line, url: postLink }). */}
    <ShareSheet visible={share} title={post.text} subtitle={`${author.name} on Indy Holistic Living`} photo={(post.photos || [])[0] || author.photo} onClose={() => setShare(false)}
      onPick={(to) => { setShare(false); fb.snack({ message: to === 'Copy' ? 'Link copied' : `Opening ${to}`, tone: to === 'Copy' ? 'success' : 'info', bottom: SNACK.composer, hapticKind: 'light' }); }} />
    </>
  );
}

export function MemberProfile() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const { route } = useRoute();
  const person = app.person(route.params.personId);
  const posts = app.postsBy(person.id);
  const options = usePostOptions();
  // Their journey stage, bio and the badges they earned (V2). Badges are trust signals, never a ranking.
  const stage = app.v2 ? STAGES.find((x) => x.id === person.stage) : null;
  const earned = app.v2 ? BADGES.filter((b) => (person.badges || []).includes(b.id)).map((b) => ({ ...b, earned: true })) : [];
  const bio = app.v2 ? person.bio : '';
  return (
    <Screen testID="screen-member" nav={<NavBar kind="back" onBack={nav.goBack} />} bodyGap={24}>
      <View style={{ gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Avatar person={person} size={96} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={[type('H3', 'bold'), { color: c('text/color-primary') }]}>{person.name}</Text>
            <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{person.area}  ·  Member since {person.since}</Text>
            {!!stage && <View style={{ marginTop: 4 }}><Badge testID="member-stage" label={stage.name} tone="accent" icon={stage.icon} /></View>}
          </View>
        </View>
        {!!bio && <Text testID="member-bio" style={[type('BodyM'), { color: c('text/color-primary') }]}>{bio}</Text>}
      </View>
      {earned.length > 0 && (
        <View style={{ gap: 8 }}>
          <SectionLabel>Badges</SectionLabel>
          <BadgeRow badges={earned} testID="member-badges" />
        </View>
      )}
      <View style={{ gap: 8 }}>
        <SectionLabel>Interests</SectionLabel>
        <InterestTiles ids={person.interests} />
      </View>
      <View style={{ gap: 8 }}>
        <SectionLabel>Posts</SectionLabel>
        {posts.length ? (
          <View style={{ gap: 20 }}>
            {posts.map((p) => (
              <PostCard key={p.id} post={p} author={person} onPress={() => nav.navigate('Conversation', { postId: p.id })} onLike={() => { app.toggleLike(p.id); fb.haptic('light'); }} onPhoto={(i) => nav.openViewer(p.photos, i)} onMore={() => options(p, { gone: p.author === 'jane' ? undefined : nav.goBack })} />
            ))}
          </View>
        ) : (
          <Text testID="member-no-posts" style={[type('BodyM'), { color: c('text/color-secondary') }]}>{person.name.split(' ')[0]} hasn’t posted yet.</Text>
        )}
      </View>
    </Screen>
  );
}

// ---------- New post (full screen modal) ----------
const MAX_PHOTOS = 5;
export function NewPost() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const { route, focused } = useRoute();
  const p = route.params || {};
  const live = useRef(focused);
  live.current = focused;
  // No topic until the person picks one. Opening from a topic's empty feed starts on that topic.
  // In a group the post has no topic: "Posting in" names the group instead.
  const group = p.group ? app.groups.find((g) => g.id === p.group) : null;
  // From the quest, the post is the Share a reflection step.
  const quest = p.quest === 'share';
  const [topic, setTopic] = useState(p.topic && p.topic !== 'All' ? p.topic : null);
  const [text, setText] = useState(p.text || '');
  const [photos, setPhotos] = useState(p.photos || []);
  const [sheet, setSheet] = useState(!!p.openSheet);
  const [posting, setPosting] = useState(false);
  // Post with no topic, or with no text and no photo, says what is missing. Posting… is the only disabled state.
  const form = useForm(!!p.validate);
  const errors = { topic: !group && !topic ? 'Pick a topic.' : null, content: !text.trim() && !photos.length ? 'Write something or add a photo.' : null };
  const shown = form.shown(errors);
  const room = MAX_PHOTOS - photos.length;

  const timers = useRef([]);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => {
    if (p.autoPost) later(post, 700);
    return () => timers.current.forEach(clearTimeout); // leaving the screen cancels a pending post
  }, []);

  function post() {
    setPosting(true);
    later(() => {
      if (!live.current) return; // closed while posting
      setPosting(false);
      if (app.network === 'offline') { fb.snack({ message: 'Couldn’t post. Try again.', tone: 'error', bottom: SNACK.bottomBar }); return; }
      const created = app.addPost({ topic: group ? null : topic, text: text.trim(), photos, group: group ? group.id : null });
      fb.haptic('success');
      // A group post shows up on the group's page, under the modal.
      if (group) { nav.closeModal(); setTimeout(() => celebrate(fb, { grew: created.grew }, { message: 'Your post is live', bottom: SNACK.none }), 420); return; }
      const won = quest ? app.completeQuestStep('share') : null;
      const award = won || created.grew;
      nav.closeModalAndPush('community', 'Conversation', { postId: created.id, justPosted: !award });
      if (award) setTimeout(() => celebrate(fb, { earned: won, grew: created.grew }), 700);
    }, 1200);
  }
  const addPicked = (picked) => {
    setPhotos((ph) => [...ph, ...picked].slice(0, MAX_PHOTOS));
    setSheet(false);
  };
  return (
    <>
      <Screen
        testID="screen-newpost"
        nav={<NavBar kind="back" backIcon="xmark" title="New post" onBack={nav.closeModal} />}
        bodyGap={24}
        bottom={<BottomBar plain><Button testID="post-submit" label={posting ? 'Posting…' : 'Post'} fill disabled={posting} onPress={() => form.submit(errors, post)} /></BottomBar>}
      >
        {group ? (
          <View testID="posting-in" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <GroupArt group={group} size={40} />
            <View style={{ flex: 1 }}>
              <Text style={[type('Caption'), { color: c('text/color-tertiary') }]}>Posting in</Text>
              <Text numberOfLines={1} style={[type('BodyS', 'bold'), { color: c('text/color-primary') }]}>{group.name}</Text>
            </View>
          </View>
        ) : (
          <View style={{ gap: 8 }}>
            <SectionLabel error={!!shown.topic}>Topic</SectionLabel>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {TOPICS.filter((t) => t !== 'All').map((t) => <Chip key={t} label={t} selected={topic === t} onPress={() => { setTopic(t); fb.haptic('selection'); }} />)}
            </View>
            <FieldError testID="topic-error" message={shown.topic} />
          </View>
        )}
        {quest && (
          <View testID="quest-note" style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, backgroundColor: c('bg/color-accent-subtle') }}>
            <Icon name="medal" size={24} color={c('icon/color-accent')} />
            <Text style={[type('BodyS'), { color: c('text/color-primary'), flex: 1 }]}>This post finishes a step of the {QUEST.name}.</Text>
          </View>
        )}
        <View style={{ height: 220, borderRadius: 16, borderWidth: shown.content ? 2 : 1, borderColor: c(shown.content ? 'border/color-error' : 'border/color-control'), backgroundColor: c('bg/color-surface-raised'), padding: shown.content ? 15 : 16 }}>
          <TextInput testID="post-text" multiline value={text} onChangeText={setText} placeholder="What would you like to share?" placeholderTextColor={c('text/color-tertiary')} style={[type('BodyM'), { color: c('text/color-primary'), flex: 1, height: '100%' }]} />
        </View>
        {/* Figma: the photo row and its caption are separate rows of the body (24pt apart) */}
        <PhotoGrid photos={photos} max={MAX_PHOTOS} onRemove={(i) => { setPhotos((x) => x.filter((_, j) => j !== i)); fb.haptic('light'); }} onAdd={() => setSheet(true)} />
        {/* The message for an empty post takes the caption's place, under the box and the photos it is about. */}
        {shown.content
          ? <FieldError testID="content-error" message={shown.content} />
          : <Text style={[type('Caption'), { color: c('text/color-tertiary') }]}>{photos.length ? `${photos.length} of ${MAX_PHOTOS} photos` : `Add up to ${MAX_PHOTOS} photos`}</Text>}
      </Screen>
      <ChoosePhotosSheet visible={sheet} room={room} initialPicks={p.picks || []} onAdd={addPicked} onClose={() => setSheet(false)} />
    </>
  );
}

// ---------- Photo viewer ----------
export function PhotoViewer() {
  const { c } = useTheme();
  const nav = useNav();
  const fb = useFeedback();
  const { route } = useRoute();
  const { photos, index: start } = route.params;
  const [index, setIndex] = useState(start || 0);
  const [zoom, setZoom] = useState(false);
  const [dx, setDx] = useState(0);
  const drag = useRef(null);
  const go = (d) => { setZoom(false); setIndex((i) => Math.max(0, Math.min(photos.length - 1, i + d))); fb.haptic('selection'); };
  const down = (e) => { drag.current = { x: e.clientX, scale: e.currentTarget.getBoundingClientRect().width / 402 }; };
  const move = (e) => { if (drag.current && !zoom) setDx((e.clientX - drag.current.x) / drag.current.scale); };
  const up = () => { if (!drag.current) return; const d = dx; drag.current = null; setDx(0); if (d < -60) go(1); else if (d > 60) go(-1); };
  return (
    <View testID="screen-viewer" style={[StyleSheet.absoluteFill, { backgroundColor: c('bg/color-viewer') }]}>
      <div className="viewer-track" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} onDoubleClick={() => setZoom((z) => !z)}>
        <div className="viewer-strip" style={{ transform: `translateX(${-index * 402 + dx}px)`, transition: dx ? 'none' : `transform ${motion.push.duration}ms ${motion.push.easing}` }}>
          {photos.map((ph, i) => (
            <div key={i} className="viewer-page">
              <img src={ph} alt="" draggable={false} style={{ width: '100%', transform: `scale(${zoom && i === index ? 2 : 1})`, transition: `transform ${motion.viewer.duration}ms ${motion.viewer.easing}` }} />
            </div>
          ))}
        </div>
      </div>
      <View style={{ position: 'absolute', top: 66, left: 16, right: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton testID="viewer-close" variant="glass" icon="xmark" accessibilityLabel="Close" onPress={nav.closeViewer} />
        <Text style={[type('BodyS', 'bold'), { color: '#FFFFFF' }]}>{index + 1} of {photos.length}</Text>
        <IconButton variant="glass" icon="share-ios" accessibilityLabel="Share" onPress={() => fb.haptic('light')} />
      </View>
      {photos.length > 1 && (
        <View style={{ position: 'absolute', bottom: 58, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
          {photos.map((_, i) => <View key={i} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF', opacity: i === index ? 1 : 0.4 }} />)}
        </View>
      )}
    </View>
  );
}
