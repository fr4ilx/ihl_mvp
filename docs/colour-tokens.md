# IHL Colour Tokens

Figma: Mockups (Internal), page Design System, frame Colours. Collections: Primitives (109 variables, hidden from pickers) and Semantic (81 variables, Light and Dark). Designed by Steven Yeo.

Rules
- Screens use semantic tokens only. Primitives are never applied directly
- Every text token passes WCAG 2.1 AA (4.5:1) in both modes. Lowest pairs are text/color-tertiary on bg/color-canvas at 5.0:1 and on bg/color-surface at 4.5:1 (Light)
- Borders and icons meant to be seen pass 3:1
- React Native: text/color-primary maps to theme.text.primary

## Primitives

- neutral: 0 #FFFFFF, 5 #F5F5F3, 10 #E5E5E3, 20 #CCCCC9, 30 #B2B2B1, 40 #999997, 50 #80807E, 60 #666665, 70 #4D4D4C, 80 #333332, 90 #292928, 95 #121212, 100 #000000
- cream: 0 #FCFCF7, 5 #F7F6EF, 10 #EEEEE9 (logo plate and text on brand)
- sand: 5 #FAF8F3, 10 #F4F0E8, 20 #EBE5DB, 30 #CCC6BD, 40 #AEA9A0, 50 #918B83, 60 #726D65, 70 #554F48, 80 #36312B, 90 #2B2722, 95 #161411 (the beige white canvas and sheets, sand/20 for what sits on them, and their warm browns in Dark)
- forest: 5 #F3F9F1, 10 #E9EFE7, 20 #D8DED6, 30 #C1CBBE, 40 #A0B39C, 50 #7F9A78, 60 #5E8154, 70 #44673A, 80 #314E29, 90 #1C3A13, 95 #162212
- sage: 5 #F6F8F2, 10 #ECEEE8, 20 #DBDED3, 30 #C6CAB9, 40 #AAB097, 50 #8E9574, 60 #757C5D, 70 #5A6044, 80 #434834, 90 #2F3226, 95 #1E1F19
- honey: 5 #FFF6E5, 10 #FFEBC3, 20 #FED788, 30 #E3B54B, 40 #D6A42C, 50 #B38928, 60 #8F712F, 70 #6D5931, 80 #4E442F, 90 #363023, 95 #231D12
- success: 5 #EEFBF1, 10 #E4F1E7, 20 #CCE3D1, 30 #ADD2B6, 40 #84BC92, 50 #56A46E, 60 #338A51, 70 #246C3E, 80 #215030, 90 #1C3724, 95 #152218
- warning: 5 #FFF5ED, 10 #FFE8D5, 20 #FED3AF, 30 #F3BA89, 40 #E49953, 50 #CC7A20, 60 #AA6105, 70 #814F1B, 80 #5C3D20, 90 #3C2D20, 95 #261C13
- error: 5 #FFF4F2, 10 #FEE7E4, 20 #FAD2CC, 30 #F4B5AD, 40 #EB9086, 50 #DE675C, 60 #C2473F, 70 #9B342E, 80 #712B26, 90 #4C221E, 95 #2C1816
- turquoise: 20 #A6C6BA, 50 #558A7A, 60 #4B7D6E, 80 #2D4A42, 90 #1F3B33 (the brand turquoise: buttons and the app icon. 50 is the brand guide’s Grey Turquoise, 60 is the Primary button so white text reaches 4.71:1)
- info: 5 #F0F8FF, 10 #E4EEF7, 20 #CDDFEF, 30 #AFCBE4, 40 #87B2D6, 50 #5D97C7, 60 #3D7BAD, 70 #2D6189, 80 #264865, 90 #1E3244, 95 #161F27

## Semantic tokens (Light / Dark)

