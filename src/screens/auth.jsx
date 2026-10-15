// Authentication and onboarding: Welcome, SignUp, TermsOfUse, PrivacyPolicy, Waiver, LogIn, ForgotPassword, AccountType,
// AboutYou, QuizGoals, Interests, QuizCare, SeedlingAward, FindListing, ClaimListing, ClaimSent, ClaimReview, Preparing.
// Create account and Continue with Apple open the liability waiver first. I agree makes the account.
// Which one are you? splits the flow: a Seeker goes on to About you, the three question quiz (what they want help
// with, what they're into, who they care for) and the Seedling badge. In V1 About you leads to Interests alone, then
// Preparing. A Practitioner looks for their business in the imported listings and claims it, or adds a new one with
// the 9 step setup (practice.jsx).
import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from '../rn';
import { useTheme, type, elevation, fonts, FONT_TARGET, OnSheet } from '../theme';
import { motion } from '../theme/motion';
import { useNav, useRoute } from '../app/nav';
import { useApp, maskEmail } from '../app/store';
import { useForm } from '../app/form';
import { useFeedback, SNACK } from '../app/feedback';
import { images, INTERESTS, GENDERS, QUIZ_GOALS, QUIZ_CARE, STAGES } from '../data';
import Screen, { BottomBar } from '../components/Screen';
import NavBar from '../components/NavBar';
import Button from '../components/Button';
import TextField from '../components/TextField';
import Chip from '../components/Chip';
import Icon from '../components/Icon';
import SystemAlert from '../components/SystemAlert';
import { InterestCard } from '../components/Interests';
import { SectionLabel } from '../components/Rows';
import TextLink from '../components/TextLink';
import DateSheet from '../components/DateSheet';
import PlaceSheet from '../components/PlaceSheet';
import AppleSheet from '../components/AppleSheet';
import AppleButton from '../components/AppleButton';
import ChoiceCard from '../components/ChoiceCard';
import WaiverSheet, { WaiverText } from '../components/WaiverSheet';
import SearchField from '../components/SearchField';
import ListingCard from '../components/ListingCard';
import EmptyState from '../components/EmptyState';
import { DetailRow } from '../components/Rows';
import StepProgress from '../components/StepProgress';
import FieldError from '../components/FieldError';
import SelectTile, { SelectGrid } from '../components/SelectTile';
import Medallion from '../components/Medallion';

export const EMAIL_OK = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const EMAIL_ERROR = 'Enter a full email, like name@example.com.';
export const LOCATION_OFF = 'Location is off. Search for a city or turn it on in Settings.';
// Shows the email error once the person leaves the field with an unfinished address.
const emailCheck = (email, setErr) => () => { if (email.trim() && !EMAIL_OK(email)) setErr(true); };
export const PASSWORD_RULES = [
  ['At least 8 characters', (p) => p.length >= 8],
  ['One capital letter', (p) => /[A-Z]/.test(p)],
  ['One number', (p) => /\d/.test(p)],
];
const passwordOk = (p) => PASSWORD_RULES.every(([, ok]) => ok(p));

function Title({ children, sub }) {
  const { c } = useTheme();
  return (
    <View style={{ gap: 8 }}>
      <Text style={[type('H2', 'bold'), { color: c('text/color-primary') }]}>{children}</Text>
      {!!sub && <Text style={[type('BodyM'), { color: c('text/color-secondary') }]}>{sub}</Text>}
    </View>
  );
}

// ---------- Welcome ----------
const HERO = [
  // token, left, top, size, opacity, blur (from the Figma Gradient frame)
  ['bg/color-hero-seafoam', -170, 150, 400, 0.9, 120],
  ['bg/color-hero-gold', 210, -70, 320, 0.55, 100],
  ['bg/color-hero-sage', -110, 560, 340, 0.75, 120],
  ['bg/color-hero-teal', 130, 500, 460, 0.7, 140],
  ['bg/color-hero-cream', -29, 10, 460, 0.85, 110],
];

