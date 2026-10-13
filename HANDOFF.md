# Indy Holistic Living · Prototype handoff

Design by Steven Yeo. iOS app, React Native with Expo. Users are mostly people 60 and over in the US.

Open `dist/index.html` in any browser. It works offline. Everything inside the phone frame is the app. The panels around it are only for review.

---

## 1. How to build the app from this

The prototype is written in React, but every component inside the phone is shaped like React Native: `View`, `Text`, `Pressable`, `TextInput`, `ScrollView`, `Image`, `StyleSheet`, flexbox only, numbers in points. Porting is mostly swapping imports and replacing a short list of web-only details (section 5).

If you build with Claude, attach this folder (without `node_modules`) and start with:

> Build the Indy Holistic Living iOS app with Expo and expo-router from this prototype. Read HANDOFF.md first and follow it. Port src/theme, src/components, src/screens and src/app screen by screen. Keep every size, color, copy string, motion value and haptic exactly as the prototype. Open dist/index.html to see how each screen behaves. Replace only what HANDOFF.md section 5 lists as web-only.

Work in this order: tokens and fonts, components, navigation shell, then screens flow by flow (Authentication, Home, Directory, Community and groups, Membership, My Profile and the journey, My Practice). After each flow, compare with the prototype side by side in Light and Dark.

The prototype holds two versions of the app (section 7, V1 and V2). V1 is the MVP without the seeker round. V2 adds the quiz, Seedling and Grove, groups, member questions and the journey. Build the one IHL picks, from the same code: `v2` in the store switches the seeker round on.

## 2. Suggested stack

| Need | Package |
| --- | --- |
| App shell and routing | `expo`, `expo-router` |
| Animation | `react-native-reanimated` |
| Gestures (edge swipe, photo pager, pinch, the Slide button) | `react-native-gesture-handler` |
| Liquid Glass tab bar | `expo-glass-effect` (`GlassView`, iOS 26 and later), `expo-blur` as the fallback |
| Nav bar blur | `expo-blur` |
| Bottom sheets | `@gorhom/bottom-sheet` (`BottomSheetModal` with `snapPoints={['75%']}`) |
| Haptics | `expo-haptics` |
| Images | `expo-image` |
| Icons | `iconoir-react-native` (same names as the prototype) and `react-native-svg` |
| Fonts | `@expo-google-fonts/manrope` (500 and 700), `@expo-google-fonts/mrs-saint-delafield` |
| Location permission | `expo-location` |
| Photos | `expo-image-picker` (library, up to 5, and camera) |
| Sign in with Apple | `expo-apple-authentication` |
| Date of birth | `@react-native-community/datetimepicker` with `display="spinner"` inside the Date sheet |
| Opening hours | The same picker in `mode="time"` with `minuteInterval={30}` inside the Hours sheet |
| Location search | Your places API (Apple MapKit search or Google Places) inside the Location sheet |
| Map box | `react-native-maps` `MapView` (Apple Maps on iOS) with pan, zoom, rotate and pitch off |
| Directions | `ActionSheetIOS` from react-native for the choice, then `Linking` to open Apple Maps or Google Maps |
| Share | `Share.share` from react-native, the iOS share sheet |
| Confirm before deleting or leaving a group | `Alert.alert` from react-native |
| Grove membership | StoreKit through `react-native-purchases` (RevenueCat) or `react-native-iap`: two auto-renewable subscriptions in one group, Grove Yearly and Grove Monthly. Restore purchases and the manage sheet (`showManageSubscriptions`) come with them |
| Links that stay in the app | `expo-web-browser` (`openBrowserAsync`) for a website, a booking page, Terms of Use and Privacy Policy |
| App icon | `ios.icon` in app.json with the files in `assets/app-icon` (its README has the config) |
| Safe areas | `react-native-safe-area-context` |

## 3. Folder map

