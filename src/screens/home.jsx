// Home tab: Home (Sponsored reel and Top discussions). Directory tab: Directory, ListingProfile, TagResults, Saved.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, StyleSheet } from '../rn';
import { useTheme, type, withAlpha, elevation } from '../theme';
import { motion } from '../theme/motion';
import { useNav, useRoute, useStatusBarStyle } from '../app/nav';
import { useApp, useLoad } from '../app/store';
import { useFeedback, SNACK, celebrate } from '../app/feedback';
import { LISTINGS, images } from '../data';
import Screen, { BottomBar, HeaderFill, useScrollTo } from '../components/Screen';
import NavBar from '../components/NavBar';
import TabBar from '../components/TabBar';
import SearchField from '../components/SearchField';
import ListingCard from '../components/ListingCard';
import EmptyState from '../components/EmptyState';
import { RowSkeleton, ReelSkeleton, ThreadsSkeleton } from '../components/Skeleton';
import IconButton from '../components/IconButton';
import TextLink from '../components/TextLink';
import Reel from '../components/Reel';
import ThreadRow from '../components/ThreadRow';
import MapsSheet from '../components/MapsSheet';
import ResultsMap from '../components/ResultsMap';
import ShareSheet from '../components/ShareSheet';
import PhotoPager from '../components/PhotoPager';
import ListingSections, { ListingActions } from '../components/ListingSections';
import Icon from '../components/Icon';
import StreakCard from '../components/StreakCard';
import CheckInSheet from '../components/CheckInSheet';
import CategoriesSheet from '../components/CategoriesSheet';

