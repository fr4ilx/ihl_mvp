// Practitioner accounts.
// A practitioner first looks for their business in the imported listings (auth.jsx). A new listing runs as a 9 step
// stepper, one part of the listing per step: Your practice, Specialties, Where people find you, Photos, About,
// Hours, How people reach you (phone, website, booking link), then Services and Member offer (both optional).
// Every step shows Step progress, a title, one line and fields whose placeholders say what to write. From step 4 on,
// Finish later keeps what is there and opens My Practice, where Continue setup picks up at the next step.
// The same screens open as editors from My Practice: a Back bar named after the row, and Save once something changed.
//
// A practitioner runs one listing. A new one starts as a Draft, goes In review once sent (IHL checks every listing
// within 2 business days) and then Live in the Directory with the Verified Local Business badge. A claimed listing is
// live at once. Live listings get Ask the Experts questions and can ask to be featured on Home.
// The request is all the app does: the IHL team emails to set it up, and the app never shows prices.
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Pressable } from '../rn';
import { useTheme, type, elevation } from '../theme';
import { useNav, useRoute } from '../app/nav';
import { useApp, PRACTICE_TASKS, hoursSummary } from '../app/store';
import { useFeedback, SNACK } from '../app/feedback';
import { useForm } from '../app/form';
import { useAppearance } from '../app/appearance';
import { PRACTICE_TYPES, TYPE_ART, PRACTICE_STEPS, WEEK, FEATURE_LENGTHS, SPECIALTIES, FOCUS_AREAS, MAX_SPECIALTIES } from '../data';
import Screen, { BottomBar, useScrollTo } from '../components/Screen';
import NavBar from '../components/NavBar';
import TabBar from '../components/TabBar';
import Button from '../components/Button';
import Toggle from '../components/Toggle';
import TextField from '../components/TextField';
import Chip from '../components/Chip';
import Icon from '../components/Icon';
import IconButton from '../components/IconButton';
import PlaceSheet from '../components/PlaceSheet';
import HoursSheet from '../components/HoursSheet';
import ListingPhotos from '../components/ListingPhotos';
import ChoosePhotosSheet from '../components/ChoosePhotosSheet';
import ListingCard from '../components/ListingCard';
import MapBox from '../components/MapBox';
import StepProgress from '../components/StepProgress';
import { InterestCard } from '../components/Interests';
import { Group, SettingRow, TaskRow, SectionLabel, DetailRow } from '../components/Rows';
import ListingReviewSheet from '../components/ListingReviewSheet';
import FieldError from '../components/FieldError';
import { PracticeCard, StatTile, FeatureCard } from '../components/Practice';
import OfferCard from '../components/OfferCard';
import ThreadRow from '../components/ThreadRow';

const MAX_PHOTOS = 6;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ---------- Stepper ----------
// params.setup: 'signup' (right after Which one are you?) or 'resume' (Continue setup on My Practice).
// Without it the screen is an editor. Your practice and Where people find you are always steps.
function useSteps(name) {
  const nav = useNav();
  const fb = useFeedback();
  const { params } = useRoute().route;
  const mode = params.setup || (name === 'PracticeBasics' || name === 'PracticePlace' ? 'signup' : null);
  const index = PRACTICE_STEPS.indexOf(name);
  // Sign up ends with Setting up your practice. Continue setup goes back to My Practice.
  const leave = (done) => {
    if (mode === 'signup') { nav.navigate('Preparing'); return; }
    nav.popToTop();
    if (done) setTimeout(() => fb.snack({ message: 'Your listing is ready', bottom: SNACK.tabBar }), 380);
  };
  return {
    mode,
    step: index + 1,
    total: PRACTICE_STEPS.length,
    next: () => {
      if (index < PRACTICE_STEPS.length - 1) nav.navigate(PRACTICE_STEPS[index + 1], { setup: mode });
      else { fb.haptic('success'); leave(true); }
    },
    later: () => leave(false),
  };
}

