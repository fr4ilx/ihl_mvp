// App data for the prototype: profile, saved places, posts, listings and the network scenario.
// In the React Native app this becomes your data layer (React Query, Zustand, or context). Keep the method names.
//
// content: 'full' | 'empty'. Empty is a brand new account in a place with nothing listed yet:
//   no listings, nothing saved, no posts, no replies. Posts and replies you add yourself still show.
// seed: sample data a Jump to item starts with, for example { saved: [...] }, { me: { interests: ['Herbs'] } },
//   { withoutTopic: 'Mind' } (a topic nobody has posted in yet) or { me: { role: 'practitioner' }, practice: {...} }.
//
// role: 'seeker' or 'practitioner'. A practitioner runs one listing (practice) and posts in Community as it.
// practice.status: 'draft' (still filling the checklist), 'review' (sent, IHL checks it) or 'live' (in the Directory).
// practice.claim: 'review' while IHL checks a claim made without the email on record.
// practice.feature: null, { status: 'requested', length } or { status: 'live', length, until } (shown in the Home reel).
// unclaimed: imported listings nobody manages yet. Claimed listings carry the Verified Local Business badge.
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ME, POSTS, PEOPLE, LISTINGS, WEEK, TYPE_CATEGORY, SAMPLE_PRACTICE, TODAY, GROUPS, FREE_GROUPS, STAGES, BADGES, QUEST, MY_QUESTIONS, GROUP_HINTS, SPECIALTIES, FOCUS_AREAS, kindOf, moreReplies } from '../data';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const clone = (x) => JSON.parse(JSON.stringify(x));
// Matches Figma: Traders Point and Still Waters are saved. Wildroot gets saved in the Listing saved state.
export const DEFAULT_SAVED = ['traders', 'stillwaters'];
const freshMe = (seed) => ({ ...clone(ME), role: 'seeker', ...((seed && seed.me) || {}) });

// Weeks in a row with a check-in. This week counts once it is done, and missing it so far breaks nothing.
export const streakOf = (weeks = []) => {
  const w = weeks[weeks.length - 1] ? weeks : weeks.slice(0, -1);
  let n = 0; for (let i = w.length - 1; i >= 0 && w[i]; i--) n++;
  return n;
};
// Where a member is on the journey and what the next stage asks for.
export function journeyOf(me) {
  const at = Math.max(0, STAGES.findIndex((x) => x.id === me.stage));
  const next = STAGES[at + 1] || null;
  const streak = streakOf(me.weeks);
  const steps = {
    sprout: [['Add a short bio', !!(me.bio || '').trim()], ['Reply to a post', !!me.replied], ['Visit a local place', (me.visited || []).length > 0]],
    root: [['Check in 4 weeks in a row', streak >= 4, `${Math.min(streak, 4)} of 4 weeks`, Math.min(streak, 4), 4], ['Share 10 posts', (me.posts || 0) >= 10, `${Math.min(me.posts || 0, 10)} of 10 posts`, Math.min(me.posts || 0, 10), 10]],
    grove: [['Join Grove', me.tier === 'grove'], ['Post in all 4 topics', false, '2 of 4 topics', 2, 4]],
    forest: [['Check in 12 weeks in a row', streak >= 12, `${Math.min(streak, 12)} of 12 weeks`, Math.min(streak, 12), 12], ['Share 25 posts', (me.posts || 0) >= 25, `${Math.min(me.posts || 0, 25)} of 25 posts`, Math.min(me.posts || 0, 25), 25]],
    oak: [['Take part for a year', false, 'Since 2026', 0, 1]],
  };
  // have and need give each step its share of the bar. A step without numbers counts as 0 or 1.
  const todo = next ? (steps[next.id] || []).map(([label, done, value, have, need]) => ({ label, done, value, part: done ? 1 : need ? have / need : 0 })) : [];
  const part = todo.length ? todo.reduce((a, t) => a + t.part, 0) / todo.length : 1;
  return { stage: STAGES[at], index: at, next, steps: todo, done: todo.filter((t) => t.done).length, part, streak };
}
// Every badge with when it was earned (or null) and the progress toward it.
export function badgesOf(me) {
  return BADGES.map((b) => ({ ...b, earned: me.badges[b.id] || null, value: me.progress[b.id] || 0 }));
}
// A member grows into the next stage once every step for it is done, one stage at a time.
// Returns the member as they are now and the stage they just reached, if any.
export function grow(m) {
  const j = journeyOf(m);
  if (!j.next || !j.steps.length || j.done < j.steps.length) return { m, grew: null };
  return { m: { ...m, stage: j.next.id }, grew: j.next };
}
const freshPractice = (seed) => (seed && seed.practice ? clone(seed.practice) : null);
// Dana's listing is claimed in the seeker's world. A brand new account starts before she claims it.
export const DEFAULT_UNCLAIMED = ['rooted', 'apothecary'];
const NEW_ACCOUNT_UNCLAIMED = ['rooted', 'quietmind', 'apothecary'];

