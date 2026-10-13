// My Profile tab: MyProfile, EditProfile, EditInterests, Privacy.
// In V2 My Profile leads with the member's membership (Seedling or Grove), their journey stage and their badges.
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Image } from '../rn';
import { useTheme, type, elevation } from '../theme';
import { useNav, useRoute } from '../app/nav';
import { useApp } from '../app/store';
import { useFeedback, SNACK, celebrate } from '../app/feedback';
import { useForm } from '../app/form';
import { useAppearance } from '../app/appearance';
import { INTERESTS, GENDERS, RECENT_PHOTOS } from '../data';
import Screen, { BottomBar } from '../components/Screen';
import NavBar from '../components/NavBar';
import TabBar from '../components/TabBar';
import Avatar from '../components/Avatar';
import Icon from '../components/Icon';
import Button from '../components/Button';
import Toggle from '../components/Toggle';
import TextField from '../components/TextField';
import Chip from '../components/Chip';
import { Group, SettingRow, SectionLabel } from '../components/Rows';
import { InterestTiles, InterestCard } from '../components/Interests';
import { EMAIL_OK, EMAIL_ERROR } from './auth';
import Sheet, { SHEET_CONTENT } from '../components/Sheet';
import SheetRow from '../components/SheetRow';
import DateSheet from '../components/DateSheet';
import PlaceSheet from '../components/PlaceSheet';
import ConfirmAlert from '../components/ConfirmAlert';
import FieldError from '../components/FieldError';
import TextLink from '../components/TextLink';
import { MembershipCard } from '../components/Grove';
import { JourneyCard, BadgeRow } from '../components/Journey';
import { badgeOrder } from './journey';

const same = (a, b) => a.length === b.length && a.every((x) => b.includes(x));
// Recents on the Add photo sheet: three to a row, 8pt apart, across the sheet's content width.
const PHOTO_TILE = (SHEET_CONTENT - 16) / 3;

export function MyProfile() {
  const { c, dark } = useTheme();
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const appearance = useAppearance();
  const me = app.me;
  return (
    <Screen testID="screen-profile" bodyTop={12} nav={<NavBar kind="title" title="My Profile" />} bottom={<TabBar active="profile" onChange={nav.switchTab} />}>
      <Pressable testID="profile-card" onPress={() => nav.navigate('EditProfile')} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 16, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card }, pressed && { transform: [{ scale: 0.985 }] }]}>
        <Avatar person={{ photo: me.photo, initials: me.initials }} size={56} />
        <View style={{ flex: 1 }}>
          <Text style={[type('BodyM', 'bold'), { color: c('text/color-primary') }]}>{me.name}</Text>
          <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{me.email}</Text>
        </View>
        <Icon name="nav-arrow-right" size={20} color={c('icon/color-secondary')} />
      </Pressable>
      {app.v2 && (
        <>
          <MembershipCard grove={app.grove} renews={me.renews} onJoin={() => nav.openModal('JoinGrove', { reason: 'profile' })} onOpen={() => nav.navigate('Membership')} />
          <View style={{ gap: 8 }}>
            <SectionLabel>Your journey</SectionLabel>
            <JourneyCard journey={app.journey} onPress={() => nav.navigate('Journey')} />
          </View>
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <SectionLabel>Badges</SectionLabel>
              <TextLink testID="profile-badges" label="See all" onPress={() => nav.navigate('Badges')} />
            </View>
            <BadgeRow badges={badgeOrder(app.badges)} onPress={() => nav.navigate('Badges')} />
          </View>
        </>
      )}
      <View style={{ gap: 8 }}>
        <SectionLabel>My interests</SectionLabel>
        <InterestTiles ids={me.interests} onEdit={() => nav.navigate('EditInterests')} />
      </View>
      <Group label="Preferences">
        <SettingRow testID="appearance" icon="half-moon" label="Dark mode" trailing={<Toggle testID="dark-mode" on={dark} onChange={(v) => { appearance.set(v ? 'dark' : 'light'); fb.haptic('selection'); }} accessibilityLabel="Dark mode" />} />
      </Group>
      <Group label="Account">
        <SettingRow icon="map-pin" label="Location" value={me.location ? me.location.split(',')[0] : 'Not set'} onPress={() => nav.navigate('EditProfile')} />
        <SettingRow testID="open-privacy-settings" icon="lock" label="Privacy" onPress={() => nav.navigate('Privacy')} />
      </Group>
      <Button testID="sign-out" label="Sign out" hierarchy="tertiary" leadingIcon="log-out" onPress={nav.signOut} style={{ alignSelf: 'center' }} />
    </Screen>
  );
}