- text/color-primary: neutral/90 #292928 / neutral/5 #F5F5F3
- text/color-secondary: neutral/70 #4D4D4C / neutral/20 #CCCCC9
- text/color-tertiary: neutral/60 #666665 / neutral/30 #B2B2B1
- text/color-disabled: neutral/40 #999997 / neutral/60 #666665
- text/color-inverse: neutral/0 #FFFFFF / neutral/95 #121212
- text/color-brand: forest/90 #1C3A13 / forest/30 #C1CBBE
- text/color-link: forest/70 #44673A / forest/40 #A0B39C
- text/color-accent: forest/90 #1C3A13 / #C1CBBE
- text/color-on-brand: cream/0 #FCFCF7 / forest/95 #162212
- text/color-on-button-primary: neutral/0 #FFFFFF / turquoise/90 #1F3B33 (labels and icons on Primary buttons and Filled icon buttons)
- text/color-on-button-secondary: turquoise/60 #4B7D6E / turquoise/20 #A6C6BA (labels and icons on Secondary buttons, the Primary turquoise on white in Light)
- text/color-on-secondary: neutral/0 #FFFFFF / neutral/95 #121212
- text/color-on-accent: forest/90 #1C3A13 / forest/95 #162212
- text/color-on-status: neutral/0 #FFFFFF / neutral/95 #121212
- text/color-success: success/70 #246C3E / success/40 #84BC92
- text/color-warning: warning/70 #814F1B / warning/40 #E49953
- text/color-error: error/70 #9B342E / error/40 #EB9086
- text/color-info: info/70 #2D6189 / info/40 #87B2D6
- bg/color-canvas: #F8F4EE / sand/95 #161411 (beige white, white cards still read on it, since October 12, 2026)
- bg/color-surface: sand/20 #EBE5DB / sand/80 #36312B (skeleton shapes, disabled fills, quiet areas)
- bg/color-surface-raised: neutral/0 #FFFFFF / sand/90 #2B2722 (cards, fields, chips)
- bg/color-sunken: sand/20 #EBE5DB / neutral/100 #000000
- bg/color-inverse: neutral/90 #292928 / neutral/5 #F5F5F3
- bg/color-logo-plate: cream/0 #FCFCF7 / cream/0 #FCFCF7
- bg/color-brand: forest/90 #1C3A13 / forest/40 #A0B39C
- bg/color-button-primary: turquoise/60 #4B7D6E / turquoise/20 #A6C6BA (Primary buttons and Filled icon buttons)
- bg/color-button-secondary: neutral/0 #FFFFFF / turquoise/80 #2D4A42 (Secondary buttons: white with a turquoise edge in Light, filled in Dark. Light Grey Turquoise read as disabled, October 4, 2026)
- bg/color-brand-pressed: forest/80 #314E29 / forest/30 #C1CBBE
- bg/color-brand-subtle: forest/10 #E9EFE7 / forest/90 #1C3A13
- bg/color-selected: forest/10 #E9EFE7 / forest/80 #314E29 (selected tab pill)
- bg/color-secondary: sage/70 #5A6044 / sage/40 #AAB097
- bg/color-secondary-subtle: sage/10 #ECEEE8 / sage/90 #2F3226
- bg/color-accent: sage #A0B39C / sage #A0B39C
- bg/color-accent-subtle: #E9EFE7 / forest/90 #1C3A13
- bg/color-success: success/70 #246C3E / success/40 #84BC92
- bg/color-success-subtle: success/10 #E4F1E7 / success/90 #1C3724
- bg/color-warning: warning/70 #814F1B / warning/40 #E49953
- bg/color-warning-subtle: warning/10 #FFE8D5 / warning/90 #3C2D20
- bg/color-error: error/70 #9B342E / error/40 #EB9086
- bg/color-error-subtle: error/10 #FEE7E4 / error/90 #4C221E
- bg/color-info: info/70 #2D6189 / info/40 #87B2D6
- bg/color-info-subtle: info/10 #E4EEF7 / info/90 #1E3244
- bg/color-glass: white 55% / sand/90 at 72% (raw alpha)
- bg/color-overlay: black 40% / black 60% (raw alpha). Behind sheets and alerts, and the scrim at the top of a listing photo, where a gradient fades it to clear by 128pt
- bg/color-thumb: neutral/0 #FFFFFF / neutral/0 #FFFFFF (toggle knob)
- bg/color-toast: neutral/90 #292928 / neutral/70 #4D4D4C (snackbar, dark in both modes)
- bg/color-sheet: #F8F4EE / sand/90 #2B2722 (bottom sheets, the canvas beige in Light since October 5, 2026)
- bg/color-sheet-raised: sand/20 #EBE5DB / sand/80 #36312B (fields, rows, tiles and the close button on a sheet, one tonal step from it with no edge)
- bg/color-hero-base: #F4F0E4 / #0F1A12 (Welcome background, raw values)
- bg/color-hero-seafoam: #A6C6BA / #2B4C46
- bg/color-hero-gold: #E9C46A / #B38928
- bg/color-hero-cream: #FFF8E7 / #F4F0E4 (glow behind the logo, light in both modes)
- bg/color-hero-sage: #698E79 / #44673A
- bg/color-hero-teal: #2B4C46 / #162212
- bg/color-viewer: neutral/100 #000000 / neutral/100 #000000 (full-screen photo viewer)
- bg/color-map-land: sand/20 #EBE5DB / sand/80 #36312B (Map box)
- bg/color-map-road: neutral/0 #FFFFFF / sand/70 #554F48 (Map box, also scoped to strokes)
- bg/color-map-park: forest/20 #D8DED6 / forest/90 #1C3A13 (Map box)
- bg/color-map-water: info/20 #CDDFEF / info/90 #1E3244 (Map box)
- border/color-subtle: neutral/10 #E5E5E3 / neutral/70 #4D4D4C
- border/color-default: neutral/20 #CCCCC9 / neutral/60 #666665 (also the edge on a Sheet row)
- border/color-glass: white 45% / white 10% (raw alpha, edge on glass surfaces)
- border/color-glass-highlight: white 90% / white 22% (raw alpha, the specular top rim of the Liquid Glass tab bar)
- border/color-control: neutral/20 #CCCCC9 / none (Outline icon buttons, unselected interest cards, message box)
- border/color-control-subtle: neutral/10 #E5E5E3 / none (idle chips, search field)
- border/color-strong: neutral/50 #80807E / neutral/40 #999997
- border/color-brand: forest/90 #1C3A13 / forest/40 #A0B39C
- border/color-brand-subtle: forest/30 #C1CBBE / forest/70 #44673A (the edge on Tag chips and on a selected Sheet row, so they read on the canvas and the sheet without turning loud. October 5, 2026)
- border/color-accent: #44673A / sage #A0B39C (the ring on an earned Medallion and the passed part of the journey line)
- border/color-button-secondary: turquoise/20 #A6C6BA / none (the 1.5pt edge on Secondary buttons in Light. Dark buttons are filled, no edge)
- border/color-focus: info/60 #3D7BAD / info/40 #87B2D6
- border/color-error: error/60 #C2473F / error/40 #EB9086
- icon/color-primary: neutral/90 #292928 / neutral/5 #F5F5F3
- icon/color-secondary: neutral/60 #666665 / neutral/30 #B2B2B1
- icon/color-brand: forest/90 #1C3A13 / forest/30 #C1CBBE
- icon/color-accent: #44673A / #C1CBBE
- icon/color-on-brand: cream/0 #FCFCF7 / forest/95 #162212
- icon/color-success: success/70 #246C3E / success/40 #84BC92
- icon/color-warning: warning/70 #814F1B / warning/40 #E49953
- icon/color-error: error/70 #9B342E / error/40 #EB9086
- icon/color-info: info/70 #2D6189 / info/40 #87B2D6