// Figma: the step layout. A Back bar with Step progress at its right, the title in H2 Bold with one line in Body M,
// the fields, then Continue (Finish on the last step) and, from step 4 to 8, Finish later on a canvas bottom bar.
// Steps 1 to 3 (name and type, specialties, address) make the draft, so they come before Finish later.
// note: a second line under the hint, in Body S, for a live count.
// form and errors (src/app/form.jsx): Continue stays on and shows what the step still needs.
function StepScreen({ testID, steps, title, hint, note, form, errors = {}, onContinue, children, sheet }) {
  const { c } = useTheme();
  const nav = useNav();
  const last = steps.step === steps.total;
  const later = steps.step >= 4 && !last;
  return (
    <>
      <Screen
        testID={testID}
        nav={<NavBar kind="back" onBack={nav.goBack} right={<StepProgress step={steps.step} total={steps.total} />} />}
        bodyGap={24}
        bottomSpace={later ? 190 : 120}
        bottom={(
          <BottomBar>
            <Button testID="step-continue" label={last ? 'Finish' : 'Continue'} fill onPress={() => (form ? form.submit(errors, onContinue) : onContinue())} />
            {later && <Button testID="step-later" label="Finish later" hierarchy="tertiary" fill onPress={steps.later} />}
          </BottomBar>
        )}
      >
        <View style={{ gap: 8 }}>
          <Text style={[type('H2', 'bold'), { color: c('text/color-primary') }]}>{title}</Text>
          {!!hint && <Text style={[type('BodyM'), { color: c('text/color-secondary') }]}>{hint}</Text>}
          {note}
        </View>
        {children}
      </Screen>
      {sheet}
    </>
  );
}

// ---------- Editors ----------
// From My Practice: Save shows once something changed, then back to My Practice with a Snackbar above the tab bar.
function useSave(label) {
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  return (patch) => {
    app.updatePractice(patch);
    nav.goBack();
    setTimeout(() => fb.snack({ message: `${label} saved`, bottom: SNACK.tabBar }), 380);
  };
}

function Editor({ testID, title, hint, note, changed, form, errors = {}, onSave, children, sheet }) {
  const { c } = useTheme();
  const nav = useNav();
  return (
    <>
      <Screen
        testID={testID}
        nav={<NavBar kind="back" title={title} onBack={nav.goBack} />}
        bodyGap={24}
        bottomSpace={150}
        bottom={changed ? <BottomBar className="fx-fade-up"><Button testID="editor-save" label="Save" fill onPress={() => (form ? form.submit(errors, onSave) : onSave())} /></BottomBar> : null}
      >
        {(!!hint || !!note) && (
          <View style={{ gap: 8 }}>
            {!!hint && <Text style={[type('BodyM'), { color: c('text/color-secondary') }]}>{hint}</Text>}
            {note}
          </View>
        )}
        {children}
      </Screen>
      {sheet}
    </>
  );
}

// ---------- Fields shared by the steps and the editors ----------
// Type: four Interest cards with Interest illustrations, two per row, one picked.
function TypeCards({ value, onChange, error }) {
  const fb = useFeedback();
  return (
    <View style={{ gap: 8 }}>
      <SectionLabel error={!!error}>Type</SectionLabel>
      <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {PRACTICE_TYPES.map((t) => (
          <InterestCard key={t} id={t} testID={`type-${t}`} label={t} art={TYPE_ART[t]} single selected={value === t} onPress={() => { onChange(t); fb.haptic('selection'); }} />
        ))}
      </View>
      <FieldError testID="type-error" message={error} />
    </View>
  );
}

// Street address and City, then a map of the place once both are in.
const addressErrors = (address, city) => ({ address: address.trim() ? null : 'Enter the street address.', city: city ? null : 'Choose a city.' });
function AddressFields({ address, setAddress, city, onCity, errors = {} }) {
  const done = !!(address.trim() && city);
  return (
    <View style={{ gap: 20 }}>
      <TextField testID="practice-address" label="Street address" value={address} onChangeText={setAddress} placeholder="123 Main St" error={errors.address} />
      <TextField testID="practice-city" label="City" value={city} placeholder="City or neighborhood" trailingIcon="nav-arrow-down" onPress={onCity} error={errors.city} />
      {done && <View className="fx-fade-up"><MapBox testID="place-map" preview address={`${address}, ${city}`} /></View>}
    </View>
  );
}

function AboutBox({ value, onChange, error }) {
  const { c } = useTheme();
  return (
    <View style={{ gap: 8 }}>
      <View style={{ height: 320, borderRadius: 16, borderWidth: error ? 2 : 1, borderColor: c(error ? 'border/color-error' : 'border/color-control'), backgroundColor: c('bg/color-surface-raised'), padding: error ? 15 : 16 }}>
        <TextInput testID="about-text" multiline value={value} onChangeText={onChange} placeholder="What you offer, who it helps and what a first visit is like." placeholderTextColor={c('text/color-tertiary')} style={[type('BodyM'), { color: c('text/color-primary'), flex: 1, height: '100%' }]} />
      </View>
      <FieldError testID="about-error" message={error} />
    </View>
  );
}