// Privacy: opened from Privacy on My Profile and on My Practice. The policies, the location permission and
// Delete account, which Apple asks every app with sign up to offer (App Review 5.1.1(v)).
export function Privacy() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const { params } = useRoute().route;
  const [confirm, setConfirm] = useState(!!params.confirmDelete);
  const remove = () => {
    setConfirm(false);
    fb.haptic('success');
    nav.signOut();
    // The Snackbar sits 16 above the Welcome sheet.
    setTimeout(() => fb.snack({ message: 'Your account was deleted', bottom: 874 - 545 + 16 }), 480);
  };
  return (
    <>
      <Screen testID="screen-privacy-settings" nav={<NavBar kind="back" title="Privacy" onBack={nav.goBack} />}>
        <Group label="Policies">
          <SettingRow testID="privacy-policy" icon="lock" label="Privacy Policy" onPress={() => nav.navigate('PrivacyPolicy')} />
          <SettingRow testID="terms-of-use" icon="page" label="Terms of Use" onPress={() => nav.navigate('TermsOfUse')} />
          <SettingRow testID="liability-waiver" icon="shield-check" label="Liability waiver" onPress={() => nav.navigate('Waiver')} />
        </Group>
        <Group label="Permissions">
          {/* In the app: Linking.openSettings(). iOS keeps the permission, the app only shows it. */}
          <SettingRow testID="location-permission" icon="map-pin" label="Location" value="While using" onPress={() => fb.snack({ message: 'Opening Settings', tone: 'info', bottom: SNACK.none, hapticKind: 'light' })} />
        </Group>
        <Group>
          <SettingRow testID="delete-account" icon="trash" label="Delete account" tone="destructive" onPress={() => { fb.haptic('light'); setConfirm(true); }} />
        </Group>
      </Screen>
      <ConfirmAlert
        testID="delete-alert"
        visible={confirm}
        title="Delete your account?"
        message={app.practitioner ? 'Your listing, posts and saved places go with it. This can’t be undone.' : 'Your profile, posts and saved places go with it. This can’t be undone.'}
        actions={[{ label: 'Cancel', style: 'cancel', onPress: () => setConfirm(false) }, { label: 'Delete', style: 'destructive', onPress: remove }]}
      />
    </>
  );
}