export function Welcome() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const { params } = useRoute().route;
  const [apple, setApple] = useState(!!params.showApple);
  const [shared, setShared] = useState(null); // what Apple shared, while the waiver is open
  // After the Apple sheet comes the waiver. I agree makes the account with the name and email Apple shared.
  const appleDone = (who) => { setApple(false); setShared(who); };
  const agree = () => { const { name, email } = shared; setShared(null); fb.haptic('success'); app.startNewMember({ email }); app.updateMe({ name }); nav.navigate('AccountType', { via: 'apple', name }); };
  return (
    <>
    <View testID="screen-welcome" style={[StyleSheet.absoluteFill, { backgroundColor: c('bg/color-hero-base'), overflow: 'hidden' }]}>
      {HERO.map(([tok, left, top, size, opacity, blur], i) => (
        <View key={tok} className={`fx-drift fx-drift-${i}`} style={{ position: 'absolute', left, top, width: size, height: size, borderRadius: size / 2, backgroundColor: c(tok), opacity, filter: `blur(${blur / 2}px)` }} />
      ))}
      {/* The logo sits in the middle of the hero, between the status bar (62) and the sheet top (545). */}
      <View className="fx-fade-up" style={{ position: 'absolute', top: 194, left: 0, right: 0, height: 220, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={images.logo} resizeMode="contain" style={{ width: 330, height: 138 }} accessibilityLabel="Indy Holistic Living" />
      </View>
      {/* Figma: the sheet hugs its content (top at y 545): the headline with 24 at its sides, 16 under it, then
          Log in and Register side by side, both Primary, then Continue with Apple, 16 between all three. 40 under the
          buttons, over the 34pt home indicator area (74 bottom padding). The terms line lives on Sign up. */}
      <View className="fx-sheet-up" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: c('bg/color-sheet'), borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingTop: 24, paddingHorizontal: 16, paddingBottom: 74, gap: 16, boxShadow: elevation.overlay }}>
        {/* Figma: H1 Bold (34/41) with "home" in Mrs Saint Delafield at 52, same color. Wraps to two lines. */}
        <Text style={[type('H1', 'bold'), { color: c('text/color-primary'), paddingHorizontal: 8 }]}>
          Holistic living, close to{' '}
          <Text style={{ ...fonts.script[FONT_TARGET], fontSize: 52, lineHeight: 41, color: c('text/color-primary') }}>home</Text>
        </Text>
        <OnSheet.Provider value={true}>
        <View style={{ gap: 16 }}>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ flex: 1 }}><Button testID="welcome-login" label="Log in" fill onPress={() => nav.navigate('LogIn')} /></View>
            <View style={{ flex: 1 }}><Button testID="welcome-signup" label="Register" fill onPress={() => nav.navigate('SignUp')} /></View>
          </View>
          <AppleButton testID="welcome-apple" onPress={() => setApple(true)} />
        </View>
        </OnSheet.Provider>
      </View>
    </View>
    <AppleSheet visible={apple} onClose={() => setApple(false)} onContinue={appleDone} />
    <WaiverSheet visible={!!shared} onAgree={agree} onClose={() => setShared(null)} />
    </>
  );
}

