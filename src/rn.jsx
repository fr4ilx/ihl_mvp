// A tiny web version of the React Native building blocks.
// The screens and components import View, Text, Pressable, TextInput, ScrollView, Image and StyleSheet
// from this file. In the React Native app, change the import to 'react-native' (and Image to 'expo-image')
// and the style objects keep working, because only React Native style keys are used.

import React, { createContext, forwardRef, useContext, useLayoutEffect, useRef, useState } from 'react';

const PX_KEYS = new Set([
  'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
  'top', 'left', 'right', 'bottom',
  'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
  'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
  'borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius',
  'borderWidth', 'borderTopWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderRightWidth',
  'fontSize', 'lineHeight', 'letterSpacing', 'gap', 'rowGap', 'columnGap', 'flexBasis',
]);

function flatten(style) {
  if (!style) return {};
  if (Array.isArray(style)) return style.reduce((acc, s) => Object.assign(acc, flatten(s)), {});
  return style;
}

// React Native style object -> DOM style object
export function toCSS(style) {
  const s = flatten(style);
  const out = {};
  for (const [k, v] of Object.entries(s)) {
    if (v === undefined || v === null) continue;
    switch (k) {
      case 'paddingHorizontal': out.paddingLeft = px(v); out.paddingRight = px(v); break;
      case 'paddingVertical': out.paddingTop = px(v); out.paddingBottom = px(v); break;
      case 'marginHorizontal': out.marginLeft = px(v); out.marginRight = px(v); break;
      case 'marginVertical': out.marginTop = px(v); out.marginBottom = px(v); break;
      case 'transform':
        out.transform = Array.isArray(v)
          ? v.map((t) => Object.entries(t).map(([fn, val]) => `${fn}(${typeof val === 'number' && !['scale', 'scaleX', 'scaleY'].includes(fn) ? (fn.startsWith('rotate') ? val + 'deg' : val + 'px') : val})`).join(' ')).join(' ')
          : v;
        break;
      case 'resizeMode': out.objectFit = v === 'stretch' ? 'fill' : v; break;
      case 'flex':
        if (typeof v === 'number') { out.flexGrow = v; out.flexShrink = v > 0 ? 1 : 0; out.flexBasis = v > 0 ? 0 : 'auto'; }
        else out.flex = v;
        break;
      case 'tintColor': case 'includeFontPadding': case 'textAlignVertical': break;
      default:
        out[k] = typeof v === 'number' && PX_KEYS.has(k) ? px(v) : v;
    }
  }
  const hasBorder = ['borderWidth', 'borderTopWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderRightWidth'].some((k) => s[k]);
  if (hasBorder && !s.borderStyle) out.borderStyle = 'solid';
  return out;
}
const px = (v) => (typeof v === 'number' ? `${v}px` : v);

export const StyleSheet = {
  create: (styles) => styles,
  flatten,
  absoluteFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  hairlineWidth: 0.5,
};

const InText = createContext(false);

// A View inside Text sits in the line like a word, the way React Native draws inline views (bottom on the baseline).
export const View = forwardRef(function View({ style, children, pointerEvents, testID, accessibilityLabel, className, ...rest }, ref) {
  const inline = useContext(InText);
  const css = toCSS(style);
  if (pointerEvents === 'none') css.pointerEvents = 'none';
  if (inline) return <span ref={ref} className={'rn-view-inline' + (className ? ' ' + className : '')} style={{ display: 'inline-flex', ...css }} data-testid={testID} aria-label={accessibilityLabel} {...pass(rest)}>{children}</span>;
  const cls = 'rn-view' + (pointerEvents === 'box-none' ? ' pe-box-none' : '') + (className ? ' ' + className : '');
  return (
    <div ref={ref} className={cls} style={css} data-testid={testID} aria-label={accessibilityLabel} {...pass(rest)}>
      {children}
    </div>
  );
});
export function Text({ style, children, numberOfLines, onPress, selectable, className, testID, ...rest }) {
  const nested = useContext(InText);
  const css = toCSS(style);
  if (numberOfLines === 1) {
    // One line truncates on that line with an ellipsis, like React Native, never at a word break.
    // pre keeps the double spaces around a middle dot.
    css.whiteSpace = 'pre';
    css.overflow = 'hidden';
    css.textOverflow = 'ellipsis';
    if (css.minWidth == null) css.minWidth = 0;
    if (css.maxWidth == null) css.maxWidth = '100%';
  } else if (numberOfLines) {
    css.display = '-webkit-box';
    css.WebkitLineClamp = numberOfLines;
    css.WebkitBoxOrient = 'vertical';
    css.overflow = 'hidden';
  }
  const Tag = nested ? 'span' : 'div';
  return (
    <InText.Provider value>
      <Tag className={(nested ? 'rn-text-inline' : 'rn-text') + (className ? ' ' + className : '')} style={css} onClick={onPress} data-testid={testID} {...pass(rest)}>{children}</Tag>
    </InText.Provider>
  );
}