// What search matches on a listing: its name, kind, area, category and its specialties.
export const listingText = (l) => [l.name, l.kind, l.area, l.category, ...(l.specialties || [])].join(' ').toLowerCase();
// A search may start with # like a tag.
export const searchTerm = (query) => query.trim().replace(/^#+/, '').trim().toLowerCase();


// Staggered entrance for list items. React Native: entering={FadeInDown.delay(i * 40)}.
export const enter = (i) => ({ className: 'fx-list-in', style: { animationDelay: `${Math.min(i, 8) * motion.listEnter.stagger}ms` } });

// Home: a Search field, paid partners in a Sponsored reel, the weekly check-in (for seekers, V2),
// then the three conversations with the most replies. See all opens the Community tab. Typing swaps everything for
// results in place, like Directory and Community: Places (Compact listing cards) and Posts (Thread rows).
// Clearing the field brings Home back.
export function Home() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const { params } = useRoute().route;
  const [query, setQuery] = useState(params.query || '');
  const [state, retry] = useLoad(app.network);
  const [checkIn, setCheckIn] = useState(!!params.openCheckIn);
  // Check in closes the sheet, then a badge or stage just earned opens its sheet, or the Snackbar confirms.
  const submitCheckIn = (mood) => {
    const r = app.checkIn(mood);
    setCheckIn(false);
    setTimeout(() => celebrate(fb, r, { message: 'Checked in for this week', bottom: SNACK.tabBar }), 360);
  };
  // Review panel only: open scrolled to the week cards, or check in on its own to show an award.
  const scroll = useRef();
  useScrollTo(scroll, params.scrollTo);
  useEffect(() => { if (!params.autoCheckIn) return; const t = setTimeout(() => submitCheckIn(params.autoCheckIn), 700); return () => clearTimeout(t); }, []);
  // A featured practitioner sees their own card first.
  const sponsored = app.listings.filter((l) => l.sponsored).sort((a, b) => (b.mine ? 1 : 0) - (a.mine ? 1 : 0));
  const top = [...app.feed].sort((a, b) => b.replyCount - a.replyCount).slice(0, 3);
  // Search matches a place by name, kind, area, category and what it offers, and a post by its text, topic and author.
  const q = searchTerm(query);
  const places = q ? app.listings.filter((l) => listingText(l).includes(q)) : [];
  const posts = q ? app.feed.filter((p) => [p.text, p.topic, app.person(p.author).name].join(' ').toLowerCase().includes(q)) : [];

  const toggleSave = (item) => {
    const now = app.toggleSave(item.id);
    fb.snack({ message: now ? 'Saved to your list' : 'Removed from Saved', bottom: SNACK.tabBar, hapticKind: 'light' });
  };

  let body;
  if (state === 'loading') {
    body = <><ReelSkeleton /><ThreadsSkeleton /></>;
  } else if (state === 'error') {
    body = (
      <View style={{ paddingTop: 130 }}>
        <EmptyState testID="home-offline" tone="error" illustration={images.illustrations.offline} title="Can’t connect" message="Check your connection and try again." action="Try again" onAction={() => { fb.haptic('light'); retry(); }} />
      </View>
    );
  } else if (q) {
    body = !places.length && !posts.length ? (
      <EmptyState testID="home-no-results" illustration={images.illustrations.noResults} title={`No results for “${query.trim()}”`} message="Try another word." action="Clear search" onAction={() => setQuery('')} />
    ) : (
      <>
        {places.length > 0 && (
          <View style={{ gap: 12 }}>
            <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>Places</Text>
            <View style={{ gap: 12 }}>
              {places.map((l, i) => (
                <View key={l.id} {...enter(i)}>
                  <ListingCard testID={`result-${l.id}`} item={l} showSave={false} onPress={() => nav.navigate('ListingProfile', { id: l.id })} />
                </View>
              ))}
            </View>
          </View>
        )}
        {posts.length > 0 && (
          <View className={enter(places.length).className} style={[{ gap: 12 }, enter(places.length).style]}>
            <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>Posts</Text>
            <View style={{ backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, borderRadius: 16, paddingHorizontal: 16 }}>
              {posts.map((p, i) => (
                <ThreadRow key={p.id} testID={`result-post-${p.id}`} post={p} author={app.person(p.author)} divider={i < posts.length - 1} onPress={() => nav.navigate('Conversation', { postId: p.id })} />
              ))}
            </View>
          </View>
        )}
      </>
    );
  } else if (!sponsored.length && !top.length) {
    // A new area with no partners and no conversations yet (Content: Empty in the review panel).
    // 62 + the search field and its 20pt gap keep the illustration where it sat before search was added.
    body = (
      <View style={{ paddingTop: 62 }}>
        <EmptyState testID="home-empty" illustration={images.illustrations.path} title="Nothing here yet" message="Partners and conversations near you will show up here." action="Start a conversation" onAction={() => nav.openModal('NewPost')} />
      </View>
    );
  } else {
    body = (
      <>
        {sponsored.length > 0 && (
          <Reel
            testID="home-reel"
            items={sponsored}
            renderItem={(l) => <ListingCard testID={`sponsored-${l.id}`} item={l} variant="sponsored" showSave={!l.mine} saved={app.isSaved(l.id)} onPress={() => nav.navigate('ListingProfile', { id: l.id })} onToggleSave={() => toggleSave(l)} />}
          />
        )}
        {app.v2 && app.member && (
          <View testID="home-week" {...enter(1)}>
            <View style={{ gap: 12 }}>
              <StreakCard weeks={app.me.weeks} streak={app.streak} onCheckIn={() => { fb.haptic('light'); setCheckIn(true); }} />
            </View>
          </View>
        )}
        {top.length > 0 && (
          <View {...enter(2)}>
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>Top discussions</Text>
                <TextLink testID="see-all" label="See all" onPress={() => nav.switchTab('community')} />
              </View>
              <View style={{ backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, borderRadius: 16, paddingHorizontal: 16 }}>
                {top.map((p, i) => (
                  <ThreadRow key={p.id} testID={`thread-${p.id}`} post={p} author={app.person(p.author)} divider={i < top.length - 1} onPress={() => nav.navigate('Conversation', { postId: p.id })} />
                ))}
              </View>
            </View>
          </View>
        )}
      </>
    );
  }

  return (
    <>
      <Screen testID="screen-home" scrollRef={scroll} bodyTop={12} nav={<NavBar kind="title" title="Home" />} bottom={<TabBar active="home" onChange={nav.switchTab} />}>
        {/* Figma Offline hides the search, like Directory. */}
        {state !== 'error' && <SearchField testID="home-search" value={query} onChangeText={setQuery} placeholder="Search people, places and posts" />}
        {body}
      </Screen>
      {app.v2 && <CheckInSheet visible={checkIn} initialMood={params.mood || null} onClose={() => setCheckIn(false)} onPick={() => fb.haptic('selection')} onCheckIn={submitCheckIn} />}
    </>
  );
}