// ---------- Sign up ----------
export function SignUp() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const { params } = useRoute().route;
  const fb = useFeedback();
  const [email, setEmail] = useState(params.email ?? '');
  const [pw, setPw] = useState(params.password ?? '');
  const [pw2, setPw2] = useState(params.confirm ?? '');
  const [mismatch, setMismatch] = useState(!!params.showMismatch);
  const [emailErr, setEmailErr] = useState(!!params.emailError);
  const [waiver, setWaiver] = useState(!!params.showWaiver);
  const form = useForm(!!params.validate);
  const errors = {
    email: !email.trim() ? 'Enter your email.' : !EMAIL_OK(email) ? EMAIL_ERROR : null,
    password: !pw ? 'Create a password.' : !passwordOk(pw) ? 'Check the rules below.' : null,
    confirm: !pw2 ? 'Type your password again.' : null,
  };
  const shown = form.shown(errors);
  // Create account checks the form, then shows the waiver. The account is made on I agree.
  const submit = () => {
    const differ = !!pw2 && pw !== pw2;
    if (differ) setMismatch(true);
    form.submit({ ...errors, differ }, () => { fb.haptic('light'); setWaiver(true); });
  };
  const agree = () => {
    setWaiver(false);
    fb.haptic('success');
    app.startNewMember({ email: email.trim() });
    nav.navigate('AccountType');
  };
  return (
    <>
    <Screen
      testID="screen-signup"
      nav={<NavBar kind="back" onBack={nav.goBack} />}
      bodyGap={24}
      bottom={
        <BottomBar plain>
          {/* Figma: Body S secondary, centered over the button, the two names as links in Body S Bold
              text/color-link. Each opens its page. React Native: nested <Text onPress> with hitSlop on the links. */}
          <Text testID="signup-terms" style={[type('BodyS'), { color: c('text/color-secondary'), textAlign: 'center' }]}>
            By creating an account, you agree to the{' '}
            <Text testID="open-terms" role="link" onPress={() => nav.navigate('TermsOfUse')} style={[type('BodyS', 'bold'), { color: c('text/color-link') }]}>{'Terms\u00A0of\u00A0Use'}</Text>
            {' '}and{' '}
            <Text testID="open-privacy" role="link" onPress={() => nav.navigate('PrivacyPolicy')} style={[type('BodyS', 'bold'), { color: c('text/color-link') }]}>{'Privacy\u00A0Policy'}</Text>.
          </Text>
          <Button testID="signup-submit" label="Create account" fill onPress={submit} />
        </BottomBar>
      }
    >
      <Title>Create your account</Title>
      <View style={{ gap: 20 }}>
        <TextField testID="signup-email" label="Email" value={email} onChangeText={(v) => { setEmail(v); setEmailErr(false); }} onBlur={emailCheck(email, setEmailErr)} placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" error={shown.email || (emailErr ? EMAIL_ERROR : null)} />
        <TextField testID="signup-password" label="Password" value={pw} onChangeText={(v) => { setPw(v); setMismatch(false); }} placeholder="Create a password" secureTextEntry error={shown.password} />
        <TextField testID="signup-confirm" label="Confirm password" value={pw2} onChangeText={(v) => { setPw2(v); setMismatch(false); }} placeholder="Type it again" secureTextEntry error={shown.confirm || (mismatch ? 'Passwords don’t match.' : null)} />
      </View>
      <View style={{ gap: 8 }}>
        {PASSWORD_RULES.map(([label, ok]) => {
          const met = ok(pw);
          // After Create account, a rule a typed password misses turns to the error color with a warning icon.
          const miss = !met && !!pw && form.tried;
          return (
            <View key={label} testID={`rule-${label}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View className={met ? 'fx-pop-once' : ''}>
                <Icon name={miss ? 'warning-circle' : 'check-circle'} solid={met || miss} size={20} color={met ? c('icon/color-success') : miss ? c('icon/color-error') : c('icon/color-secondary')} />
              </View>
              <Text style={[type('BodyS'), { color: c(miss ? 'text/color-error' : 'text/color-secondary') }]}>{label}</Text>
            </View>
          );
        })}
      </View>
    </Screen>
    <WaiverSheet visible={waiver} startAtEnd={!!params.waiverRead} startEarly={!!params.waiverEarly} onAgree={agree} onClose={() => setWaiver(false)} />
    </>
  );
}

// ---------- Terms of Use and Privacy Policy ----------
// Full pages pushed from the links on Sign up. Empty on purpose: the text comes from IHL.
// React Native: a ScrollView with the text in Body M, 16pt side padding, under the same Back bar and H2 title.
function LegalPage({ title, testID }) {
  const nav = useNav();
  return (
    <Screen testID={testID} nav={<NavBar kind="back" onBack={nav.goBack} />} bodyGap={24}>
      <Title>{title}</Title>
    </Screen>
  );
}
export const TermsOfUse = () => <LegalPage title="Terms of Use" testID="screen-terms" />;
export const PrivacyPolicy = () => <LegalPage title="Privacy Policy" testID="screen-privacy" />;

// The waiver people agreed to, to read again from Privacy. Same text as the Waiver sheet, no button.
export function Waiver() {
  const nav = useNav();
  return (
    <Screen testID="screen-waiver" nav={<NavBar kind="back" title="Liability waiver" onBack={nav.goBack} />}>
      <WaiverText agreed />
    </Screen>
  );
}

// ---------- Log in ----------
export function LogIn() {
  const nav = useNav();
  const app = useApp();
  const { params } = useRoute().route;
  const fb = useFeedback();
  const [email, setEmail] = useState(params.email ?? '');
  const [pw, setPw] = useState(params.password ?? '');
  const [error, setError] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const form = useForm(!!params.validate);
  const errors = {
    email: !email.trim() ? 'Enter your email.' : !EMAIL_OK(email) ? EMAIL_ERROR : null,
    password: pw ? null : 'Enter your password.',
  };
  const shown = form.shown(errors);
  const submit = () => form.submit(errors, () => {
    if (!passwordOk(pw)) { setError(true); fb.haptic('error'); return; }
    fb.haptic('success');
    nav.enterApp({ role: app.logIn() });
  });
  useEffect(() => { if (!params.autoSubmit) return; const t = setTimeout(submit, 500); return () => clearTimeout(t); }, []);
  return (
    <Screen
      testID="screen-login"
      nav={<NavBar kind="back" onBack={nav.goBack} />}
      bodyGap={24}
      bottom={<BottomBar plain><Button testID="login-submit" label="Log in" fill onPress={submit} /></BottomBar>}
    >
      <Title>Welcome back</Title>
      <View style={{ gap: 12 }}>
        <View style={{ gap: 20 }}>
        <TextField testID="login-email" label="Email" value={email} onChangeText={(v) => { setEmail(v); setEmailErr(false); }} onBlur={emailCheck(email, setEmailErr)} placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" error={shown.email || (emailErr ? EMAIL_ERROR : null)} />
        <TextField testID="login-password" label="Password" value={pw} onChangeText={(v) => { setPw(v); setError(false); }} placeholder="Your password" secureTextEntry error={shown.password || (error ? 'Email or password doesn’t match.' : null)} />
        </View>
        <TextLink testID="forgot-link" label="Forgot password?" onPress={() => nav.navigate('ForgotPassword')} />
      </View>
    </Screen>
  );
}

// ---------- Forgot password ----------
export function ForgotPassword() {
  const nav = useNav();
  const fb = useFeedback();
  const { params } = useRoute().route;
  const [email, setEmail] = useState(params.email ?? '');
  const [emailErr, setEmailErr] = useState(false);
  const form = useForm(!!params.validate);
  const errors = { email: !email.trim() ? 'Enter your email.' : !EMAIL_OK(email) ? EMAIL_ERROR : null };
  return (
    <Screen
      testID="screen-forgot"
      nav={<NavBar kind="back" onBack={nav.goBack} />}
      bodyGap={24}
      bottom={<BottomBar plain><Button testID="forgot-submit" label="Send link" fill onPress={() => form.submit(errors, () => fb.snack({ message: 'Reset link sent', bottom: SNACK.bottomBar }))} /></BottomBar>}
    >
      <Title>Reset your password</Title>
      <TextField testID="forgot-email" label="Email" value={email} onChangeText={(v) => { setEmail(v); setEmailErr(false); }} onBlur={emailCheck(email, setEmailErr)} placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" helper="We’ll email you a link to set a new password." error={form.shown(errors).email || (emailErr ? EMAIL_ERROR : null)} />
    </Screen>
  );
}

// ---------- Which one are you? ----------
// Right after the account is made. One choice, then Continue. The app is the same for both,
// a Practitioner also gets My Practice in place of My Profile.
export const ROLES = [
  { id: 'seeker', title: 'Seeker', text: 'I’m looking for wellness near\u00A0me', art: images.roles.seeker },
  { id: 'practitioner', title: 'Holistic Business', text: 'I run a practice, farm or shop', art: images.roles.practitioner },
];

export function AccountType() {
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const { params } = useRoute().route;
  const [role, setRole] = useState(params.pick ?? null);
  const form = useForm(!!params.validate);
  const errors = { role: role ? null : 'Pick one to continue.' };
  const go = () => {
    app.setRole(role);
    if (role === 'practitioner') nav.navigate('FindListing');
    else nav.navigate('AboutYou', params.via ? { via: params.via, name: params.name } : {});
  };
  return (
    <Screen
      testID="screen-accounttype"
      nav={<NavBar kind="back" onBack={nav.goBack} />}
      bodyGap={24}
      bottom={<BottomBar plain><Button testID="role-continue" label="Continue" fill onPress={() => form.submit(errors, go)} /></BottomBar>}
    >
      <View style={{ gap: 12 }}>
        <Title>Which one are you?</Title>
        <FieldError testID="role-error" message={form.shown(errors).role} />
      </View>
      <View accessibilityRole="radiogroup" style={{ gap: 12 }}>
        {ROLES.map((r) => (
          <ChoiceCard key={r.id} testID={`role-${r.id}`} title={r.title} text={r.text} art={r.art} selected={role === r.id} onPress={() => { setRole(r.id); fb.haptic('selection'); }} />
        ))}
      </View>
    </Screen>
  );
}

// ---------- About you ----------
export function AboutYou() {
  const nav = useNav();
  const fb = useFeedback();
  const app = useApp();
  const { params } = useRoute().route;
  const [name, setName] = useState(params.name ?? '');
  const [dob, setDob] = useState(params.dob ?? '');
  const [loc, setLoc] = useState(params.location ?? '');
  const [gender, setGender] = useState(params.gender ?? null);
  const [alert, setAlert] = useState(!!params.showAlert);
  const [denied, setDenied] = useState(!!params.denied);
  const [dateOpen, setDateOpen] = useState(!!params.openDate);
  const [placeOpen, setPlaceOpen] = useState(!!params.showAlert || !!params.openPlace);
  // Location is the only optional field.
  const form = useForm(!!params.validate);
  const errors = { name: name.trim() ? null : 'Enter your name.', dob: dob.trim() ? null : 'Choose your date of birth.', gender: gender ? null : 'Pick one.' };
  const shown = form.shown(errors);
  const choose = (l) => {
    setAlert(false);
    if (l === 'Don’t Allow') { setDenied(true); return; }
    setDenied(false);
    setLoc('Broad Ripple, Indianapolis');
    setPlaceOpen(false);
    fb.haptic('success');
  };
  return (
    <>
      <Screen
        testID="screen-about"
        nav={<NavBar kind="back" onBack={nav.goBack} />}
        bodyGap={24}
        bottom={<BottomBar><Button testID="about-continue" label="Continue" fill onPress={() => form.submit(errors, () => { app.updateMe({ name: name.trim(), dob, location: loc, gender }); nav.navigate(app.v2 ? 'QuizGoals' : 'Interests'); })} /></BottomBar>}
      >
        <Title>Tell us about you</Title>
        <View style={{ gap: 20 }}>
          <TextField testID="about-name" label="Full name" value={name} onChangeText={setName} placeholder="First and last name" error={shown.name} />
          <TextField testID="about-dob" label="Date of birth" value={dob} placeholder="Choose a date" trailingIcon="calendar" onPress={() => { fb.haptic('light'); setDateOpen(true); }} error={shown.dob} />
          <TextField
            testID="about-location"
            label="Location"
            value={loc}
            placeholder="City or address"
            helper={denied && !loc ? LOCATION_OFF : 'We use it to show places near you.'}
            trailingIcon="nav-arrow-down"
            onPress={() => { fb.haptic('light'); setPlaceOpen(true); }}
          />
          <View style={{ gap: 8 }}>
            <SectionLabel error={!!shown.gender}>Gender</SectionLabel>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {GENDERS.map((g) => <Chip key={g} label={g} selected={gender === g} showCheck onPress={() => { setGender(g); fb.haptic('selection'); }} />)}
            </View>
            <FieldError testID="gender-error" message={shown.gender} />
          </View>
        </View>
      </Screen>
      <DateSheet visible={dateOpen} value={dob} onClose={() => setDateOpen(false)} onDone={(v) => { setDob(v); setDateOpen(false); fb.haptic('success'); }} />
      <PlaceSheet visible={placeOpen} onClose={() => setPlaceOpen(false)} onPick={(p) => { setLoc(p); setDenied(false); setPlaceOpen(false); fb.haptic('selection'); }} onLocate={() => { fb.haptic('light'); setAlert(true); }} locateNote={denied ? LOCATION_OFF : null} />
      <SystemAlert visible={alert} onChoose={choose} />
    </>
  );
}

// ---------- The seeker quiz ----------
// Three questions after About you: what they'd like help with, what they're into and who they care for. The answers set
// the Home feed and the groups we suggest, and stay private. Each question needs one pick, then Continue.
const QUIZ = 3;
const toggleIn = (setPicked, fb) => (id) => { fb.haptic('selection'); setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])); };

// n: the question number. Without one (Interests in V1) there is no Step progress.
function QuizScreen({ testID, n, title, sub, picked, label = 'Continue', onNext, children }) {
  const nav = useNav();
  const { params } = useRoute().route;
  const form = useForm(!!params.validate);
  const errors = { picked: picked.length ? null : 'Pick at least one.' };
  return (
    <Screen
      testID={testID}
      nav={<NavBar kind="back" onBack={nav.goBack} right={n ? <StepProgress step={n} total={QUIZ} noun="Question" /> : null} />}
      bodyGap={24}
      bottomSpace={150}
      bottom={<BottomBar><Button testID={`${testID}-next`} label={label} fill onPress={() => form.submit(errors, onNext)} /></BottomBar>}
    >
      <View style={{ gap: 12 }}>
        <Title sub={sub}>{title}</Title>
        <FieldError testID="quiz-error" message={form.shown(errors).picked} />
      </View>
      {children}
    </Screen>
  );
}

export function QuizGoals() {
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const { params } = useRoute().route;
  const [picked, setPicked] = useState(params.picked || []);
  const toggle = toggleIn(setPicked, fb);
  return (
    <QuizScreen testID="screen-quiz-goals" n={1} title="What can we help with?" sub="Pick any. Only you see your answers." picked={picked} onNext={() => { app.saveQuiz({ goals: QUIZ_GOALS.map((g) => g.id).filter((id) => picked.includes(id)) }); nav.navigate('Interests'); }}>
      <SelectGrid>
        {QUIZ_GOALS.map((g) => <SelectTile key={g.id} testID={`goal-${g.id}`} label={g.id} icon={g.icon} art={g.art} selected={picked.includes(g.id)} onPress={() => toggle(g.id)} />)}
      </SelectGrid>
    </QuizScreen>
  );
}

// Question 2 of 3, the Interest cards. Also the interests on My Profile.
// V1: the only question, with no Step progress. Finish goes to Preparing.
export function Interests() {
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const { params } = useRoute().route;
  const [picked, setPicked] = useState(params.picked || []);
  const toggle = toggleIn(setPicked, fb);
  return (
    <QuizScreen testID="screen-interests" n={app.v2 ? 2 : null} label={app.v2 ? 'Continue' : 'Finish'} title="What are you into?" sub="Pick a few. You can change them later." picked={picked} onNext={() => { app.updateMe({ interests: INTERESTS.map((i) => i.id).filter((id) => picked.includes(id)) }); nav.navigate(app.v2 ? 'QuizCare' : 'Preparing'); }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {INTERESTS.map((i) => <InterestCard key={i.id} id={i.id} selected={picked.includes(i.id)} onPress={() => toggle(i.id)} />)}
      </View>
    </QuizScreen>
  );
}

export function QuizCare() {
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const { params } = useRoute().route;
  const [picked, setPicked] = useState(params.picked || []);
  const toggle = toggleIn(setPicked, fb);
  return (
    <QuizScreen testID="screen-quiz-care" n={3} title="Who do you care for?" sub="We’ll suggest groups for you." label="Finish" picked={picked} onNext={() => { app.saveQuiz({ care: QUIZ_CARE.map((g) => g.id).filter((id) => picked.includes(id)) }); nav.navigate('SeedlingAward'); }}>
      <SelectGrid>
        {QUIZ_CARE.map((g) => <SelectTile key={g.id} testID={`care-${g.id}`} label={g.id} icon={g.icon} art={g.art} selected={picked.includes(g.id)} onPress={() => toggle(g.id)} />)}
      </SelectGrid>
    </QuizScreen>
  );
}

// ---------- Your first badge ----------
// The quiz ends on the Seedling badge, an instant win: the Medallion with its halo, the stage, and the six stages
// ahead as a path. Continue goes on to Preparing.
export function SeedlingAward() {
  const { c } = useTheme();
  const nav = useNav();
  const fb = useFeedback();
  const { focused } = useRoute();
  useEffect(() => { if (focused) fb.haptic('success'); }, [focused]);
  return (
    <Screen
      testID="screen-seedling"
      nav={<NavBar kind="back" onBack={nav.goBack} />}
      center
      bottom={<BottomBar plain><Button testID="seedling-continue" label="Continue" fill onPress={() => nav.navigate('Preparing')} /></BottomBar>}
    >
      <View className="fx-fade-up" style={{ alignItems: 'center', gap: 8 }}>
        <Medallion icon="soil-alt" size={96} halo />
        <Text style={[type('BodyS', 'bold'), { color: c('text/color-accent'), marginTop: 8 }]}>Your first badge</Text>
        <Text style={[type('H2', 'bold'), { color: c('text/color-primary'), textAlign: 'center' }]}>You’re a Seedling</Text>
        <Text style={[type('BodyM'), { color: c('text/color-secondary'), textAlign: 'center' }]}>Everyone starts here. Check in, visit local places and join the conversation to grow.</Text>
      </View>
      {/* The path ahead: each stage at 40pt over its name, on one line in border/color-default. */}
      <View testID="stage-path" className="fx-fade-up" style={{ flexDirection: 'row', marginTop: 40, animationDelay: '160ms' }}>
        <View style={{ position: 'absolute', left: 31, right: 31, top: 19, height: 2, backgroundColor: c('border/color-default') }} />
        {STAGES.map((st, i) => (
          <View key={st.id} style={{ flex: 1, alignItems: 'center', gap: 8 }}>
            <Medallion icon={st.icon} size={40} state={i === 0 ? 'earned' : 'progress'} />
            <Text style={[type('Caption', i === 0 ? 'bold' : 'medium'), { color: c(i === 0 ? 'text/color-accent' : 'text/color-tertiary') }]}>{st.name}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

// ---------- Preparing ----------
// A new practitioner sees Setting up your practice and lands on My Practice to finish the listing.
export function Preparing() {
  const { c } = useTheme();
  const nav = useNav();
  const fb = useFeedback();
  const app = useApp();
  const { focused } = useRoute();
  const { params } = useRoute().route;
  const practitioner = app.me.role === 'practitioner';
  useEffect(() => {
    if (!focused) return;
    fb.haptic('soft');
    const t = setTimeout(() => {
      fb.haptic('soft');
      nav.enterApp(practitioner ? { role: 'practitioner', tab: 'profile' } : {});
      // A claim with the email link lands on a live listing.
      if (params.claimed) setTimeout(() => fb.snack({ message: `${app.practice.name} is yours`, bottom: SNACK.tabBar }), 420);
    }, motion.breathe.total);
    return () => clearTimeout(t);
  }, [focused]);
  const ring = (size, op, delay) => (
    <View className="fx-breathe" style={{ position: 'absolute', left: (240 - size) / 2, top: (240 - size) / 2, width: size, height: size, borderRadius: size / 2, backgroundColor: c('bg/color-brand'), opacity: op, animationDelay: `${delay}ms` }} />
  );
  return (
    <View testID="screen-preparing" style={[StyleSheet.absoluteFill, { backgroundColor: c('bg/color-canvas'), alignItems: 'center', justifyContent: 'center', gap: 32 }]}>
      <View style={{ width: 240, height: 240 }}>
        {ring(240, 0.06, 0)}
        {ring(176, 0.1, 120)}
        {ring(112, 0.16, 240)}
        <View className="fx-breathe-core" style={{ position: 'absolute', left: 96, top: 96, width: 48, height: 48, borderRadius: 24, backgroundColor: c('bg/color-accent'), opacity: 0.9 }} />
      </View>
      <View style={{ alignItems: 'center', gap: 8, paddingHorizontal: 16 }} className="fx-fade-up">
        <Text style={[type('H2', 'bold'), { color: c('text/color-primary'), textAlign: 'center' }]}>{practitioner ? 'Setting up your practice' : 'Preparing your space'}</Text>
        <Text style={[type('BodyM'), { color: c('text/color-secondary') }]}>Take a slow breath</Text>
      </View>
    </View>
  );
}

// ---------- Find your business ----------
// IHL imports 25 to 100 businesses before launch. A practitioner finds theirs and claims it, or adds a new listing.
// Search matches the name, street, neighborhood and city. A listing someone manages shows the verified mark.
export function FindListing() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const { params } = useRoute().route;
  const [query, setQuery] = useState(params.query || '');
  const q = query.trim().toLowerCase();
  const found = q ? app.imported.filter((l) => [l.name, l.address, l.area, l.city].join(' ').toLowerCase().includes(q)) : [];
  return (
    <Screen
      testID="screen-findlisting"
      nav={<NavBar kind="back" onBack={nav.goBack} />}
      bodyGap={24}
      bottomSpace={150}
      bottom={<BottomBar><Button testID="not-listed" label="My business isn’t listed" hierarchy="secondary" fill onPress={() => nav.navigate('PracticeBasics', { setup: 'signup' })} /></BottomBar>}
    >
      <Title sub="It may already be in the Directory. Search by its name or street.">Find your business</Title>
      <SearchField testID="find-search" value={query} onChangeText={setQuery} placeholder="Business name or street" />
      {!!q && (found.length ? (
        <View style={{ gap: 12 }}>
          <Text testID="find-count" style={[type('BodyS'), { color: c('text/color-secondary') }]}>{found.length} {found.length === 1 ? 'match' : 'matches'}</Text>
          {found.map((l) => <ListingCard key={l.id} testID={`find-${l.id}`} item={l} showSave={false} onPress={() => nav.navigate('ClaimListing', { id: l.id })} />)}
        </View>
      ) : (
        <EmptyState testID="find-none" illustration={images.illustrations.noResults} title={`No match for “${query.trim()}”`} message="Check the spelling, or add it as a new listing." />
      ))}
    </Screen>
  );
}

// ---------- Is this your business? ----------
// Nobody manages it yet: a claim link goes to the business email on record (from the import). Opening it on this
// iPhone claims the listing at once, no review needed. Without that email, Ask us to check sends it to IHL.
// Someone already manages it: only Ask us to check.
export function ClaimListing() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const { params } = useRoute().route;
  const l = app.imported.find((x) => x.id === params.id) || app.imported[0];
  const taken = l.verified;
  return (
    <Screen
      testID="screen-claim"
      nav={<NavBar kind="back" onBack={nav.goBack} />}
      bodyGap={24}
      bottomSpace={taken ? 150 : 210}
      bottom={(
        <BottomBar>
          {taken
            ? <Button testID="claim-check" label="Ask us to check" fill onPress={() => nav.navigate('ClaimReview', { id: l.id })} />
            : <Button testID="claim-send" label="Email me the link" fill onPress={() => { fb.haptic('success'); nav.navigate('ClaimSent', { id: l.id }); }} />}
          {!taken && <Button testID="claim-no-email" label="I can’t use that email" hierarchy="tertiary" fill onPress={() => nav.navigate('ClaimReview', { id: l.id })} />}
        </BottomBar>
      )}
    >
      <Title>Is this your business?</Title>
      <View pointerEvents="none"><ListingCard item={l} showSave={false} /></View>
      {taken ? (
        <Text testID="claim-taken" style={[type('BodyM'), { color: c('text/color-secondary') }]}>Someone already manages this listing. If it’s yours, we’ll check and move it to you.</Text>
      ) : (
        <View style={{ gap: 16 }}>
          <Text style={[type('BodyM'), { color: c('text/color-secondary') }]}>We’ll send a claim link to this email.</Text>
          <DetailRow icon="mail" title={maskEmail(l.email)} meta="Email on record" />
        </View>
      )}
    </Screen>
  );
}

// ---------- Check your email ----------
// In the app Open Mail opens the Mail app, and the link opens the app again on Setting up your practice
// (a universal link). In the prototype Open Mail stands in for tapping that link.
export function ClaimSent() {
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const { params } = useRoute().route;
  const l = app.imported.find((x) => x.id === params.id) || app.imported[0];
  const open = () => { fb.haptic('success'); app.claimListing(l.id); nav.navigate('Preparing', { claimed: true }); };
  return (
    <Screen
      testID="screen-claimsent"
      nav={<NavBar kind="back" onBack={nav.goBack} />}
      center
      bottom={(
        <BottomBar plain>
          <Button testID="open-mail" label="Open Mail" fill onPress={open} />
          <Button testID="send-again" label="Send it again" hierarchy="tertiary" fill onPress={() => fb.snack({ message: 'Link sent again', bottom: SNACK.twoButtons })} />
        </BottomBar>
      )}
    >
      <EmptyState icon="mail-open" title="Check your email" message={`We sent a link to ${maskEmail(l.email)}. Open it on this iPhone within 24 hours to claim ${l.name}.`} />
    </Screen>
  );
}

// ---------- Ask us to check ----------
// For a listing without a usable email on record, or one someone else manages. IHL calls to confirm, then moves it.
export const CLAIM_ROLES = ['Owner', 'Manager', 'Staff'];
export function ClaimReview() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const { params } = useRoute().route;
  const l = app.imported.find((x) => x.id === params.id) || app.imported[0];
  const [role, setRole] = useState(params.role ?? null);
  const [phone, setPhone] = useState(params.phone ?? '');
  const form = useForm(!!params.validate);
  const errors = { role: role ? null : 'Pick your role.', phone: phone.trim() ? null : 'Enter a phone number.' };
  const shown = form.shown(errors);
  const send = () => form.submit(errors, () => { fb.haptic('success'); app.requestClaim(l.id, { role, phone: phone.trim() }); nav.navigate('Preparing', { claim: 'review' }); });
  return (
    <Screen
      testID="screen-claimreview"
      nav={<NavBar kind="back" onBack={nav.goBack} />}
      bodyGap={24}
      bottom={<BottomBar plain><Button testID="claim-review-send" label="Send" fill onPress={send} /></BottomBar>}
    >
      <Title sub={`Tell us how you’re connected to ${l.name}. We reply within 2 business days.`}>Ask us to check</Title>
      <View style={{ gap: 20 }}>
        <View style={{ gap: 8 }}>
          <SectionLabel error={!!shown.role}>Your role</SectionLabel>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {CLAIM_ROLES.map((r) => <Chip key={r} testID={`claim-role-${r}`} label={r} selected={role === r} showCheck onPress={() => { setRole(r); fb.haptic('selection'); }} />)}
          </View>
          <FieldError testID="claim-role-error" message={shown.role} />
        </View>
        <TextField testID="claim-phone" label="Phone" value={phone} onChangeText={setPhone} placeholder="(317) 555-0100" keyboardType="phone-pad" helper="We’ll call to confirm it’s you." error={shown.phone} />
      </View>
    </Screen>
  );
}