// Pressable: onPress, disabled, style and children can be functions of { pressed }.
// accessible={false}: a tap area that is not its own accessibility element, like a text field's label that focuses it.
export function Pressable({ style, children, onPress, disabled, hitSlop, accessible = true, accessibilityRole, accessibilityLabel, testID, onPressIn, onPressOut, className, ...rest }) {
  const [pressed, setPressed] = useState(false);
  const s = typeof style === 'function' ? style({ pressed }) : style;
  const css = toCSS(s);
  const down = () => { if (disabled) return; setPressed(true); onPressIn && onPressIn(); };
  const up = () => { setPressed(false); onPressOut && onPressOut(); };
  return (
    <div
      className={'rn-view rn-pressable' + (accessible ? '' : ' is-plain') + (disabled ? ' is-disabled' : '') + (className ? ' ' + className : '')}
      role={accessible ? accessibilityRole || 'button' : undefined}
      aria-label={accessibilityLabel}
      aria-disabled={(accessible && disabled) || undefined}
      tabIndex={!accessible ? undefined : disabled ? -1 : 0}
      data-testid={testID}
      style={css}
      onPointerDown={down}
      onPointerUp={up}
      onPointerLeave={up}
      onPointerCancel={up}
      onClick={(e) => { if (disabled) return; e.stopPropagation(); onPress && onPress(e); }}
      onKeyDown={accessible ? (e) => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onPress && onPress(e); } } : undefined}
      {...pass(rest)}
    >
      {typeof children === 'function' ? children({ pressed }) : children}
      {hitSlop != null && <span aria-hidden style={slopStyle(hitSlop, flatten(s))} />}
    </div>
  );
}

// hitSlop grows the touch area without changing layout, like React Native. It counts from the outer edge, so a border
// (inside which an absolute child sits on the web) adds to it.
function slopStyle(h, st = {}) {
  const s = typeof h === 'number' ? { top: h, bottom: h, left: h, right: h } : h;
  const b = (side) => st[`border${side}Width`] ?? st.borderWidth ?? 0;
  return { position: 'absolute', top: -(s.top || 0) - b('Top'), bottom: -(s.bottom || 0) - b('Bottom'), left: -(s.left || 0) - b('Left'), right: -(s.right || 0) - b('Right') };
}

export const TextInput = forwardRef(function TextInput(
  { style, value, onChangeText, placeholder, placeholderTextColor, secureTextEntry, multiline, autoFocus, onFocus, onBlur, onSubmitEditing, onContentSizeChange, keyboardType, autoCapitalize, editable = true, testID, returnKeyType, ...rest },
  ref
) {
  const css = toCSS(style);
  // onContentSizeChange, as in React Native: a multiline field reports the height its text needs, so it can grow.
  const own = useRef(null);
  const setRef = (el) => { own.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; };
  useLayoutEffect(() => {
    const el = own.current;
    if (!multiline || !onContentSizeChange || !el) return;
    const keep = el.style.height;
    el.style.height = '0px';
    const h = el.scrollHeight;
    el.style.height = keep;
    onContentSizeChange({ nativeEvent: { contentSize: { width: el.clientWidth, height: h } } });
  }, [value, multiline]);
  const common = {
    ref: setRef,
    className: 'rn-input',
    style: { ...css, '--ph': placeholderTextColor },
    value,
    placeholder,
    autoFocus,
    readOnly: !editable,
    'data-testid': testID,
    onFocus,
    onBlur,
    onChange: (e) => onChangeText && onChangeText(e.target.value),
    onKeyDown: (e) => { if (!multiline && e.key === 'Enter' && onSubmitEditing) onSubmitEditing(); },
    autoCapitalize: autoCapitalize === 'none' ? 'off' : undefined,
    inputMode: keyboardType === 'email-address' ? 'email' : keyboardType === 'number-pad' ? 'numeric' : undefined,
  };
  return multiline ? <textarea {...common} /> : <input type={secureTextEntry ? 'password' : 'text'} {...common} />;
});

export const ScrollView = forwardRef(function ScrollView({ style, contentContainerStyle, horizontal, children, showsVerticalScrollIndicator, showsHorizontalScrollIndicator, onScroll, testID, ...rest }, ref) {
  const css = toCSS(style);
  return (
    <div ref={ref} className={'rn-view rn-scroll' + (horizontal ? ' is-horizontal' : '')} style={css} onScroll={onScroll && ((e) => { const t = e.currentTarget; onScroll({ nativeEvent: { contentOffset: { x: t.scrollLeft, y: t.scrollTop }, contentSize: { width: t.scrollWidth, height: t.scrollHeight }, layoutMeasurement: { width: t.clientWidth, height: t.clientHeight } } }); })} data-testid={testID} {...pass(rest)}>
      <div className="rn-view" style={{ ...(horizontal ? { flexDirection: 'row' } : {}), ...toCSS(contentContainerStyle) }}>{children}</div>
    </div>
  );
});

// Image: source is a module (string url in the prototype) or { uri }.
export function Image({ source, style, resizeMode = 'cover', accessibilityLabel, ...rest }) {
  const src = typeof source === 'string' ? source : source && source.uri;
  const css = toCSS([{ objectFit: resizeMode === 'contain' ? 'contain' : resizeMode === 'stretch' ? 'fill' : 'cover' }, style]);
  return <img className="rn-image" src={src} alt={accessibilityLabel || ''} style={css} draggable={false} {...pass(rest)} />;
}

// Drop React Native only props so they don't reach the DOM.
function pass(rest) {
  const out = {};
  for (const [k, v] of Object.entries(rest)) {
    if (k.startsWith('on') || k.startsWith('aria-') || k.startsWith('data-') || k === 'id' || k === 'role' || k === 'tabIndex') out[k] = v;
  }
  return out;
}

export const Platform = { OS: 'web', select: (o) => o.web ?? o.default };

// Svg, Rect, Path, Circle and G: in the app these come from react-native-svg (same names and props).
export const Svg = ({ children, style, ...props }) => <svg style={toCSS(style)} {...props}>{children}</svg>;
export const Rect = (props) => <rect {...props} />;
export const Path = (props) => <path {...props} />;
export const Circle = (props) => <circle {...props} />;
export const G = ({ children, ...props }) => <g {...props}>{children}</g>;
