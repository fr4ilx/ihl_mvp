# Watercolor icons

The client asked for watercolor art in place of the content icons. This file holds the list, one shared style and a prompt for each, so every image matches.

Design by Steven Yeo.

## What changes and what stays

Watercolor replaces the icons that show a subject: the art in tiles, choice cards and icon circles.

The tab bar stays Iconoir, as asked. So do the icons that are controls: back, close, search, bookmark, share, more, like, chevrons, check, plus, the city and radius arrows and the Detail row icons (pin, clock, phone). They sit at 16 to 24pt inside buttons, where a watercolor turns to a blur, and people 60 and over need them crisp to know what they tap.

The art that is already illustrated (interests, group covers, medallions, empty states, the role cards) is a separate set. Redo it in the same style once these are approved, so the whole app matches.

## Style

Every image uses this exact text. Only the subject changes.

**Prompt**

```
Loose watercolor illustration of {subject}. One object, centered, filling about 70% of the frame, on a plain white background with generous empty space around it. Soft wet-on-wet edges, visible cold-press paper grain, light pencil-free washes. Limited palette: sage green, deep forest green, grey turquoise, warm cream, soft terracotta and a touch of honey yellow. Gentle natural light from the upper left. No outlines, no text, no letters, no logos, no ground shadow, no border. Simple bold shapes that still read at small size. Square, 1:1.
```

**Avoid** (the negative prompt, where the tool has one)

```
photorealistic, 3D render, glossy, vector, flat cartoon, black outlines, text, letters, numbers, logos, detailed faces, busy background, scenery, gradient background, frame, border, several separate objects, harsh shadows, neon colors
```

**Rules**

- One subject per image. A small companion object is fine (a sprig, a leaf) when the prompt names it.
- No faces with features. People show as hands or from behind, animals as simple shapes.
- Keep the same palette and light on every image. Generate one first, approve it, then use it as the style reference image for the rest.
- Same framing for all: subject centered, about 70% of the square, the rest empty.

## Files