// What a category's count line calls its places, one and many: "1 farm near you", "4 practitioners near you".
const CATEGORY_NOUNS = { Practitioners: ['practitioner', 'practitioners'], Farms: ['farm', 'farms'], Food: ['food spot', 'food spots'], Shops: ['shop', 'shops'] };

// Directory: every listing, with search and a menu button that opens the Categories sheet, like Topics on Community.
// While a category is on, the button is Filled and a line under the search counts the places with a Clear link.
// The bookmark opens Saved.
export function Directory() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const { params } = useRoute().route;
  const [query, setQuery] = useState(params.query || '');
  const [cat, setCat] = useState(params.category || 'All');
  const [sheet, setSheet] = useState(!!params.openCategories);
  const [state, retry] = useLoad(app.network);
  const pickCategory = (k) => { setCat(k); setSheet(false); fb.haptic('selection'); };

  const q = searchTerm(query);
  const results = useMemo(() => {
    let list = app.listings;
    if (cat !== 'All') list = list.filter((l) => l.category === cat);
    if (q) list = list.filter((l) => listingText(l).includes(q));
    return list;
  }, [q, cat, app.listings]);

  const open = (item) => nav.navigate('ListingProfile', { id: item.id });

  let body;
  if (state === 'loading') {
    body = <View style={{ gap: 12 }}><RowSkeleton /><RowSkeleton /><RowSkeleton /></View>;
  } else if (!app.listings.length) {
    // Nothing listed near the person yet (Content: Empty in the review panel).
    body = <EmptyState testID="directory-empty" illustration={images.illustrations.path} title="No places near you yet" message="We’re still adding places in your area." action={app.practitioner ? null : 'Change location'} onAction={() => { nav.switchTab('profile'); nav.navigate('EditProfile'); }} />;
  } else if (!results.length) {
    body = q
      ? <EmptyState testID="directory-no-results" illustration={images.illustrations.noResults} title={`No listings for “${query.trim()}”`} message="Try another word or pick a category." action="Clear search" onAction={() => { setQuery(''); setCat('All'); }} />
      : <EmptyState testID="directory-no-results" illustration={images.illustrations.path} title={`No ${CATEGORY_NOUNS[cat][1]} near you yet`} message="We’re still adding places in your area." action="Show all places" onAction={() => setCat('All')} />;
  } else {
    const list = (
      <View style={{ gap: 12 }}>
        {results.map((l, i) => (
          <View key={cat + l.id} {...enter(i)}>
            <ListingCard testID={`listing-${l.id}`} item={l} showSave={false} onPress={() => open(l)} />
          </View>
        ))}
      </View>
    );
    body = cat === 'All' && !q ? (
      <View style={{ gap: 12 }}>
        <Text style={[type('H5', 'bold'), { color: c('text/color-primary') }]}>Near you</Text>
        {list}
      </View>
    ) : list;
  }
  // The map: only on a search, and only for places (Farms, Food, Shops). Practitioners offer services, so no pin.
  const places = q && state === 'ready' ? results.filter((l) => l.category !== 'Practitioners') : [];
  const n = results.length;
  const countLabel = q ? `${n} ${n === 1 ? 'result' : 'results'}${cat === 'All' ? '' : ` in ${cat}`}` : cat === 'All' ? '' : `${n} ${CATEGORY_NOUNS[cat][n === 1 ? 0 : 1]} near you`;
  const showCount = state === 'ready' && app.listings.length > 0 && n > 0 && !!countLabel;

  return (
    <>
    <Screen
      testID="screen-directory"
      bodyTop={12}
      nav={<NavBar kind="title" title="Directory" actions={[{ icon: 'bookmark', onPress: () => nav.navigate('Saved'), accessibilityLabel: 'Saved', testID: 'open-saved' }]} />}
      bottom={<TabBar active="directory" onChange={nav.switchTab} />}
    >
      {state === 'error' ? (
        // Figma Offline: no search or filters, the message sits lower (y 260).
        <View style={{ paddingTop: 130 }}>
          <EmptyState testID="directory-offline" tone="error" illustration={images.illustrations.offline} title="Can’t connect" message="Check your connection and try again." action="Try again" onAction={() => { fb.haptic('light'); retry(); }} />
        </View>
      ) : (
        <>
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <SearchField testID="directory-search" value={query} onChangeText={setQuery} />
              </View>
              <IconButton testID="open-categories" icon="menu" variant={cat === 'All' ? 'outline' : 'filled'} accessibilityLabel={cat === 'All' ? 'Categories' : `Categories, ${cat}`} onPress={() => setSheet(true)} />
            </View>
            {showCount && (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text testID="directory-count" style={[type('BodyS'), { color: c('text/color-secondary') }]}>{countLabel}</Text>
                {cat !== 'All' && <TextLink testID="clear-category" label="Clear" onPress={() => { setCat('All'); fb.haptic('selection'); }} />}
              </View>
            )}
          </View>
          {places.length > 0 && (
            <View key={q} {...enter(0)}>
              <ResultsMap testID="directory-map" places={places} onOpen={open} />
            </View>
          )}
          {body}
        </>
      )}
    </Screen>
    <CategoriesSheet visible={sheet} value={cat} onPick={pickCategory} onClose={() => setSheet(false)} />
    </>
  );
}

