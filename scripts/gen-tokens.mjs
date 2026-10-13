// Turns the Figma variable export (assets/tokens.figma.json) into src/theme/tokens.js.
// Run again after changing variables in Figma.
import fs from 'node:fs';
const t = JSON.parse(fs.readFileSync('assets/tokens.figma.json', 'utf8'));
const light = {}, dark = {};
for (const [name, v] of Object.entries(t.semantic)) { light[name] = v.light; dark[name] = v.dark; }
const sort = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));
const out = `// Indy Holistic Living design tokens.
// Generated from the Figma variables in "Mockups (Internal)" by scripts/gen-tokens.mjs.
// Names match Figma exactly, so "bg/color-canvas" here is "bg/color-canvas" in Figma.
// This file has no web code in it and can be copied into the React Native app as is.

export const colors = {
  light: ${JSON.stringify(sort(light), null, 4).replace(/\n}/, '\n  }')},
  dark: ${JSON.stringify(sort(dark), null, 4).replace(/\n}/, '\n  }')},
};

// spacing/4 ... spacing/64. Use for padding and gap only.
export const spacing = ${JSON.stringify(t.spacing)};

// radius/4 ... radius/40 and radius/full.
export const radius = ${JSON.stringify(t.radius)};

// Text styles: [fontSize, lineHeight, letterSpacing]. Body styles come in Regular (400) and Bold (700). Headings have one weight.
export const textStyles = ${JSON.stringify(t.text)};

// Fonts. Headings (H1 to H6) are Tenor Sans, which has one weight. Body and UI text are PT Sans, Regular and Bold.
// In React Native load them with @expo-google-fonts/tenor-sans, @expo-google-fonts/pt-sans and @expo-google-fonts/mrs-saint-delafield.
export const fonts = {
  heading: { web: { fontFamily: 'Tenor Sans', fontWeight: '400' }, native: { fontFamily: 'TenorSans_400Regular' } },
  medium: { web: { fontFamily: 'PT Sans', fontWeight: '400' }, native: { fontFamily: 'PTSans_400Regular' } },
  bold: { web: { fontFamily: 'PT Sans', fontWeight: '700' }, native: { fontFamily: 'PTSans_700Bold' } },
  script: { web: { fontFamily: 'Mrs Saint Delafield', fontWeight: '400' }, native: { fontFamily: 'MrsSaintDelafield_400Regular' } },
};

// Effect styles from Figma, written as CSS box-shadow strings (React Native 0.76+ accepts boxShadow).
export const elevation = ${JSON.stringify(t.elevation, null, 2)};

// The same shadows for React Native (iOS). Use the larger layer of each web shadow.
export const elevationNative = ${JSON.stringify(Object.fromEntries(Object.entries(t.elevation).map(([k, v]) => {
  const layers = v.split(/,(?![^(]*\))/).map((x) => x.trim())
  const last = layers[layers.length - 1].match(/(-?\d+)(?:px)? (-?\d+)(?:px)? (\d+)(?:px)? rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
  const [, x, y, blur, r, g, b, a] = last
  return [k, { shadowColor: `rgb(${r},${g},${b})`, shadowOffset: { width: +x, height: +y }, shadowRadius: +blur / 2, shadowOpacity: +a }]
})), null, 2)};

// Primitive colors used directly by a few system pieces (snackbar icons).
export const primitives = { 'success/40': '#84BC92', 'info/40': '#87B2D6', 'error/40': '#EB9086', 'neutral/0': '#FFFFFF', 'neutral/100': '#000000' };
`;
fs.writeFileSync('src/theme/tokens.js', out);
console.log('tokens.js written', Object.keys(light).length, 'colors');
