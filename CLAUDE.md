# Indy Holistic Living · iOS prototype

Design by Steven Yeo. Credit all design work to him. Never credit another company or agency.

## Product

- Wellness community app for Indiana: a directory of trusted local practitioners and places, plus a community space with topics and groups. Four tabs: Home (sponsored partners, the weekly check-in and top discussions), Directory, Community, My Profile. Events are out of the MVP.
- Two account types, picked on Which one are you? right after sign up and the liability waiver. A Seeker looks for wellness near them: a three question quiz, then the Seedling badge. A Practitioner runs a practice, farm or shop: they claim their imported listing or add one in a 9 step setup, and they get three tabs, no Home: My Practice first, where they finish and edit it, send it for review and answer Ask the Experts, then Community, then Reach, two buttons to add a promotion to the listing or get featured on Home. In Community they read, reply and answer as their practice, with the Practitioner badge, but never start a post. Featuring is a request, the IHL team emails to set it up.
- Seekers have two memberships. Seedling is free: up to 3 groups. Grove is $89.00 a year or $11.11 a month through the App Store: every group, Ask the Experts and member offers. The journey grows from Seedling to Oak through check-ins, replies, posts and visits (I was here on a listing), with badges along the way. Nothing ranks members against each other.
- Two versions for IHL to pick from. V1: the MVP without the seeker round. V2 adds the quiz and the Seedling badge, Seedling and Grove with the paywall, member questions, groups and the journey. Both have Specialties: up to 10 tags per listing that show as Tag chips and open Tag results. The prototype switches versions in its review panel, `dist/v1.html` opens on V1.
- iOS only for now, in React Native with Expo. This repo is the interactive prototype and the developer handoff, not the app. No Android and no backend here.
- Users are mostly people 60 and over in the US. Comfort and clarity first: touch targets 48pt or more, text 13pt or more, contrast 4.5:1 in Light and Dark.
- US formats: 10:30 AM, Sat, Oct 10, (317) 555-0142, miles, US English, $89.00. The only prices in the app are Grove's, from StoreKit. Listings show no prices.

## Writing rules

These apply to UI copy, docs, commit messages and replies.

- Never use em dashes or semicolons.
- Use as few words as possible and never repeat wording.
- Sentence case, no all caps. The tab names My Profile and My Practice are the exception, in Title Case.

## Figma

- File: Mockups (Internal), https://www.figma.com/design/bYFNs7UYF2rRs6sOicKrNk, file key `bYFNs7UYF2rRs6sOicKrNk`.
- Pages: Design System / Foundation `2041:2`, Design System / Components `2083:5447`, Mockups V1 `2101:8578` and Mockups V2 `2564:36650`. Each Mockups page has two parent sections, Seeker and Practitioner, each with a Dark twin to its right. V1 leaves out the seeker round, V2 has it. A change to a shared screen lands on both pages. Arrow rules are in docs/design-guide.md, section 9, Mockups pages.
- Variables: Semantic collection `VariableCollectionId:2055:97`, modes Light `2055:1` and Dark `2055:2`. Bind every color, spacing and radius. Never type a raw hex.
- Connection: the `figma` server in `.mcp.json`, Figma's remote MCP. If its tools are missing, ask Steven to run `/mcp`, pick figma and authenticate.
- Load the figma-use skill before any `use_figma` call. Take a screenshot to check every change.
- Plugin API gotchas: `clone()` lands on the page root, so move the clone into its section with `appendChild`. Dark frames can keep stale bound paints, so rebind them to the variable. Load Manrope Medium and Bold before editing text.
- A design change usually lands in both places: the Figma component and its screens, and the prototype. Ask when that is unclear.

## Prototype

- React components shaped like React Native. `src/rn.jsx` stands in for `react-native`. esbuild bundles everything into one offline file, `dist/index.html`.
- `npm install` once. `npm run dev` rebuilds on every change. `npm run build` builds once. Node 18 or newer.
- Tokens live in `src/theme/tokens.js`, generated from `assets/tokens.figma.json` by `scripts/gen-tokens.mjs`. Motion and haptics live in `src/theme/motion.js`.
- Read colors with `c('bg/color-surface-raised')` from `useTheme()` and text styles with `type('BodyM')`. No raw hex or font sizes in screens or components.
- Screens are in `src/screens`, components in `src/components`, sample data in `src/data.js` and `src/app/store.jsx`, the review panel in `src/showcase` with its Jump to list in `scenarios.js`.
- After a change, build, open `dist/index.html` and check the screen in Light and Dark. Update `HANDOFF.md` when behavior changes.

## Git

- Branch `main`, GitHub repo `fr4ilx/ihl_mvp`, the `origin` remote.
- Commit as alessandrorlang `hariadi.alessandro@gmail.com`, already set in the repo config. No co-author trailers.
- The repo turns off the keychain credential helper, so a plain `git push` has no login. Push from VS Code, or from the terminal through the GitHub CLI, signed in as fr4ilx: `git -c credential.helper='!gh auth git-credential' push origin main`.

## Reference

- `docs/design-system.md`: the decisions log.
- `docs/colour-tokens.md`: every color token with its hex value.
- `assets/app-icon/`: the app icon set with its README (Expo config, App Store rules).

@docs/design-guide.md

@HANDOFF.md