- Generate at 1024 by 1024. Remove the background to transparent PNG.
- Name each file `wc_{set}_{slug}.png`, for example `wc_sub_herbalism.png`. The slugs are in the tables.
- For the app, export 144 by 144 WebP (48pt at 3x) into `assets/img`.
- In the tiles the art replaces the Iconoir glyph inside the 40pt circle and grows to 48pt with no circle. Check every one at that size in Light and Dark before handing over. If pale washes vanish on the Dark card (#2B2722), keep a cream circle behind the art in Dark only.

## Applied

The 23 subcategory watercolors are on the tiles (October 15, 2026): `assets/img/wc_sub_*.webp` at 192 by 192, 1024 masters in `assets/watercolor`. They show at 88pt, two to a row, centered on a white card with the name under them.

The rest are in too (October 15, 2026): the quiz answers and moods at 56pt in place of the Select tile circle (`art` on QUIZ_GOALS, QUIZ_CARE and MOODS), the Grove perks at 48pt (`art` on GROVE_PERKS), the follow-up stages, badges and quests as the Medallion and quest art (MEDALLION_ART and QUESTS), the first week steps at 56pt (STEP_ART) and the interests. The grey copies for the stages and badges are made here from the color art: grayscale and 15% lighter, then the Medallion sets them to 80%. The greys in the brief (30% lighter) almost vanished on bg/color-surface. The goal, care, mood and perk sets are made and not placed yet.

## The list

46 images, plus 31 in Follow-up: the gaps.

### Directory categories

Done and approved, October 13, 2026. On the Directory tiles at 128pt: `assets/img/wc_cat_*.webp`, 1024 masters in `assets/watercolor`. Use Holistic Business as the style reference for the rest.

| Tile | Slug | Subject |
|---|---|---|
| Holistic Business | `cat_holistic` | a stone mortar and pestle holding fresh green herbs |
| Food | `cat_food` | a small woven basket of fresh vegetables, carrots and leafy greens on top |
| Shop | `cat_shop` | a brown paper shopping bag with a sprig of lavender and an amber bottle peeking out |
| Services | `cat_services` | two open hands cupped together holding a small green sprout |

### Holistic Business

| Tile | Slug | Subject |
|---|---|---|
| Integrative and Functional Medicine | `sub_integrative` | a stethoscope loosely curled around a sprig of green leaves |
| Alternative Health Professionals | `sub_alternative` | a small bundle of dried herbs tied with twine |
| Movement and Manual Therapy | `sub_movement` | a rolled sage green yoga mat with two smooth massage stones beside it |
| Mental Health and Energy Work | `sub_mental` | a lit cream candle beside a small brass singing bowl |

### Alternative Health Professionals

| Tile | Slug | Subject |
|---|---|---|
| Herbalism | `sub_herbalism` | a glass jar of dried herbs with a fresh leaf sprig leaning against it |
| TCM and Ayurveda | `sub_tcm` | a small brass bowl of warm spices with a cinnamon stick and a piece of ginger root |
| Naturopath | `sub_naturopath` | an amber dropper bottle beside a single chamomile flower |
| Homeopath | `sub_homeopath` | a small clear glass vial of tiny white pellets |

### Food

Food and Shop subcategories are still a draft. Wait for IHL's final list before generating these two sets.

| Tile | Slug | Subject |
|---|---|---|
| Farms | `sub_farms` | a red barn with a silo beside rows of green crops |
| Markets | `sub_markets` | a wooden market crate full of red apples |
| Bakeries and cafés | `sub_bakeries` | a round loaf of crusty bread beside a cup of coffee |
| Restaurants | `sub_restaurants` | a plate of simple green salad with a fork beside it |
| Grocers | `sub_grocers` | a paper grocery bag with carrots and leafy greens on top |

### Shop

| Tile | Slug | Subject |
|---|---|---|
| Apothecary | `sub_apothecary` | an amber apothecary jar tied with twine and a sprig of lavender |
| Supplements | `sub_supplements` | an amber supplement bottle with a few capsules beside it |
| Skin care | `sub_skincare` | an open jar of cream and a small serum bottle with eucalyptus leaves |
| Teas and herbs | `sub_teas` | a cup of herbal tea with loose dried leaves scattered beside it |

### Services

| Tile | Slug | Subject |
|---|---|---|
| Holistic Vet | `sub_vet` | a calm sitting dog seen from the side, simple shape, no detailed face |
| Birth and Family Services | `sub_birth` | a folded knitted baby blanket with a small wooden rattle |
| Wellness Spa | `sub_spa` | a rolled white towel with smooth stones and a eucalyptus sprig |
| Coaching and Personal | `sub_coaching` | an open notebook and pen beside a small potted plant |
| Professional Services | `sub_professional` | a brown leather satchel |
| Facilities | `sub_facilities` | a small wooden studio building with a door, a window and plants by the step |

### Quiz: What can we help with? (V2)

| Tile | Slug | Subject |
|---|---|---|
| Better sleep | `goal_sleep` | a crescent moon with two small stars |
| Less stress | `goal_stress` | a balanced stack of smooth river stones |
| Easier digestion | `goal_digestion` | a cup of ginger tea with a slice of fresh ginger |
| Joint comfort | `goal_joints` | a pair of soft walking shoes |
| More energy | `goal_energy` | a sliced orange, one half facing up |
| Healthy aging | `goal_aging` | a full old oak tree in leaf |
| Eating local | `goal_local` | a bunch of fresh carrots with their green tops and a little soil |
| Meeting people | `goal_people` | two teacups side by side |

### Quiz: Who do you care for? (V2)

| Tile | Slug | Subject |
|---|---|---|
| Myself | `care_myself` | a single teacup resting on a closed book |
| My partner | `care_partner` | two flower stems leaning together |
| Kids or grandkids | `care_kids` | a small wooden toy boat |
| An aging parent | `care_parent` | a pair of reading glasses on a folded quilt |

### Weekly check-in moods (V2)

The moods move from faces to weather, which reads warmer than painted faces and keeps the no-faces rule.

| Tile | Slug | Subject |
|---|---|---|
| Great | `mood_great` | a bright round sun |
| Good | `mood_good` | a sun partly behind a small white cloud |
| Okay | `mood_okay` | a soft grey cloud |
| Hard | `mood_hard` | a grey cloud with light rain falling |

### Grove perks (V2)

| Row | Slug | Subject |
|---|---|---|
| Every group | `perk_groups` | a small round table with several teacups around it |
| Ask the Experts | `perk_experts` | an open book with a pressed leaf on the page |
| Member offers | `perk_offers` | a small gift wrapped in brown paper and twine |

## Follow-up: the gaps

31 more images for the gamification and the interests, added October 15, 2026. They use the same style prompt, the same avoid list and `cat_holistic` as the style reference.

Two extra rules for this set:

- **Medallion art** (stages and badges) sits inside a 62% circle on the Medallion. Keep the subject compact and roughly round, so nothing pokes past the ring. Add this line to the prompt: `Compact rounded silhouette that fits inside a circle.`
- **Grey copies** are made from the color file, not generated: desaturate, lighten 30% and set to 80%. Name them `wc_stage_{slug}_grey.png` and `wc_badge_{slug}_grey.png`.

Keep each subject apart from the first 46: no second barn, apple crate, yoga mat or teacup. The subjects below already avoid them.

### Journey stages (V2)

From smallest to biggest, so the six read as one growing line.

| Stage | Slug | Subject |
|---|---|---|
| Seedling | `stage_seedling` | a tiny seedling with two round leaves in a small mound of soil |
| Sprout | `stage_sprout` | a young sprout with four leaves rising from dark soil |
| Root | `stage_root` | a small plant lifted from the ground, its pale roots showing |
| Grove | `stage_grove` | three young trees growing close together |
| Forest | `stage_forest` | a cluster of tall deep green pine trees |
| Oak | `stage_oak` | a mature oak with a wide round crown and acorns at its foot |

`stage_oak` and `goal_aging` both show an oak. Keep the acorns on the stage, so they read apart.

### Badges (V2)

The Seedling badge reuses `stage_seedling`.

| Badge | Slug | Subject |
|---|---|---|
| Explorer | `badge_explorer` | a brass pocket compass, lid open |
| Farm Friend | `badge_farmfriend` | a woven straw hat with a sprig of wheat in its band |
| Welcomer | `badge_welcomer` | two hands meeting in a warm handshake, simple shapes, no faces |
| Steady | `badge_steady` | a small brass lantern with a warm glow |
| Harvest 2026 | `badge_harvest` | a round orange pumpkin with one green leaf |
| Winter Warmth 2026 | `badge_winter` | a knitted cream mitten with a sprig of pine |
| Spring Renewal 2027 | `badge_spring` | a tulip bulb with a green shoot breaking out of it |
| Summer Roots 2027 | `badge_summer` | a single sunflower head, slightly turned |

### Seasonal quests (V2)

The hero art on a quest, at 128pt on the accent tint, and at 40pt in This year's quests. Each one is a small still life, still one group of objects.

| Quest | Slug | Subject |
|---|---|---|
| Fall Harvest | `quest_fall` | a woven basket of small pumpkins, squash and red apples with an autumn leaf |
| Winter Warmth | `quest_winter` | a round teapot with steam, two cinnamon sticks and a sprig of pine beside it |
| Spring Renewal | `quest_spring` | a terracotta pot of green seedlings with a small trowel leaning on it |
| Summer Roots | `quest_summer` | a straw sun hat resting beside a loose bunch of wildflowers |

`quest_fall` redoes the art in the app today, so all four match.

### Your first week (V2)

The 48pt circle on the First week card, one per step.

| Step | Slug | Subject |
|---|---|---|
| Join the Welcome Circle | `step_join` | a small wooden garden gate standing open |
| Say hello | `step_hello` | a blank folded note card with a sprig of lavender, no writing |
| Review a place near you | `step_review` | a single honey yellow five pointed star with soft edges |
| Check in this week | `step_checkin` | a small stone sundial in soft morning light |

### Grove perks, one more (V2)

| Row | Slug | Subject |
|---|---|---|
| Seasonal quests | `perk_quests` | a brass medal on a sage green ribbon |

### Interests

The eight Interest cards and Interest tiles, on About you, What are you into?, Edit interests and My Profile. They replace the current illustrations.

| Interest | Slug | Subject |
|---|---|---|
| Herbs | `int_herbs` | a small terracotta pot of fresh rosemary |
| Yoga | `int_yoga` | a cork yoga block with a rolled cotton strap |
| Farms | `int_farms` | a small vintage red tractor |
| Nutrition | `int_nutrition` | a bowl of grains and greens with half an avocado |
| Sound baths | `int_soundbaths` | a frosted crystal singing bowl with a wooden striker |
| Markets | `int_markets` | a canvas tote bag full of fresh produce |
| Gardening | `int_gardening` | a pair of gardening gloves crossed over a trowel |
| Meditation | `int_meditation` | a round meditation cushion with a smooth stone on top |

## How to run it

1. Generate Holistic Business (`cat_holistic`) first with the style prompt. Adjust until the client approves it.
2. Use that image as the style reference for every other image, and keep the same seed where the tool allows it.
3. Work set by set and review each set side by side, so the palette and framing stay even.
4. Drop the approved WebPs into the prototype and check them on Directory, a category page and the quiz in Light and Dark.
5. For the follow-up, check the stages and badges inside the Medallion at 40 and 96pt, and the interests on Interests and My Profile, in Light and Dark.