// The email on record with only its first letter showing: d•••@quietmindmassage.com
export const maskEmail = (email) => { const [user, domain] = (email || '').split('@'); return user ? `${user[0]}\u2022\u2022\u2022@${domain}` : ''; };

// Promotions: 1 a day and 3 in any 7 days. Replies, comments and answers have no limit.
// Returns { left, today, next }: next is the day the next promotion opens, like Wed, Oct 7.
const DAY = 86400000;
const toDate = (iso) => new Date(`${iso}T12:00:00`);
const fmtDay = (d) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
export function promoStatus(promos = [], today = TODAY) {
  const now = toDate(today);
  const recent = promos.map(toDate).filter((d) => now - d < 7 * DAY && d <= now).sort((a, b) => a - b);
  const usedToday = recent.some((d) => d.getTime() === now.getTime());
  const left = Math.max(0, 3 - recent.length);
  let next = null;
  if (!left) next = fmtDay(new Date(recent[0].getTime() + 7 * DAY));
  else if (usedToday) next = 'tomorrow';
  return { left, usedToday, next, open: left > 0 && !usedToday };
}

// Hours as people read them on a listing: "Wed to Sun" over "11:00 AM to 8:00 PM".
export function hoursSummary(hours) {
  const open = WEEK.filter((d) => hours && hours[d]);
  if (!open.length) return { days: 'Closed', time: '', short: 'Closed' };
  const at = open.map((d) => WEEK.indexOf(d));
  const inARow = at.every((v, i) => i === 0 || v === at[i - 1] + 1);
  const ab = (d) => d.slice(0, 3);
  const days = open.length === 7 ? 'Every day' : inARow && open.length > 2 ? `${ab(open[0])} to ${ab(open[open.length - 1])}` : open.map(ab).join(', ');
  const [o, cl] = hours[open[0]];
  const same = open.every((d) => hours[d][0] === o && hours[d][1] === cl);
  return { days, time: same ? `${o} to ${cl}` : 'Hours vary by day', short: same ? `Open until ${cl}` : 'Open today' };
}

// What the checklist on My Practice counts, in step order. Services, Member offer, website and booking are optional.
export const PRACTICE_TASKS = [
  { id: 'name', label: 'Name and type', screen: 'EditPracticeName', done: (p) => !!(p.name && p.type) },
  { id: 'specialties', label: 'Specialties', screen: 'EditSpecialties', done: (p) => p.specialties.some((x) => (SPECIALTIES[p.type] || []).includes(x)) },
  { id: 'address', label: 'Address', screen: 'EditPracticeAddress', done: (p) => !!(p.address && p.city) },
  { id: 'photos', label: 'Photos', screen: 'EditPhotos', done: (p) => p.photos.length > 0 },
  { id: 'about', label: 'About', screen: 'EditAbout', done: (p) => !!p.about.trim() },
  { id: 'hours', label: 'Hours', screen: 'EditHours', done: (p) => WEEK.some((d) => p.hours[d]) },
  { id: 'contact', label: 'Phone and links', screen: 'EditContact', done: (p) => !!p.phone.trim() },
  { id: 'services', label: 'Services', screen: 'EditServices', done: (p) => p.services.length > 0, optional: true },
  { id: 'offer', label: 'Member offer', screen: 'EditOffer', done: (p) => !!(p.offer && p.offer.title), optional: true },
];

