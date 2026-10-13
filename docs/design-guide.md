# Indy Holistic Living: Design Guide for AI Agents

Read this before you build any screen, component, icon or visual asset for the Indy Holistic Living (IHL) app. It covers how the product looks, where everything lives, and the rules that keep new work consistent with what exists.

Design lead: Steven Yeo. Credit design work to him.

---

## 1. The product in brief

- IHL is a wellness community app for Indiana: a directory of trusted local people and places, and a community space with topics and groups for conversations about holistic living. Home shows sponsored partners, the weekly check-in and the busiest conversations. Events are out of the MVP, so nothing in the app mentions them.
- iOS app built with React Native. No Android for now.
- Everyone accepts the liability waiver before the account is made, then picks an account type on Which one are you?:
  - **Seeker**: looks for wellness near them. A three question quiz suggests groups and ends on the Seedling badge. Seedling is the free membership, with up to 3 groups. Grove, $89.00 a year or $11.11 a month through the App Store, opens every group, Ask the Experts and member offers. The journey grows from Seedling to Oak through check-ins, replies, posts and visits, with badges along the way. Nothing ranks members against each other. The fourth tab is My Profile.
  - **Practitioner**: runs a practice, farm or shop. They claim their imported listing or add one in a 9 step setup, with up to 10 Specialties that show as tags on the listing. The fourth tab is My Practice, where they finish and edit the listing, send it for review, request a feature on Home and answer Ask the Experts questions. They post and reply in Community as their practice, with the Practitioner badge, and can mark up to 3 posts a week as a Promotion.
- Two versions for IHL to pick from. V1 is the MVP without the seeker round: no quiz, Seedling or Grove, groups, member questions or journey. V2 adds them as described above. Both have the practitioner flows and Specialties.
- Audience: people in the US, mostly older adults. Design for comfort and clarity first.
- US formats everywhere:
  - Money: $89.00 a year and $11.11 a month, Grove's prices from StoreKit, are the only prices in the app. Listings show none: services are names only
  - Time: 10:30 AM, 10:00 AM to 12:00 PM
  - Dates: Sat, Oct 10 in lists, Saturday, October 10 on detail screens, October 10, 2026 in full (timestamps such as 2h and 1d in the feed)
  - Phone: (317) 555-0142. Location: neighborhood and city (Broad Ripple, Indianapolis), street addresses as written in the US
  - Language: US English

## 2. Principles

These come before any visual choice.

1. **Minimal text.** Say it in as few words as possible. Cut helper copy that doesn't change a decision.
2. **Whitespace.** Let space do the grouping. Don't fill empty areas.
3. **One job per screen.** A screen asks for one thing or shows one thing.
4. **Labeled, visible controls.** Icons get a text label wherever space allows. Icon-only buttons are only for back, close, share, search and more.
   Quick confirmations and short failures use a Snackbar: a dark rounded pill with an icon and a few words that goes away on its own, never wider than 370pt. The retry lives in the screen itself (the Post button stays). A Banner is only for a message that needs its own action, and no MVP screen needs one today.
5. **Few filters up front.** On Community, one menu button next to the Search field opens the Topics sheet. While one is on, the button turns Filled and a count line with Clear sits under the search. Directory shows its four categories as Category tiles under the search, and each opens a category page.
6. **Gentle forms.** One or two fields per step, labels above the fields, errors that explain the fix. The main button stays on: tapping it with something missing shows what each field or group needs, and each message goes once it is fixed.
7. **Undo over confirm.** Let the action happen, then offer Undo in a banner. Use a confirm dialog only for things that can't be undone.
8. **State never by color alone.** Pair color with a check, an icon, a weight change or a label.
9. **Glass is a rare accent.** Use it only on the tab bar, on buttons over photos, and on hero moments.

Accessibility floor:

- Touch targets are at least 48pt. Smaller controls (chips, text links, More and Like on a post, the clear button in a search field, the remove button on a photo) reach 48pt with hit slop in code. A text field's label is part of its tap area.
- No text below 13pt.
- Text contrast is at least 4.5:1 and UI boundaries at least 3:1, in both Light and Dark.
- Dynamic Type stays on.

Dark mode: surfaces separate by tone, never by outlines. The canvas is a warm near-black #161411, cards sit on #2B2722 with no edge, quiet surfaces such as skeleton shapes use #36312B. Filled controls (idle chips, the search field, Outline icon buttons, the message box, unselected interest cards) lose their edge in Dark through the `border/color-control` tokens. Lines stay only where they carry meaning: dividers inside grouped cards (#4D4D4C), underline text fields, the dashed add tile, the selected brand border, and the edge on Tag chips (#44673A) and Sheet rows (#666665). Buttons turn light: Primary is #A6C6BA with #1F3B33 text, Secondary is #2D4A42 with #A6C6BA text. Brand green turns to sage #A0B39C with dark text on it, tinted areas use forest/90 #1C3A13, the selected tab pill is forest/80 #314E29 so it sits lighter than the dark glass bar, photos stay as they are, and the Welcome hero turns into a deep forest with a cream glow behind the logo.

Writing rules:

- Use sentence case and short verbs ("Add to calendar"). The tab names My Profile and My Practice are the exception, in Title Case.
- No all caps and no wide letter spacing.
- Never use em dashes or semicolons.

## 3. Where things live

**Figma file: Mockups (Internal)**

| Page | Contents |
|---|---|
| Design System | Colours, Typography, Spacing, Layout, Icons, Illustrations, App icon, Screens · Events (an early exploration, not part of the MVP) |
| Components | 35 documented component groups, each with Base component, Anatomy, Variants, Examples (Light and Dark), Do and don't |
| Mockups V1 | The MVP without the seeker round, for client review: 149 screens and states in two parent sections, Seeker (Sign up and log in, Home, Directory, Community, My Profile) and Practitioner (My Practice), each with a Dark twin to the right. The main path runs left to right, states sit under their screens, arrows carry the action (section 9, Mockups pages). Screens carry no code labels or captions, only their frame names |
| Mockups V2 | The same flows with the seeker round, 199 screens and states: Seeker adds Groups and Grove membership, plus the quiz, This week on Home, I was here, Your journey and Badges |

**Icon library:** the published IHL Iconoir file (Regular and Solid only).

**Prototype code:** this repo. `CLAUDE.md` at the root covers the build and git workflow.

**Written references:**

- `docs/design-system.md`: the decisions log.
- `docs/colour-tokens.md`: every color token with its hex value.
- `HANDOFF.md`: how the prototype maps to the React Native app.

Always reuse what exists. Place instances of the components. Never redraw a button, field or row by hand.

## 4. Tokens

Bind every color, spacing and radius to a variable. Never type a raw hex or a loose number into a screen.

### 4.1 Color (Semantic collection, Light and Dark modes)

Naming is `{role}/color-{name}`, with roles `text`, `bg`, `border` and `icon`. Primitives exist but are hidden. Never apply them directly.

| Token | Light | Dark | Use |
|---|---|---|---|
| bg/color-canvas | #F8F4EE | #161411 | Screen background, a beige white with nothing layered on it. A step darker than cards in Light so white cards stand out |
| bg/color-surface | #EBE5DB | #36312B | Skeleton shapes, disabled fills, quiet areas inside cards |
| bg/color-surface-raised | #FFFFFF | #2B2722 | Cards, fields and chips that sit above the canvas, and the Detail row icon circles |
| bg/color-brand | #1C3A13 | #A0B39C | Selected chips and days, toggles, radios, step progress, page dots, the map pin |
| bg/color-button-primary | #4B7D6E | #A6C6BA | Primary buttons, Filled icon buttons and the Slide button track, a step deeper than the brand Grey Turquoise #558A7A so white text reaches 4.71:1 |
| bg/color-button-secondary | #FFFFFF | #2D4A42 | Secondary buttons: white with a turquoise edge in Light, filled in Dark |
| border/color-button-secondary | #A6C6BA | none | The 1.5pt edge on Secondary buttons, Light only |
| bg/color-brand-subtle | #E9EFE7 | #1C3A13 | Tinted Icon buttons, the Empty state icon circle, selected interest cards, Tag chips. Too close to the canvas for anything that sits straight on it without an edge |
| bg/color-selected | #E9EFE7 | #314E29 | Selected tab pill |
| bg/color-glass | white 55% | #2B2722 at 72% | Glass buttons and tab bar |
| bg/color-overlay | black 40% | black 60% | Behind sheets and alerts, and the scrim at the top of a listing photo (fading to clear by 128pt) |
| bg/color-thumb | #FFFFFF | #FFFFFF | Toggle knob |
| bg/color-toast | #292928 | #4D4D4C | Snackbar and the photo count pill on a listing, dark in both modes |
| bg/color-sheet | #F8F4EE | #2B2722 | Bottom sheets: the canvas beige in Light, lifted off the dimmed screen in Dark |
| bg/color-sheet-raised | #EBE5DB | #36312B | Fields, rows, tiles and the close button on a sheet, one tonal step from it with no edge |
| bg/color-map-land, -road, -park, -water | #EBE5DB, #FFFFFF, #D8DED6, #CDDFEF | #36312B, #554F48, #1C3A13, #1E3244 | The Map box drawing |
| bg/color-viewer | #000000 | #000000 | Full-screen photo viewer |
| bg/color-hero-* | cream, seafoam, gold | forest, teal, muted gold | Welcome background only |
| text/color-primary | #292928 | #F5F5F3 | Titles and body text |
| text/color-secondary | #4D4D4C | #CCCCC9 | Meta lines, labels, helper text |
| text/color-tertiary | #666665 | #B2B2B1 | Placeholders, timestamps |
| text/color-disabled | #999997 | #666665 | Disabled text and icons |
| text/color-brand | #1C3A13 | #C1CBBE | Eyebrows, brand accents |
| text/color-link | #44673A | #A0B39C | Inline actions such as Undo |
| text/color-on-brand | #FCFCF7 | #162212 | Text on bg/color-brand |
| text/color-on-button-primary | #FFFFFF | #1F3B33 | Labels and icons on Primary, the Slide button knob |
| text/color-on-button-secondary | #4B7D6E | #A6C6BA | Labels and icons on Secondary |
| border/color-subtle | #E5E5E3 | #4D4D4C | Dividers, chip edges |
| border/color-default | #CCCCC9 | #666665 | Dashed add and Edit tiles, Step progress after the current step, the sheet grabber, the edge on a Sheet row |
| border/color-brand-subtle | #C1CBBE | #44673A | The edge on Tag chips and a selected Sheet row, soft so they read on the beige without turning loud |
| border/color-glass | white 45% | white 10% | The thin edge on glass surfaces, and the rim along the top of Check your listing |
| border/color-control | #CCCCC9 | none | Edge on Outline icon buttons, unselected interest cards and the message box. Light only |
| border/color-control-subtle | #E5E5E3 | none | Soft edge on idle chips and the search field. Light only |
| border/color-strong | #80807E | #999997 | Field underlines and unchecked controls (3:1) |
| border/color-focus | #3D7BAD | #87B2D6 | Focus rings |
| icon/color-primary | #292928 | #F5F5F3 | Default icons |
| icon/color-secondary | #666665 | #B2B2B1 | Quiet icons, idle tabs |
| icon/color-brand | #1C3A13 | #C1CBBE | Selected and brand icons |

