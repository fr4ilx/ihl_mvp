// Theme access for components. In React Native keep the same API:
// useTheme() gives c('bg/color-canvas') for the current scheme (useColorScheme() + the user's Appearance choice).
import React, { createContext, useContext } from 'react';
import { colors, textStyles, fonts, spacing, radius, elevation, elevationNative, primitives } from './tokens';

// 'web' in the prototype. In React Native use 'native' so fonts resolve to TenorSans_400Regular, PTSans_400Regular and PTSans_700Bold.
export const FONT_TARGET = 'web';

export const ThemeContext = createContext({ scheme: 'light', reduceMotion: false, background: 'linen' });

// Prototype only: the review panel's Background swatches, from white to beige. 'linen' (#F8F4EE) is the design as it
// stands. The others swap the Light canvas and sheet. Raised surfaces stay white. Dark stays as is.
export const CANVAS_OPTIONS = [
  ['white', '#FFFFFF'],
  ['paper', '#FBF9F5'],
  ['linen', '#F8F4EE'],
  ['sand', '#F4F0E8'],
  ['oat', '#EDE7DC'],
  ['stone', '#E3DDD3'],
];
export const BACKGROUNDS = Object.fromEntries(CANVAS_OPTIONS.map(([k, hex]) => [k, k === 'linen' ? {} : { 'bg/color-canvas': hex, 'bg/color-sheet': hex }]));
export const resolveColor = (scheme, background, name) => {
  const over = scheme === 'light' ? BACKGROUNDS[background] : null;
  return over && over[name] !== undefined ? over[name] : colors[scheme][name];
};

export function useTheme() {
  const { scheme, reduceMotion, background = 'linen', tiles = 'grid' } = useContext(ThemeContext);
  const c = (name) => {
    const v = resolveColor(scheme, background, name);
    if (v === undefined && typeof console !== 'undefined') console.warn('Unknown token', name);
    return v;
  };
  return { scheme, dark: scheme === 'dark', c, reduceMotion, tiles };
}

// withAlpha('#F4F0E8', 0.85) -> 'rgba(244,240,232,0.85)'. For fills that let a blur show through, like the nav bar.
export function withAlpha(color, a) {
  const hex = /^#([0-9a-f]{6})$/i.exec(color || '');
  if (hex) {
    const n = parseInt(hex[1], 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }
  const rgb = /rgba?\(([^)]+)\)/.exec(color || '');
  if (rgb) { const [r, g, b] = rgb[1].split(',').map((x) => parseFloat(x)); return `rgba(${r},${g},${b},${a})`; }
  return color;
}

// type('BodyM', 'bold') -> { fontSize, lineHeight, letterSpacing, fontFamily, fontWeight }
export function type(style, weight = 'medium') {
  const [fontSize, lineHeight, letterSpacing] = textStyles[style];
  // Headings are always Tenor Sans, whatever weight is asked for. Everything else is PT Sans.
  const face = /^H\d$/.test(style) ? fonts.heading : fonts[weight];
  return { fontSize, lineHeight, letterSpacing, ...face[FONT_TARGET] };
}

// Inside a bottom sheet, fields, chips, tiles and the close button sit on bg/color-sheet-raised, one tonal step from the sheet
// (sand/20 on the beige sheet in Light, sand/80 in Dark). On a sheet they drop their edge, the fill does the work.
export const OnSheet = createContext(false);
export const useOnSheet = () => useContext(OnSheet);
export const useRaised = () => (useContext(OnSheet) ? 'bg/color-sheet-raised' : 'bg/color-surface-raised');

export { colors, spacing, radius, elevation, elevationNative, primitives, textStyles, fonts };