export function ListingProfile() {
  const { c, reduceMotion } = useTheme();
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const { route } = useRoute();
  const params = route.params;
  // app.listing also knows the practitioner's own listing (Preview listing on My Practice).
  const item = app.listing(params.id) || LISTINGS[0];
  const photos = (item.photos || []).length ? item.photos : item.photo ? [item.photo] : [];
  const saved = app.isSaved(item.id);
  const [pop, setPop] = useState(false);
  const [maps, setMaps] = useState(!!params.openMaps);
  const [share, setShare] = useState(!!params.openShare);
  const [y, setY] = useState(0);
  const scroll = useRef();
  const pastPhoto = y > 300 - 118; // photo has scrolled under the nav bar
  // Over the photo the status bar turns light in both modes, on a scrim, so it reads on any photo. Once the photo is
  // gone the nav bar fills with the canvas and the status bar follows the mode again.
  useStatusBarStyle(item.photo && !pastPhoto ? 'light' : null);
  // Review panel only: open scrolled to a section (About, Member offer, Specialties or Location), like Figma.
  useScrollTo(scroll, params.scrollTo);
  const toggle = () => {
    const now = app.toggleSave(item.id);
    setPop(true); setTimeout(() => setPop(false), motion.save.duration);
    fb.snack({ message: now ? 'Saved to your list' : 'Removed from Saved', bottom: SNACK.listingBar, hapticKind: 'light' });
  };
  const address = `${item.address}, ${item.city}`;
  // In the app: WebBrowser.openBrowserAsync (expo-web-browser), Safari inside the app.
  const openLink = (url) => fb.snack({ message: `Opening ${url}`, tone: 'info', bottom: SNACK.listingBar, hapticKind: 'light' });
  // In the app: Linking.openURL to Apple Maps or Google Maps (see MapsSheet.jsx).
  const openIn = (appName) => {
    setMaps(false);
    fb.snack({ message: `Opening ${appName}`, tone: 'info', bottom: SNACK.listingBar, hapticKind: 'light' });
  };
  // I was here (V2): a member marks a visit. It counts toward Sprout, Explorer and Farm Friend.
  const here = app.v2 && app.member && !item.mine;
  const visit = () => celebrate(fb, app.visit(item), { message: 'Visit saved', bottom: SNACK.listingBar });
  useEffect(() => { if (!params.autoVisit) return; const t = setTimeout(visit, 700); return () => clearTimeout(t); }, []);
  return (
    <View testID="screen-listing" style={[StyleSheet.absoluteFill, { backgroundColor: c('bg/color-canvas') }]}>
      <ScrollView ref={scroll} style={StyleSheet.absoluteFill} contentContainerStyle={{ paddingBottom: 150 }} onScroll={(e) => setY(e.nativeEvent.contentOffset.y)}>
        <View style={{ height: 300, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, overflow: 'hidden' }}>
          {/* The photos swipe one at a time with a "1 of 3" count, and a tap opens the Photo viewer.
              Parallax: they move at 40% of the scroll speed. Reanimated interpolate on scroll offset. */}
          {photos.length
            ? <PhotoPager photos={photos} offset={reduceMotion ? 0 : Math.max(0, y) * motion.parallax.factor} onOpen={(i) => nav.openViewer(photos, i)} />
            : <View style={{ flex: 1, backgroundColor: c('bg/color-surface'), alignItems: 'center', justifyContent: 'center' }}><Icon name="media-image" size={48} color={c('icon/color-secondary')} /></View>}
          {/* Scrim: bg/color-overlay through the status bar, fading out by 128pt, under the light status bar. */}
          {!!item.photo && <View testID="listing-scrim" pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 128, backgroundImage: `linear-gradient(to bottom, ${c('bg/color-overlay')} 24px, ${withAlpha(c('bg/color-overlay'), 0)})` }} />}
        </View>
        {/* Figma: 40pt between the intro, About, Services, Location and the details */}
        <ListingSections
          item={item}
          here={here}
          visited={app.visited(item.id)}
          onVisit={visit}
          offerLocked={app.v2 && app.member && !app.grove}
          onUnlock={() => nav.openModal('JoinGrove', { reason: 'offers' })}
          aboutOpen={!!params.expanded}
          onTag={(t) => nav.navigate('TagResults', { tag: t })}
          onMap={() => setMaps(true)}
          onLink={openLink}
          style={{ paddingHorizontal: 16, paddingTop: 24 }}
        />
      </ScrollView>
      <HeaderFill visible={pastPhoto} />
      <View pointerEvents="none" style={{ position: 'absolute', top: 62, left: 80, right: 136, height: 48, justifyContent: 'center', opacity: pastPhoto ? 1 : 0, transform: [{ translateY: pastPhoto ? 0 : 6 }], transition: reduceMotion ? 'none' : `opacity ${motion.navFill.duration}ms ${motion.navFill.easing}, transform ${motion.navFill.duration}ms ${motion.navFill.easing}` }}>
        <Text numberOfLines={1} style={[type('BodyM', 'bold'), { color: c('text/color-primary') }]}>{item.name}</Text>
      </View>
      <View style={{ position: 'absolute', top: 62, left: 16 }}>
        <IconButton variant="glass" icon="nav-arrow-left" onPress={nav.goBack} accessibilityLabel="Back" testID="nav-back" />
      </View>
      <View style={{ position: 'absolute', top: 62, right: 16, flexDirection: 'row', gap: 12 }}>
        {/* Share opens the iOS share sheet (Share.share in the app). */}
        <IconButton testID="listing-share" variant="glass" icon="share-ios" accessibilityLabel="Share" onPress={() => { fb.haptic('light'); setShare(true); }} />
        {/* Your own listing has nothing to save. */}
        {!item.mine && <IconButton testID="listing-save" variant="glass" icon="bookmark" solid={saved} color={saved ? c('icon/color-brand') : undefined} accessibilityLabel={saved ? 'Remove from Saved' : 'Save'} onPress={toggle} className={pop ? 'fx-pop' : ''} />}
      </View>
      {/* Figma: this bar keeps 48pt below the buttons (they sit at y 770) */}
      {/* Two buttons at most. A booking link makes Book the primary action with Call beside it.
          Without one: Website and Call, or Call alone when there is no website. */}
      <BottomBar style={{ flexDirection: 'row', paddingBottom: 48 }}>
        <ListingActions item={item} onCall={() => fb.haptic('light')} onLink={openLink} />
      </BottomBar>
      <MapsSheet visible={maps} address={address} onPick={openIn} onClose={() => setMaps(false)} />
      <ShareSheet visible={share} title={item.name} subtitle="Indy Holistic Living" photo={item.photo} onClose={() => setShare(false)}
        onPick={(to) => { setShare(false); fb.snack({ message: to === 'Copy' ? 'Link copied' : `Opening ${to}`, tone: to === 'Copy' ? 'success' : 'info', bottom: SNACK.listingBar, hapticKind: 'light' }); }} />
    </View>
  );
}

