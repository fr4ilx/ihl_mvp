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

The 23 subcategory watercolors are on the tiles (October 15, 2026): `assets/img/wc_sub_*.webp` at 192 by 192, 1024 masters in `assets/watercolor`. They show bare at 68pt, four to a row, with the name under them in Caption Bold, no card or circle. The goal, care, mood and perk sets are made and not placed yet.

## The list

46 images.

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

## How to run it

1. Generate Holistic Business (`cat_holistic`) first with the style prompt. Adjust until the client approves it.
2. Use that image as the style reference for every other image, and keep the same seed where the tool allows it.
3. Work set by set and review each set side by side, so the palette and framing stay even.
4. Drop the approved WebPs into the prototype and check them on Directory, a category page and the quiz in Light and Dark.