// A day with no hours yet reads Add in the link color. Closed and opening times read as values.
function DaysCard({ hours, onDay }) {
  const { c } = useTheme();
  return (
    <View style={{ backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, borderRadius: 16, paddingHorizontal: 16 }}>
      {WEEK.map((d, i) => {
        const h = hours[d];
        return <SettingRow key={d} testID={`day-${d}`} label={d} value={h === undefined ? 'Add' : h === null ? 'Closed' : `${h[0]} to ${h[1]}`} valueTone={h === undefined ? 'link' : undefined} divider={i < WEEK.length - 1} onPress={() => onDay(d)} />;
      })}
    </View>
  );
}
// Days still unset count as Closed once the hours are kept.
const settle = (hours) => Object.fromEntries(WEEK.map((d) => [d, hours[d] ?? null]));

// Phone, website and booking link, then the Detail rows seekers will see once there is a phone number.
// A booking link puts Book on the listing, next to Call.
function ContactFields({ phone, setPhone, website, setWebsite, booking, setBooking, error }) {
  return (
    <View style={{ gap: 20 }}>
      <TextField testID="practice-phone" label="Phone" value={phone} onChangeText={setPhone} placeholder="(317) 555-0100" keyboardType="phone-pad" error={error} />
      <TextField testID="practice-website" label="Website (optional)" value={website} onChangeText={setWebsite} placeholder="yourpractice.com" keyboardType="url" autoCapitalize="none" />
      <TextField testID="practice-booking" label="Booking link (optional)" value={booking} onChangeText={setBooking} placeholder="yourpractice.com/book" keyboardType="url" autoCapitalize="none" helper="Adds a Book button to your listing." />
      {!!phone.trim() && (
        <View testID="contact-preview" className="fx-fade-up" style={{ gap: 12, paddingTop: 4 }}>
          <SectionLabel>On your listing</SectionLabel>
          <View style={{ gap: 16 }}>
            <DetailRow icon="phone" title={phone.trim()} meta="Call or text" />
            {!!website.trim() && <DetailRow icon="globe" title={website.trim()} meta="Website" />}
            {!!booking.trim() && <DetailRow icon="calendar-check" title={booking.trim()} meta="Book" />}
          </View>
        </View>
      )}
    </View>
  );
}

// Specialties: Chips with a check in two groups, what the place offers (by type) and focus areas (the same for every
// type). Up to 10, with at least one from What you offer. One more than 10 gets the error haptic and a Snackbar.
function SpecialtyChips({ practiceType, value, onChange, snackAt, error }) {
  const fb = useFeedback();
  const offers = SPECIALTIES[practiceType] || SPECIALTIES.Practice;
  const toggle = (m) => {
    if (value.includes(m)) { onChange(value.filter((x) => x !== m)); fb.haptic('selection'); return; }
    if (value.length >= MAX_SPECIALTIES) { fb.snack({ message: `You can pick up to ${MAX_SPECIALTIES}`, tone: 'info', bottom: snackAt, hapticKind: 'error' }); return; }
    onChange([...value, m]); fb.haptic('selection');
  };
  const group = (label, list, bad) => (
    <View style={{ gap: 12 }}>
      <SectionLabel error={bad}>{label}</SectionLabel>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {list.map((m) => <Chip key={m} testID={`specialty-${m}`} label={m} selected={value.includes(m)} showCheck onPress={() => toggle(m)} />)}
      </View>
    </View>
  );
  return (
    <View style={{ gap: 24 }}>
      {group('What you offer', offers, !!error)}
      {group('Focus areas', FOCUS_AREAS)}
    </View>
  );
}

// The live count under the hint: how many are picked and which one shows on the card.
function SpecialtyNote({ practiceType, value, error }) {
  const { c } = useTheme();
  if (error) return <FieldError testID="specialty-error" message={error} />;
  const kind = value.find((m) => (SPECIALTIES[practiceType] || []).includes(m));
  const text = !value.length ? `Pick up to ${MAX_SPECIALTIES}, at least one from What you offer.`
    : !kind ? 'Pick at least one from What you offer.'
      : `${value.length} of ${MAX_SPECIALTIES} picked. ${kind} shows on your card.`;
  return <Text testID="specialty-count" style={[type('BodyS', 'bold'), { color: c('text/color-brand') }]}>{text}</Text>;
}

// Member offer: the offer and how to use it, then the card seekers will see.
function OfferFields({ title, setTitle, details, setDetails }) {
  return (
    <View style={{ gap: 20 }}>
      <TextField testID="offer-title" label="Offer" value={title} onChangeText={setTitle} placeholder="Like 10% off your first visit" maxLength={40} />
      <TextField testID="offer-details" label="How to use it (optional)" value={details} onChangeText={setDetails} placeholder="Like mentioning the app when you book" maxLength={80} />
      {!!title.trim() && (
        <View testID="offer-preview" className="fx-fade-up" style={{ gap: 12, paddingTop: 4 }}>
          <SectionLabel>On your listing</SectionLabel>
          <OfferCard offer={{ title: title.trim(), details: details.trim() }} />
        </View>
      )}
    </View>
  );
}