| Path | What it is | Ports to the app |
| --- | --- | --- |
| `src/theme/tokens.js` | All Figma tokens: 81 semantic colors (Light and Dark), spacing, radius, text styles, fonts, elevation | Yes, copy as is |
| `src/theme/motion.js` | Every duration, curve and haptic, each with a `native` note | Yes, copy as is |
| `src/theme/index.jsx` | `useTheme()` returning `c(name)`, `dark`, `reduceMotion`, and `type(style, weight)` | Yes. Set `FONT_TARGET = 'native'` |
| `src/components/` | One file per Figma component, plus `ShowMoreText` (About on a listing), `DashedBorder` (the dashed Edit and add tiles), `FilterSheet` (the shell Topics and Categories share), `ListingSections` (a listing's sections, shared by Listing profile and Check your listing), `PhotoPager` (the listing photos) and `ListingReviewSheet` (Check your listing) | Yes, see section 5 |
| `src/screens/` | Every screen, grouped by flow | Yes, one route file per screen |
| `src/screens/index.js` | Screen registry: components, motion and haptics per screen, and what Empty and Offline change there | Reference only |
| `src/app/store.jsx` | Sample data store: `v2` (true in V2, section 7), `me` (with `role`, `tier`, `stage`, `weeks`, `badges`, `progress`), `saved`, `listings`, `feed`, `post(id)`, `postsBy(personId)`, likes, replies and replies to replies. Membership and groups: `grove`, `groups`, `groupPosts`, `suggestedGroups`, `canJoin`, `joinGroup`, `leaveGroup`, `subscribe`. Journey: `journey`, `badges`, `streak`, `checkIn`, `visit`. Ask the Experts: `myQuestions`, `askQuestion`, `resendQuestion`. For a practitioner: `practice`, `myListing`, `claimListing`, `requestClaim`, `setRole`, `startPractice`, `updatePractice`, `submitPractice`, `requestFeature`, `questions`, `promo` | Replace with the real API later. Keep the method names |
| `src/app/feedback.jsx` | Snackbar host, `haptic(kind)`, `award(item)` (the Badge sheet for a badge or stage just earned) and `celebrate(fb, result, snack)` | Yes, swap the haptic call for expo-haptics |
| `src/app/appearance.jsx` | Dark mode: the app follows the phone until the person flips the switch on My Profile or My Practice, then stays Light or Dark | Yes, save the choice with AsyncStorage |
| `src/app/form.jsx` | `useForm()`: main buttons stay on, the first tap with something missing shows every message and scrolls to the first, then each message goes once it is fixed | Yes, swap the scroll step (section 5) |
| `src/app/nav.jsx` | Small navigator with the same API as React Navigation | No. Use expo-router (section 6) |
| `src/app/App.jsx` | Providers plus a drawn status bar and home indicator | Providers only. Use `expo-status-bar` |
| `src/rn.jsx` | Web stand-ins for React Native primitives | No. Import from `react-native` |
| `src/data.js` | Sample listings, people, posts and images | Reference and seed data |
| `src/showcase/`, `src/main.jsx`, `src/styles.css`, `scripts/` | The review page and build | No |
| `assets/img/` | Photos, interest illustrations, empty state illustrations, the role art on Which one are you? (`role_*`), a cover for each group (`grp_*`), Medallion art for the stages and badges (`art_*` in full color, `art_*_grey` for one not earned yet), logo (PNG and WebP). All from the Figma file | Yes |
| `assets/tokens.figma.json` | Raw token export from Figma | Source for `tokens.js` |
| `assets/app-icon/` | The app icon: Light, Dark and Tinted 1024 PNGs, SVG masters, Icon Composer layers | Yes, see its README |

## 4. Tokens, type and color mode

Colors are always read by their Figma name, never by hex:

```js
const { c } = useTheme()
<View style={{ backgroundColor: c('bg/color-surface-raised') }} />
```

`useTheme()` picks Light or Dark from the Dark mode switch on My Profile and My Practice. Until the person flips it, the app follows the phone (`useColorScheme()`).

Text always goes through `type(style, weight)`, for example `type('BodyM')` or `type('H6', 'bold')`. It returns `fontSize`, `lineHeight`, `letterSpacing` and `fontFamily`. Manrope Medium 500 is the regular weight. Manrope Bold 700 is the bold weight. Mrs Saint Delafield is used once, for the word "home" on Welcome.

| Style | Size / line height |
| --- | --- |
| H1 | 34 / 41 |
| H2 | 28 / 34 |
| H3 | 22 / 28 |
| H4 | 20 / 25 |
| H5 | 17 / 22 |
| H6 | 15 / 20 |
| BodyL | 19 / 28 |
| BodyM | 17 / 26 |
| BodyS | 15 / 22 |
| Caption | 13 / 18 |

Layout rules that hold on every screen:

- Screen side padding 16. Status bar 62, nav bar 56.
- Content starts at y 142 under a Back bar (24 below it) and at y 130 on the four tab screens (12 below the Title bar). `Screen` does this with `bodyTop`.
- 12 inside a group, 20 between groups. 12 between compact listing cards (Near you, category and search results, Saved), 20 between post cards and other cards. A listing profile keeps 40 between the intro, About, Services, Location and the details.
- Bottom buttons, as in Figma: short forms that never scroll (Sign up, Log in, Forgot password, New post, Ask the Experts) put the button top at y 772 with no fill (`<BottomBar plain>`). Forms that scroll under a canvas bar (About you, the quiz, Edit profile, Edit interests, the practice setup steps, Join Grove) put it at y 784 (`<BottomBar>`). Setup steps 4 to 8 stack Continue and a Tertiary Finish later, so the bar starts at y 704. Listing profile and every bottom sheet keep 48 below their buttons (y 770 on Listing profile). The Reply bar has its field at y 784.
- Bottom sheets are full width and attached to the bottom, 656 tall (three quarters of the 874 screen), radius 40 on the top corners, 12 top with the grabber, then the title with a close button, 16 sides and 16 between parts, the action pinned 48 above the screen edge. Content past the space scrolls under a hairline below the title and a 16pt fade above the action. Check your listing and the Waiver sheet are page sheets from y 72. On a sheet, fields, tiles and the close button use `bg/color-sheet-raised` with no edge (`useOnSheet()`), and choices are Sheet rows with a 1pt `border/color-default` edge.
- Minimum touch target 48. Primary buttons are 56 tall.
- Buttons take the brand turquoise from `bg/color-button-primary` and `bg/color-button-secondary`, with `text/color-on-button-primary` and `text/color-on-button-secondary` for labels and icons. White on the Primary turquoise is 4.71:1. Secondary is white with a 1.5pt `border/color-button-secondary` edge and a turquoise label in Light, filled in Dark.
- Radius tokens: 4, 8, 12, 16, 20, 24, 40, full.
- Dark mode has no strokes on cards or filled controls. `border/color-control` is transparent in Dark on purpose.
- US formats everywhere: 12-hour time (6:00 PM), Month Day, Year (March 14, 1958), miles, $89.00. Weeks start on Sunday. The only prices are Grove's on Join Grove and Membership, and the app reads them from StoreKit in the App Store's local format. Listings show no prices.

## 5. Porting rules

### Imports

| Prototype | App |
| --- | --- |
| `import { View, Text, ... } from '../rn'` | `import { View, Text, ... } from 'react-native'` |
| `Image` from `../rn` | `Image` from `expo-image` with `contentFit="cover"` |
| `Icon` (iconoir-react) | Same component, import from `iconoir-react-native` |
| `Svg`, `Rect` from `../rn` | `Svg`, `Rect` from `react-native-svg` (same props) |
| `useNav()` | `useRouter()` from expo-router (method map in section 6) |
| `useRoute().route.params` | `useLocalSearchParams()` |
| `useRoute().focused` | `useIsFocused()` |

### Web-only details to replace

| In the prototype | In the app | Where |
| --- | --- | --- |
| `backdropFilter: 'blur(...)'` | `BlurView` from expo-blur behind the content, tinted with the same token | IconButton (glass), TabBar, Sheet backdrop |
| `backgroundImage: 'linear-gradient(...)'` | `LinearGradient` from expo-linear-gradient with the same token stops (or `experimental_backgroundImage` on React Native 0.76 or newer) | Screen `HeaderFill` and `BottomBar` (the scroll edge), the listing photo scrim |
| `filter: 'blur(...)'` on the Welcome glow ellipses | A pre-blurred PNG, or `react-native-svg` RadialGradient | Welcome hero |
| `boxShadow` | Keep `boxShadow` on React Native 0.76 or newer, or spread `elevationNative.card` (and raised, overlay, glass) from tokens.js | Every card (`elevation.card`), Snackbar, SystemAlert, TabBar. Rows that scroll sideways (the Home reel, Your groups) pad 12 above and 32 below with matching negative margins, so the shadow is not clipped |
| `transition: ...` in a style | Reanimated `withTiming` using the matching entry in motion.js | Chip, Button, IconButton, TextField focus, Screen nav fill |
| `className="fx-..."` | Reanimated, see the table below | Screens and components |
| `animationDelay` | `entering={FadeInDown.delay(index * 40)}` | Lists |
| `scrollTo({ top: 99999 })` | `scrollRef.current.scrollToEnd({ animated: true })` | Conversation |
| `pointerEvents="box-none"` prop | Same prop on View (it already is RN) | |
| `numberOfLines` | Same prop. One line ends with an ellipsis (`ellipsizeMode="tail"`, the default), never a cut word | Task rows, Setting rows, meta lines |
| `hitSlop` | Same prop. React Native counts it from the outer edge, as the web shim now does | Chip, Tag chip, Text link, More and Like on a post, Like on a reply, the search clear button, photo remove buttons, the password eye |
| `Pressable accessible={false}` around a text field's label and line | Same: a tap on the label focuses the field (`inputRef.current.focus()`) without adding an accessibility element | TextField |
| `onContentSizeChange` on a multiline field | Same prop: grow the field one 26pt line at a time up to 4 lines, then let it scroll | Short bio on Edit profile |
| Height animation in `ShowMoreText` (measures `scrollHeight`) | `onTextLayout` to know if the text runs past 3 lines, then `layout={LinearTransition.duration(280)}` on the wrapper | Listing profile |
| Pointer drag and CSS scroll snap in `Reel.jsx` | `FlatList horizontal snapToInterval={350} decelerationRate="fast"`, dots from `onMomentumScrollEnd` | Home |
| Pointer drag and CSS scroll snap in `PhotoPager.jsx` | A horizontal `FlatList` with `pagingEnabled`, the "1 of 3" count from `onMomentumScrollEnd`, each photo a `Pressable` that opens the viewer route. The parallax moves the whole row | Listing profile, Check your listing |
| Pointer drag in `SlideButton.jsx` (`setPointerCapture`) | `Gesture.Pan()` from react-native-gesture-handler moving a Reanimated `translateX` clamped to the track, `withTiming` to the end past 85%, `withSpring(0)` before, then `runOnJS(onConfirm)` (motion.slide). VoiceOver: `accessibilityActions` with activate | Check your listing |
| `revealFirstError` in `form.jsx` (scrolls the nearest `.rn-scroll` to the first `[data-field-error]`) | Note each message's y with `onLayout` and call `scrollRef.current.scrollTo({ y })`. `FieldError` keeps `accessibilityRole="alert"` so VoiceOver reads it | Every form |
| The drawn map in `MapBox.jsx` (`filter: drop-shadow` on the pin) | A real `MapView` with a custom `Marker` drawn like the pin, the same 200pt box, radius and Directions pill | Listing profile |

| Class | Motion key | Reanimated |
| --- | --- | --- |
| `fx-list-in` | listEnter | `entering={FadeInDown.delay(i * 40).duration(360)}` |
| `fx-fade-up` | listEnter | `entering={FadeInDown.duration(360)}` |
| `fx-pop`, `fx-pop-once` | like, save | `withSequence(withTiming(1.28, { duration: 120 }), withSpring(1, { damping: 10 }))` |
| `fx-pop-in`, `fx-check-in` | select | `entering={ZoomIn.springify().damping(14)}` |
| `fx-collapse` | listRemove | `exiting={FadeOut.duration(200)}` plus `layout={LinearTransition.duration(300)}` |
| `fx-breathe`, `fx-breathe-core` | breathe | `withRepeat(withTiming(1.04, { duration: 2000 }), -1, true)` from 0.92 |
| `fx-drift-*` | Welcome hero | Slow `withRepeat` translate of 12 to 20 pt over 14 s |
| `fx-pulse` | skeleton | `withRepeat(withTiming(0.55, { duration: 700 }), -1, true)` on opacity |
| `fx-locate` | alert | Pulse ring on the map pin. Not needed, the real alert replaces it |
| `fx-sheet-up` | sheet | Welcome's panel rising on open: `entering={SlideInDown.delay(120).duration(640)}`. The Apple and App Store sheets that use it are drawn by iOS |
| `fx-nudge` | slide | The Slide button knob nudging 12pt right and back twice, 1.4 s each, after 600 ms: `withDelay(600, withRepeat(withSequence(withTiming(12, { duration: 420 }), withTiming(0, { duration: 420 }), withTiming(0, { duration: 560 })), 2))` |
| `fx-root-in` | fadeThrough | Root stack `animation: 'fade'` |

### Things drawn for the prototype only

- `SystemAlert.jsx` draws the iOS location alert. In the app call `Location.requestForegroundPermissionsAsync()` and iOS shows the real one. Copy for `NSLocationWhenInUseUsageDescription`: "We use it to show practitioners and places near you."
- The status bar, Dynamic Island and home indicator in `App.jsx`. The status bar is Apple's iOS 27 one for iPhone 17 Pro, taken from Apple's iOS and iPadOS 27 design kit. Use `expo-status-bar` with `style="auto"`, and `"light"` on the photo viewer. Listing profile asks for `"light"` while its photo sits under the status bar (`useStatusBarStyle` in `nav.jsx`, in the app `<StatusBar style="light" />` rendered while the screen is focused and the photo is in view), over a bg/color-overlay scrim that fades out by 128pt.
- The Choose photos sheet uses sample photos. In the app it is `ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true, selectionLimit: 5 - photos.length })`. Take a photo uses `launchCameraAsync`.
- Continue with Apple is a custom Sign in with Apple button that lines up with Log in and Register: black with white logo and title in Light, white with black in Dark (Apple requires black or white, never brand colors), 56pt pill, Apple's logo at 24pt, title in Body M Bold, 8pt gap. Port `AppleButton.jsx` as a Pressable, and Figma has it as the Sign in with Apple button component (Style Black, White) in the System doc. The title is smaller than Apple's native button draws it (Apple's proportion would be 24pt), so App Review may look at it. The colors, the logo and the "Continue with Apple" title follow Apple's rules. On press call `AppleAuthentication.signInAsync({ requestedScopes: [FULL_NAME, EMAIL] })` from `expo-apple-authentication`. iOS then shows its own Sign in with Apple sheet and Face ID. `AppleSheet.jsx` only draws that system sheet for the prototype. A new member goes to About you with the name Apple shared filled in. The email may be a private relay address (`@privaterelay.appleid.com`). Never ask for another email.
- `MapBox.jsx` draws a map with the `bg/color-map-*` tokens. The app shows the real place with `react-native-maps`, non-interactive inside a Pressable that opens the Get directions action sheet.
- `MapsSheet.jsx` draws the iOS action sheet for Get directions. In the app iOS draws the real one: `ActionSheetIOS.showActionSheetWithOptions({ title: 'Get directions', message: address, options: ['Open in Apple Maps', 'Open in Google Maps', 'Cancel'], cancelButtonIndex: 2 }, callback)`. Leave out `anchor` so it rises from the bottom, as in the mockup. Picking an app only shows a Snackbar ("Opening Apple Maps") in the prototype. In the app: Apple Maps `Linking.openURL('maps://?daddr=' + encodeURIComponent(address))`. Google Maps `comgooglemaps://?daddr=...` when `Linking.canOpenURL` says it is installed (add `comgooglemaps` to `LSApplicationQueriesSchemes` in app.json), otherwise `https://www.google.com/maps/dir/?api=1&destination=...` in the browser.
- `ShareSheet.jsx` draws the iOS share sheet for Share on a listing and on a post (the conversation's nav bar). For a post: `Share.share({ message: firstLine, url: postLink })`. In the app: `Share.share({ title: name, message: `${name}, ${address}`, url: listingLink })`, and iOS lists the person's own apps and contacts. `listingLink` is a universal link to the listing, which needs a domain from IHL with an apple-app-site-association file. Without the app installed it opens the web page or the App Store. Until IHL has a domain, share the name and address only.
- `ConfirmAlert.jsx` draws the iOS alert for Delete account. In the app: `Alert.alert('Delete your account?', message, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress }])`.
- `ConfirmAlert.jsx` also asks before leaving a group: `Alert.alert('Leave Book Club?', 'You can join again anytime.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Leave', style: 'destructive', onPress }])`.
- `ActionSheet.jsx` draws the iOS action sheet (Get directions, More on a post). More on someone else's post: `ActionSheetIOS.showActionSheetWithOptions({ options: ['Report post', 'Block Karen B.', 'Cancel'], destructiveButtonIndex: 1, cancelButtonIndex: 2 }, callback)`. On your own post: Delete post. Block and Delete ask first with `Alert.alert` ("Block Karen B.?", "You won’t see their posts or replies. They won’t be told." / "Delete this post?"). `actionSheet()` and `confirm()` in `feedback.jsx` host both over the whole screen. App Review Guideline 1.2 asks an app with member posts for a way to report them and to block their authors: Report sends the post to IHL's review queue ("Thanks. IHL will review this post."), Block hides that member's posts and replies for this person on the server, and they are not told.
- `AppStoreSheet.jsx` draws the App Store subscription sheet. In the app StoreKit draws it when you purchase the Grove product (`Purchases.purchasePackage` with RevenueCat or `requestSubscription` with react-native-iap), then the person confirms with Face ID or the side button. Show Welcome to Grove when the purchase resolves. Read the prices from the products, never from `PLANS` in `data.js`. Restore purchases calls `Purchases.restorePurchases()`. Manage subscription on Membership calls `showManageSubscriptions`.
- `Sheet.jsx` draws the bottom sheet: full width, attached to the bottom, three quarters of the screen. In the app use `@gorhom/bottom-sheet`: a `BottomSheetModal` with `snapPoints={['75%']}`, a `BottomSheetBackdrop` in `bg/color-overlay` that closes it on tap, `backgroundStyle` in `bg/color-sheet` with 40pt top corners, the handle in `border/color-default`, a `BottomSheetScrollView` for the content and `footerComponent` for the pinned action. iOS 26's own `formSheet` floats a partial height sheet off the screen edges, so it would not match. The Location sheet keeps its Search field in place and scrolls the places. Check your listing is a `pageSheet` route (expo-router `presentation: 'pageSheet'`) on `bg/color-canvas` with a 1pt `border/color-glass` rim along its top. The Waiver sheet is a `pageSheet` that can't be swiped away (`gestureEnabled: false`).
- Award moments (the Badge sheet with a breathing halo) come from `fb.award()` in `feedback.jsx`. In the app present the same Badge sheet as a `BottomSheetModal` at 75% and fire `notificationAsync(Success)`.
- `PhotoViewer` in `community.jsx` uses a raw div pager. Build it with a horizontal paging `FlatList` or gesture-handler, pinch to zoom and double tap to zoom 2x. Swipe down to close is a good native extra.

## 6. Navigation

```
app/
  _layout.tsx                 root Stack, animation 'fade' between (auth) and (tabs)
  (auth)/_layout.tsx          Stack
    welcome.tsx               Log in and Register side by side, Continue with Apple under them. Apple, then the waiver
    sign-up.tsx               Create account opens the waiver sheet. I agree makes the account
    terms.tsx                 Terms of Use, pushed from the link on Sign up
    privacy.tsx               Privacy Policy, the same way
    log-in.tsx
    forgot-password.tsx
    account-type.tsx          Which one are you? Seeker goes to about-you, Practitioner to find-listing
    about-you.tsx
    quiz-goals.tsx            Question 1 of 3, what they want help with
    interests.tsx             Question 2 of 3
    quiz-care.tsx             Question 3 of 3, who they care for. Finish goes to seedling
    seedling.tsx              You're a Seedling, the first badge. Continue goes to preparing
    find-listing.tsx          Find your business in the imported listings, or add a new one
    claim-listing.tsx         Is this your business? Email me the link, or Ask us to check
    claim-sent.tsx            Check your email. The link (a universal link) opens preparing with the claim done
    claim-review.tsx          Ask us to check: role and phone
    practice-basics.tsx       Step 1, Your practice
    practice-specialties.tsx  Step 2, Specialties
    practice-place.tsx        Step 3, Where people find you
    practice-photos.tsx       Steps 4 to 9 re-export the practice tab screens with setup="signup"
    practice-about.tsx
    practice-hours.tsx
    practice-contact.tsx
    practice-services.tsx
    practice-offer.tsx        Finish (and Finish later from steps 4 to 8) goes to preparing
    preparing.tsx             router.replace('/(tabs)/home') after 2.6 s, '/(tabs)/practice' for a practitioner
  (tabs)/_layout.tsx          Tabs with the custom glass TabBar: Home, Directory, Community, then My Profile
                              or My Practice by role (hide the other with href: null)
    home/_layout.tsx          Stack
      index.tsx               Home: Sponsored reel, weekly check-in, Top discussions
      listing/[id].tsx        Listing profile (re-exports the Directory screen)
      tag/[tag].tsx           Tag results (re-exports the Directory screen)
      post/[postId].tsx       Conversation (re-exports the Community screen)
      member/[personId].tsx   Member profile
    directory/_layout.tsx     Stack
      index.tsx               Directory
      listing/[id].tsx        Listing profile
      tag/[tag].tsx           Tag results, every place with one specialty
      saved.tsx
    community/_layout.tsx     Stack
      index.tsx               Community: Your groups, then the feed
      groups.tsx              Groups: yours, suggested for you, the rest
      group/[id].tsx          A group and its posts. Ask the Experts adds Ask a question and Your questions
      post/[postId].tsx       Conversation
      member/[personId].tsx   Member profile
    profile/_layout.tsx       Stack
      index.tsx               My Profile: membership, journey, badges, interests, settings
      membership.tsx          A Grove member's plan
      journey.tsx             Your journey
      badges.tsx              Badges, with the Badge sheet
      edit.tsx                Edit profile
      interests.tsx           Edit interests
      privacy.tsx             Privacy: Policies, Permissions, Delete account
      waiver.tsx              Liability waiver
    practice/_layout.tsx      Stack, a Practitioner's fourth tab
      index.tsx               My Practice: Draft (Continue setup or Send for review), In review or Live
                              Continue setup pushes the first missing step with setup="resume".
                              Without setup the same screens are editors with Save
      check-listing.tsx       Check your listing, presentation 'pageSheet'. Send for review opens it,
                              the Slide button sends the listing and goes back to index
      name.tsx                Name and type
      specialties.tsx         Specialties
      address.tsx             Address
      photos.tsx              Photos
      about.tsx               About
      hours.tsx               Hours, with the Hours sheet
      contact.tsx             Phone and links
      services.tsx            Services
      offer.tsx               Member offer
      get-featured.tsx        Get featured
      post/[postId].tsx       A question for you (Conversation)
      privacy.tsx             Privacy (re-exports the profile screen)
      listing/[id].tsx        Their listing as seekers see it
      tag/[tag].tsx           Tag results
  new-post.tsx                presentation 'fullScreenModal'. group param
  ask-question.tsx            presentation 'fullScreenModal'. edit param for Needs changes
  join-grove.tsx              presentation 'fullScreenModal', the paywall. reason param
  photo-viewer.tsx            presentation 'transparentModal', animation 'fade'
```

V1 leaves out quiz-goals, quiz-care, seedling, groups, group/[id], membership, journey, badges, ask-question and join-grove. Its interests.tsx is the last onboarding step and goes to preparing.

| Prototype call | expo-router |
| --- | --- |
| `nav.navigate('ListingProfile', { id })` | `router.push({ pathname: '/directory/listing/[id]', params: { id } })`, from Home `/home/listing/[id]` so it stays in that tab |
| `nav.navigate('TagResults', { tag })` | `router.push({ pathname: '/directory/tag/[tag]', params: { tag } })`, from Home `/home/tag/[tag]` and from My Practice `/practice/tag/[tag]` |
| `nav.navigate('Conversation', { postId })` | `router.push({ pathname: '/community/post/[postId]', params: { postId } })`, from Home `/home/post/[postId]` so back returns to Home |
| `nav.goBack()` | `router.back()` |
| `nav.switchTab('community')` | `router.navigate('/community')` |
| `nav.openModal('NewPost')` | `router.push('/new-post')` |
| `nav.openModal('JoinGrove', { reason })` | `router.push({ pathname: '/join-grove', params: { reason } })` |
| `nav.openModal('AskQuestion', { edit })` | `router.push({ pathname: '/ask-question', params: { edit } })` |
| `nav.openTab('directory', 'Directory', { category })` | `router.navigate({ pathname: '/directory', params: { category } })` |
| `nav.closeModal()` | `router.back()` |
| `nav.closeModalAndPush('community', 'Conversation', { postId, justPosted: true })` | `router.dismiss()` then `router.push({ pathname: '/community/post/[postId]', params: { postId, justPosted: '1' } })` |
| `nav.openViewer(photos, index)` | `router.push({ pathname: '/photo-viewer', params: { postId, index } })` |
| `nav.enterApp()` | `router.replace('/(tabs)/home')` |
| `nav.enterApp({ role: 'practitioner', tab: 'profile' })` | `router.replace('/(tabs)/practice')` |
| `nav.signOut()` | `router.replace('/(auth)/welcome')` |

The tab bar hides on every pushed screen (Listing profile, Tag results, Saved, Conversation, Member profile, Groups, a group, Your journey, Badges, Membership, Edit profile, Edit interests, Privacy, the practice editors and Get featured). Tapping the active tab pops its stack to the top.

## 7. Screens

| Screen | File | Params | States to build |
| --- | --- | --- | --- |
| Welcome | auth.jsx | | Sign in with Apple sheet (system), then the waiver sheet |
| Sign up | auth.jsx | | Empty, Errors (Create account with something missing), Email not valid, rules check live, Passwords don't match, Waiver sheet (I agree before the end shows "Scroll to the end to agree", at the end it makes the account) |
| Terms of Use, Privacy Policy | auth.jsx | | A Back bar and the title only, until IHL sends the text |
| Liability waiver | auth.jsx | | The waiver text to read again, from Privacy. It opens with "You agreed to this when you made your account." and has no I agree line |
| Log in | auth.jsx | | Empty, Errors, Email not valid, Wrong password |
| Forgot password | auth.jsx | | Empty, Enter your email, Reset link sent Snackbar |
| Which one are you? | auth.jsx | | Nothing picked yet, Continue with nothing picked ("Pick one to continue.") |
| About you | auth.jsx | | Empty, Errors (name, date of birth, gender), Date sheet, Location sheet, location permission alert, Location not allowed, location filled |
| Quiz: help with, Interests, care for | auth.jsx | | Question 1, 2 and 3 of 3. Nothing picked, then "Pick at least one." on Continue or Finish. V1: Interests only, with no question count and Finish |
| You're a Seedling | auth.jsx | | The badge with its halo and the six stages ahead |
| Preparing | auth.jsx | | Setting up your practice for a practitioner |
| Find your business, Is this your business?, Check your email, Ask us to check | auth.jsx | query, id | One match, No match, Already managed, Ask us to check empty |
| Your practice (step 1) | practice.jsx | setup | Empty, Errors (name and type) |
| Specialties (step 2) | practice.jsx | setup | Empty, Focus areas only (Continue shows "Pick at least one from What you offer."), 10 picked (an 11th shows a Snackbar) |
| Where people find you (step 3) | practice.jsx | setup | Empty, Errors, City sheet, map preview once both fields are in |
| Home | home.jsx | query | Loading, Offline, Nothing here yet, Search results, No results, Check-in sheet, Checked in, Steady earned, New member |
| Directory | home.jsx | query, category | Loading, Offline (no search or menu, like Figma), a category chip picked (count line and Clear), Subcategories sheet for one category and for all, a subcategory picked, a subcategory with nothing in it, Services with nothing in it, Search results (a # tag works too), Search results with map (a 200pt map between the search and the list when the search finds Food or Shop places, one pin per place, a pin opens the listing, Holistic Business and Services get no pin), No listings, No places near you yet, a category with no places |
| Listing profile | home.jsx | id | Saved and not saved, photos that swipe with a "1 of 3" pill (a photo opens the Photo viewer), Specialties and Approach as Tag chips, I was here and You've been here, a stage or badge earned by a visit, member offer (locked for a Seedling), Book, no website, About with Show more and Show less, Get directions action sheet, share sheet |
| Tag results | home.jsx | tag | Loading, Offline, No places with the tag yet |
| Saved | home.jsx | | Loading, Offline, Nothing saved |
| Community | community.jsx | topic, query, options, block | Your groups, No groups yet, Loading, Couldn't load, No posts yet, Topics sheet, Topic picked, Search results, No results, No posts in a topic, Post options, Block alert, a blocked member's posts gone |
| Groups | groups.jsx | | Grove, Seedling (2 of 3 free groups), 3 of 3 (Join opens the paywall), Suggested for you |
| Group | groups.jsx | id | Joined, Not joined, Leave alert, No posts yet. Ask the Experts: Your questions (In review, Published, Needs changes), Seedling (Grove badge) |
| Ask the Experts | groups.jsx | edit | Empty, Filled, Sent for review Snackbar, Errors (topic, question), Edit a question with IHL's note (Send again with no change shows "Edit your question to send it again.") |
| Conversation | community.jsx | postId, justPosted, replyTo | No replies yet, Reply posted, Couldn't send, Replying to (a reply to a reply), the group a post lives in, See more (the next 5 replies), Share sheet, post options. The post and its replies share one card, the Reply bar sits under it |
| Member profile | community.jsx | personId | Stage, bio and badges, Hasn't posted yet |
| New post | community.jsx | group | Empty, Errors (topic, text or a photo), Choose photos with nothing picked and with 3 picked, up to 5 photos, Posting, Couldn't post, Posting in a group |
| Photo viewer | community.jsx | photos, index | From a post photo or a listing photo |
| Join Grove | membership.jsx | reason | Yearly or Monthly picked, App Store sheet (system), Welcome to Grove. The plans sit right under the title, in view with Join, then What you get |
| Membership | membership.jsx | | A Grove member's plan, Manage subscription |
| My Profile | profile.jsx | | Grove or Seedling membership, No photo or location, One interest, Dark mode on and off |
| Your journey, Badges | journey.jsx | | New member at Seedling, Badge sheet in progress and earned |
| Edit profile | profile.jsx | | Short bio growing to 4 lines (V2), No photo or location, Add photo sheet, Photo picked, Photo added, Date sheet, Location sheet, Place not found, Email not valid, Profile saved |
| Edit interests | profile.jsx | | Nothing picked (Save shows "Pick at least one."), One picked |
| Privacy | profile.jsx | | Delete account alert, then Welcome with the Your account was deleted Snackbar |
| My Practice | practice.jsx | | Draft with Continue setup, Ready to send, Check your listing with the Slide button, In review, Claim in review, Live with Questions for you, scrolled to the Feature card, Request sent, Featured |
| Photos, About, Hours, Phone and links, Services, Member offer (steps 4 to 9) | practice.jsx | setup | Empty and filled for each step, Errors on Continue, Choose photos sheet, Hours sheet, Finish later. As editors: nothing changed (no Save), Saved Snackbar |
| Name and type, Address | practice.jsx | | Editors only |
| Hours | practice.jsx | setup | A day with no hours reads Add, Hours sheet open, Closed day, closing before opening |
| Get featured | practice.jsx | | Nothing picked (Send request shows "Pick how long."), 3 months picked |

The other params you see in `scenarios.js` (`email`, `password`, `confirm`, `name`, `dob`, `gender`, `location`, `text`, `photos`, `showAlert`, `autoSubmit`, `autoPost`, `validate`, `openSheet`, `openCategories`, `picked`, `picks`, `expanded`, `scroll`, `openMaps`, `openShare`, `confirmDelete`, `openTopics`, `pick`, `type`, `kind`, `address`, `city`, `openPlace`, `about`, `hours`, `openDay`, `phone`, `website`, `services`, `length`, `showWaiver`, `waiverRead`, `promo`, `scrollTo`, `openCheckIn`, `mood`, `autoCheckIn`, `autoVisit`, `confirmLeave`, `showStore`, `welcome`, `plan`, `open`, `from`, `openCheck`, `waiverEarly`, `showMismatch`, `emailError`, `showApple`, `denied`, `openDate`, `placeQuery`, `photo`, `draft`, `autoSend`, `claimed`, `role`) and the `seed` values only exist so the review panel can jump straight to a state. Do not port them. In the app every form opens empty.

### Behavior to keep exactly

- Forms open empty with placeholders: "name@example.com", "Your password", "Create a password", "Type it again", "First and last name", "Choose a date", "City or address" and "What would you like to share?" Edit profile and Edit interests open with the member's saved data.
- Main buttons stay on, on every form. Tapping one with something missing shows a message under each field or group that needs it (the Text field's Error state, or `FieldError` under chips, cards, tiles, photos and days), fires the error haptic and scrolls the first message into view. From then on the messages are live, so each one goes as soon as it is fixed. Nothing shows before that first tap, except an unfinished email once the person leaves the field. Only a busy button (Posting…) is disabled. `useForm()` in `src/app/form.jsx` holds this.
- A member without a photo shows their initials. On Edit profile the initials circle is `bg/color-surface-raised` so it reads on the canvas.
- Password rules: at least 8 characters, one capital letter, one number. Each rule turns green as it passes. Create account checks that the email is valid, every rule passes and Confirm password is filled, and says what is missing: "Enter your email.", "Create a password.", "Check the rules below.", "Type your password again." Two different passwords show "Passwords don’t match." on Create account, with the error haptic.
- Log in in the prototype accepts any password that passes the rules. The wrong password message is "Email or password doesn't match."
- Date of birth and Location are picker fields. Tapping opens a bottom sheet (Date sheet with month, day and year wheels, Location sheet with search, Use my current location and places). Location is optional. Use my current location asks for permission, then fills the city. Don't Allow shows "Location is off. Search for a city or turn it on in Settings." A search with no match shows "We couldn't find that place. Try a city or street."
- About you needs a name, a date of birth and a gender before Continue: "Enter your name.", "Choose your date of birth.", "Pick one."
- An unfinished email shows "Enter a full email, like name@example.com." when the person leaves the field (Sign up, Log in, Forgot password, Edit profile).
- New post needs a topic plus text or a photo. It opens with no topic, except from a topic's empty feed.
- A new member (Sign up or Continue with Apple) starts with no photo (initials), nothing saved and their own email. Log in brings back the returning member.
- Edit profile and Edit interests show Save only once something changed. With nothing picked, Save on Edit interests shows "Pick at least one."
- Change photo (Add photo with no photo yet) opens a sheet: Take a photo as a Sheet row, Recents with single select, Use photo, and Remove photo when there is one. In the app use `ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1] })` and `launchCameraAsync`.
- Forgot password? is a Text link: Body S Bold in text/color-link, left aligned, 48pt hit area.
- Welcome: the headline has 24 at its sides (8 inside the sheet's 16) and 16 under it. Log in and Register sit side by side, both Primary with no icons, Continue with Apple under them, 16 between all three. The sheet keeps 40 under Continue with Apple, over the 34pt home indicator area (74 bottom padding), so its top sits at y 545 and the logo centers between the status bar and the sheet. No legal line on Welcome.
- Sign up: "By creating an account, you agree to the Terms of Use and Privacy Policy." sits centered above Create account in Body S secondary. The two names are inline links (Body S Bold, text/color-link) that push Terms of Use and Privacy Policy, each a Back bar and its title. Fill them with IHL's text when it arrives.
- Gender options: Woman, Man, Non-binary, Prefer not to say.
- Home: the reel shows only paid partners (`sponsored` from the API), each card labeled Sponsored. It snaps one card at a time with Page dots under it and never moves on its own. Top discussions shows the three posts with the most replies. See all opens Community, a row opens the conversation inside Home.
- Home search ("Search people, places and posts") matches listings by name, kind, area and category, and posts by text, topic and author. Results replace the reel and Top discussions: Places as Compact listing cards with no save button, then Posts as Thread rows in one card. A result opens inside Home. No match shows No results for “Reiki” with Clear search. Offline hides the field.
- Section titles on a listing (About, Specialties, Approach, Services, Location) are H6 Bold in text/color-secondary.
- A listing's tags sit under About in two sections of Tag chips that wrap 8 apart: Specialties, what the place offers ("Massage"), in the deeper sage (TagChip `tone="sage"`: bg/color-accent, text/color-on-accent), then Approach, its focus areas ("Sleep"), in the light green. Services follows as it is. A chip is a link, never a filter: it pushes Tag results, with the tag as the title, "3 places" and Compact listing cards with no save button in Directory order. A result opens its listing, Back returns to the listing the tag came from.
- Search on Home and Directory matches specialties too, with or without the # ("#sleep" and "sleep" find the same places).
- Services on a listing sit in one inset card (`ServiceList`), a 56pt Service tag row each with a divider between them. Names only, not tappable. The app shows no prices.
- Share on a listing opens the iOS share sheet with the name, the address and the listing link.
- Location on a listing: the title, the 200pt Map box, then the street in Body M Bold over the area and city in Body S. The map and the address open the Get directions action sheet (Open in Apple Maps, Open in Google Maps, Cancel). Picking one opens that app with directions to the address.
- Directory: four category Chips in one row under Search, Holistic Business, Food, Shop and Services (`CategoryChips`, 12pt sides so they fit, IHL adds subcategories later). For now practices are Holistic Business, farms and food spots are Food, shops are Shop, and Services is empty. A chip filters the list, and tapping it again goes back to Near you. The filter-list button next to Search opens the Subcategories sheet: the picked category's 4 to 6 subcategories as text Sheet rows with a favorite heart (favorites move to the top), or every subcategory under its category when none is picked (`SUBCATEGORIES` in data.js, a draft, each listing has one `subcategory`). Picking one narrows the list, picks its category, fills the button and reads "1 place in Farms". A new category or Clear drops it. A subcategory with nothing in it shows No places in Fitness yet. While one is on, the line under the chips reads "4 holistic businesses near you" (food spot, shop, service) with Clear. A search within it reads "1 result in Shop". A category with nothing in it shows No services near you yet with Show all places.
- Community search matches the post text, its topic and the author's name. The menu button opens Topics, one topic at a time. While a topic is on, the button is Filled and "2 posts in Food" with Clear shows under the search. A search with no match shows No posts for “Reiki” with Clear search.
- Saving and unsaving always confirms with a Success Snackbar ("Saved to your list", "Removed from Saved"). Unsaving on Saved collapses the row first. The newest save goes to the top of Saved.
- Listing profile: About shows 3 lines with an ellipsis. Show more (Body S Bold, link color, 8 below) opens the full text and turns into Show less. It only shows when the text is longer than 3 lines.
- Listing photos: one photo fills the 300pt hero. With more than one they swipe one at a time with a "1 of 3" pill (`bg/color-toast`, Body S Bold in white) 16pt from the bottom right corner, and tapping a photo opens the Photo viewer on it, as on a post.
- Detail rows on a listing, under Location: days over opening times, phone over "Call or text". The icon circle is `bg/color-surface-raised` so it reads on the canvas.
- New post: topic chips, message, up to 5 photos with remove buttons. Post with no topic or nothing to post shows "Pick a topic." and "Write something or add a photo." Offline shows "Couldn't post. Try again." and keeps the draft. Success closes the modal, opens the new post and shows "Your post is live".
- Conversation: the post and its replies share one white card, the replies under a divider. The Reply bar is docked under it on the same white surface. The send button always looks active. With no text it puts the cursor in the field. Offline shows "Couldn't send. Try again." and keeps the text.
- Replies to a reply: Reply under a reply answers it one level down, indented 44 so the avatars line up with its text. The Reply bar shows "Replying to Wildroot Herbal Co." with a close button that goes back to replying to the post. Replies to a reply have no Reply of their own.
- Post cards: the line under the name is the time only (Practitioner badge first for a practice). The topic is a Neutral badge at the end of the Like and Reply row. Feed cards show the text in Body S, four lines at most. The conversation shows the whole post and its replies in Body M. Thread rows show the post in Body S Bold, two lines at most.
- One Snackbar at a time. It shows for 2.6 s and sits 16 pt above whatever is at the bottom (tab bar, button bar, Reply bar or home indicator). Offsets are in `feedback.jsx` as `SNACK`. It fades out when you leave the screen.
- The nav bar stays put. A solid canvas fill fades in once content scrolls under it, with the scroll edge under it: content softens over 16pt instead of showing through or stopping at a hard line. A canvas bottom bar has the same 16pt edge above it. In the app iOS 26 draws this scroll edge effect on native headers and toolbars. On Listing profile the photo moves at 40% of scroll speed and the name fades into the nav bar once the photo is gone.
- Date of birth wheels: month and day wrap around (December above January, 31 above 1), the year does not. A day the month doesn't have moves to its last day. The native spinner picker does all of this.
- The waiver sheet shows a border/color-subtle hairline under its title once the text scrolls under it. I agree before the end turns the hint above it into "Scroll to the end to agree" in `text/color-error` with a warning icon and the error haptic. At the end the hint reads "You’ve read it all" and I agree makes the account.
- Hit areas: every control reaches 48pt, small ones through `hitSlop`. A text field's label is part of its tap area.
- More on a post opens the post options. In a conversation the nav bar holds More and the card has none. See more under the replies loads the next 5. Report, Block and Delete post: see the iOS action sheet note under Things drawn for the prototype only.
- A practitioner's New post with the Promotion row uses a 176pt Message box, so the Promotion line stays clear of Post.
- Edge swipe back works on every pushed screen.
- Dark mode on My Profile and My Practice is a Toggle. Until the person flips it the app follows the phone, after that it keeps Light or Dark.
- Tab bar: each tab is as wide as its label in Bold plus an equal share of the space left, so My Practice fits inside its pill, and the selected pill sits 4pt inside the capsule. The tab names are My Profile and My Practice, in Title Case.
- Privacy, from My Profile and My Practice: Policies (Privacy Policy and Terms of Use push their pages), Permissions (Location shows the current permission from `Location.getForegroundPermissionsAsync()` and opens `Linking.openSettings()`), then Delete account. Delete account asks first with the iOS alert. Delete calls the delete account API, signs out to Welcome and shows "Your account was deleted". Apple requires deletion inside the app for any app with sign up (App Review Guideline 5.1.1(v)), and an account made with Sign in with Apple must also revoke its Apple token on delete. A practitioner's alert says their listing goes too. There is no Help page in the MVP.

### Seekers in V2: quiz, membership, groups and the journey

- After About you a seeker answers three questions, one screen each with Step progress at the top right of the nav bar (a bar and "1 of 3", VoiceOver reads "Question 1 of 3"): What can we help with? (eight Select tiles, two to a row), What are you into? (the Interest cards) and Who do you care for? (four Select tiles). Each needs one pick ("Pick at least one."), the last button reads Finish. The answers set Home and the suggested groups, and nobody else sees them.
- Finish opens You're a Seedling: the Seedling badge with its breathing halo, "Your first badge", one line and the six stages ahead as a path. Continue runs Preparing. Every member starts as a Seedling on the free Seedling membership.
- Seedling membership: up to 3 groups. Grove, $89.00 a year (Save 33%) or $11.11 a month: every group, Ask the Experts and member offers. Join Grove opens from Join Grove on My Profile, Join on a fourth group, Ask a question, and a locked member offer. The line under the title says why it opened, and that perk leads the list. Yearly is picked first. The button carries the price ("Join for $89.00 a year"). Under the plans: the renewal terms, Restore purchases, Terms of Use and Privacy Policy (App Review Guideline 3.1.2). Subscribe on the App Store sheet shows Welcome to Grove, and Grove joins Ask the Experts for the member.
- Groups are forum spaces on top of the four topics: Welcome Circle, Ask the Experts, Herbal Medicine, Gut Health and Nutrition, Local Farms, Foraging, Book Club and Natural Parenting. A group's posts live on its page, never in the Community feed, and carry no topic. Community shows Your groups as tiles in a row with Find groups at the end, or a Join a group card before any. Groups lists yours, up to 3 Suggested for you from the quiz (a new member gets the Welcome Circle first) and the rest. Join confirms with "You joined Book Club". Joined on a group asks "Leave Book Club?" with the iOS alert. The plus on a joined group opens New post with Posting in and the group's name.
- Ask the Experts: a Grove member asks with a topic and the question, reminded to leave out names, medicines and health records. Send for review shows "Sent for review" and the question In review under Your questions. IHL then publishes it in the group (Published, with the answer count, opens the conversation) or sends it back (Needs changes, with IHL's note and Edit question). Edit reopens it with the note, and Send again with no change shows "Edit your question to send it again." Verified practitioners answer with the Expert badge.
- Weekly check-in on Home: once a week is enough, there is no daily streak. Weeks start on Sunday. The card shows the last six weeks over the Sunday each starts on, then Check in, which opens How was your week? (Great, Good, Okay, Hard, "Only you see this."). Afterward the card reads "You checked in this week". Four weeks in a row earns Steady.
- I was here on a listing marks a visit, once per place, for members only. It counts toward Sprout, Explorer (10 places), and Farm Friend (3 farms or markets). "Visit saved" confirms, or the Badge sheet opens when it earns something.
- Stages: Seedling (make your account), Sprout (a bio, a reply, a visit), Root (check in 4 weeks in a row, share 10 posts), Grove (join Grove, post in all 4 topics), Forest (check in 12 weeks in a row, share 25 posts), Oak (take part for a year). A member grows one stage at a time as soon as every step is done, and the Badge sheet says "You reached Sprout".
- Badges: Seedling, Explorer, Farm Friend, Welcomer (greet 5 new members in the Welcome Circle) and Steady. A badge in progress shows "6 of 10 places". Member profiles show the stage, the bio and the earned badges. Nothing ranks members against each other.
- Award moments use one Badge sheet: the Medallion at 96 with its halo, "New badge" or "New stage", the title, one line and Done, with a success haptic. When one action earns a stage and a badge, the stage shows.

### Practitioner accounts

- Which one are you? shows once, after the waiver for a new member. The cards read Seeker and Holistic Business (the Practitioner account). Continue with no card picked shows "Pick one to continue." Seeker goes to About you, Holistic Business to Find your business. Log in brings back the saved account type.
- Find your business searches the imported listings by name, street, neighborhood and city. A listing nobody manages offers Email me the link: a claim link goes to the email on record, shown masked (d•••@quietmindmassage.com), and opening it on this iPhone claims the listing at once, live and verified. I can't use that email, or a listing someone already manages, goes to Ask us to check: a role (Owner, Manager, Staff) and a phone, then IHL calls within 2 business days and My Practice shows the claim In review.
- My business isn't listed starts a 9 step stepper: Your practice, Specialties, Where people find you, Photos, About, Hours, Phone and links, Services, Member offer. Each step shows Step progress at the top right of the nav bar (a 160pt bar and "3 of 9"), so the title under it has the whole width, then the title and one line. Continue stays on and says what the step still needs. Your practice needs a name and a type. The type sets the Directory category (Practice is Practitioners, Farm is Farms, Food is Food, Shop is Shops) and what Specialties offers first. Specialties needs one pick from What you offer. Where people find you needs a street address and a city, then shows a map of the place. Photos needs one photo, About needs text, Hours needs one open day, Phone and links needs the phone (the website and a booking link are optional). Services and Member offer are optional, and the last button reads Finish.
- Specialties ("They show as tags on your listing and help people find you."): Chips with a check in two groups. What you offer depends on the type: Acupuncture to Yoga for a practice, CSA to U-pick for a farm, Bakery to Restaurant for food, Apothecary to Teas for a shop. Focus areas are the same for every type: Back pain, Blood sugar, Gut health, Healthy aging, Heart health, Joint pain, Menopause, Mobility, Sleep and Stress. Up to 10, at least one from What you offer. A line under the hint counts them in Body S Bold text/color-brand: "Pick up to 10, at least one from What you offer.", "Pick at least one from What you offer." or "5 of 10 picked. Massage shows on your card." The first pick from What you offer is the kind on cards (Massage  ·  Irvington). An 11th pick shows the Snackbar "You can pick up to 10" with the error haptic. The lists are a draft of the IHL tag taxonomy, `SPECIALTIES` and `FOCUS_AREAS` in data.js, until IHL sends the final one.
- A new type on Name and type keeps the focus areas and drops the picks that belong to the old type, with "Some specialties belong to the old type. Pick again under Specialties after saving." under the type cards.
- From step 4 to 8 Finish later keeps what is there. Finish and Finish later both run Setting up your practice (the Preparing rings, 2.6 s) and land on My Practice.
- Placeholders say what to write: "Name people know you by", "123 Main St", "City or neighborhood", "What you offer, who it helps and what a first visit is like.", "(317) 555-0100", "yourpractice.com", "yourpractice.com/book", "Like a 60 minute massage", "Like 10% off your first visit", "Like mentioning the app when you book".
- Hours: a day with no hours yet reads Add in the link color and opens the Hours sheet with Open on at 9:00 AM to 5:00 PM. Days still unset count as Closed once the hours are kept.
- My Practice counts seven required parts: Name and type, Specialties, Address, Photos, About, Hours, Phone and links. Services and Member offer are optional. The button sits right under the Practice card, above the nine rows, so it shows without scrolling. While parts are missing it is Continue setup, which opens the stepper at the first missing step. Once all seven are done it is Send for review, which opens Check your listing: a page sheet with the Directory card, then the listing as seekers will see it (photos, every section and its buttons, nothing tappable), then the Slide button. Sliding it to the end sends the listing, so a stray tap never does. The listing is then In review ("Sent for review" Snackbar) and stays out of the Directory until IHL approves it. Closing the sheet, or swiping it down, goes back to fix something.
- A claimed or approved listing carries the Verified Local Business badge (Accent, badge-check) and a verified mark after its name on cards. Its tags show under About as Tag chips, under Specialties and Approach. A booking link makes Book the main button next to Call and moves the website into a Detail row. Without one: Website and Call, or Call alone when there is no website. A member offer shows in its own card (locked for a Seedling).
- From My Practice a Task row or a Your listing row opens its step as an editor: a Back bar named after the row, the same fields, and Save only once something changed. Save goes back to My Practice and confirms with "Photos saved", "Hours saved" and so on. Photos takes up to 6 and the first is the Cover on the listing and the Sponsored card. Hours: a day opens the Hours sheet, Open off means Closed, and a closing time before the opening time shows "Pick a closing time after it opens." under the wheels, and Done answers it with the error haptic.
- Get featured is a request, nothing is paid in the app. Send request returns to My Practice with "Request sent", and the Feature card shows "Requested  ·  3 months" until the IHL team sets it up. Featured shows the end date and See it on Home, and the practice card leads the Home reel, labeled Sponsored.
- Questions for you: once live, My Practice lists the Ask the Experts questions that match the practice's specialties. The practitioner answers as the practice ("Answer as Quiet Mind Massage"), and the answer shows the Expert badge.
- Promotions: New post has a Promotion toggle for offers, sales and events, 1 a day and 3 in any 7 days ("2 of 3 left this week", or when the next one opens). A promotion carries the Promotion badge. Replies and answers have no limit.
- A practitioner never sees a save button on their own listing, on the listing profile or in the Home reel, and has no check-in or membership.
- A practitioner posts and replies as their practice: the practice name, its cover photo as the avatar and the Practitioner badge. New post shows Posting as above Topic.

### V1 and V2

The review panel switches between two versions of one app (section 9). V2 is everything in this file. V1 is the MVP without the seeker round:

- Onboarding: About you goes to What are you into?, with no question count, and Finish runs Preparing. No other quiz questions and no You're a Seedling.
- No Seedling or Grove: no Membership card, Join Grove or App Store sheet. Member offers are open to everyone.
- No groups: Community has the topics and the feed only, with no Your groups row or Groups screen. Published Ask the Experts questions show in the feed with their Ask the Experts badge, and practitioners answer them from Questions for you. Asking one is V2.
- No journey: no This week (the check-in) on Home, no I was here on a listing, no Your journey or Badges on My Profile, no bio on Edit profile, and no stage, badges or bio on a member profile.
- Both versions have the practitioner flows, replies to a reply, Specialties and Tag results.

## 8. Motion and haptics

Every value lives in `src/theme/motion.js`. The review panel shows which ones each screen uses and lights them up as they run.

| Key | What | Duration | App |
| --- | --- | --- | --- |
| push / pop | Push and back | 480 / 420 ms | Native stack default |
| fadeThrough | Auth to app and sign out | 420 ms | Root stack `animation: 'fade'` |
| tab | Switch tab | 160 ms | Tabs `animation: 'fade'`. The new tab fades in over the old one, the background never dips |
| modal | Open New post | 520 ms | `fullScreenModal` |
| sheet | Every bottom sheet: Choose photos, Topics, Categories, Location, Date, Hours, Check-in, Badge, and the page sheets | 520 ms | `BottomSheetModal` at 75%, `pageSheet` for Check your listing and the waiver, or the image picker |
| actionSheet | Get directions | 520 ms | The real `ActionSheetIOS`. iOS animates it |
| shareSheet | Share on a listing | 520 ms | The real `Share.share` sheet. iOS animates it |
| alert | Location permission, Delete account | 260 ms | The real alert. iOS animates it |
| reel | Home reel snap and dots | Scroll linked | `snapToInterval={350}`, the current dot grows to 20pt over 180 ms |
| viewer | Photo viewer, from a post or a listing | 360 ms | `transparentModal` plus ZoomIn from 0.92 |
| slide | Slide button | 280 ms to the end or back, the check shows 360 ms | `Gesture.Pan`, `withTiming` past 85%, `withSpring(0)` before, then `runOnJS(onConfirm)` |
| navFill | Nav bar fill on scroll | 220 ms | BlurView opacity from scroll offset |
| parallax | Listing photo | Scroll linked | translateY = scrollY × 0.4 |
| expand | Show more and Show less | 280 ms | `numberOfLines` 3 to none, `LinearTransition` on the wrapper |
| snackbar | In and out | 420 in, 240 out, 2.6 s shown | `FadeInDown.springify().damping(18)`, `FadeOutDown.duration(240)` |
| press | Press feedback | 120 ms, scale 0.97 | Reanimated scale on Pressable |
| like / save | Heart and bookmark pop | 360 / 320 ms | Sequence to 1.28 then spring back |
| select | Chips and interest cards | 180 ms | Style swap or interpolateColor |
| listEnter | List items appear | 360 ms, 40 ms stagger | `FadeInDown.delay(i * 40)` |
| listRemove | Remove from Saved | 300 ms | FadeOut plus LinearTransition |
| skeleton | Loading pulse | 1400 ms loop | Opacity loop |
| breathe | Preparing | 4 s cycle, 2.6 s on screen | Scale loop 0.92 to 1.04 |

Curves: iOS navigation `cubic-bezier(0.32, 0.72, 0, 1)`, small feedback uses a light spring. With Reduce Motion on, drop movement and keep 200 ms fades (`useReducedMotion()` from Reanimated). The Reduce motion switch in the review panel shows this.

| Haptic | expo-haptics | Used for |
| --- | --- | --- |
| Light impact | `impactAsync(Light)` | Like, save, share, remove photo |
| Soft impact | `impactAsync(Soft)` | Preparing start and end |
| Selection | `selectionAsync()` | Chips, interest cards, photo picks, viewer paging, the Dark mode switch |
| Success | `notificationAsync(Success)` | Account created, logged in, location allowed, every success Snackbar |
| Error | `notificationAsync(Error)` | A main button tapped with something missing, I agree before the end of the waiver, passwords don't match, wrong password, couldn't post, place not found |

In the prototype a small tag next to the phone shows each haptic as it fires.

## 9. Review panel

Left, from the top:

- Version and Appearance share one row.
  - Version: V1 or V2 (section 7, V1 and V2). The Jump to list shows only that version's screens, and the line under the title reads iOS prototype · V1 or V2. Switching opens the same Jump to item in the other version, or the first screen of its flow when that version leaves it out. `dist/v1.html` opens on V1, and `#v1` or `#v2` after `index.html` picks one.
  - Appearance: the phone's Light or Dark setting. Once Dark mode is flipped inside the app, a line says so, with Follow phone to hand it back to the phone.
- Background: six swatches from white to beige (#FFFFFF, #FBF9F5, #F8F4EE, #F4F0E8, #EDE7DC, #E3DDD3) that swap the Light canvas and sheets. #F8F4EE is the design. Prototype only, not a token.
- Network and content: one row, folded by default, that shows what is set (Online · Full). Open it for:
  - Network: Online, Slow (loading states for 1.6 s) or Offline.
  - Content: Full, or Empty for a brand new account in a place with nothing listed yet (no listings, nothing saved, no posts, no replies).
  - Form: Empty, Half or Filled sets the fields of the form in the phone (Sign up, Log in, Forgot password, About you, Interests, New post, Edit interests, the reply box). On a screen without fields nothing is picked.
  - Under Network, Content and Form a line says what they change on the screen in the phone, or that nothing changes there and which screens to try.
  - Reduce motion.
- Jump to: takes the rest of the panel's height. Opens any screen or state with fresh sample data. A state that needs Network or Content sets them, and the next plain screen puts them back. What you set yourself stays until you change it or press Restart. The highlighted item follows what the phone shows.
- Restart, next to Jump to: back to Welcome with fresh data and default settings.

Right: the current screen's components, motion and haptics, plus the main tokens in use.

Present, at the top right of the middle column, hides both panels and goes full screen so the phone fills the screen for a client demo. Esc, or Exit at the top right (it shows when the mouse moves), brings the panels back.

## 10. Rebuild the prototype

```
npm install
npm run build     writes dist/index.html (opens on V2) and dist/v1.html (opens on V1)
npm run dev       rebuilds on every change
```

Node 18 or newer. The build inlines React, fonts and images, so `dist/index.html` is one file you can send to anyone.
