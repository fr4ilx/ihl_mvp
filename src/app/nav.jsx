// A small navigator with the same shape as React Navigation:
//   navigation.navigate('ListingProfile', { id }), navigation.goBack(), switchTab('community'),
//   openModal('NewPost'), openViewer(photos, index), enterApp(), signOut().
// In the React Native app use expo-router or React Navigation (native stack + bottom tabs):
//   root stack  -> (auth) group: Welcome, SignUp, LogIn, ForgotPassword, AccountType, AboutYou, Interests,
//                  PracticeBasics, PracticePlace, Preparing
//               -> (tabs) group: Home stack, Directory stack, Community stack, My Profile stack
//                  (My Practice stack for practitioner accounts)
//               -> NewPost (fullScreenModal), PhotoViewer (transparentModal)
import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTheme, ThemeContext } from '../theme';
import { motion } from '../theme/motion';

const NavContext = createContext(null);
const RouteContext = createContext(null);
export const useNav = () => useContext(NavContext);
export const useRoute = () => useContext(RouteContext);

// The status bar style, the way <StatusBar style="light" /> from expo-status-bar works on a focused screen. A screen
// asks for light text while a photo sits under the status bar (Listing profile). The focused route's choice wins.
export const StatusBarContext = createContext(() => {});
export function useStatusBarStyle(style) {
  const set = useContext(StatusBarContext);
  const ctx = useContext(RouteContext);
  const key = ctx && ctx.route && ctx.route.key;
  useEffect(() => {
    if (!key) return undefined;
    set(key, style);
    return () => set(key, null);
  }, [key, style]);
}

let seq = 1;
export const mk = (name, params = {}) => ({ key: `${name}-${seq++}`, name, params });

// The fourth tab is My Profile for a seeker and My Practice for a practitioner.
export const TAB_ROOTS = { home: 'Home', directory: 'Directory', community: 'Community', profile: 'MyProfile' };
export const tabRoots = (role) => Object.fromEntries(Object.entries(TAB_ROOTS).map(([t, name]) => [t, [mk(t === 'profile' && role === 'practitioner' ? 'MyPractice' : name)]]));

export function initialNav() {
  return {
    root: 'auth',
    auth: [mk('Welcome')],
    tab: 'home',
    tabs: tabRoots(),
    modal: null,
    viewer: null,
  };
}

// The route that is on screen right now (for the spec panel).
export function focusedRoute(nav) {
  if (nav.viewer) return { name: 'PhotoViewer', params: nav.viewer };
  if (nav.modal) return nav.modal;
  const stack = nav.root === 'auth' ? nav.auth : nav.tabs[nav.tab];
  return stack[stack.length - 1];
}

export function makeNavApi(setNav, onEvent) {
  const ev = (key) => onEvent && onEvent({ type: 'motion', key });
  const edit = (fn) => setNav((n) => fn({ ...n, tabs: { ...n.tabs } }));
  const stackOf = (n) => (n.root === 'auth' ? 'auth' : n.tab);
  const getStack = (n) => (n.root === 'auth' ? n.auth : n.tabs[n.tab]);
  const setStack = (n, s) => { if (n.root === 'auth') n.auth = s; else n.tabs[n.tab] = s; return n; };
  return {
    navigate: (name, params) => { ev('push'); edit((n) => setStack(n, [...getStack(n), mk(name, params)])); },
    replace: (name, params) => edit((n) => { const s = getStack(n); return setStack(n, [...s.slice(0, -1), mk(name, params)]); }),
    goBack: () => {
      edit((n) => {
        if (n.viewer) { ev('viewer'); n.viewer = null; return n; }
        if (n.modal) { ev('modal'); n.modal = null; return n; }
        const s = getStack(n);
        if (s.length > 1) { ev('pop'); return setStack(n, s.slice(0, -1)); }
        return n;
      });
    },
    popToTop: () => edit((n) => setStack(n, getStack(n).slice(0, 1))),
    switchTab: (tab) => {
      edit((n) => {
        if (n.tab === tab) { if (n.tabs[tab].length > 1) { ev('pop'); n.tabs[tab] = n.tabs[tab].slice(0, 1); } return n; }
        ev('tab'); n.tab = tab; return n;
      });
    },
    // Opens a tab on a fresh root, for links between tabs like Find a farm (Directory with Farms picked).
    openTab: (tab, name, params) => { ev('tab'); edit((n) => { n.tab = tab; n.tabs[tab] = [mk(name, params)]; return n; }); },
    // A seeker lands on Home. A practitioner has no Home: they land on My Practice, their first tab.
    enterApp: ({ role, tab = role === 'practitioner' ? 'profile' : 'home' } = {}) => { ev('fadeThrough'); edit((n) => ({ ...n, root: 'main', tab, tabs: tabRoots(role), modal: null, viewer: null })); },
    signOut: () => { ev('fadeThrough'); edit((n) => ({ ...n, root: 'auth', auth: [mk('Welcome')], modal: null, viewer: null })); },
    openModal: (name, params) => { ev('modal'); edit((n) => ({ ...n, modal: mk(name, params) })); },
    closeModal: () => { ev('modal'); edit((n) => ({ ...n, modal: null })); },
    // After posting: close the modal and open the new post in the Community tab.
    closeModalAndPush: (tab, name, params) => { ev('modal'); edit((n) => { n.modal = null; n.tab = tab; n.tabs[tab] = [n.tabs[tab][0], mk(name, params)]; return n; }); },
    openViewer: (photos, index = 0) => { ev('viewer'); edit((n) => ({ ...n, viewer: { key: `viewer-${seq++}`, photos, index } })); },
    closeViewer: () => { ev('viewer'); edit((n) => ({ ...n, viewer: null })); },
    stackOf,
  };
}