export function Saved() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const [removing, setRemoving] = useState([]);
  const [state, retry] = useLoad(app.network);
  const items = app.saved.map(app.listing).filter(Boolean);
  const unsave = (item) => {
    setRemoving((r) => [...r, item.id]);
    fb.snack({ message: 'Removed from Saved', bottom: SNACK.none, hapticKind: 'light' });
    setTimeout(() => { app.toggleSave(item.id); setRemoving((r) => r.filter((x) => x !== item.id)); }, motion.listRemove.duration);
  };
  return (
    <Screen testID="screen-saved" nav={<NavBar kind="back" title="Saved" onBack={nav.goBack} />} bodyGap={0}>
      {state === 'loading' ? (
        <View style={{ gap: 12 }}><RowSkeleton /><RowSkeleton /><RowSkeleton /></View>
      ) : state === 'error' ? (
        <View style={{ paddingTop: 78 }}>
          <EmptyState testID="saved-offline" tone="error" illustration={images.illustrations.offline} title="Can’t connect" message="Check your connection and try again." action="Try again" onAction={() => { fb.haptic('light'); retry(); }} />
        </View>
      ) : items.length === 0 ? (
        <View style={{ paddingTop: 78 }}>
          <EmptyState testID="nothing-saved" illustration={images.illustrations.saved} title="Nothing saved yet" message="Tap the bookmark on a listing to keep it here." action="Browse places" onAction={nav.goBack} />
        </View>
      ) : (
        items.map((l, i) => (
          <View key={l.id} className={removing.includes(l.id) ? 'fx-collapse' : 'fx-list-in'} style={{ paddingBottom: 12, animationDelay: removing.includes(l.id) ? '0ms' : `${i * 40}ms` }}>
            <ListingCard testID={`saved-${l.id}`} item={l} saved onPress={() => nav.navigate('ListingProfile', { id: l.id })} onToggleSave={() => unsave(l)} />
          </View>
        ))
      )}
    </Screen>
  );
}