// A practice shaped like a listing, for the listing profile, the Sponsored card preview and the Directory.
// Live means IHL vetted it, so it carries the Verified Local Business badge.
export function practiceListing(p) {
  const h = hoursSummary(p.hours);
  return {
    id: p.listingId, name: p.name, kind: kindOf(p.type, p.specialties), area: (p.city || '').split(',')[0], category: TYPE_CATEGORY[p.type],
    distance: '0.4 mi away', hours: h.short, days: h.days, time: h.time, photo: p.photos[0] || null, photos: p.photos,
    about: p.about, services: p.services, specialties: p.specialties, address: p.address, city: p.city, phone: p.phone,
    website: p.website, booking: p.booking, offer: p.offer, verified: p.status === 'live',
    sponsored: !!(p.feature && p.feature.status === 'live'), mine: true,
  };
}

// A claimed listing becomes the practice. Imported hours read like "Tue to Sat" and "10:00 AM to 6:00 PM".
const TYPE_OF = Object.fromEntries(Object.entries(TYPE_CATEGORY).map(([t, cat]) => [cat, t]));
function hoursFrom(days, time) {
  const [o, cl] = (time || '').split(' to ');
  const ab = WEEK.map((d) => d.slice(0, 3));
  let open = [];
  if (/^Every day/.test(days)) open = WEEK;
  else if (/^Saturdays/.test(days)) open = ['Saturday'];
  else { const m = /^(\w{3}) to (\w{3})/.exec(days || ''); if (m) open = WEEK.slice(ab.indexOf(m[1]), ab.indexOf(m[2]) + 1); }
  return Object.fromEntries(WEEK.map((d) => [d, open.includes(d) && o ? [o, cl] : null]));
}
function practiceFrom(l) {
  // Dana's listing comes back with her photos, hours, booking link and member offer (the sample practice).
  if (l.id === SAMPLE_PRACTICE.listingId) return clone(SAMPLE_PRACTICE);
  return {
    listingId: l.id, name: l.name, type: TYPE_OF[l.category] || 'Practice', specialties: [...(l.specialties || [])], email: l.email || '',
    address: l.address, city: l.city, phone: l.phone, website: l.website || '', booking: l.booking || '', offer: l.offer || null, promos: [],
    photos: [l.photo], about: l.about, hours: hoursFrom(l.days, l.time), services: [...l.services],
    status: 'live', feature: null, stats: { views: 0, saves: 0, directions: 0 },
  };
}
// A brand new member: only the email they signed up with. About you and the quiz fill in the rest.
// Everyone starts as a Seedling on the free tier, with the Seedling badge.
const NEW_MEMBER = {
  name: '', short: '', dob: '', location: '', neighborhood: '', gender: null, photo: null, bio: '', interests: [], goals: [], care: [],
  tier: 'seedling', plan: null, renews: null, groups: [], stage: 'seedling', posts: 0, replied: false, visited: [],
  weeks: [false, false, false, false, false, false], mood: null, badges: { seedling: 'Today' }, progress: {}, quest: {},
};
export const initialsOf = (name) => (name || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
const shortOf = (name) => { const [first, ...rest] = (name || '').trim().split(/\s+/); return rest.length ? `${first} ${rest[rest.length - 1][0].toUpperCase()}.` : first || ''; };

// version: 1 or 2. V2 adds the seeker round: the quiz, Seedling and Grove, groups, members asking Ask the Experts and the
// journey. V1 is the app without them, Specialties included (see HANDOFF.md, V1 and V2).
export function AppProvider({ children, network = 'online', content = 'full', seed, version = 2 }) {
  const v2 = version === 2;
  const empty = content === 'empty';
  const startSaved = (seed && seed.saved) || DEFAULT_SAVED;
  const [me, setMe] = useState(() => freshMe(seed));
  const [practice, setPractice] = useState(() => freshPractice(seed));
  const [saved, setSaved] = useState(() => (empty ? [] : startSaved));
  // Favorite topics (Community) and categories (Directory), set with the heart on a row of the Topics or Categories sheet.
  const [favorites, setFavorites] = useState({ topic: [], category: [], subcategory: [] });
  const [posts, setPosts] = useState(() => clone(POSTS).filter((p) => !(seed && seed.withoutTopic === p.topic)));
  const [unclaimed, setUnclaimed] = useState(() => (seed && seed.unclaimed) || DEFAULT_UNCLAIMED);
  // The member's own Ask the Experts questions (askQuestion). Not the practitioner's Questions for you below.
  const [asked, setAsked] = useState(() => clone((seed && seed.questions) || MY_QUESTIONS));
  // Members blocked from More on a post. Their posts and replies stop showing (App Review 1.2).
  const [blocked, setBlocked] = useState([]);
  // While Empty is on, the full saved list waits here and comes back when you switch to Full.
  const stash = useRef(empty ? startSaved : null);
  const lastContent = useRef(content);

  useEffect(() => {
    if (lastContent.current === content) return;
    lastContent.current = content;
    if (content === 'empty') setSaved((s) => { stash.current = s; return []; });
    else { setSaved(stash.current || DEFAULT_SAVED); stash.current = null; }
  }, [content]);

  const api = useMemo(() => {
    const mine = (p) => p.author === 'jane' && p.fresh;
    // What a post looks like right now. With Empty on, other people's replies are gone.
    const view = (p) => {
      const seen = (r) => !blocked.includes(r.author);
      const keep = (rs) => rs.filter(seen).map((r) => (r.replies ? { ...r, replies: r.replies.filter(seen) } : r));
      if (!empty || mine(p)) return blocked.length ? { ...p, replies: keep(p.replies) } : p;
      const replies = keep(p.replies.filter((r) => r.fresh));
      return { ...p, replies, replyCount: replies.length };
    };
    // The main feed holds posts outside groups. Group posts live on their group's page.
    // V1 has no groups: Ask the Experts questions sit in the feed with their badge, and other group posts don't exist.
    const all = (empty ? posts.filter(mine) : posts).filter((p) => !blocked.includes(p.author)).map(view);
    const feed = all.filter((p) => !p.group || (!v2 && p.ask));
    const practitioner = me.role === 'practitioner' && !!practice;
    // Membership, groups and the journey are for seekers. A practitioner takes part as their practice, with no limits.
    const grove = me.tier === 'grove';
    const joined = me.groups || [];
    // Applies a change to the member and returns the stage it grew them into, if any. The update stays functional so
    // two changes in one tap (a new member, then their name) both land. A practitioner has no journey, nor does V1.
    const change = (fn) => {
      if (practitioner || !v2) { setMe(fn); return null; }
      setMe((m) => grow(fn(m)).m);
      return grow(fn(me)).grew;
    };
    const myListing = practitioner ? practiceListing(practice) : null;
    // Every imported listing someone manages carries the Verified Local Business badge.
    const imported = LISTINGS.map((l) => ({ ...l, verified: !unclaimed.includes(l.id) }));
    // The practitioner's own listing shows in the Directory once it is live, and in the Home reel once featured.
    // While it is a draft or in review it stays out of the Directory. A claim in review keeps the imported listing.
    const ownIsLive = practitioner && practice.status === 'live';
    const listings = empty ? [] : imported.filter((l) => !ownIsLive || l.id !== practice.listingId).concat(ownIsLive ? [myListing] : []);
    // Ask the Experts: approved questions for the specialties this practice lists. Only live (verified) listings get them.
    const questions = ownIsLive ? posts.filter((p) => p.ask && p.asks.some((m) => practice.specialties.includes(m))).map(view) : [];
    return {
      v2,
      me: { ...me, initials: initialsOf(me.name) }, saved, network, content,
      practitioner, practice, myListing,
      listings,
      // The imported database, with who already manages each listing, for Find your business.
      imported,
      // The practitioner's own listing as seekers will see it, except a claim in review: seekers still see the import.
      listing: (id) => (myListing && id === myListing.id && practice.claim !== 'review' ? myListing : imported.find((l) => l.id === id)),
      questions,
      promo: practice ? promoStatus(practice.promos) : null,
      // ---------- Membership, groups, journey ----------
      // member: a seeker. Tiers, the journey, check-ins and quests are theirs.
      member: !practitioner,
      grove,
      groups: GROUPS.map((g) => ({ ...g, joined: joined.includes(g.id) })),
      groupPosts: (id) => all.filter((p) => p.group === id),
      // Up to 3 groups to suggest from the quiz answers, best match first. A new member gets the Welcome Circle first.
      suggestedGroups: (() => {
        const score = {};
        if (me.stage === 'seedling') score.welcome = 9;
        // Who they care for counts double: question 3 promises those suggestions.
        const add = (keys, w) => keys.forEach((k) => (GROUP_HINTS[k] || []).forEach((id) => { score[id] = (score[id] || 0) + w; }));
        add([...(me.goals || []), ...(me.interests || [])], 1);
        add(me.care || [], 2);
        return GROUPS.filter((g) => !joined.includes(g.id) && score[g.id]).sort((a, b) => score[b.id] - score[a.id]).slice(0, 3).map((g) => ({ ...g, joined: false }));
      })(),
      // A Seedling joins up to 3 groups. Returns false when the limit stops it (the paywall opens instead).
      canJoin: () => practitioner || grove || joined.length < FREE_GROUPS,
      joinGroup: (id) => { if (!practitioner && !grove && joined.length >= FREE_GROUPS) return false; setMe((m) => ({ ...m, groups: [...(m.groups || []), id] })); return true; },
      leaveGroup: (id) => setMe((m) => ({ ...m, groups: (m.groups || []).filter((x) => x !== id) })),
      // Grove: StoreKit in the app. Joining Grove opens Ask the Experts, so it joins that group too.
      subscribe: (plan) => change((m) => ({ ...m, tier: 'grove', plan, renews: plan === 'monthly' ? 'November 4, 2026' : 'October 4, 2027', groups: (m.groups || []).includes('experts') ? m.groups : [...(m.groups || []), 'experts'] })),
      journey: journeyOf(me),
      badges: badgesOf(me),
      streak: streakOf(me.weeks),
      checkedIn: !!(me.weeks && me.weeks[me.weeks.length - 1]),
      // Weekly check-in. Four weeks in a row earns Steady and counts toward Root.
      // Returns { streak, earned (a badge), grew (a stage) }.
      checkIn: (mood) => {
        const weeks = [...me.weeks.slice(0, -1), true];
        const n = streakOf(weeks);
        const earned = n >= 4 && !me.badges.steady ? BADGES.find((b) => b.id === 'steady') : null;
        const grew = change((m) => ({ ...m, weeks, mood, progress: { ...m.progress, steady: Math.min(n, 4) }, badges: earned ? { ...m.badges, steady: 'Today' } : m.badges }));
        return { streak: n, earned, grew };
      },
      // I was here on a listing: counts toward Sprout, Explorer, Farm Friend and, for Grove, the quest.
      // Returns { earned, grew } like checkIn.
      visit: (listing) => {
        if ((me.visited || []).includes(listing.id)) return {};
        const farm = listing.category === 'Food';
        const explorer = (me.progress.explorer || 0) + 1;
        const farmfriend = (me.progress.farmfriend || 0) + (farm ? 1 : 0);
        const quest = { ...me.quest, ...(grove && farm ? { farm: true } : {}), ...(grove && listing.category === 'Holistic Business' ? { practitioner: true } : {}) };
        const harvest = QUEST.steps.filter((x) => quest[x.id]).length;
        const won = BADGES.find((b) => !me.badges[b.id] && ((b.id === 'explorer' && explorer >= b.goal) || (b.id === 'farmfriend' && farmfriend >= b.goal) || (b.id === 'harvest' && harvest >= b.goal)));
        const grew = change((m) => ({ ...m, visited: [...(m.visited || []), listing.id], quest, progress: { ...m.progress, explorer, farmfriend, harvest }, badges: won ? { ...m.badges, [won.id]: 'Today' } : m.badges }));
        return { earned: won || null, grew };
      },
      questDone: (step) => !!(me.quest && me.quest[step]),
      // Returns the Harvest badge when this step finishes the quest.
      completeQuestStep: (step) => {
        const quest = { ...me.quest, [step]: true };
        const n = QUEST.steps.filter((x) => quest[x.id]).length;
        const won = n === QUEST.steps.length && !me.badges.harvest ? BADGES.find((b) => b.id === 'harvest') : null;
        change((m) => ({ ...m, quest, progress: { ...m.progress, harvest: n }, badges: won ? { ...m.badges, harvest: 'Today' } : m.badges }));
        return won;
      },
      visited: (id) => (me.visited || []).includes(id),
      // Ask the Experts: every question goes to IHL first. Needs changes comes back with a note, then Send again.
      myQuestions: asked,
      askQuestion: ({ topic, text }) => setAsked((q) => [{ id: 'aq' + Date.now(), text, topic, status: 'review', when: 'Today', fresh: true }, ...q]),
      resendQuestion: (id, text) => setAsked((q) => [{ ...q.find((x) => x.id === id), text, status: 'review', note: null, when: 'Today', fresh: true }, ...q.filter((x) => x.id !== id)]),
      // The onboarding quiz sets the Home feed and suggests groups.
      saveQuiz: (patch) => setMe((m) => ({ ...m, ...patch })),
      feed,
      post: (id) => { const p = posts.find((x) => x.id === id); return p ? view(p) : null; },
      blocked,
      // More on someone else's post: Block hides their posts and replies everywhere. They are not told.
      block: (personId) => setBlocked((b) => (b.includes(personId) ? b : [...b, personId])),
      // More on your own post: Delete post.
      deletePost: (id) => setPosts((ps) => ps.filter((p) => p.id !== id)),
      // See more in a conversation: the next 5 replies.
      loadReplies: (postId) => setPosts((ps) => ps.map((p) => (p.id !== postId ? p : { ...p, replies: [...p.replies, ...moreReplies(p)] }))),
      postsBy: (personId) => feed.filter((p) => p.author === personId),
      // A practitioner posts and replies as their practice, with the Practitioner badge.
      // verified: the practice behind the account manages a vetted listing. Their answers to Ask the Experts show Expert.
      person: (id) => (id === 'jane'
        ? (practitioner
          ? { id: 'jane', name: practice.name, initials: initialsOf(practice.name), photo: practice.photos[0] || null, practitioner: true, verified: practice.status === 'live', listingId: practice.listingId }
          : { ...PEOPLE.jane, name: me.short, initials: initialsOf(me.name), photo: me.photo, interests: me.interests, stage: me.stage, bio: me.bio, badges: Object.keys(me.badges || {}) })
        : PEOPLE[id] && PEOPLE[id].practitioner ? { ...PEOPLE[id], verified: !unclaimed.includes(PEOPLE[id].listingId) } : PEOPLE[id]),
      isSaved: (id) => saved.includes(id),
      favorites,
      // Newest favorite first. Returns the new state.
      toggleFavorite: (kind, value) => { const on = !favorites[kind].includes(value); setFavorites((f) => ({ ...f, [kind]: on ? [value, ...f[kind]] : f[kind].filter((x) => x !== value) })); return on; },
      // Newest first, like the Saved list in Figma. Returns the new state.
      toggleSave: (id) => { setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [id, ...s])); return !saved.includes(id); },
      toggleLike: (postId) => setPosts((ps) => ps.map((p) => (p.id === postId ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p))),
      // Works for replies to replies too.
      toggleReplyLike: (postId, replyId) => {
        const flip = (r) => (r.id === replyId ? { ...r, liked: !r.liked, likes: r.likes + (r.liked ? -1 : 1) } : r.replies ? { ...r, replies: r.replies.map(flip) } : r);
        setPosts((ps) => ps.map((p) => (p.id !== postId ? p : { ...p, replies: p.replies.map(flip) })));
      },
      // to: a reply id answers that reply, one level down (a sub-thread).
      // Returns { grew, earned }: a first reply counts toward Sprout, and greeting someone in the Welcome Circle counts
      // toward Welcomer (5 earns it).
      addReply: (postId, text, to) => {
        const r = { id: 'r' + Date.now(), author: 'jane', time: 'Just now', text, likes: 0, liked: false, fresh: true };
        setPosts((ps) => ps.map((p) => (p.id !== postId ? p : { ...p, replyCount: p.replyCount + 1, replies: to ? p.replies.map((x) => (x.id === to ? { ...x, replies: [...(x.replies || []), r] } : x)) : [...p.replies, r] })));
        const p = posts.find((x) => x.id === postId);
        const greet = !practitioner && p && p.group === 'welcome' && p.author !== 'jane' && !to;
        const welcomer = (me.progress.welcomer || 0) + (greet ? 1 : 0);
        const earned = greet && welcomer >= 5 && !me.badges.welcomer ? BADGES.find((b) => b.id === 'welcomer') : null;
        const grew = change((m) => ({ ...m, replied: true, progress: { ...m.progress, welcomer }, badges: earned ? { ...m.badges, welcomer: 'Today' } : m.badges }));
        return { grew, earned };
      },
      // promo: a practitioner's promotion. It counts toward 1 a day and 3 in any 7 days, and shows the Promotion badge.
      addPost: ({ topic, text, photos, promo, group }) => {
        const post = { id: 'p' + Date.now(), author: 'jane', time: 'Just now', topic, liked: false, likes: 0, text, photos, replies: [], replyCount: 0, fresh: true, ...(promo ? { promo: true } : {}), ...(group ? { group } : {}) };
        setPosts((ps) => [post, ...ps]);
        if (promo) setPractice((p) => ({ ...p, promos: [...(p.promos || []), TODAY] }));
        post.grew = change((m) => ({ ...m, posts: (m.posts || 0) + 1 }));
        return post;
      },
      // Returns the stage a change grew the member into (a bio can finish Sprout).
      updateMe: (patch) => change((m) => ({ ...m, ...patch, ...(patch.name != null ? { short: shortOf(patch.name) } : {}) })),
      // Sign up with email or Continue with Apple as a new member: no photo, nothing saved yet.
      startNewMember: ({ email }) => { setMe({ ...NEW_MEMBER, role: 'seeker', email }); setSaved([]); setPractice(null); setUnclaimed(NEW_ACCOUNT_UNCLAIMED); stash.current = null; },
      // Which one are you? Seeker goes on to About you, Practitioner to Your practice.
      setRole: (role) => setMe((m) => ({ ...m, role })),
      // Your practice: the first two checklist items come from onboarding.
      startPractice: ({ name, type }) => setPractice((p) => ({
        listingId: 'mine', specialties: [], address: '', city: '', phone: '', website: '', booking: '', offer: null, promos: [], photos: [], about: '', hours: {}, services: [],
        status: 'draft', feature: null, stats: { views: 0, saves: 0, directions: 0 }, ...(p || {}),
        // A new type offers other things, so its picks from What you offer go. Focus areas stay.
        ...(p && p.type !== type ? { specialties: p.specialties.filter((s) => FOCUS_AREAS.includes(s)) } : {}), name, type,
      })),
      // Claim with the link from the email on record: the listing is theirs at once, live and verified.
      claimListing: (id) => {
        const l = LISTINGS.find((x) => x.id === id);
        setMe((m) => ({ ...m, role: 'practitioner' }));
        setPractice(practiceFrom(l));
        setUnclaimed((u) => u.filter((x) => x !== id));
      },
      // Without that email, IHL checks the claim first. The listing stays as imported until then.
      requestClaim: (id, details) => {
        const l = LISTINGS.find((x) => x.id === id);
        setMe((m) => ({ ...m, role: 'practitioner' }));
        setPractice({ ...practiceFrom(l), status: 'review', claim: 'review', claimDetails: details });
      },
      updatePractice: (patch) => setPractice((p) => ({ ...p, ...patch })),
      // Send for review: IHL checks every listing before it goes live.
      submitPractice: () => setPractice((p) => ({ ...p, status: 'review' })),
      // Get featured: a request. The IHL team emails to set it up, nothing is paid in the app.
      requestFeature: (length) => setPractice((p) => ({ ...p, feature: { status: 'requested', length } })),
      // Log in brings back the returning member (Jane in the prototype).
      // Returns the role so the app opens the right fourth tab.
      logIn: () => { const m = freshMe(seed); setMe(m); setPractice(freshPractice(seed)); setSaved(empty ? [] : startSaved); return m.role; },
    };
  }, [me, practice, saved, favorites, posts, unclaimed, asked, blocked, network, content, empty, v2]);

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>;
}

// Waits like a network call. 'slow' shows loading states, 'offline' fails.
export function useLoad(network, deps = []) {
  const [state, setState] = useState(network === 'slow' ? 'loading' : network === 'offline' ? 'error' : 'ready');
  const [nonce, setNonce] = useState(0);
  useEffect(() => {
    if (network === 'offline') { setState('error'); return; }
    if (network === 'slow') { setState('loading'); const t = setTimeout(() => setState('ready'), 1600); return () => clearTimeout(t); }
    setState('ready');
  }, [network, nonce, ...deps]);
  return [state, () => setNonce((n) => n + 1)];
}
