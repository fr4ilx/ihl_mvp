# App icon

Design by Steven Yeo. The Indiana outline and turquoise heart from the Live Love Local mark, without the words, so it reads down to the 29pt Settings size.

| File | Use |
|---|---|
| `icon-light.png` | Default and App Store icon. 1024 by 1024, square, opaque, no alpha channel |
| `icon-dark.png` | Dark appearance. Transparent background, iOS draws the dark one behind it |
| `icon-tinted.png` | Tinted appearance. Grayscale on black, iOS adds the tint |
| `icon-lockup-light.png` | Option with the full Live Love Local lockup. Its words are too small to read under 60pt |
| `source/*.svg` | Vector masters for each file above |
| `layers/*.svg` | Foreground layers for Icon Composer: Indiana, then the heart |

Colors: sand/10 `#F4F0E8` background, turquoise/90 `#1F3B33` outline, turquoise/50 `#558A7A` heart. Dark uses sand/10 for the outline and turquoise/20 `#A6C6BA` for the heart.

## Expo

```json
"ios": {
  "icon": {
    "light": "./assets/app-icon/icon-light.png",
    "dark": "./assets/app-icon/icon-dark.png",
    "tinted": "./assets/app-icon/icon-tinted.png"
  }
}
```

For the iOS 26 Liquid Glass look, open Icon Composer, set the background fill to `#F4F0E8`, add `layers/1-indiana.svg` and `layers/2-heart.svg`, save `AppIcon.icon` here and set `"ios": { "icon": "./assets/app-icon/AppIcon.icon" }` (Expo SDK 54 or newer).

## Rules

- Keep `icon-light.png` square and opaque. iOS rounds the corners.
- A PNG exported from Figma carries an alpha channel, and App Store Connect rejects that for the App Store icon (ITMS-90717). Ship these files, or re-save without alpha.
- No words in the icon. Keep the full lockup for marketing.

The Indiana outline comes from the US Census Bureau 2017 cartographic boundary file (public domain).