// Tag results: every place with one specialty, opened from a Tag chip on a listing. The title is the tag, then the
// count and Compact listing cards in Directory order. Back goes to the listing.
export function TagResults() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const { params } = useRoute().route;
  const tag = params.tag || 'Sleep';
  const [state, retry] = useLoad(app.network);
  const places = app.listings.filter((l) => (l.specialties || []).includes(tag));
  return (
    <Screen testID="screen-tag" nav={<NavBar kind="back" title={tag} onBack={nav.goBack} />} bodyGap={12}>
      {state === 'loading' ? (
        <View style={{ gap: 12 }}><RowSkeleton /><RowSkeleton /><RowSkeleton /></View>
      ) : state === 'error' ? (
        <View style={{ paddingTop: 78 }}>
          <EmptyState testID="tag-offline" tone="error" illustration={images.illustrations.offline} title="Can’t connect" message="Check your connection and try again." action="Try again" onAction={() => { fb.haptic('light'); retry(); }} />
        </View>
      ) : places.length === 0 ? (
        <View style={{ paddingTop: 78 }}>
          <EmptyState testID="tag-empty" illustration={images.illustrations.path} title={`No places with ${tag} yet`} message="We’re still adding places in your area." />
        </View>
      ) : (
        <>
          <Text testID="tag-count" style={[type('BodyS'), { color: c('text/color-secondary') }]}>{places.length} {places.length === 1 ? 'place' : 'places'}</Text>
          <View style={{ gap: 12 }}>
            {places.map((l, i) => (
              <View key={l.id} {...enter(i)}>
                <ListingCard testID={`tag-result-${l.id}`} item={l} showSave={false} onPress={() => nav.navigate('ListingProfile', { id: l.id })} />
              </View>
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}