export function EditProfile() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const { params } = useRoute().route;
  const me = app.me;
  const [name, setName] = useState(me.name);
  const [bio, setBio] = useState(params.bio ?? (me.bio || ''));
  const [dob, setDob] = useState(me.dob);
  const [email, setEmail] = useState(me.email);
  const [loc, setLoc] = useState(me.location);
  const [dateOpen, setDateOpen] = useState(false);
  const [placeOpen, setPlaceOpen] = useState(!!params.openPlace);
  const [gender, setGender] = useState(me.gender);
  const [photo, setPhoto] = useState(params.photo !== undefined ? params.photo : me.photo);
  const [sheet, setSheet] = useState(!!params.openSheet);
  const [pick, setPick] = useState(params.pick ?? null);
  const [emailErr, setEmailErr] = useState(false);
  // Save only shows once something changed.
  const changed = name !== me.name || bio !== (me.bio || '') || dob !== me.dob || email !== me.email || loc !== me.location || gender !== me.gender || photo !== me.photo;
  const form = useForm();
  const errors = { name: name.trim() ? null : 'Enter your name.', email: !email.trim() ? 'Enter your email.' : !EMAIL_OK(email) ? EMAIL_ERROR : null };
  const shown = form.shown(errors);
  // The photo sheet: Use photo with nothing picked asks for one.
  const photoForm = useForm();
  const photoErrors = { pick: pick === null ? 'Pick a photo.' : null };
  const closeSheet = () => { setSheet(false); setPick(null); photoForm.reset(); };
  const usePhoto = () => photoForm.submit(photoErrors, () => { setPhoto(RECENT_PHOTOS[pick]); fb.haptic('success'); closeSheet(); });
  const removePhoto = () => { setPhoto(null); fb.haptic('light'); closeSheet(); };
  const save = () => form.submit(errors, () => {
    // A bio can finish a step toward Sprout.
    const grew = app.updateMe({ name: name.trim(), bio: bio.trim(), dob, email: email.trim(), location: loc.trim(), gender, photo });
    nav.goBack();
    setTimeout(() => celebrate(fb, { grew }, { message: 'Profile saved', bottom: SNACK.tabBar }), 380);
  });
  return (
    <>
    <Screen
      testID="screen-editprofile"
      nav={<NavBar kind="back" onBack={nav.goBack} />}
      bodyGap={24}
      bottomSpace={150}
      bottom={changed ? <BottomBar className="fx-fade-up"><Button testID="profile-save" label="Save" fill onPress={save} /></BottomBar> : null}
    >
      <Text style={[type('H2', 'bold'), { color: c('text/color-primary') }]}>Edit profile</Text>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Avatar person={{ photo, initials: me.initials }} size={96} raised />
        <Button testID="change-photo" label={photo ? 'Change photo' : 'Add photo'} hierarchy="tertiary" size="medium" leadingIcon="camera" onPress={() => { fb.haptic('light'); setSheet(true); }} style={{ alignSelf: 'center' }} />
      </View>
      <View style={{ gap: 20 }}>
        <TextField testID="profile-name" label="Full name" value={name} onChangeText={setName} placeholder="First and last name" error={shown.name} />
        {app.v2 && <TextField testID="profile-bio" label="Short bio (optional)" multiline value={bio} onChangeText={setBio} placeholder="A line about you" helper="Shows on your profile." />}
        <TextField testID="profile-dob" label="Date of birth" value={dob} placeholder="Choose a date" trailingIcon="calendar" onPress={() => { fb.haptic('light'); setDateOpen(true); }} />
        <TextField testID="profile-email" label="Email" value={email} onChangeText={(v) => { setEmail(v); setEmailErr(false); }} onBlur={() => { if (email.trim() && !EMAIL_OK(email)) setEmailErr(true); }} placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" error={shown.email || (emailErr ? EMAIL_ERROR : null)} />
        <TextField
          testID="profile-location"
          label="Location (optional)"
          value={loc}
          placeholder="City or address"
          trailingIcon="nav-arrow-down"
          onPress={() => { fb.haptic('light'); setPlaceOpen(true); }}
        />
        <View style={{ gap: 8 }}>
          <SectionLabel>Gender</SectionLabel>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {GENDERS.map((g) => <Chip key={g} label={g} selected={gender === g} showCheck onPress={() => { setGender(g); fb.haptic('selection'); }} />)}
          </View>
        </View>
      </View>
    </Screen>
    <DateSheet visible={dateOpen} value={dob} onClose={() => setDateOpen(false)} onDone={(v) => { setDob(v); setDateOpen(false); fb.haptic('success'); }} />
    <PlaceSheet visible={placeOpen} initialQuery={params.placeQuery || ''} onClose={() => setPlaceOpen(false)} onPick={(p) => { setLoc(p); setPlaceOpen(false); fb.haptic('selection'); }} onLocate={() => { setLoc('Broad Ripple, Indianapolis'); setPlaceOpen(false); fb.haptic('success'); }} />
    {/* Figma: Change photo sheet. In the app: expo-image-picker with allowsEditing and aspect [1, 1], or launchCameraAsync. */}
    <Sheet visible={sheet} onClose={closeSheet} title={photo ? 'Change photo' : 'Add photo'}
      footer={<>
        <Button testID="use-photo" label="Use photo" fill onPress={usePhoto} />
        {!!photo && <Button testID="remove-photo" label="Remove photo" hierarchy="tertiary" fill onPress={removePhoto} />}
      </>}>
      <SheetRow testID="take-photo" role="button" icon="camera" label="Take a photo" onPress={() => fb.haptic('light')} />
      <View style={{ gap: 8 }}>
        <SectionLabel error={!!photoForm.shown(photoErrors).pick}>Recents</SectionLabel>
        <FieldError testID="photo-error" message={photoForm.shown(photoErrors).pick} />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {RECENT_PHOTOS.map((ph, i) => (
          <Pressable key={i} testID={`photo-${i}`} accessibilityLabel={`Photo ${i + 1}`} onPress={() => { setPick(i); fb.haptic('selection'); }} style={({ pressed }) => [{ width: PHOTO_TILE, height: PHOTO_TILE, borderRadius: 8, overflow: 'hidden' }, pressed && { transform: [{ scale: 0.96 }] }]}>
            <Image source={ph} style={{ width: PHOTO_TILE, height: PHOTO_TILE, opacity: pick === i ? 0.85 : 1 }} />
            <View className={pick === i ? 'fx-pop-once' : ''} style={{ position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: '#FFFFFF', backgroundColor: pick === i ? c('bg/color-brand') : 'rgba(0,0,0,0.18)', alignItems: 'center', justifyContent: 'center' }}>
              {pick === i && <Icon name="check" size={16} strokeWidth={2} color={c('icon/color-on-brand')} />}
            </View>
          </Pressable>
        ))}
      </View>
    </Sheet>
    </>
  );
}

export function EditInterests() {
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const { params } = useRoute().route;
  const [picked, setPicked] = useState(params.picked || app.me.interests);
  const toggle = (id) => { fb.haptic('selection'); setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])); };
  const form = useForm(!!params.validate);
  const errors = { picked: picked.length ? null : 'Pick at least one.' };
  const save = () => form.submit(errors, () => {
    app.updateMe({ interests: INTERESTS.map((i) => i.id).filter((id) => picked.includes(id)) });
    nav.goBack();
    setTimeout(() => fb.snack({ message: 'Interests saved', bottom: SNACK.tabBar }), 380);
  });
  return (
    <Screen
      testID="screen-editinterests"
      nav={<NavBar kind="back" title="My interests" onBack={nav.goBack} />}
      bottomSpace={150}
      bottom={!same(picked, app.me.interests) ? <BottomBar className="fx-fade-up"><Button testID="interests-save" label="Save" fill onPress={save} /></BottomBar> : null}
    >
      <FieldError testID="interests-error" message={form.shown(errors).picked} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {INTERESTS.map((i) => <InterestCard key={i.id} id={i.id} selected={picked.includes(i.id)} onPress={() => toggle(i.id)} />)}
      </View>
    </Screen>
  );
}