Status colors come in sets: `success`, `warning`, `error` and `info`, each with `bg/color-{tone}`, `bg/color-{tone}-subtle`, `text/color-{tone}` and `icon/color-{tone}`. Accent (brand sage, honey before October 12, 2026) uses `bg/color-accent`, `bg/color-accent-subtle`, `text/color-accent`, `icon/color-accent` and `border/color-accent` (the ring on an earned Medallion). Accent marks what is earned or paid for: badges, stages, Grove, Sponsored and Promotion. The full list is in `docs/colour-tokens.md`.

### 4.2 Typography

- **Manrope** for every word in the app.
- **Mrs Saint Delafield** is a decorative script: one word per screen at most (for example "home" or "Indy"). Never use it for dates, prices or buttons.
- Two weights only: **Medium 500** for reading and **Bold 700** for emphasis. Never use Regular 400, Light or Thin.

| Style | Size / line height | Use |
|---|---|---|
| Heading/H1 | 34/41, tracking -0.4 | Screen hero, one per screen |
| Heading/H2 | 28/34, tracking -0.4 | Screen titles |
| Heading/H3 | 22/28, tracking -0.2 | Detail titles, such as a listing name, and the name on a Sponsored card |
| Heading/H4 | 20/25 | Section headers, featured card titles |
| Heading/H5 | 17/22 | Card and list titles |
| Heading/H6 | 15/20 | Small labels above groups |
| Body/L | 19/28 | Long reading |
| Body/M | 17/26 | Default text |
| Body/S | 15/22 | Meta text: date, time, place, labels |
| Caption | 13/18 | Tab labels, badges, timestamps. The floor |

Each style exists in Medium and Bold, for example `Body/M Medium` and `Body/M Bold`. Always apply the text style. Never set the font by hand.

In code, use `Manrope_500Medium` and `Manrope_700Bold` from `@expo-google-fonts/manrope`.

### 4.3 Spacing

- Nine tokens, named by their value in points: `spacing/4`, `spacing/8`, `spacing/12`, `spacing/16`, `spacing/20`, `spacing/24`, `spacing/40`, `spacing/48`, `spacing/64`.
- They are scoped to gap and padding. Code uses the same numbers: `spacing[16]` is 16.
- Component sizes that are not on the scale (a 56pt button, a 52 by 32 toggle) are set in the component, not as tokens.
- Common choices:
  - 4 and 8 inside components
  - 12 between related items inside a group (search and its filters, a section label and its list)
  - 20 between groups on a tab screen (the reel and Top discussions on Home, the search group and Near you on Directory, search to feed on Community). Wrap each group in its own vertical frame with a 12pt gap and give the Body a 20pt gap, as on Directory
  - 40 between the sections of a listing profile: the intro (eyebrow, name, distance and hours, 16 inside), About, Services, Location and the Detail rows
  - 24 between sections on forms and profiles
  - 40 between sections

### 4.4 Radius

| Token | Use |
|---|---|
| radius/4 | Tiny details |
| radius/8 | Checkboxes, small controls |
| radius/12 | Thumbnails, code boxes |
| radius/16 | Banners, grouped lists, preview cards |
| radius/20 | Cards and photos |
| radius/24 | The bottom curve of a full-bleed hero photo |
| radius/40 | The top corners of bottom sheets and the device corner on mockup frames |
| radius/full | Buttons, chips, fields, tab bar, avatars |

Square corners are plain 0, not a token.

### 4.5 Effects

Use the effect styles:

- `Elevation/Raised`: small lift, such as the toggle knob or the selected segment.
- `Elevation/Card`: every card on the canvas (listing, post, check-in, group, settings and the other cards), plus floating cards. Not on fields, chips, message boxes or add tiles. In Dark it barely shows, so tone still does the work.
- `Elevation/Overlay`: dialogs and sheets.
- `Glass/Liquid`: native glass plus a soft shadow.

## 5. Layout

- **Design at 402 x 874pt** (iPhone 17 and 17 Pro). Check 420 x 912 (Air) and 440 x 956 (17 Pro Max) before handoff.
- **Safe areas:** 62pt at the top (68 on Air) and 34pt at the bottom. Every screen starts with the `Status bar` component and ends with the `Home indicator` component.
- **Horizontal padding is 16pt on every screen.** Content width is 370pt at 402.
- **Build with auto layout.** Containers carry the 16pt padding, bound to `spacing/16`. Elements inside are set to **Fill container**. Never give an inner element a fixed width like 362 or 370.
- **Grid style:** `IHL/iPhone/Layout` has 4 columns, a 16pt margin, a 16pt gutter, a 4pt baseline and the safe areas.
- **Tab bar:** the four main areas (Home, Directory, Community, and My Profile or My Practice) show the floating Tab bar, 16pt from each side, just above the home indicator (y 784 on an 874pt screen). Screens below them hide it. Saved opens from the bookmark at the right of Search on Directory.
- **Bottom actions:** a full-width container with 16pt side padding holds the buttons (each set to Fill), and sits 12pt above the home indicator.
- **Search:** always a visible Search field on the screen. Never a round search button. On the results screen, an Outline back Icon button sits to the left of the field. No Cancel text.

## 6. Components

Place instances from the Components page and set their properties. When a component is missing, build it in the same style, add it to the Components page and document it with the same template.