function ServicesField({ services, setServices }) {
  const { c } = useTheme();
  const fb = useFeedback();
  const [draft, setDraft] = useState('');
  const add = () => { const v = draft.trim(); if (!v || services.includes(v)) return; setServices((s) => [...s, v]); setDraft(''); fb.haptic('light'); };
  return (
    <View style={{ gap: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <TextField testID="service-new" label="Add a service" value={draft} onChangeText={setDraft} placeholder="Like a 60 minute massage" />
        </View>
        <IconButton testID="service-add" icon="plus" variant="filled" accessibilityLabel="Add service" onPress={add} />
      </View>
      {services.length > 0 && (
        <View style={{ backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, borderRadius: 16, paddingHorizontal: 16 }}>
          {services.map((name, i) => (
            <View key={name} className="fx-list-in" style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={[type('BodyM'), { color: c('text/color-primary'), flex: 1 }]}>{name}</Text>
              <Pressable testID={`remove-${i}`} accessibilityLabel={`Remove ${name}`} hitSlop={12} onPress={() => { setServices((s) => s.filter((x) => x !== name)); fb.haptic('light'); }} style={({ pressed }) => [{ width: 24, height: 24 }, pressed && { opacity: 0.6 }]}>
                <Icon name="minus-circle" size={24} color={c('icon/color-error')} />
              </Pressable>
              {i < services.length - 1 && <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 1, backgroundColor: c('border/color-subtle') }} />}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ---------- Steps 1 to 3 ----------
export function PracticeBasics() {
  const app = useApp();
  const steps = useSteps('PracticeBasics');
  const { params } = useRoute().route;
  const p = app.practice;
  const [name, setName] = useState(params.name ?? (p ? p.name : ''));
  const [type, setType] = useState(params.type ?? (p ? p.type : null));
  const form = useForm(!!params.validate);
  const errors = { name: name.trim() ? null : 'Enter your practice name.', type: type ? null : 'Pick a type.' };
  const shown = form.shown(errors);
  return (
    <StepScreen
      testID="screen-practicebasics" steps={steps} title="Your practice" hint="How seekers find you in the Directory."
      form={form} errors={errors} onContinue={() => { app.startPractice({ name: name.trim(), type }); steps.next(); }}
    >
      <View style={{ gap: 24 }}>
        <TextField testID="practice-name" label="Practice name" value={name} onChangeText={setName} placeholder="Name people know you by" error={shown.name} />
        <TypeCards value={type} onChange={setType} error={shown.type} />
      </View>
    </StepScreen>
  );
}

// Step 2. Also the Specialties editor on My Practice.
export function EditSpecialties() {
  const app = useApp();
  const p = app.practice;
  const steps = useSteps('EditSpecialties');
  const { params } = useRoute().route;
  const [picked, setPicked] = useState(params.picked ?? p.specialties);
  const save = useSave('Specialties');
  const hint = 'They show as tags on your listing and help people find you.';
  const changed = !same(picked, p.specialties);
  const form = useForm(!!params.validate);
  const errors = { offer: picked.some((m) => (SPECIALTIES[p.type] || []).includes(m)) ? null : 'Pick at least one from What you offer.' };
  const shown = form.shown(errors);
  // The message takes the count line's place, at the top where it shows without scrolling.
  const note = <SpecialtyNote practiceType={p.type} value={picked} error={shown.offer} />;
  const field = <SpecialtyChips practiceType={p.type} value={picked} onChange={setPicked} snackAt={steps.mode || changed ? SNACK.bottomBar : SNACK.none} error={shown.offer} />;
  if (steps.mode) {
    return <StepScreen testID="screen-specialties" steps={steps} title="Specialties" hint={hint} note={note} form={form} errors={errors} onContinue={() => { app.updatePractice({ specialties: picked }); steps.next(); }}>{field}</StepScreen>;
  }
  return <Editor testID="screen-specialties" title="Specialties" hint={hint} note={note} changed={changed} form={form} errors={errors} onSave={() => save({ specialties: picked })}>{field}</Editor>;
}

export function PracticePlace() {
  const app = useApp();
  const fb = useFeedback();
  const steps = useSteps('PracticePlace');
  const { params } = useRoute().route;
  const p = app.practice || {};
  const [address, setAddress] = useState(params.address ?? p.address ?? '');
  const [city, setCity] = useState(params.city ?? p.city ?? '');
  const [sheet, setSheet] = useState(!!params.openPlace);
  const form = useForm(!!params.validate);
  const errors = addressErrors(address, city);
  return (
    <StepScreen
      testID="screen-practiceplace" steps={steps} title="Where people find you" hint="Seekers use it to get directions."
      form={form} errors={errors} onContinue={() => { app.updatePractice({ address: address.trim(), city }); fb.haptic('success'); steps.next(); }}
      sheet={<PlaceSheet visible={sheet} onClose={() => setSheet(false)} onPick={(x) => { setCity(x); setSheet(false); fb.haptic('selection'); }} onLocate={() => { setCity('Irvington, Indianapolis'); setSheet(false); fb.haptic('success'); }} />}
    >
      <AddressFields address={address} setAddress={setAddress} city={city} onCity={() => { fb.haptic('light'); setSheet(true); }} errors={form.shown(errors)} />
    </StepScreen>
  );
}

// ---------- My Practice ----------
export function MyPractice() {
  const { c, dark } = useTheme();
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const appearance = useAppearance();
  const p = app.practice;
  const listing = app.myListing;
  const tasks = PRACTICE_TASKS.map((t) => ({ ...t, isDone: t.done(p) }));
  const required = tasks.filter((t) => !t.optional);
  const doneCount = required.filter((t) => t.isDone).length;
  const ready = doneCount === required.length;
  const h = hoursSummary(p.hours);
  // Review panel only: open with a section just under the nav bar, like the scrolled frames in Figma.
  const { params } = useRoute().route;
  const scroll = useRef();
  useScrollTo(scroll, params.scrollTo);
  const summary = {
    name: p.name,
    specialties: p.specialties.length ? `${p.specialties.length} picked` : '',
    address: p.address,
    photos: p.photos.length ? `${p.photos.length} ${p.photos.length === 1 ? 'photo' : 'photos'}` : '',
    about: '',
    hours: h.days,
    contact: p.phone,
    services: p.services.length ? `${p.services.length} ${p.services.length === 1 ? 'service' : 'services'}` : '',
    offer: p.offer ? p.offer.title : '',
  };
  const claimReview = p.claim === 'review';
  // Send for review opens Check your listing. Sliding its button sends it.
  const [check, setCheck] = useState(!!params.openCheck);
  const send = () => {
    setCheck(false);
    app.submitPractice();
    fb.snack({ message: 'Sent for review', bottom: SNACK.tabBar });
  };
  // Continue setup opens the stepper at the first part still missing.
  const resume = () => nav.navigate(PRACTICE_STEPS[Math.max(0, tasks.findIndex((t) => !t.optional && !t.isDone))], { setup: 'resume' });
  return (
    <Screen testID="screen-practice" scrollRef={scroll} bodyTop={12} nav={<NavBar kind="title" title="My Practice" />} bottom={<><TabBar active="profile" onChange={nav.switchTab} /><ListingReviewSheet visible={check} listing={listing} onClose={() => setCheck(false)} onSend={send} /></>}>
      <View style={{ gap: 12 }}>
        <PracticeCard testID="practice-card" practice={p} listing={listing} onPress={() => nav.navigate('ListingProfile', { id: listing.id })} />
        {p.status === 'review' && <Text testID="review-note" style={[type('BodyS'), { color: c('text/color-secondary') }]}>{claimReview ? 'We’re checking that it’s yours. We’ll email you within 2 business days.' : 'We’ll email you once it’s live, within 2 business days.'}</Text>}
      </View>

      {/* Ask the Experts: questions IHL approved for what this practice offers. Answers show the Expert badge. */}
      {p.status === 'live' && app.questions.length > 0 && (
        <View testID="questions" style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <SectionLabel>Questions for you</SectionLabel>
            <Text testID="questions-count" style={[type('BodyS'), { color: c('text/color-secondary') }]}>{app.questions.length} waiting</Text>
          </View>
          <View style={{ backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, borderRadius: 16, paddingHorizontal: 16 }}>
            {app.questions.map((q, i) => {
              const who = app.person(q.author);
              return <ThreadRow key={q.id} testID={`question-${q.id}`} post={q} author={who} meta={`${who.name}  ·  ${q.replyCount ? `${q.replyCount} ${q.replyCount === 1 ? 'answer' : 'answers'}` : 'No answers yet'}  ·  ${q.time}`} divider={i < app.questions.length - 1} onPress={() => nav.navigate('Conversation', { postId: q.id })} />;
            })}
          </View>
          <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>IHL approves every question. Your answers show the Expert badge.</Text>
        </View>
      )}

      {/* The action sits right under the card, so it shows without scrolling past the nine rows. */}
      {p.status === 'draft' && (ready ? (
        <View style={{ gap: 12 }}>
          <Button testID="send-review" label="Send for review" fill onPress={() => { fb.haptic('light'); setCheck(true); }} />
          <Text style={[type('BodyS'), { color: c('text/color-secondary'), textAlign: 'center' }]}>We check every listing before it goes live.</Text>
        </View>
      ) : (
        <Button testID="continue-setup" label="Continue setup" fill onPress={resume} />
      ))}
      {p.status === 'draft' && (
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <SectionLabel>Finish your listing</SectionLabel>
            <Text testID="tasks-count" style={[type('BodyS'), { color: c('text/color-secondary') }]}>{doneCount} of {required.length} done</Text>
          </View>
          <View style={{ backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, borderRadius: 16, paddingHorizontal: 16 }}>
            {tasks.map((t, i) => (
              <TaskRow key={t.id} testID={`task-${t.id}`} label={t.label} value={summary[t.id]} done={t.isDone} optional={t.optional} divider={i < tasks.length - 1} onPress={() => nav.navigate(t.screen)} />
            ))}
          </View>
        </View>
      )}

      {p.status === 'live' && (
        <View testID="this-month" style={{ gap: 8 }}>
          <SectionLabel>This month</SectionLabel>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <StatTile value={p.stats.views} label="Views" />
            <StatTile value={p.stats.saves} label="Saves" />
            <StatTile value={p.stats.directions} label="Directions" />
          </View>
        </View>
      )}
      {p.status === 'live' && <FeatureCard feature={p.feature} onRequest={() => nav.navigate('GetFeatured')} onSeeHome={() => nav.switchTab('home')} />}

      {p.status !== 'draft' && !claimReview && (
        <Group label="Your listing">
          {tasks.map((t) => <SettingRow key={t.id} testID={`edit-${t.id}`} label={t.label} value={t.isDone ? summary[t.id] : t.optional ? 'Add' : ''} onPress={() => nav.navigate(t.screen)} />)}
        </Group>
      )}
      <Group label="Account">
        <SettingRow testID="appearance" icon="half-moon" label="Dark mode" trailing={<Toggle testID="dark-mode" on={dark} onChange={(v) => { appearance.set(v ? 'dark' : 'light'); fb.haptic('selection'); }} accessibilityLabel="Dark mode" />} />
        <SettingRow testID="open-privacy-settings" icon="lock" label="Privacy" onPress={() => nav.navigate('Privacy')} />
      </Group>
      <Button testID="sign-out" label="Sign out" hierarchy="tertiary" leadingIcon="log-out" onPress={nav.signOut} style={{ alignSelf: 'center' }} />
    </Screen>
  );
}

// ---------- Editors for steps 1 and 3 ----------
export function EditPracticeName() {
  const { c } = useTheme();
  const p = useApp().practice;
  const { params } = useRoute().route;
  const [name, setName] = useState(params.name ?? p.name);
  const [pType, setPType] = useState(p.type);
  const save = useSave('Name');
  // Each type offers other things, so a new type keeps its focus areas and only the picks that still fit.
  const keep = (t) => p.specialties.filter((m) => FOCUS_AREAS.includes(m) || (SPECIALTIES[t] || []).includes(m));
  const lost = pType !== p.type && keep(pType).length < p.specialties.length;
  const form = useForm();
  const errors = { name: name.trim() ? null : 'Enter your practice name.' };
  return (
    <Editor testID="screen-editname" title="Name and type" changed={name !== p.name || pType !== p.type} form={form} errors={errors} onSave={() => save({ name: name.trim(), type: pType, specialties: keep(pType) })}>
      <View style={{ gap: 24 }}>
        <TextField testID="practice-name" label="Practice name" value={name} onChangeText={setName} placeholder="Name people know you by" error={form.shown(errors).name} />
        <TypeCards value={pType} onChange={setPType} />
        {lost && <Text testID="type-note" style={[type('BodyS'), { color: c('text/color-secondary') }]}>Some specialties belong to the old type. Pick again under Specialties after saving.</Text>}
      </View>
    </Editor>
  );
}

export function EditPracticeAddress() {
  const p = useApp().practice;
  const fb = useFeedback();
  const [address, setAddress] = useState(p.address);
  const [city, setCity] = useState(p.city);
  const [sheet, setSheet] = useState(false);
  const save = useSave('Address');
  const form = useForm();
  const errors = addressErrors(address, city);
  return (
    <Editor
      testID="screen-editaddress" title="Address" hint="Seekers use it to get directions." changed={address !== p.address || city !== p.city} form={form} errors={errors} onSave={() => save({ address: address.trim(), city })}
      sheet={<PlaceSheet visible={sheet} onClose={() => setSheet(false)} onPick={(x) => { setCity(x); setSheet(false); fb.haptic('selection'); }} onLocate={() => { setCity('Irvington, Indianapolis'); setSheet(false); fb.haptic('success'); }} />}
    >
      <AddressFields address={address} setAddress={setAddress} city={city} onCity={() => { fb.haptic('light'); setSheet(true); }} errors={form.shown(errors)} />
    </Editor>
  );
}

// ---------- Steps 4 to 8, each also an editor ----------
export function EditPhotos() {
  const app = useApp();
  const p = app.practice;
  const fb = useFeedback();
  const steps = useSteps('EditPhotos');
  const { params } = useRoute().route;
  const [photos, setPhotos] = useState(params.photos ?? p.photos);
  const [sheet, setSheet] = useState(!!params.openSheet);
  const save = useSave('Photos');
  const hint = 'Show your space and your work. The first one is your cover.';
  const form = useForm(!!params.validate);
  const errors = { photos: photos.length ? null : 'Add at least one photo.' };
  const field = (
    <View style={{ gap: 8 }}>
      <ListingPhotos photos={photos} max={MAX_PHOTOS} onRemove={(i) => { setPhotos((x) => x.filter((_, j) => j !== i)); fb.haptic('light'); }} onAdd={() => setSheet(true)} />
      <FieldError testID="photos-error" message={form.shown(errors).photos} />
    </View>
  );
  const picker = <ChoosePhotosSheet visible={sheet} room={MAX_PHOTOS - photos.length} initialPicks={params.picks || []} onAdd={(add) => { setPhotos((x) => [...x, ...add].slice(0, MAX_PHOTOS)); setSheet(false); }} onClose={() => setSheet(false)} />;
  if (steps.mode) {
    return <StepScreen testID="screen-editphotos" steps={steps} title="Add photos" hint={hint} form={form} errors={errors} onContinue={() => { app.updatePractice({ photos }); steps.next(); }} sheet={picker}>{field}</StepScreen>;
  }
  return <Editor testID="screen-editphotos" title="Photos" hint={hint} changed={!same(photos, p.photos)} form={form} errors={errors} onSave={() => save({ photos })} sheet={picker}>{field}</Editor>;
}

export function EditAbout() {
  const app = useApp();
  const p = app.practice;
  const steps = useSteps('EditAbout');
  const { params } = useRoute().route;
  const [about, setAbout] = useState(params.about ?? p.about);
  const save = useSave('About');
  const hint = 'Seekers read this first on your listing.';
  const form = useForm(!!params.validate);
  const errors = { about: about.trim() ? null : 'Tell seekers about your practice.' };
  const field = <AboutBox value={about} onChange={setAbout} error={form.shown(errors).about} />;
  if (steps.mode) {
    return <StepScreen testID="screen-editabout" steps={steps} title="About your practice" hint={hint} form={form} errors={errors} onContinue={() => { app.updatePractice({ about: about.trim() }); steps.next(); }}>{field}</StepScreen>;
  }
  return <Editor testID="screen-editabout" title="About" hint={hint} changed={about !== p.about} form={form} errors={errors} onSave={() => save({ about: about.trim() })}>{field}</Editor>;
}

export function EditHours() {
  const app = useApp();
  const p = app.practice;
  const fb = useFeedback();
  const steps = useSteps('EditHours');
  const { params } = useRoute().route;
  const [hours, setHours] = useState(params.hours ?? p.hours);
  const [day, setDay] = useState(params.openDay ?? null);
  const save = useSave('Hours');
  const hint = 'Tap a day to set when you’re open.';
  const form = useForm(!!params.validate);
  const errors = { hours: WEEK.some((d) => hours[d]) ? null : 'Set at least one open day.' };
  const field = (
    <View style={{ gap: 8 }}>
      <DaysCard hours={hours} onDay={(d) => { fb.haptic('light'); setDay(d); }} />
      <FieldError testID="hours-days-error" message={form.shown(errors).hours} />
    </View>
  );
  const sheet = <HoursSheet visible={!!day} day={day} value={day ? hours[day] : null} onClose={() => setDay(null)} onDone={(v) => { setHours((x) => ({ ...x, [day]: v })); setDay(null); fb.haptic('success'); }} />;
  if (steps.mode) {
    return <StepScreen testID="screen-edithours" steps={steps} title="Your hours" hint={hint} form={form} errors={errors} onContinue={() => { app.updatePractice({ hours: settle(hours) }); steps.next(); }} sheet={sheet}>{field}</StepScreen>;
  }
  return <Editor testID="screen-edithours" title="Hours" hint={hint} changed={!same(settle(hours), settle(p.hours))} form={form} errors={errors} onSave={() => save({ hours: settle(hours) })} sheet={sheet}>{field}</Editor>;
}

export function EditContact() {
  const app = useApp();
  const p = app.practice;
  const steps = useSteps('EditContact');
  const { params } = useRoute().route;
  const [phone, setPhone] = useState(params.phone ?? p.phone);
  const [website, setWebsite] = useState(params.website ?? p.website);
  const [booking, setBooking] = useState(params.booking ?? p.booking ?? '');
  const save = useSave('Phone and links');
  const hint = 'Seekers call, visit your site or book from your listing.';
  const form = useForm(!!params.validate);
  const errors = { phone: phone.trim() ? null : 'Enter a phone number.' };
  const field = <ContactFields phone={phone} setPhone={setPhone} website={website} setWebsite={setWebsite} booking={booking} setBooking={setBooking} error={form.shown(errors).phone} />;
  const patch = () => ({ phone: phone.trim(), website: website.trim(), booking: booking.trim() });
  if (steps.mode) {
    return <StepScreen testID="screen-editcontact" steps={steps} title="How people reach you" hint={hint} form={form} errors={errors} onContinue={() => { app.updatePractice(patch()); steps.next(); }}>{field}</StepScreen>;
  }
  return <Editor testID="screen-editcontact" title="Phone and links" hint={hint} changed={phone !== p.phone || website !== p.website || booking !== (p.booking || '')} form={form} errors={errors} onSave={() => save(patch())}>{field}</Editor>;
}

export function EditServices() {
  const app = useApp();
  const p = app.practice;
  const steps = useSteps('EditServices');
  const { params } = useRoute().route;
  const [services, setServices] = useState(params.services ?? p.services);
  const save = useSave('Services');
  const field = <ServicesField services={services} setServices={setServices} />;
  if (steps.mode) {
    return <StepScreen testID="screen-editservices" steps={steps} title="Services" hint="Optional. Names only, the app shows no prices." onContinue={() => { app.updatePractice({ services }); steps.next(); }}>{field}</StepScreen>;
  }
  return <Editor testID="screen-editservices" title="Services" hint="Names only, the app shows no prices." changed={!same(services, p.services)} onSave={() => save({ services })}>{field}</Editor>;
}

// Step 9 and optional, Finish ends the setup. Also the Member offer editor, where clearing the offer removes it.
export function EditOffer() {
  const app = useApp();
  const p = app.practice;
  const steps = useSteps('EditOffer');
  const { params } = useRoute().route;
  const [title, setTitle] = useState(params.title ?? (p.offer ? p.offer.title : ''));
  const [details, setDetails] = useState(params.details ?? (p.offer ? p.offer.details : ''));
  const save = useSave('Member offer');
  const offer = () => (title.trim() ? { title: title.trim(), details: details.trim() } : null);
  const field = <OfferFields title={title} setTitle={setTitle} details={details} setDetails={setDetails} />;
  if (steps.mode) {
    return <StepScreen testID="screen-editoffer" steps={steps} title="Member offer" hint="Optional. A thank you for people who find you here." onContinue={() => { app.updatePractice({ offer: offer() }); steps.next(); }}>{field}</StepScreen>;
  }
  return <Editor testID="screen-editoffer" title="Member offer" hint="A thank you for people who find you here. Clear the offer to remove it." changed={!same(offer(), p.offer || null)} onSave={() => save({ offer: offer() })}>{field}</Editor>;
}

// ---------- Get featured ----------
// A preview of the Sponsored card seekers would see on Home, how long, and Send request.
export function GetFeatured() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const { params } = useRoute().route;
  const [length, setLength] = useState(params.length ?? null);
  const form = useForm(!!params.validate);
  const errors = { length: length ? null : 'Pick how long.' };
  const send = () => form.submit(errors, () => {
    app.requestFeature(length);
    nav.goBack();
    setTimeout(() => fb.snack({ message: 'Request sent', bottom: SNACK.tabBar }), 380);
  });
  return (
    <Screen
      testID="screen-getfeatured"
      nav={<NavBar kind="back" title="Get featured" onBack={nav.goBack} />}
      bodyGap={24}
      bottomSpace={150}
      bottom={<BottomBar><Button testID="send-request" label="Send request" fill onPress={send} /></BottomBar>}
    >
      <View pointerEvents="none" accessibilityLabel="How your card looks on Home">
        <ListingCard item={{ ...app.myListing, photo: app.practice.photos[0] }} variant="sponsored" />
      </View>
      <View style={{ gap: 8 }}>
        <SectionLabel error={!!form.shown(errors).length}>How long</SectionLabel>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {FEATURE_LENGTHS.map((l) => <Chip key={l} testID={`length-${l}`} label={l} selected={length === l} showCheck onPress={() => { setLength(l); fb.haptic('selection'); }} />)}
        </View>
        <FieldError testID="length-error" message={form.shown(errors).length} />
        <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>We’ll email you within 2 business days to set it up.</Text>
      </View>
    </Screen>
  );
}
