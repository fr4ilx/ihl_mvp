# Gamification and membership onboarding plan

Design by Steven Yeo. A draft for IHL to react to. Section 3 lists what needs their answer.

## 1. Goal

Get a new member from sign up to a weekly habit, and from Seedling to Grove, without pressure.

Rules that hold everywhere:

- Reward real participation: visits, replies, posts, check-ins.
- Nothing ranks members against each other. No leaderboards.
- Weekly, never daily. No streak loss shame, a missed week just shows a quiet dot.
- Every award names its reason in words, never color or a medal alone.
- Members 60 and over come first: big targets, short copy, no timers.

## 2. Where the prototype is now (V2)

| Piece | State |
|---|---|
| Stages | Seedling, Sprout, Root, Grove, Forest, Oak, with steps and a Progress bar |
| Badges | Seedling, Explorer, Farm Friend, Welcomer, Steady, Harvest 2026 |
| Check-in | Weekly, six week dots, mood sheet, Steady after 4 weeks in a row |
| I was here | Once per place, feeds Sprout, Explorer, Farm Friend and the quest |
| Quest | One: Fall Harvest Quest, Grove only, three steps |
| Membership | Seedling free (3 groups), Grove $89.00 a year or $11.11 a month |
| Onboarding | Waiver, account type, About you, 3 question quiz, Seedling badge, Preparing, Home |

## 3. Decisions for IHL

The brief (6.1 to 6.3) and the prototype disagree in these places. My recommendation is first.

| Topic | Brief | Prototype | Recommend |
|---|---|---|---|
| Sprout | Attend 1 local event | Visit 1 local place | Keep visit. Events are out of the MVP |
| Root | 30 day streak | 4 weeks in a row | Keep weekly |
| Grove stage | 5 discussion topics | All 4 topics | Keep 4. There are only 4 topics |
| Forest | 90 day streak, host 1 event | 12 weeks in a row | Keep weekly, drop hosting until events ship |
| Explorer | Visit and save 10 | Visit 10 | Keep visit. Saving is easy to game |
| Farm Friend | Connect with or review 3 farms | Visit 3 farms or markets | Keep visit. No reviews in the MVP |
| Quests | Quarterly group quests | One solo quest | Quarterly, solo first, group later |
| Recognition | Badges on profiles and listing cards | Profiles only | Add a stage Medallion by the name on posts. Skip listing cards |

Also decide:

1. Is Grove the only place quests live, or does a Seedling get one free quest a year?
2. Should the Oak Ambassador seal come with a real perk, such as early access or a feature in the app?
3. Does a practitioner earn anything? Today they do not play. Verified Local Business is their mark.

## 4. Gamification plan

### 4.1 Stages

Final rules, assuming the recommendations above.

| Stage | Steps |
|---|---|
| Seedling | Make an account |
| Sprout | Add a bio, reply once, review a local place |
| Root | Check in 4 weeks in a row, share 10 posts |
| Grove | Join Grove, post in all 4 topics |
| Forest | Check in 12 weeks in a row, share 25 posts |
| Oak | Take part for a year |

- A member grows one stage at a time, as soon as every step is done.
- The Badge sheet says "You reached Sprout" with a success haptic.
- Show the stage Medallion next to the name on posts and the member profile.

### 4.2 Badges

| Badge | Rule |
|---|---|
| Explorer | Review 10 places |
| Farm Friend | Review 3 farms or markets |
| Welcomer | Greet 5 new members in the Welcome Circle |
| Steady | Check in 4 weeks in a row |
| Season badge | Finish that season's quest |

Verified Local Business stays a practitioner mark and is never earned by play.

### 4.3 Weekly check-in

- One check-in a week, weeks start on Sunday.
- The card shows six weeks. A missed week is an empty dot, nothing is lost.
- Steady at 4 in a row. Root and Forest steps use the same count.

### 4.4 Quests

One quest per season, Grove only, three steps each, ending in a badge.

| Season | Quest | Steps |
|---|---|---|
| Winter | Winter Warmth | Visit a tea or herb shop, try a class, share a reflection |
| Spring | Spring Renewal | Visit a farm, attend a workshop, share a reflection |
| Summer | Summer Roots | Visit a market, try an outdoor class, share a reflection |
| Fall | Fall Harvest | Visit a farm or market, visit a practitioner, share a reflection |

The Spring workshop step needs events. Until then use "try a class or practitioner".

### 4.5 Integrity

- A place's first review counts once per member. I was here is gone, the review is the visit.
- Ask for the phone to be near the place when location is on, otherwise accept it with a daily cap of 3 visits.
- Posts count only when kept for 24 hours, so delete and repost does nothing.
- Greets count only for members who joined in the last 14 days.
- Reported posts do not count toward any step.

## 5. Membership onboarding plan

### 5.1 Day 0 flow

1. Welcome, then Register or Apple.
2. Liability waiver.
3. Which one are you?
4. Seeker: About you, the 3 question quiz, You're a Seedling, Preparing, Home.
5. Practitioner: claim or add a listing, Preparing, My Practice.

Keep each screen to one job. No notification prompt in the MVP.

### 5.2 First week for a Seedling

Home shows one next step at a time in the weekly card area.

| Day | Prompt | Earns |
|---|---|---|
| 0 | Join the Welcome Circle | A group joined |
| 1 to 2 | Say hello in the Welcome Circle | Sprout step |
| 3 to 4 | Review a place near you | Sprout step |
| 7 | Your first check-in | First dot |

No pushes. The prompts live on Home only.

### 5.3 Moments that offer Grove

Offer it when the member hits a real limit, never on a timer.

| Moment | Screen text leads with |
|---|---|
| Join a 4th group | Every group |
| Ask a question | Ask the Experts |
| Open a member offer | Member offers |
| Open a quest | Seasonal quests |

Rules:

- One offer per session at most.
- Show both prices together, Yearly picked first.
- Close always works and returns to where they were.
- After purchase, Welcome to Grove, then back to the screen that asked.
- Restore purchases and the renewal terms stay on the paywall (App Review 3.1.2).

### 5.4 Grove after joining

- The Grove step in the journey completes at once and the Badge sheet shows it.
- The current quest unlocks.
- The membership card on My Profile shows the renewal date and Manage subscription.

### 5.5 Practitioner track

Claim or add, set up, send for review, live, then request a feature. Their progress is the checklist on My Practice, not a game.

## 6. What to measure

- Sign up to account type to quiz finished to Home.
- Share of Seedlings who reach Sprout in 14 days.
- Weekly check-in rate and median weeks in a row.
- Paywall views by trigger, and conversion by trigger.
- Quest started, steps done, badge earned.
- Reports per 100 posts, to catch gaming.

## 7. Phases

| Phase | Work | Output |
|---|---|---|
| 0 | IHL answers section 3 | Final rules |
| 1 | Align prototype copy and rules, add stage Medallion on posts, first week card. Done October 15, 2026 | Updated V2 and HANDOFF |
| 2 | Figma: stage mark on Post card, seasonal quest art, first week card | Mockups V2 |
| 3 | Build in Expo: stages, check-in, reviews, paywall | MVP |
| 4 | Add Winter, Spring and Summer quests, then group quests. In the prototype October 15, 2026: all four seasons and Together on the running quest | Post launch |

## 8. Risks

- Gaming the counts. Section 4.5 covers it, and the first month of data will show more.
- Pressure on older members. Weekly pace and no ranking keep it calm. Test with real members.
- Event dependent steps in the brief. Events are out of the MVP, so those steps wait.