| Component | Variants | Properties and notes |
|---|---|---|
| Button | Hierarchy: Primary, Secondary, Tertiary, Destructive. Size: Large 56pt, Medium 48pt. State: Default, Disabled | Label, Show leading icon, Leading icon, Show trailing icon, Trailing icon. Primary fills with bg/color-button-primary. Secondary is white with a 1.5pt border/color-button-secondary edge and a turquoise label in Light, filled with no edge in Dark. One Primary per screen. Welcome is the exception: Log in and Register are both Primary, so they carry the same weight |
| Icon button | Style: Outline, Filled, Tinted, Glass. State | Icon. 48pt circle. Filled uses bg/color-button-primary. Outline keeps its edge in Light only, in Dark and on a sheet it is a filled circle. Glass only over photos |
| Chip | Selected: No, Yes. State | Label, Show icon, Icon, Show check. 40pt (48pt hit area in code), 16pt side padding. Idle is a quiet raised pill and Body S Medium, with a soft edge in Light only. Selected fills with bg/color-brand and turns Bold. Show check is off by default, on for multi select |
| Badge | Tone: Success, Warning, Error, Info, Accent, Neutral. Emphasis: Subtle, Solid | Label, Show icon. 28pt. Not tappable. Subtle by default. Sponsored on Home is Accent, Subtle, no icon, 12pt left padding. Practitioner is Success, Subtle, no icon, on posts and replies by a practice. Expert is Success with badge-check, on an Ask the Experts answer. Verified Local Business is Accent with badge-check, on a claimed or approved listing. Promotion and Grove are Accent, Ask the Experts is Info. The Practice card shows Draft (Neutral), In review (Info) or Live (Success) |
| Tab, Tabs | Tab: Selected, State. Tabs: Count 2, 3, 4 | Label. Underline tabs for views of one list |
| Segment, Segmented control | Count 2, 3 | Label. Two or three views switched in place |
| Tab bar item, Tab bar | Tab bar: Account Seeker, Practitioner. Selected Home, Directory, Community, My Profile, My Practice | Label, Icon. Four areas (home-simple, map, community, user-circle, or shop for My Practice on a Practitioner account), label always under the icon. Each item is as wide as its label in Bold plus an equal share of the space left, the way iOS 26 sizes tab bar items, so My Practice sits inside its pill with room to spare. The selected pill is bg/color-selected, 4pt inside the capsule. The capsule uses Apple’s Liquid Glass material from the iOS 27 kit (glass effect, specular top rim, hairline edge, soft shadow) over bg/color-glass |
| Text link | Size: Small, Medium | Label. Body S Bold or Body M Bold in text/color-link, left aligned, no padding, 48pt hit area in code. Forgot password? and Show more / Show less |
| Date sheet | Single component | A bottom sheet with month, day and year wheels, a bg/color-surface band on the middle row and a Done button. Opens from Date of birth. Month and day wrap around like the iOS picker, so December sits above January and 31 above 1. The year does not |
| Location sheet | State: Results, Not found, Location off | A search sheet with a Search field, then Use my current location and the places as Sheet rows, which scroll under the field. Opens from Location |
| Get directions sheet | Single component | Stays in the kit, unused. A listing opens the native iOS action sheet instead: Get directions and the address as its header, then Open in Apple Maps, Open in Google Maps and Cancel. iOS draws it, so it is not a component |
| Category tile | Selected: No, Yes | Label, Icon. One of the four Directory categories, or one subcategory on a category page, two to a row with a 12pt gap, styled like the Listing cards under them: a 72pt bg/color-surface-raised tile, radius/20, Elevation/Card and no edge, a 40pt bg/color-brand-subtle circle with the icon in icon/color-brand (Holistic Business user-love, Food apple-fruit, Shop shop, Services tools) and the label in Body S Medium. Selected is bg/color-selected with a 2pt border/color-brand edge, the circle in bg/color-brand with the icon in icon/color-on-brand and the label Bold |
| Topics sheet, Categories sheet | Single components | Title and close button, then the choices as Sheet rows, one at a time. Topics (Community): All topics (community), Herbs (leaf), Food (apple-fruit), Movement (walking), Mind (brain). Categories (Directory) is no longer used: Directory shows its categories as Chips. |
| Sheet row | Selected: No, Yes | Label, Meta, Show meta, Icon. One row on a sheet, outlined with a 1pt border/color-default edge so it reads as a choice on the beige, with no card and no dividers: a 40pt bg/color-sheet-raised circle with the icon in icon/color-brand, the label in Body M and an optional meta line in Body S. At least 56pt, radius/16, 12pt inside, 16pt between the circle and the text, rows 8pt apart. Selected fills the row with bg/color-selected, turns its edge border/color-brand-subtle and the circle bg/color-brand with the icon in icon/color-on-brand, the label Bold, and adds a check in icon/color-brand. Also Use my current location, the places and Take a photo |
| Page dots | Count: 4, 5. Current: 1 to 5 | 20 by 8 bg/color-brand pill for the card in view, 8pt dots in border/color-strong, 8pt apart. 12pt under the Home reel, centered. Not tappable, no autoplay |
| Map box | Show directions | 200pt, radius/16, fills the content width. Show directions off is the preview under the address on Where people find you: no pill, not a button. Map drawn with bg/color-map-land, -road, -park and -water, a bg/color-brand pin with a bg/color-thumb ring, a Directions pill (surface-raised, maps-arrow-diagonal, Body S Bold link). One button that opens the Get directions action sheet. A real map in the app |
| Navigation bar | Type: Logo, Title, Back, Step | Title, Show title, Show second action. Buttons are nested Icon buttons. Step is the Back bar with Step progress at the top right, on the setup steps and the quiz. Actions live here at the top right, never as a floating button: plus on Community (Filled, the primary action to post). Hide the Action when a screen has none, like Home. The Logo bar is kept in the kit but no MVP screen uses it |
| Text field | State: Default, Error, Disabled. Filled: No, Yes | Label, Placeholder, Value, Helper text, Error text, Show helper, Show trailing icon, Trailing icon. Label above, underline field |
| Field error | Single component | Message. What a group still needs, under it: a 16pt Solid warning-circle in icon/color-error and the message in Body S text/color-error, 4pt apart. The Text field's Error state uses the same line. Choices, tiles, photos and days use Field error. It shows once the main button is tapped with something missing, with the error haptic, and the first one scrolls into view. Each goes as soon as it is fixed |
| Search field | Filled, State | Placeholder, Value. 48pt pill on bg/color-surface-raised, soft edge in Light only. On a sheet: bg/color-sheet-raised with no edge |
| Toggle, Checkbox, Radio | On or Checked or Selected. State | Toggle 52 x 32pt for settings that apply right away, such as Dark mode |
| Sticky bottom bar | Pattern, not a component | When a form or grid runs past the button, the Bottom container gets a bg/color-canvas fill, 12pt top padding and 34pt bottom padding, and sits on the screen edge so content scrolls under it (Interests, About you, Edit profile, the setup steps). Content softens into the bar over its last 16pt, the iOS 26 scroll edge, instead of stopping at a hard line. The nav bar fill does the same at the top. On setup steps 4 to 8 it holds Continue and a Tertiary Finish later |
| Detail row, Thread row | Single components | Detail row: 48pt icon circle in bg/color-surface-raised (white in Light, #292928 in Dark) so it reads on the canvas, brand icon, title in Body M Bold and meta in Body S, with an Icon swap and an optional divider. On a listing: street address over neighborhood and city, days (Tue to Sat) over opening times (10:00 AM to 6:00 PM), phone over Call or text. Thread row: 40pt photo avatar (Photo avatar, initials as fallback), the post in Body S Bold up to two lines, Caption meta (Linda S.  ·  21 replies  ·  1d), 12pt top and bottom padding, divider from the text |
| Setting row | Trailing: Chevron, Toggle, Value, None. State. Tone: Default, Destructive | Label, Value, Icon, Show icon, Show divider. 56pt. On Hours a day with no hours yet shows Add in text/color-link Bold, an override on Value (valueTone="link" in code). Destructive is Delete account: the label in Body M Bold text/color-error, a trash icon in icon/color-error, no trailing (tone="destructive" in code) |
| Post card | Liked: No, Yes | Name, Meta (the time only), Initials, Photo avatar, Text, Likes, Replies, Show photo, Show more, Practitioner, Promotion, Ask the Experts, Topic (an exposed Neutral Badge). Promotion adds the Accent badge to a practitioner's offer, sale or event post. Ask the Experts adds the Info badge to a published question. The Community feed item: who and when, text in Body S up to four lines, optional photo, then Like and Reply with counts and the topic badge at the end of the same row. The time stays with the author and the topic with the content, never on one line. The avatar is a photo (override the Photo layer fill per member), initials show only when Photo avatar is off. Practitioner turns on the badge before the time. More is the 24pt icon on the card padding, with a 48pt hit area in code. It opens the post options, the native iOS action sheet: Report post and Block (the member) on someone else's post, Delete post on your own. Block and Delete ask first with the iOS alert. In a conversation Show more is off, since the nav bar holds More |
| Listing card | Style: Sponsored, Featured, Compact | Name, Category, Distance, Show save, Verified, Save (exposed nested Icon button). Verified puts a badge-check in icon/color-accent after the name of a claimed or approved listing. Sponsored is a paid partner in the Home reel: 338pt wide, a 300pt photo with a Glass save button, the Sponsored badge, Category, the name in H3 Bold and distance with opening hours on one line. Compact fills Directory lists: an 80pt photo on the left and a 48pt save button on the right. Featured (204pt photo) stays in the kit, unused on the MVP screens. Saved state: Solid bookmark in icon/color-brand (Glass) or Style Tinted (Compact). Directory lists hide the save button on Compact cards, Saved shows it filled. A practitioner’s own Sponsored card has Show save off. Cards sit on bg/color-surface-raised with radius/20 |
| Snackbar | Tone: Success, Info, Error | Message. Always dark (bg/color-toast) in both modes, like an iOS toast. radius/full, 24pt Solid icon in the tone color (success/40, info/40, error/40), Body M Bold in white. Floats 16pt above the tab bar or bottom bar, centered. No buttons |
| Reply | Liked: No, Yes | Name, Time, Initials, Photo avatar, Text, Likes, Practitioner (the badge after the name), Expert (Success with badge-check in its place, on an Ask the Experts answer). Sits under the Post card inside the same conversation card. Reply under a reply nests one level, never deeper |
| Reply bar | Filled: No, Yes. Replying to: No, Yes | Text, Replying name. Docked at the bottom of a conversation on bg/color-surface-raised with a border/color-subtle top edge, so writing a reply sits on the same white surface as the post and its replies. A 48pt bg/color-canvas field and the Filled send button, 8pt above and 42pt below. Replying to adds "Replying to Wildroot Herbal Co." and a close button above the field, for a reply to a reply (139pt) |
| Interest tile | Pattern, not a component | A 104pt tall white tile (bg/color-surface-raised, radius/16, 12pt top and bottom padding) with the Interest illustration at 52pt and the label in Body S Medium below. Tiles have a fixed quarter width (83.5pt), start from the left and wrap in rows of four with a 12pt gap, so one interest shows one tile plus Edit and all eight wrap to three rows. Finish on Interests and Save on Edit interests ask for at least one when none is picked, so the row is never empty. On My Profile the last tile is a dashed Edit tile (border/color-default, pencil and "Edit" in brand green) that opens Edit interests. Member profile shows the tiles without the Edit tile |
| Banner | Tone: Success, Warning, Error, Info | Title, Message, Action, Show message, Show action, Show close. The action takes the tone’s text color (Try again in text/color-error). Use a banner only when the message needs an action |
| Step progress | Steps: 3, 9. Current | One 160 by 6pt Progress bar, bg/color-brand up to the current step over border/color-default, then "3 of 9" in Body S Bold 12pt after it. It sits at the top right of the Navigation bar (Type Step), so the title under it has the whole width. The words carry the progress. Practice setup uses Steps 9, the seeker quiz Steps 3. VoiceOver reads "Step 3 of 9" or "Question 1 of 3" |
| Status bar, Home indicator | Single components | Top and bottom of every screen. The Status bar is Apple’s iOS 27 status bar for iPhone 17 Pro (time, Dynamic Island, cellular, Wi-Fi, battery), bound to text/color-primary. Over a listing photo it is set to Dark mode, so its text is light, on a bg/color-overlay scrim |
| Skeleton | Shape: Line, Block, Circle | Resize to match the content it stands in for. bg/color-surface, no stroke |
| Interest card | Selected: No, Yes | Label, Artwork (swap from Illustration / Interest: Herbs, Yoga, Farms, Nutrition, Sound baths, Markets, Gardening, Meditation). 179 by 158pt, two per row with a 12pt gap. Your practice reuses it as four single-choice type cards: Practice (Meditation), Farm (Farms), Food (Nutrition), Shop (Markets). Built and documented by Steven |
| Choice card | Selected: No, Yes | Title, Text, Artwork (Illustration / Role: Seeker or Practitioner). One big single choice with the Radio on the left, before the artwork. The whole card is the button. Selected gets the brand border and bg/color-brand-subtle like the Interest card. Which one are you? only |
| Select tile | Kind: Quiz, Mood. Selected: No, Yes | Label, Icon. One answer in the seeker quiz (checkbox, 24pt icon) or one mood in the check-in (radio, 28pt icon). 179 by 104pt, two to a row with a 12pt gap. Selected gets bg/color-brand-subtle, a 2pt border/color-brand edge, a Bold label and a Solid check-circle. On a sheet the tile has no edge and the idle fill is bg/color-sheet-raised |
| Task row | State: To do, Done, Optional | Label, Value, Show divider. A My Practice checklist row, 56pt: an empty circle and Add in the link color while to do, a Solid check-circle in icon/color-success and what is there once done, Optional for Services and Member offer. The whole row opens its editor |
| Practice card | Single component | Name, Meta, Show photo, Verified. The practice on top of My Practice: 56pt photo (a shop icon tile before any photo), name in Body M Bold with the verified mark once live, kind and area, the status Badge and a chevron. Opens the listing the way seekers see it. The draft's main button sits right under it, above the checklist |
| Stat tile | Single component | Value, Label. One number for this month (Views, Saves, Directions) in H3 Bold over Body S, three in a row with a 12pt gap |
| Feature card | State: None, Requested, Featured | Get featured on Home, once the listing is live: a 48pt sparks circle in bg/color-accent-subtle, then a Secondary Request a feature button (None), an Info badge with the length (Requested) or the end date and a See it on Home link (Featured) |
| Hours sheet | Single component | Opens from a day on Hours: the day as the title, an Open toggle, then Opens and Closes wheels every 30 minutes from 6:00 AM to 10:00 PM, the bg/color-surface band on the middle row and Done. A closing time before the opening time shows the Field error "Pick a closing time after it opens." With Open off only the toggle and Done show. A day with no hours yet opens with Open on at 9:00 AM to 5:00 PM |
| Photo tile | Size: Cover, Small. State: Photo, Add | Listing photos on Photos. Cover Photo is the first photo, 370 by 220 with the Cover pill and a 32pt remove button (44pt target in code). Cover Add is the empty state: one 370 by 300 dashed tile with a 72pt image icon circle, Add photos and one line. Small holds the other photos and the add tile, three to a row at 115pt. Override the Photo fill per photo. Up to 6 |
| Service tag | Single component | Label, Show divider. One service on a listing, a 56pt row with the name in Body M Bold text/color-primary and a border/color-subtle divider under every row but the last. All services sit in one inset grouped card (bg/color-surface-raised, radius/16, 16pt sides, Elevation/Card), like Settings. Not tappable, so no chevron. Names only, no prices |
| Tag chip | Single component | Label. One tag on a listing, under Specialties or Approach: a 40pt bg/color-brand-subtle pill with a 1pt border/color-brand-subtle edge so it reads on the canvas, radius/full, 16pt side padding, "Sleep" in Body S Bold text/color-brand. Chips wrap 8pt apart. A link, never a filter: no check and no selected state. It opens Tag results, every place with that tag. 48pt hit area in code |
| Offer card | Locked: No, Yes | Offer, Details, Show details. A member offer on a listing: a 48pt gift circle in bg/color-brand-subtle, the offer in Body M Bold and how to use it in Body S, on bg/color-surface-raised with radius/20. Not tappable. Locked: a Seedling sees For Grove members and Join Grove, and the whole card opens the paywall |
| Listing actions | Links: Booking, Website, Phone only | The bar at the bottom of a listing, two buttons at most. Booking: Call (Secondary) and Book (Primary), the website moves to a Detail row. Website: Website (Secondary) and Call (Primary). Phone only: Call alone |
| Listing photos | Pattern, not a component | The 300pt photo at the top of a listing. With more than one photo they swipe one at a time and a "1 of 3" pill (bg/color-toast, Body S Bold in white, 12pt sides) sits 16pt from the bottom right corner. A tap opens the Photo viewer on that photo |
| Slide button | Single component | Label. A 64pt bg/color-button-primary track with a 56pt knob 4pt inside it, the knob in text/color-on-button-primary with an arrow in the track color, the label in Body M Bold centered in the space after the knob. Sliding to the end runs the action, so a stray tap can't. The label fades as the knob moves, before 85% it slides back, at the end the arrow turns into a check. The knob nudges right twice when it appears. VoiceOver reads a button named after the action. Only on Check your listing |
| Check your listing | Pattern, not a component | Send for review on My Practice opens it: a page sheet 72pt from the top on bg/color-canvas with a 1pt border/color-glass rim along its top. In the Directory (the Compact card), then Your listing (the photos, every section and the Listing actions) under H5 Bold labels, nothing tappable, then the Slide button "Slide to send for review" pinned 48pt above the screen edge. Close or swipe down to fix something |
| Waiver sheet | Read: No, Yes | The liability waiver everyone accepts before the account is made, after Create account and after the Sign in with Apple sheet. A full width page sheet 72pt from the top with radius/40 top corners that can't be swiped away. I agree before the text is scrolled to the end turns the hint above it into an error, "Scroll to the end to agree", with the error haptic. Once the text scrolls under the title, a border/color-subtle hairline sits under it, like the one above I agree. Closing it makes no account. Privacy has the same text as a page, opening with "You agreed to this when you made your account." |
| Medallion | Size: 40, 48, 56, 64, 80, 96. State: Earned, In progress, Locked, Award | Icon (swaps the Medallion art). The round badge for stages and badges, with Steven's art for each one in the middle 60%. Earned: bg/color-accent-subtle with a border/color-accent ring and the art in full color. In progress and Locked: bg/color-surface with a border/color-default ring and the art grey (desaturated, lightened 30% and at 80%), so a badge never looks earned before it is. Locked adds a lock. Award adds the breathing halo for the moment it is earned. The name and status always sit next to it in words |
| Progress bar | Value: 0 to 100 | A 6pt bar toward a badge or the next stage, bg/color-brand over border/color-default. Pick the closest Value. The words next to it carry the count ("6 of 10 places") |
| Badge item, Badge row | Single components | Badge row: up to four Badge items (a 48pt Medallion over the name in Caption) in one card. My Profile shows earned badges first, then the closest in progress, and opens Badges. A member profile shows earned ones only |
| Journey card | Single component | Stage, Meta, Next, Progress. On My Profile: the stage Medallion at 56pt, the stage in H5 Bold over "Stage 2 of 6", a chevron, then the next stage with a Progress bar and what is left in words. Opens Your journey |
| Stage row | State: Done, Current, Locked. Last: No, Yes | Stage, Steps. The six stages on Your journey in one card: a 48pt Medallion, a 2pt line to the next stage (border/color-accent once passed), the name in Body M Bold and its steps in Body S. Done has a Solid check-circle, Current the You're here badge, Locked a lock |
| Badge tile, Badge sheet | Tile State: Earned, In progress. Sheet State: Earned, In progress, Award | Badges shows tiles two to a row: a 64pt Medallion, the name, then "Earned Sep 28" in Caption Bold text/color-accent or a Progress bar. A tile opens the Badge sheet: a 96pt Medallion, when it was earned (or New badge, New stage), the title in H2 Bold, how to earn it, the count for one in progress, and Done. Award gets the halo and a success haptic |
| Week dot, Streak card | Week dot: State Missed, Checked in, Open, This week. Streak card: Checked in No, Yes | The weekly check-in on Home. Once a week is enough, there is no daily streak. The last six weeks as dots over the Sunday each starts on, then Check in (Secondary, Medium) or "You checked in this week" |
| Check-in sheet | Mood: None, Good | How was your week? with a close button, "Only you see this.", four moods as Select tiles (Kind Mood) and Check in. With no mood picked, Check in shows "Pick how your week was." |
| Group art | Group: the eight groups | A group's cover art at 56pt. Ask the Experts uses chat-bubble-question on bg/color-info-subtle. Scale it to 28 for the Group label, 40 for Posting in, 120 on the group page |
| Group tile, Group card, Group header | Tile Type: Group, Find groups. Card Joined: No, Yes. Header Joined: Yes, No | Tile: Your groups on Community, 136 by 152pt in a row that scrolls sideways, two tiles and most of a third in view, new posts in Caption Bold text/color-brand, Find groups closes the row as a dashed tile. Card: a row on Groups with Join (Secondary, Medium) or a chevron. Header: the top of a group page with the art at 120pt, the name in H2 Bold, members and new posts, what it is about, then Joined (Secondary with a check, opens Leave) or Join group (Primary) |
| Group label, Posting in | Group label: Link No, Yes | Group label sits above a group post in its conversation, a link back to the group when opened from elsewhere. Posting in replaces the Topic chips on New post from a group, since group posts carry no topic |
| Limit card, Join groups card | Single components | Limit card: a Seedling's "2 of 3 free groups" on top of Groups, with Join Grove. Join groups card: Community before any group is joined, opens Groups |
| Ask card, Question card | Ask card: Locked No, Yes. Question card: Status In review, Published, Needs changes | Ask card: Ask a local expert and Ask a question on Ask the Experts. Locked shows a Seedling the Grove badge and opens the paywall. Question card: one of your questions. IHL reads each first: In review says what happens next, Published shows the answer count and opens the conversation, Needs changes shows IHL's note on bg/color-warning-subtle and Edit question. The status is a badge with an icon, never color alone |
| Perk row, Perk list | Single components | What Grove adds, on Join Grove and Membership: an icon on a 40pt bg/color-brand-subtle circle, the perk in Body M Bold and one line. The perk the person came for leads the list |
| Plan card | Selected: Yes, No | Plan, Note, Price, Per, Show save. A radio card on Join Grove: the plan with Save 33% (Accent badge) and its monthly price, then the price in H5 Bold over "a year". Prices come from the App Store |
| Membership card | Tier: Grove, Seedling | On My Profile. Grove: tree on bg/color-accent-subtle, the renewal date, opens Membership. Seedling: soil-alt on bg/color-surface, what it includes and Join Grove (Secondary, Medium) |
| iOS share sheet, iOS action sheet, iOS alert, App Store sheet | System UI, not components | Share on a listing or a post opens the iOS share sheet. Get directions and More on a post open the iOS action sheet. Delete account, Leave a group, Block and Delete post ask first with the iOS alert. Join on Join Grove opens the App Store subscription sheet. Mockups draw them for review, iOS and StoreKit draw them in the app |
| Empty state | Tone: Neutral, Error | Title, Message, Show message, Show action, Icon, Show icon, Show illustration, Illustration. 112pt icon circle or a 180pt Connection illustration, H3 title, one line, one Secondary button |

Text properties share one default value across all variants of a set. To change what an instance says, override it on the instance.

**Lists are cards.** Every card carries Elevation/Card. Listings, posts and replies never use hairline dividers. Compact Listing cards sit in a vertical auto layout with a 12pt gap (spacing/12), Post cards with a 20pt gap. Detail rows use a 16pt gap, replies a 20pt gap. Settings use inset grouped cards: rows inside a `bg/color-surface-raised` container with `radius/16` and 16pt side padding, with the Setting row divider on every row but the last.

**States.** Every list screen has three extra states, built from the components above:

- Loading: Skeleton shapes in the same layout as the content (a 338 by 460 card with a 300pt block for a Sponsored card, an 80pt block plus two lines for a row, a 40pt circle plus two lines for a Thread row).
- Empty: an Empty state with a title that says what is missing and one action. Warm moments use an illustration: Illustration / Empty state No results on No listings and No results (Community search), Offline on Offline, Error on Couldn’t load (Community), Saved on Nothing saved, Illustration / Connection Circle on No posts yet, and Path on No places near you yet and Nothing here yet (Home). Field errors and banners keep their icons.
- Illustrations: the `Illustration / Connection` set on the Design System page (Path, Care, Circle), drawn by Steven Yeo. Illustration / Role (Seeker, Practitioner) is the art on Which one are you?, and Group art and Medallion art belong to their components. Supporting artwork only, never the sole indicator of state, copy stays outside the artwork. They are fixed colors, so check them on dark: the cream parts carry the shape.
- Error: the Error tone of Empty state with wifi-off, "Can't connect" and a Try again button.
- On the Mockups pages each state sits directly under the screen it belongs to, joined by a dashed arrow with its label (While loading, No match, Couldn't load, Place not found). A second state under the same screen goes one row further down.
- Quick confirmations (Profile saved, Saved to your list, Reply posted) are a Snackbar 16pt above the tab bar or the bottom bar, never a banner.

## 7. Icons

- **Set:** Iconoir, rounded, 24pt grid, 1.5 stroke. MIT licensed.
- **Weights:**
  - **Regular** by default.
  - **Solid** only to show a state, such as a saved listing, a completed step or a status message.
  - Home, group, search and user-circle have no Solid. For those, the selected tab uses the tinted pill and a bold label.
- **Sizes:** 20 inline with Body S, 24 as the default, 28 in the tab bar, 48 in feature circles.
- **Color:** glyphs are black in the library. In mockups, every icon sits in a slot:
  - A frame named `Icon`.
  - Inside it, a group named `Mask` with the glyph instance, set as a mask.
  - A `Color` rectangle above the group, bound to an icon token.
  - This keeps the color when the icon is swapped and lets it flip with Light and Dark.
- **In code:** `iconoir-react-native`. Import from `iconoir-react-native/regular` and `iconoir-react-native/solid`, and pass `color` from the theme.
- **Apple logo:** Apple’s own logo artwork from Apple Design Resources, the `apple` component in the System doc. Never draw an apple.
- **Continue with Apple:** the Sign in with Apple button component. Apple’s colors and logo (black in Light, white in Dark, never brand colors) with our Button Large shape and Body M Bold title so it lines up with Log in and Register.
- **Credit:** keep both MIT notices in the app's acknowledgements: Iconoir icons (Luca Burgio) and iconoir-react-native (Daniel Martin, Pascal Jufer).

## 8. Imagery and backgrounds

- **Photos:**
  - Use real, warm, natural-light photos of the places, hosts and activities.
  - Never put text or logos on top of a photo.
  - Buttons over photos use the Glass icon button.
  - Photo radius is 20 on cards and 12 on thumbnails.
- **Canvas:** screens sit on plain `bg/color-canvas`, beige white in Light and warm near-black in Dark, with no wash, glow or tint on top, so the beige reads true. Only Welcome (its hero) and the photo viewer (black) differ.
- **Raised surfaces for clarity:** Search field, idle chips and Outline icon buttons sit on `bg/color-surface-raised`, so they stand out from the canvas. In Light they add a soft edge, in Dark the fill does the work.
- **Welcome hero** (Welcome screen only):
  - The screen fill is `bg/color-hero-base` (warm cream in Light, deep forest in Dark).
  - Five blurred ellipses in a frame named `Gradient`, each bound to a hero token so the mood flips with the mode: `bg/color-hero-seafoam` (seafoam, teal in Dark), `bg/color-hero-gold` (morning gold), `bg/color-hero-cream` (a soft cream glow behind the logo, cream in both modes so the wordmark reads on dark), `bg/color-hero-sage` and `bg/color-hero-teal`. Layer blur 100 to 140, opacities 0.55 to 0.9.
  - The logo sits directly on the glow, no card. Never reuse the hero behind lists or forms.
- **Hero photos** on a listing profile run full bleed, 300pt tall, with the bottom corners bound to `radius/24`.
- **Logo:** the IHL wordmark with leaves, on the Welcome screen only. Tab screens use a Title bar instead.
- **App icon:** the Indiana outline and turquoise heart from the Live Love Local mark, with no words, on sand/10. Light, Dark (transparent) and Tinted (grayscale) are the App icon component on the Foundation page and 1024 PNGs in `assets/app-icon`. The full lockup is kept as an option, its words are too small under 60pt.

## 9. Screen recipes

- **Sign up and log in:** Welcome's sheet has the headline with 24pt at its sides, so it breaks as Holistic living, close / to home, then 16pt down to Log in and Register side by side, both Primary with no icons, and Continue with Apple under them, 16pt between all three. 40pt under the buttons over the home indicator area. The logo stays centered on the hero. No legal line on Welcome. Register opens Sign up, one page: Email, Password and Confirm password (masked, eye toggle) with a three-line rules checklist in Body S (At least 8 characters, One capital letter, One number, check-circle icons in icon/color-success as each is met). Centered above Create account sits "By creating an account, you agree to the Terms of Use and Privacy Policy." in Body S secondary, the two names as links in Body S Bold text/color-link. Each opens a full page with a Back bar and its title, empty until IHL sends the text. Create account opens the Waiver sheet (Before you join): a page sheet 72pt from the top that can't be swiped away, the waiver in plain language, and I agree, which asks to scroll to the end first. I agree at the end makes the account and opens Which one are you? A new member through Continue with Apple gets the same waiver after the Apple sheet. Log in is Email, Password, a Forgot password? link and Log in, which lands on Home. Forgot password asks for the email and Send link, confirmed by the Reset link sent Snackbar. Every form opens empty: fields show their placeholder. The button stays on, and tapping it with something missing shows what each field needs. States: Sign up, empty, Sign up, errors, Log in, empty, Passwords don’t match, Wrong password ("Email or password doesn’t match."), Terms of Use, Privacy Policy, Read to the end. No email code step.
- **Which one are you?:** two Choice cards, Seeker ("I’m looking for wellness near me") and Holistic Business ("I run a practice, farm or shop", the Practitioner account), each with its Role illustration, and Continue. With nothing picked, Continue shows "Pick one to continue." (Nothing picked, error). Seeker goes on to About you and the quiz, Practitioner to Find your business. Asked once, right after the waiver.
- **Claim a listing:** Find your business comes first for a practitioner ("It may already be in the Directory. Search by its name or street."): a Search field over the imported listings, Compact listing cards for the matches, and My business isn't listed (Secondary) in the bottom bar. No match shows "No match for “Lotus”" with "Check the spelling, or add it as a new listing." A listing opens Is this your business?: the card, the email on record shown masked (d•••@quietmindmassage.com), Email me the link (Primary) and I can't use that email (Tertiary). Check your email (mail-open, "Open it on this iPhone within 24 hours") has Open Mail and Send it again. The link opens the app on Setting up your practice and the listing is theirs, live and verified. A listing someone already manages, or I can't use that email, goes to Ask us to check: a role (Owner, Manager, Staff), a phone and Send. My Practice then shows the claim In review ("We’re checking that it’s yours. We’ll email you within 2 business days.").
- **Practice setup:** My business isn't listed starts a 9 step stepper, one part of the listing per step. Every step has a Back bar with Step progress at its top right ("3 of 9"), the title in H2 Bold with one line in Body M secondary, the fields, and a canvas bottom bar. Fields open empty with placeholders that say what to write. Continue stays on, and with something missing it shows what the step still needs (Your practice, errors).
  1. Your practice ("How seekers find you in the Directory."): Practice name, then Type as four Interest cards (Practice, Farm, Food, Shop), which set the Directory category.
  2. Specialties ("They show as tags on your listing and help people find you."): Chips with a check under two Body S Bold labels. What you offer comes from the type (Acupuncture to Yoga for a practice, CSA to U-pick for a farm, Bakery to Restaurant for food, Apothecary to Teas for a shop), Focus areas are the same for every type (Back pain to Stress). Up to 10, at least one from What you offer. A line in Body S Bold text/color-brand under the hint counts them: "5 of 10 picked. Massage shows on your card.", since the first pick from What you offer is the kind on cards. An 11th pick shows "You can pick up to 10". The lists are a draft of IHL's tag taxonomy.
  3. Where people find you ("Seekers use it to get directions."): Street address and City from the Location sheet. Once both are in, a Map box preview with Show directions off shows the place.
  4. Add photos ("Show your space and your work. The first one is your cover."): empty, one big dashed Add photos tile. With photos, the cover tile, a row of small tiles with a dashed add tile, and "3 of 6 photos". Up to 6.
  5. About your practice ("Seekers read this first on your listing."): a 320pt message box with the placeholder "What you offer, who it helps and what a first visit is like."
  6. Your hours ("Tap a day to set when you’re open."): the seven days as Setting rows. A day with no hours reads Add in text/color-link Bold, a set day reads Closed or 11:00 AM to 8:00 PM. A day opens the Hours sheet. Continue needs one open day, days left unset count as Closed.
  7. How people reach you ("Seekers call, visit your site or book from your listing."): Phone, Website (optional) and Booking link (optional). Once there is a phone, On your listing shows the Detail rows seekers will see.
  8. Services ("Optional. Names only, the app shows no prices."): Add a service with the placeholder "Like a 60 minute massage" and a Filled plus, then the list.
  9. Member offer ("Optional. A thank you for people who find you here."): the offer ("Like 10% off your first visit") and how to use it ("Like mentioning the app when you book"), then the Offer card as it shows on the listing. The button reads Finish.
  From step 4 to 8 a Tertiary Finish later sits under Continue. Finish and Finish later both run Setting up your practice, the Preparing rings for about two seconds, then My Practice.
- **Onboarding:** About you (Full name, Date of birth with a calendar icon, Location (optional), a picker field that opens the Location sheet, and Gender as single-select chips: Woman, Man, Non-binary, Prefer not to say). Use my current location on the sheet shows the iOS location permission alert (title, our purpose line "We use it to show practitioners and places near you.", the map with Precise: On, then Allow Once, Allow While Using App, Don’t Allow). The alert is system UI, the only copy we own is the purpose line (NSLocationWhenInUseUsageDescription), then a three question quiz, each with Step progress ("1 of 3") at the top right and Continue, which asks for a pick when nothing is picked: What can we help with? ("Pick any. Only you see your answers.", eight Select tiles: Better sleep, Less stress, Easier digestion, Joint comfort, More energy, Healthy aging, Eating local, Meeting people), What are you into? (the Interest cards in two columns, the brand border and a check when picked, scrolling under a canvas bottom bar) and Who do you care for? ("We’ll suggest groups for you.", Myself, My partner, Kids or grandkids, An aging parent, and the button reads Finish). Finish opens You're a Seedling: the Seedling Medallion with its breathing halo, "Your first badge", one line and the six stages ahead. Continue runs Preparing: a breathing-rings moment ("Preparing your space", "Take a slow breath", concentric `bg/color-brand` rings with a `bg/color-accent` core) that runs about two seconds with a soft haptic and lands on Home. No notification prompt in the MVP. In V1 What are you into? comes right after About you, with no question count, and its button reads Finish, which runs Preparing.
- **Home:** Title bar "Home" with no action, then a Search field ("Search people, places and posts"). Typing swaps the reel and discussions for results: Places as Compact listing cards with no save button, then Posts as Thread rows in an inset card, each under an H5 Bold label. A result opens inside Home. No match shows No results for “Reiki” (No results illustration, "Try another word.", Clear search). Offline hides the search. A Sponsored reel of paid partners: Sponsored listing cards in a row that snaps one card at a time, the next card peeking 36pt from the right edge, Page dots 12pt under it. No autoplay. The reel takes about three quarters of the screen. For a member, This week follows the reel: the Streak card (the last six weeks as Week dots, then Check in). Check in opens the Check-in sheet (How was your week?, four moods, Check in), confirmed by "Checked in for this week", or the Badge sheet when it earns Steady. Then "Top discussions" (H5 Bold) with a See all Text link that opens Community, and the three conversations with the most replies as Thread rows in an inset card. A card opens its listing, its bookmark saves it ("Saved to your list"), a discussion opens the conversation inside Home. States: loading (a reel card skeleton with the next one peeking, a label line and three row skeletons), Offline, Nothing here yet (Path illustration, "Partners and conversations near you will show up here.", Start a conversation), Search results, No results. This is the first screen after sign in.
- **Directory:** no title bar. A Search field ("Search people and places") with an Outline bookmark Icon button at its right (opens Saved) starts 12pt under the status bar, which fills with the canvas once content scrolls under it. Then four Category tiles, two to a row (Holistic Business, Food, Shop, Services), the City picker (the city in H5 Bold with a nav-arrow-down, 48pt tall) and Compact listing cards. The City picker opens Show places in, a short sheet only as tall as its content, of small Chips (Caption labels, no icons) that wrap 8pt apart, Near me first, then Indiana's 10 largest cities: Indianapolis, Fort Wayne, Evansville, South Bend, Carmel, Fishers, Bloomington, Hammond, Gary and Lafayette. It opens on the profile city, which joins the list when it is not one of the 10, or on Near me without one. Near me lists the closest places first. The Radius pill sits at the right of the City picker row: a 40pt pill on the idle Chip fill reading "Any distance" in Caption Bold with a nav-arrow-down, which fills with bg/color-brand and reads "Within 10 mi" once one is picked. It opens How far, a short sheet like Show places in, of small Chips (Any distance, 5, 10, 25 and 50 mi). Nothing in range shows Nothing within 5 mi with Show any distance. A Category tile pushes its category page in the same layout: an Outline back Icon button left of the Search field ("Search Holistic Business"), the category's 4 to 6 subcategories as Category tiles with their own icons (a draft list, `SUBCATEGORIES` in data.js), the City picker, which starts on Directory's city, and the places. A subcategory tile pushes its subcategory page in the same layout with no tiles: the back button and Search ("Search Massage"), the City picker, a 280pt map (content width, radius/16, one bg/color-brand pin per place in the list, a pin opens its listing) and the places. No match shows No listings for “Reiki” with Clear search, an empty city No places in Fort Wayne yet with Show places near me, an empty subcategory Nothing in Restaurants in Indianapolis yet with Show places near me. Search matches names, kinds, areas, subcategories and specialties, with or without the #.
- **Listing profile:** full-bleed photo (bottom corners `radius/24`) with Glass back, share and save buttons, under a scrim (bg/color-overlay fading out by 128pt) and a light status bar in both modes, so the time and battery read on any photo. More than one photo swipes one at a time with a "1 of 3" pill 16pt from the bottom right corner, and a tap opens the Photo viewer. Then the category eyebrow, name in H3 Bold, distance and hours, the Verified Local Business badge, then I was here (Secondary, Medium), which marks a visit once per place ("Visit saved", or the Badge sheet when it earns a stage or badge) and turns into "You’ve been here". A Member offer card follows when the listing has one (Locked for a Seedling, opens Join Grove). Then About, Specialties, Approach, Services and Location, each under an H6 Bold title in text/color-secondary. Specialties holds what the place offers as Tag chips in the deeper sage (bg/color-accent with text/color-on-accent and a border/color-accent edge), Approach its focus areas in the light green, both wrapping 8pt apart, and each one opens Tag results. Services lists every service in one inset card, a Service tag row each (names only, no prices). Location holds a 200pt Map box, then the street in Body M Bold over the area and city in Body S. Then the Detail rows for hours and phone, and the Listing actions bar: Call and Book when there is a booking link (the website moves to a Detail row), Website and Call when there is not, or Call alone. The Map box and the address open Get directions, the native iOS action sheet: Get directions and the address as its header, then Open in Apple Maps, Open in Google Maps and Cancel. Picking one opens that app with directions. The sections sit 40pt apart. About shows three lines with an ellipsis, then a Show more link (Body S Bold, text/color-link, 8pt below) that opens the full text and turns into Show less. The link only shows when the text runs past three lines. Once the photo scrolls away, the nav bar fills with the canvas color and shows the listing name next to the back button. Saving shows the "Saved to your list" Snackbar. Share opens the iOS share sheet with the listing name, its address and a link to the listing. On the Mockups pages Show more sits under Listing saved with the full About in view, Specialties under it, Get directions under that scrolled to Location, and Share closes the column. Tag results sits to the left of Specialties.
- **Tag results:** a pushed screen from a Tag chip: Back bar titled with the tag (Sleep), "3 places" in Body S secondary, then Compact listing cards with no save button, 12pt apart. States: loading (three row skeletons), Offline and No places with Sleep yet (Path illustration).
- **Saved:** a pushed screen (Back bar, title "Saved", no tab bar) listing saved places as Compact listing cards, each with a filled bookmark (Tinted, Solid). Tapping it unsaves: the card leaves the list and the Success Snackbar "Removed from Saved" appears above the home indicator. When the last one goes, Nothing saved shows (Saved illustration, "Nothing saved yet", Browse places).
- **Member profile:** tapping a name or avatar on a post opens a pushed screen: Back bar, 96pt photo avatar with the name in H3 Bold and "Broad Ripple  ·  Member since 2025", an Interests label with interest tiles, then Posts with that member’s Post cards. No messaging or follow in the MVP.
- **Community:** "Community" title bar, a Search field ("Search conversations") with an Outline menu button at its right, Your groups as Group tiles in a row that scrolls sideways (See all and the last Find groups tile open Groups, a Join groups card before any group is joined), then Latest posts as a feed of Post cards with a 20pt gap. The menu button opens the Topics sheet (All topics, Herbs, Food, Movement, Mind, one at a time). While a topic is on, the button is Filled and a line under the search reads "2 posts in Food" with a Clear link. A search shows "2 posts". No match shows No posts for “Reiki” with Clear search. Feed states: Feed loading, No posts yet, Couldn’t load (Error illustration, Try again). New post is a Filled (primary) Icon button with a plus at the right of the Title navigation bar, the iOS way. No floating action button anywhere in the app. A conversation puts the Post card and its replies in one bg/color-surface-raised card with radius/20: the reply count under a border/color-subtle divider, then Reply components and See more, which loads the next 5 replies. The Reply bar is docked above the home indicator on the same white surface. Its nav bar holds Share (the iOS share sheet) and More. More on a post, in the feed, on a group or a member profile, or in the nav bar of its conversation, opens the post options: Report post ("Thanks. IHL will review this post.") and Block Karen B. ("You won’t see their posts or replies. They won’t be told.", then "Karen B. blocked"), or Delete post on your own ("Delete this post?"). App Review asks for both Report and Block in an app where members post (Guideline 1.2). On the Mockups pages Post options and Block Karen B. sit under Member, no posts.
- **Posting a post:** New post is a full page: Back bar, topic chips, one message box (a 220pt `bg/color-surface-raised` box with `radius/16` and a 1pt `border/color-control` edge, Body M inside), a photo row of 82pt thumbnails with a dark remove pill and a dashed add tile, a "3 of 5 photos" caption, and the Post button at the bottom. Up to 5 photos. Then the Choose photos sheet (multi select with numbered badges, "Add 3 photos"), New post with photos, Posting (the Post button disabled with "Posting…"), Posted (the new post with a "1 of 3" pill on the photo and the "Your post is live" Snackbar above the reply bar). Couldn't post keeps the text and photos on the compose page and shows the Error Snackbar "Couldn’t post. Try again." 16pt above the Post button, so the person just taps Post again.
- **Photo viewer:** tapping a photo on a post opens a full-screen viewer on `bg/color-viewer` with the frame set to Dark: Glass close and share buttons, a "1 of 3" counter, the photo centered, page dots at the bottom. Pinch to zoom, swipe between photos, tap X to close.
- **Groups:** a pushed screen with a Back bar titled Groups. Your groups, Suggested for you (up to 3 from the quiz, the Welcome Circle first for a new member) and More groups, each a list of Group cards. A Seedling sees the Limit card on top ("2 of 3 free groups", Join Grove), and Join on a fourth group opens Join Grove. A group page has the Group header (Join group, or Joined which asks "Leave Book Club?" with the iOS alert), then its posts, or No posts yet. A joined group adds the Filled plus to the nav bar, which opens New post with Posting in instead of the topics: group posts stay on the group page and carry no topic. Join confirms with "You joined Book Club".
- **Ask the Experts:** a group where members ask and verified practitioners answer. Under the header, the Ask card (Ask a local expert, "IHL reads every question before it’s published.", Ask a question). Ask a question is a full page: topic Chips, the question in a message box, two reminders (leave out names, medicines and health records, and answers are general information, not medical advice) and Send for review. "Sent for review" confirms, and Your questions lists Question cards: In review, Published (opens the conversation, where the answer carries the Expert badge) or Needs changes (IHL's note and Edit question, which reopens the page with the note on top and Send again). A Seedling sees the Ask card Locked, and Ask a question opens Join Grove.
- **Join Grove:** a full screen modal with a close button: the Grove Medallion, "Grow with Grove", one line that says why it opened (from a fourth group, Ask the Experts or a member offer, that perk leads the Perk list), then two Plan cards, Yearly ($89.00, $7.42 a month, Save 33%) picked first and Monthly ($11.11, Cancel anytime), so both prices sit in view with the Join button. What you get follows as the Perk list. The button carries the price ("Join for $89.00 a year"). Under the perks: "Charged to your Apple Account. Renews every year at $89.00 until you cancel. Cancel anytime in Settings, at least a day before it renews.", Restore purchases, Terms of Use and Privacy Policy, as App Review Guideline 3.1.2 asks. Join opens the App Store sheet, Subscribe opens Welcome to Grove (Start exploring goes back where they were).
- **Membership:** from the Grove Membership card on My Profile: the Grove Medallion, the plan and "Renews October 4, 2027", What you get as the Perk list, then Manage subscription (Secondary), which opens the App Store's subscriptions.
- **Your journey and Badges:** Your journey opens from the Journey card: the stage Medallion at 96pt, "Stage 2 of 6", Next: Root with what is left, then All stages as Stage rows. Badges opens from the Badge row: "2 of 6 earned" and Badge tiles two to a row. A tile opens the Badge sheet. Earning a stage or a badge opens the Badge sheet in its Award state with a success haptic.
- **My Profile:** Title bar "My Profile" with the tab bar (fourth tab), a profile card (56pt photo, name, email, chevron) that opens Edit profile, the Membership card (Grove opens Membership, Seedling shows Join Grove), Your journey (the Journey card), Badges (the Badge row with See all), My interests (label, then a row of interest tiles ending with a dashed Edit tile), Preferences (Dark mode, a Toggle that follows the phone until it is flipped) and Account (Location showing the neighborhood, Privacy) as inset grouped cards, then Sign out. Every group is a label with an 8pt gap to its card, groups sit 20pt apart. No "Edit" text links: a whole card with a chevron is the tap target, the iOS Settings way. Edit profile is a pushed form with a 96pt photo avatar and Change photo, Full name, Short bio (optional, V2, grows to 4 lines as you type), Date of birth, Email, Location (optional) and Gender chips under a sticky Save bar. An unknown place shows "We couldn’t find that place. Try a city or street." Edit interests reuses the Interests grid with a Back bar titled My interests and Save. The flow shows it with three picked, then with only Herbs picked, then the saved result on My Profile. Saving returns here with the "Profile saved" Snackbar above the tab bar. No Text size or Notifications settings in the MVP.
- **Privacy:** a pushed screen with a Back bar titled Privacy and no tab bar. Policies (Privacy Policy, Terms of Use and Liability waiver, each opens its page. The waiver page opens with "You agreed to this when you made your account."), Permissions (Location, While using, opens the app in iOS Settings), then Delete account alone in its own card. Delete account asks first with the iOS alert "Delete your account?" (Cancel, Delete in red). Delete removes the account, as App Store rule 5.1.1(v) asks, signs out to Welcome and shows the "Your account was deleted" Snackbar. A practitioner’s alert says their listing goes too. No Help page in the MVP.
- **My Practice:** the fourth tab for a Practitioner, Title bar "My Practice". The Practice card sits on top in every state.
  - Draft: the Primary button right under the Practice card, so it shows without scrolling: Continue setup while parts are missing (it opens the stepper at the first missing step), then Send for review with "We check every listing before it goes live." Send for review opens Check your listing (section 6), and sliding its Slide button to the end sends the listing Under it "Finish your listing" with "4 of 7 done" and nine Task rows (Name and type, Specialties, Address, Photos, About, Hours, Phone and links, then Services and Member offer as Optional).
  - In review: the Info badge, "We’ll email you once it’s live, within 2 business days." and the "Sent for review" Snackbar. Your listing stays editable as Setting rows. A claim in review shows its own line and no listing rows.
  - Live: the verified mark on the Practice card, Questions for you (Ask the Experts questions that match the practice's specialties as Thread rows, "2 waiting", and "IHL approves every question. Your answers show the Expert badge."), This month (Views, Saves, Directions as Stat tiles), the Feature card, then Your listing.
  - Account (Dark mode, Privacy) and Sign out close every state, like My Profile.
- **Listing editors:** a Task row or a Your listing row opens the same screen as its step, as an editor: a Back bar named after the row, the step’s line in Body M secondary, the fields, and Save once something changes. Save returns to My Practice with a Snackbar ("About saved").
- **Get featured:** Request a feature opens a pushed screen with the Sponsored card as seekers would see it, How long chips (1 month, 3 months, 6 months), "We’ll email you within 2 business days to set it up." and Send request. My Practice then shows the Feature card as Requested with the "Request sent" Snackbar. Once the IHL team sets it up, the card reads Featured on Home with the end date and See it on Home, and the practice leads the Home reel, labeled Sponsored, with no save button for its owner. No prices or payment in the app.
- **Practitioners in Community:** New post shows "Posting as" (40pt avatar, the practice name and the Practitioner badge) above Topic, and a Promotion toggle ("Offers, sales and events. 2 of 3 left this week."). With the Promotion row the Message box is 176pt, not 220, so its line stays clear of Post. A promotion carries the Promotion badge. One a day and 3 in any 7 days: at the limit the toggle is off and says when the next one opens ("You’ve shared 3 this week. Next one on Wed, Oct 7."). Their posts and replies carry the Practitioner badge, answers in Ask the Experts the Expert badge, everything else works as for a Seeker.
- **Main area** (Home, Directory, Community, and My Profile or My Practice), from top to bottom:
  - Status bar.
  - Navigation bar (Title type, with an action at the right when the screen has one).
  - Body: vertical auto layout with 16pt side padding and a 20pt gap between groups, 12pt inside each group. Children set to Fill.
  - Tab bar.
  - Home indicator.
- **Detail screen:**
  - Navigation bar (Back), or Glass icon buttons over a full-bleed photo.
  - Body.
  - Bottom container with one Primary action.
- **Form step:**
  - Navigation bar (Step type: Back, with Step progress at the top right).
  - H2 Bold question.
  - One or two Text fields.
  - Bottom Primary button, always on. Tapped with something missing, it shows a Field error or the Text field's Error state for each part, with the error haptic, and scrolls to the first.
- **Confirmation:**
  - A 112pt tinted circle with a 48pt Solid icon.
  - H2 Bold title and one line of Body M.
  - Secondary and Tertiary follow-up actions.
- **Sheet:**
  - Full width and attached to the bottom, three quarters of the screen: 656pt tall on the 874pt screen, `bg/color-sheet` (the canvas beige in Light), `radius/40` top corners, Elevation/Overlay over bg/color-overlay.
  - 12pt top with the grabber, then the title in H3 Bold with a close button, 16pt sides and 16pt between parts, content set to Fill.
  - The action is pinned 48pt above the screen edge. Content that runs past the space scrolls, with a border/color-subtle hairline under the title and a 16pt fade above the action.
  - Fields, tiles and the close button on it use `bg/color-sheet-raised`, one tonal step up with no edge. Choices and actions such as Take a photo are Sheet rows, outlined in border/color-default, never an inset card with dividers or a white button.
  - Page sheets start 72pt from the top with `radius/40` top corners: the Waiver sheet, which can't be swiped away, and Check your listing on bg/color-canvas with a border/color-glass rim. Welcome's panel uses the same top corners.
- **List screen states:** Loading shows Skeleton shapes in the content layout. Empty shows an Empty state under the same navigation, search and filters as the full screen. Error shows the Error tone with Try again.
- **Mockups pages:** Mockups V1 and Mockups V2 share one layout. Each has two parent sections, so the two account types read apart. Seeker holds Sign up and log in, Home, Directory, Community and My Profile, stacked 600pt apart, and on V2 also Groups and Grove membership. Practitioner holds My Practice, starting on Which one are you? with Practitioner picked. Each parent has a title, one line and a legend, and a Dark twin to its right. Inside a flow:
  - Screens sit on a grid, 280pt between columns and 220pt between rows.
  - A ring (6pt outside the element, 10% fill) marks what is pressed. A 12pt dot starts the arrow on the ring.
  - A solid arrow is a tap, a typed word or a swipe, with the action written on the line ("Tap Register").
  - A dashed arrow leads to another state of the same screen, or to what happens after a wait ("While loading", "After IHL sets it up").
  - A filled pill names where a flow starts, above its first screen (Open the app), or another flow an action goes to (Home, Join Grove, Practitioner flow). A screen reached from a spot hidden under the tab bar or below the fold gets a start pill instead of a long arrow ("From My Profile, tap Privacy").
  - Arrows and labels are #2D6189 in Light and #87B2D6 in Dark, in Inter. Each arrow and its labels sit in one group named Flow / its label.

Use the Mockups pages as the reference for all of these: V1 for the app without the seeker round, V2 for the app with it.

## 10. Documentation template

New component docs copy the existing ones on the Components page:

- A 2400pt wide frame, with the header bar and title cloned from the Colours doc.
- Sections in this order: Base component, Anatomy, Variants, Examples, Do and don't.
- Each section is a label (Inter Semi Bold 20), an optional muted line (Inter 16/26 #666665), then a #F5F5F3 panel.
- Anatomy shows the instance at 2x, with numbered pins in #2D6189 and a legend.
- Variants shows the component set with a dashed #9747FF border, plus row and column labels.
- Examples shows Light and Dark boxes that set the Semantic mode explicitly.
- Do and don't cards use a #E4F1E7 footer for Do and a #FEE7E4 footer for Don't.
- Doc text is Inter. App text is always Manrope.

## 11. Working in Figma through the Plugin API

- Switch pages with `await figma.setCurrentPageAsync(page)`, once per script.
- Load fonts before any text change: Manrope Medium and Bold, Inter, and Mrs Saint Delafield when the script is used.
- Colors: `figma.variables.setBoundVariableForPaint(paint, 'color', variable)`.
- Spacing: `node.setBoundVariable('paddingLeft', spacing16)`. Do the same for the other paddings and `itemSpacing`.
- Radius: bind all four corner radius fields.
- Text styles: `await text.setTextStyleIdAsync(style.id)`.
- Icons: `figma.importComponentByKeyAsync(key)` from the published Iconoir library. Retry once or twice on a transient error.
- Auto layout:
  - Append a child to its auto layout parent before you set it to Fill.
  - Give wrapping text a fixed width or Fill, with `textAutoResize` set to `HEIGHT`.
- Return the IDs of everything you create. Take a screenshot to check the result before you report back.

## 12. Checklist before you hand anything over

- [ ] Only semantic color tokens. No raw hex in the app UI
- [ ] Text styles applied, in Medium or Bold only
- [ ] 16pt horizontal padding on containers, inner elements set to Fill
- [ ] Spacing and radius bound to tokens
- [ ] Touch targets of 48pt or more, text of 13pt or more
- [ ] Checked in both Light and Dark. Seeker and Practitioner on both Mockups pages each have a Dark twin to their right, the same screens and arrows with the Semantic mode set to Dark on the frame. Dark arrows and labels use #87B2D6
- [ ] Icons from the Iconoir library, colored by an icon token, with labels where possible
- [ ] US formats for dates, times, money and places
- [ ] As little text as possible, sentence case, no all caps, no em dashes, no semicolons
- [ ] Built from existing components. Anything new is added to the Components page and documented
- [ ] Every list screen has loading, empty and error states
- [ ] Quick actions confirm with a Snackbar, anything with Undo uses a Banner
- [ ] No hairline dividers in lists. Rows are spaced with a gap, settings sit in inset cards
- [ ] No outlines on cards in either mode, and no edges on filled controls in Dark. Tag chips and Sheet rows are the exception: their 1pt edge keeps them readable on the beige in both modes
- [ ] Sticky bars carry a fill down to the screen edge so nothing shows under the home indicator: bg/color-canvas on form bottoms, bg/color-surface-raised on the Reply bar
- [ ] The main action of a screen shows without scrolling and never sits under the tab bar. A long list puts its button above the list, as on My Practice
- [ ] Main buttons stay on. A tap with something missing shows a Field error or the Text field's Error state, never a silent disabled button. Only a busy button (Posting…) is disabled