export function NavProvider({ api, children }) {
  return <NavContext.Provider value={api}>{children}</NavContext.Provider>;
}

// ---------- Stack with iOS push and pop ----------
export function StackView({ routes, screens, active = true }) {
  const { reduceMotion, dark } = useTheme();
  const nav = useNav();
  const [layers, setLayers] = useState(() => routes.map((r) => ({ route: r, phase: 'idle' })));
  const prev = useRef(routes);
  const [drag, setDrag] = useState(null); // edge swipe back: dx in px
  const D = reduceMotion ? 0 : motion.push.duration;

  useLayoutEffect(() => {
    const pk = prev.current.map((r) => r.key);
    const nk = routes.map((r) => r.key);
    prev.current = routes;
    if (pk.join() === nk.join()) { setLayers(routes.map((r) => ({ route: r, phase: 'idle' }))); return; }
    const isPush = nk.length > pk.length && pk.every((k, i) => nk[i] === k);
    const isPop = nk.length < pk.length && nk.every((k, i) => pk[i] === k);
    if (isPush && !reduceMotion) {
      setLayers(routes.map((r, i) => ({ route: r, phase: i === routes.length - 1 ? 'enter' : 'idle' })));
      requestAnimationFrame(() => requestAnimationFrame(() => setLayers((ls) => ls.map((l) => (l.phase === 'enter' ? { ...l, phase: 'idle' } : l)))));
    } else if (isPop && !reduceMotion) {
      const leaving = layersRef.current.filter((l) => !nk.includes(l.route.key)).map((l) => ({ ...l, phase: 'leave' }));
      setLayers([...routes.map((r) => ({ route: r, phase: 'idle' })), ...leaving]);
      const t = setTimeout(() => setLayers((ls) => ls.filter((l) => l.phase !== 'leave')), D + 40);
      return () => clearTimeout(t);
    } else {
      setLayers(routes.map((r) => ({ route: r, phase: 'idle' })));
    }
  }, [routes]);
  const layersRef = useRef(layers);
  layersRef.current = layers;

  const liveCount = layers.filter((l) => l.phase !== 'leave').length;
  const topIdx = liveCount - 1;

  // Edge swipe back, like iOS. Start within 24px of the left edge.
  const onPointerDown = (e) => {
    if (topIdx < 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scale = rect.width / 402;
    const x = (e.clientX - rect.left) / scale;
    if (x > 24) return;
    const startX = e.clientX;
    const move = (ev) => setDrag(Math.max(0, (ev.clientX - startX) / scale));
    const up = (ev) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      const dx = (ev.clientX - startX) / scale;
      setDrag(null);
      if (dx > 120) nav.goBack();
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <div className="stack" onPointerDown={onPointerDown}>
      {layers.map((l, i) => {
        const Comp = screens[l.route.name].component;
        let x = 0, dim = 0, shadow = false, visible = true;
        if (l.phase === 'enter' || l.phase === 'leave') { x = 402; shadow = true; }
        else if (i < topIdx) { x = 402 * motion.push.parallax; dim = 1; visible = i === topIdx - 1; }
        else if (i === topIdx && layers.some((o) => o.phase !== 'idle')) shadow = true;
        if (drag != null) {
          if (i === topIdx) { x = drag; shadow = true; }
          if (i === topIdx - 1) { x = 402 * motion.push.parallax * (1 - drag / 402); dim = 1 - drag / 402; }
        }
        const transition = drag != null || reduceMotion ? 'none' : `transform ${D}ms ${motion.push.easing}`;
        return (
          <div
            key={l.route.key}
            className={'stack-layer' + (shadow ? ' has-shadow' : '')}
            style={{ transform: `translateX(${x}px)`, transition, visibility: visible || l.phase !== 'idle' ? undefined : 'hidden', zIndex: i }}
            aria-hidden={i !== topIdx}
          >
            <RouteContext.Provider value={{ route: l.route, focused: active && i === topIdx }}>
              <Comp />
            </RouteContext.Provider>
            <div className="stack-dim" style={{ opacity: dim * (dark ? 0.5 : 0.12) * (1), transition: drag != null || reduceMotion ? 'none' : `opacity ${D}ms ${motion.push.easing}` }} />
          </div>
        );
      })}
    </div>
  );
}

// ---------- Tabs: four stacks, the active one visible ----------
export function TabsView({ nav, screens }) {
  const { reduceMotion } = useTheme();
  return (
    <div className="stack">
      {Object.entries(nav.tabs).map(([tab, routes]) => {
        const on = tab === nav.tab;
        const D = motion.tab.duration;
        // The new tab fades in on top. The old one stays fully opaque underneath until the fade ends,
        // so the canvas never dips. Native tabs swap without a see-through moment too.
        return (
          <div key={tab} className="tab-layer" style={{ opacity: on ? 1 : 0, visibility: on ? 'visible' : 'hidden', transition: reduceMotion ? 'none' : on ? `opacity ${D}ms ${motion.tab.easing}, visibility 0ms` : `opacity 0ms linear ${D}ms, visibility 0ms linear ${D}ms`, zIndex: on ? 2 : 1 }}>
            <StackView routes={routes} screens={screens} active={on} />
          </div>
        );
      })}
    </div>
  );
}

// ---------- Root: auth or app, cross-fade between them ----------
export function RootView({ nav, screens }) {
  const { reduceMotion } = useTheme();
  const [shown, setShown] = useState([nav.root]);
  useEffect(() => {
    if (shown[shown.length - 1] === nav.root) return;
    setShown((s) => [...s.filter((r) => r !== nav.root), nav.root]);
    const t = setTimeout(() => setShown([nav.root]), reduceMotion ? 0 : motion.fadeThrough.duration);
    return () => clearTimeout(t);
  }, [nav.root]);
  return (
    <div className="stack">
      {shown.map((r) => (
        <div key={r} className={'root-layer' + (r === nav.root && shown.length > 1 ? ' fx-root-in' : '')} style={{ zIndex: r === nav.root ? 2 : 1 }}>
          {r === 'auth' ? <StackView routes={nav.auth} screens={screens} active={nav.root === 'auth' && !nav.modal} /> : <TabsView nav={nav} screens={screens} />}
        </div>
      ))}
    </div>
  );
}

// ---------- Full screen modal (New post) ----------
export function ModalView({ route, screens }) {
  const { reduceMotion } = useTheme();
  const [current, setCurrent] = useState(route);
  const [open, setOpen] = useState(false);
  const D = reduceMotion ? 0 : motion.modal.duration;
  useEffect(() => {
    if (route) { setCurrent(route); requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true))); }
    else { setOpen(false); const t = setTimeout(() => setCurrent(null), D); return () => clearTimeout(t); }
  }, [route && route.key]);
  if (!current) return null;
  const Comp = screens[current.name].component;
  return (
    <div className="modal-layer" style={{ transform: `translateY(${open ? 0 : 874}px)`, transition: `transform ${D}ms ${motion.modal.easing}` }}>
      <RouteContext.Provider value={{ route: current, focused: !!route && route.key === current.key }}>
        <Comp key={current.key} />
      </RouteContext.Provider>
    </div>
  );
}

// ---------- Photo viewer ----------
export function ViewerView({ viewer, screens }) {
  const { reduceMotion } = useTheme();
  const [current, setCurrent] = useState(viewer);
  const [open, setOpen] = useState(false);
  const D = reduceMotion ? 0 : motion.viewer.duration;
  useEffect(() => {
    if (viewer) { setCurrent(viewer); requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true))); }
    else { setOpen(false); const t = setTimeout(() => setCurrent(null), D); return () => clearTimeout(t); }
  }, [viewer]);
  if (!current) return null;
  const Comp = screens.PhotoViewer.component;
  // The viewer is always dark, like Photos on iOS.
  return (
    <div className="viewer-layer" style={{ opacity: open ? 1 : 0, transform: `scale(${open ? 1 : motion.viewer.fromScale})`, transition: `opacity ${D}ms ${motion.viewer.easing}, transform ${D}ms ${motion.viewer.easing}` }}>
      <ThemeContext.Provider value={{ scheme: 'dark', reduceMotion }}>
        <RouteContext.Provider value={{ route: { name: 'PhotoViewer', params: current }, focused: true }}>
          <Comp key={current.key} />
        </RouteContext.Provider>
      </ThemeContext.Provider>
    </div>
  );
}
