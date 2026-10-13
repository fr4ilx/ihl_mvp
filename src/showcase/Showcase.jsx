// The page around the phone: control panel on the left, spec panel on the right.
// Not part of the app. Only the code inside the phone (src/app, src/screens, src/components, src/theme) ports to React Native.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PhoneApp from '../app/App';
import { initialNav, focusedRoute } from '../app/nav';
import { SCREENS } from '../screens';
import { FLOWS, navFromScenario, isScenario, FORM_PRESETS, formLevel, withForm } from './scenarios';
import { motion, haptics } from '../theme/motion';
import { resolveColor, CANVAS_OPTIONS } from '../theme';
import { images } from '../data';

const DEFAULTS = { network: 'online', content: 'full' };

// Version: V1 is the app without the seeker round, V2 adds it (see HANDOFF.md, V1 and V2). index.html opens on V2,
// v1.html on V1, and #v1 or #v2 in the address picks one. The Jump to list keeps the items of the version on screen:
// an item with v: 2 only exists in V2, and v1: { label, nav } is how an item reads and opens in V1.
const VERSION_HINT = {
  1: 'No quiz, Grove, groups, member questions or journey.',
  2: 'Adds the quiz, Grove, groups, member questions and the journey.',
};
const NETWORK_LABEL = { online: 'Online', slow: 'Slow', offline: 'Offline' };
const CONTENT_LABEL = { full: 'Full', empty: 'Empty' };
const startVersion = () => {
  const h = typeof window !== 'undefined' ? window.location.hash : '';
  if (h === '#v1') return 1;
  if (h === '#v2') return 2;
  return (typeof window !== 'undefined' && window.IHL_VERSION) || 2;
};
export const flowsFor = (version) => FLOWS
  .map((f) => ({ ...f, items: f.items.filter((i) => !i.v || i.v === version).map((i) => (version === 1 && i.v1 ? { ...i, ...i.v1 } : i)) }))
  .filter((f) => f.items.length);
// The spec panel for a screen in this version: V1 can have its own note and components.
export const metaFor = (meta, version) => (version === 1 && meta.v1 ? { ...meta, ...meta.v1 } : meta);

const topName = (item) => {
  const n = item.nav;
  if (n.viewer) return 'PhotoViewer';
  if (n.modal) return n.modal.name;
  const s = n.root === 'auth' ? n.auth : n.tabs[n.tab];
  return s[s.length - 1].name;
};

export default function Showcase() {
  const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [scheme, setScheme] = useState(prefersDark ? 'dark' : 'light');
  const [version, setVersion] = useState(startVersion);
  const flows = useMemo(() => flowsFor(version), [version]);
  const allItems = useMemo(() => flows.flatMap((f) => f.items), [flows]);
  const [network, setNetwork] = useState(DEFAULTS.network);
  const [content, setContent] = useState(DEFAULTS.content);
  // Who set Network and Content: 'manual' (you, it stays when you jump), 'jump' (a state in Jump to), or 'default'.
  const [ctlFrom, setCtlFrom] = useState({ network: 'default', content: 'default' });
  const [reduceMotion, setReduceMotion] = useState(false);
  const [appearance, setAppearance] = useState('automatic');
  const [background, setBackground] = useState('linen');
  const [nav, setNav] = useState(initialNav);
  const [seed, setSeed] = useState(null);
  const [dataKey, setDataKey] = useState(1);
  const [picked, setPicked] = useState('welcome');
  const [hapticLog, setHapticLog] = useState([]);
  const [pulse, setPulse] = useState(null);
  const [lastMotion, setLastMotion] = useState(null);
  const [nudge, setNudge] = useState(null);
  const [open, setOpen] = useState({ Authentication: true, Home: true, Directory: true, Community: true, Membership: true, 'My Profile': true, 'My Practice': true });
  // Network, Content, Form and Reduce motion fold away so Jump to gets the height.
  const [more, setMore] = useState(false);
  const [scale, setScale] = useState(1);
  // Present: hides both panels and asks the browser for full screen, for showing the app to clients.
  const [present, setPresent] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const pulseT = useRef();
  const nudgeT = useRef();
  const jumpList = useRef();

  const onEvent = useCallback((e) => {
    if (e.type === 'haptic') {
      setHapticLog((l) => [{ kind: e.kind, at: Date.now() }, ...l].slice(0, 5));
      setPulse({ kind: e.kind, at: Date.now() });
      clearTimeout(pulseT.current);
      pulseT.current = setTimeout(() => setPulse(null), 1400);
    }
    if (e.type === 'motion') setLastMotion({ key: e.key, at: Date.now() });
  }, []);

  useEffect(() => {
    const fit = () => {
      const h = window.innerHeight - 48;
      const w = window.innerWidth;
      const byH = h / 920;
      // While presenting the phone may grow past 100% to fill a big screen.
      const byW = present ? (w - 48) / 460 : (w < 820 ? w - 24 : 460) / 460;
      setScale(Math.min(present ? 1.6 : 1, byH, byW));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [present]);

  const fullscreenEl = () => document.fullscreenElement || document.webkitFullscreenElement;
  const enterPresent = () => {
    setPresent(true);
    const el = document.documentElement;
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    try { const r = req && req.call(el); if (r && r.catch) r.catch(() => {}); } catch (e) { /* panels still hide */ }
  };
  const exitPresent = () => {
    setPresent(false);
    setShowExit(false);
    if (fullscreenEl()) {
      const ex = document.exitFullscreen || document.webkitExitFullscreen;
      try { const r = ex && ex.call(document); if (r && r.catch) r.catch(() => {}); } catch (e) { /* already out */ }
    }
  };
  // Esc, or leaving full screen from the browser, ends Present. Exit shows while the mouse moves.
  useEffect(() => {
    if (!present) return undefined;
    let t;
    const onKey = (e) => { if (e.key === 'Escape') exitPresent(); };
    const onFs = () => { if (!fullscreenEl()) { setPresent(false); setShowExit(false); } };
    const onMove = () => { setShowExit(true); clearTimeout(t); t = setTimeout(() => setShowExit(false), 2000); };
    window.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFs);
    document.addEventListener('webkitfullscreenchange', onFs);
    window.addEventListener('mousemove', onMove);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('fullscreenchange', onFs);
      document.removeEventListener('webkitfullscreenchange', onFs);
      window.removeEventListener('mousemove', onMove);
    };
  }, [present]);

  useEffect(() => { document.documentElement.dataset.theme = scheme; }, [scheme]);

  const focused = focusedRoute(nav);
  const meta = metaFor(SCREENS[focused.name], version);

  // You changed Network or Content in the panel. It stays until you change it again or press Restart.
  const setControl = (key, value) => {
    if (key === 'network') setNetwork(value); else setContent(value);
    setCtlFrom((f) => ({ ...f, [key]: 'manual' }));
    const applies = key === 'network' ? meta.network : meta.empty;
    if (!applies) {
      setNudge(key);
      clearTimeout(nudgeT.current);
      nudgeT.current = setTimeout(() => setNudge(null), 1600);
    }
  };

  const jump = (item) => {
    if (isScenario(item)) {
      // A state that needs certain panel values sets both, and they go back to default on the next plain jump.
      setNetwork(item.network || DEFAULTS.network);
      setContent(item.content || DEFAULTS.content);
      setCtlFrom({ network: 'jump', content: 'jump' });
    } else {
      if (ctlFrom.network !== 'manual') setNetwork(DEFAULTS.network);
      if (ctlFrom.content !== 'manual') setContent(DEFAULTS.content);
      setCtlFrom((f) => ({ network: f.network === 'manual' ? 'manual' : 'default', content: f.content === 'manual' ? 'manual' : 'default' }));
    }
    setSeed(item.seed || null);
    setDataKey((k) => k + 1); // fresh sample data for every jump
    setNav(navFromScenario(item));
    setPicked(item.id);
    // On a phone the panel sits under the prototype, so bring the prototype back into view.
    if (window.innerWidth < 820) document.querySelector('.stage').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Switching the version opens the same item in the other version, or the first one of its flow when it has none.
  const switchVersion = (v) => {
    if (v === version) return;
    setVersion(v);
    try { window.history.replaceState(null, '', `#v${v}`); } catch (e) { /* file:// in some browsers */ }
    const next = flowsFor(v);
    const items = next.flatMap((f) => f.items);
    const same = items.find((i) => i.id === picked);
    const flow = FLOWS.find((f) => f.items.some((i) => i.id === picked));
    const first = flow && (next.find((f) => f.flow === flow.flow) || {}).items;
    jump(same || (first && first[0]) || items[0]);
  };

  const restart = () => {
    setNetwork(DEFAULTS.network); setContent(DEFAULTS.content); setCtlFrom({ network: 'default', content: 'default' });
    setAppearance('automatic'); setSeed(null);
    setDataKey((k) => k + 1); setNav(initialNav()); setPicked('welcome'); setHapticLog([]);
  };

  const effective = appearance === 'automatic' ? scheme : appearance;

  // Highlight the Jump to item that matches what the phone shows right now.
  const activeId = useMemo(() => {
    const here = allItems.filter((i) => topName(i) === focused.name);
    const matches = (i) => (i.network || DEFAULTS.network) === network && (i.content || DEFAULTS.content) === content;
    const pickedItem = here.find((i) => i.id === picked);
    if (pickedItem && isScenario(pickedItem) && matches(pickedItem)) return pickedItem.id;
    const scenario = here.find((i) => isScenario(i) && matches(i));
    if (scenario) return scenario.id;
    if (pickedItem && !isScenario(pickedItem)) return pickedItem.id;
    const plain = here.find((i) => !i.state);
    return plain ? plain.id : null;
  }, [picked, focused.name, network, content, allItems]);

  // Keep the highlighted item in view inside the list (never scrolls the page itself).
  useEffect(() => {
    const list = jumpList.current;
    const el = list && list.querySelector('.jump-item.is-active');
    if (!el) return;
    const lr = list.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    if (er.top < lr.top + 8) list.scrollBy({ top: er.top - lr.top - 8, behavior: 'smooth' });
    else if (er.bottom > lr.bottom - 8) list.scrollBy({ top: er.bottom - lr.bottom + 8, behavior: 'smooth' });
  }, [activeId]);

  // Form control: refill the fields of the screen in the phone.
  const formHere = !!FORM_PRESETS[focused.name];
  const [formPick, setFormPick] = useState(null);
  const formValue = formHere ? formPick || formLevel(focused) : null;
  useEffect(() => { setFormPick(null); }, [focused.key]);
  const setForm = (level) => {
    if (!formHere) { setNudge('form'); clearTimeout(nudgeT.current); nudgeT.current = setTimeout(() => setNudge(null), 1600); return; }
    setNav((n) => {
      const r = withForm(focusedRoute(n), level);
      if (n.modal) return { ...n, modal: r };
      if (n.root === 'auth') return { ...n, auth: [...n.auth.slice(0, -1), r] };
      const s = n.tabs[n.tab];
      return { ...n, tabs: { ...n.tabs, [n.tab]: [...s.slice(0, -1), r] } };
    });
    setTimeout(() => setFormPick(level), 0);
  };
  const formHint = formHere ? 'Sets the fields on this screen.' : 'Nothing to fill on this screen. Try Sign up, Log in, About you, Your practice or New post.';

  const netHint = meta.network || 'Nothing changes on this screen. Try Home, Directory, Community or New post.';
  const contentHint = meta.empty || 'Nothing changes on this screen. Try Home, Directory, Saved, Community or a conversation.';

  return (
    <div className={'page ' + (scheme === 'dark' ? 'page-dark' : 'page-light') + (present ? ' is-present' : '')}>
      <div className="page-glow" />
      <aside className="panel panel-left">
        <header className="brand">
          <div className="brand-mark"><img src={images.appIcon} alt="Indy Holistic Living app icon" /></div>
          <div>
            <div className="brand-title">Indy Holistic Living</div>
            <div className="brand-sub">iOS prototype · V{version}</div>
          </div>
        </header>

        <section className="ctl">
          <div className="ctl-pair">
            <div className="ctl">
              <div className="ctl-label">Version</div>
              <Segmented value={`v${version}`} onChange={(v) => switchVersion(v === 'v1' ? 1 : 2)} options={[['v1', 'V1'], ['v2', 'V2']]} />
            </div>
            <div className="ctl">
              <div className="ctl-label">Appearance</div>
              <Segmented value={scheme} onChange={setScheme} options={[['light', 'Light', 'sun'], ['dark', 'Dark', 'moon']]} />
            </div>
          </div>
          <div className="ctl">
            <div className="ctl-label">Background</div>
            <div className="canvas-swatches" role="radiogroup" aria-label="Background">
              {CANVAS_OPTIONS.map(([k, hex]) => (
                <button key={k} className={'canvas-swatch' + (k === background ? ' is-on' : '')} style={{ background: hex }} onClick={() => setBackground(k)} data-testid={`ctl-bg-${k}`} role="radio" aria-checked={k === background} aria-label={hex} title={hex} />
              ))}
            </div>
          </div>
          <div className="ctl-hint">{CANVAS_OPTIONS.find(([k]) => k === background)[1]}{background === 'linen' ? ' · the design' : ''}{effective === 'dark' ? ' · shows in Light only' : ''}</div>
          <div className="ctl-hint" data-testid="hint-version">{VERSION_HINT[version]}</div>
          {appearance !== 'automatic' && <div className="ctl-hint">Dark mode is {appearance === 'dark' ? 'on' : 'off'} in the app · <button className="link" onClick={() => setAppearance('automatic')}>Follow phone</button></div>}
        </section>

        <section className={'more' + (more ? ' is-open' : '')}>
          <button className="more-head" onClick={() => setMore((m) => !m)} aria-expanded={more} data-testid="more-controls">
            <span className="ctl-label">Network and content</span>
            <span className={'more-sum' + (network !== DEFAULTS.network || content !== DEFAULTS.content || reduceMotion ? ' is-set' : '')}>
              {[NETWORK_LABEL[network], CONTENT_LABEL[content], reduceMotion && 'Reduce motion'].filter(Boolean).join(' · ')}
            </span>
            <svg className={'chev' + (more ? ' is-open' : '')} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 6 6 6-6 6" /></svg>
          </button>
          {more && (
            <div className="more-body">
              <section className="ctl">
                <div className="ctl-label">Network</div>
                <Segmented value={network} onChange={(v) => setControl('network', v)} options={[['online', 'Online'], ['slow', 'Slow'], ['offline', 'Offline']]} />
                <div className={'ctl-hint' + (nudge === 'network' ? ' is-nudge' : '')} data-testid="hint-network">{netHint}</div>
              </section>
              <section className="ctl">
                <div className="ctl-label">Content</div>
                <Segmented value={content} onChange={(v) => setControl('content', v)} options={[['full', 'Full'], ['empty', 'Empty']]} />
                <div className={'ctl-hint' + (nudge === 'content' ? ' is-nudge' : '')} data-testid="hint-content">{contentHint}</div>
              </section>
              <section className="ctl">
                <div className="ctl-label">Form</div>
                <Segmented value={formValue} onChange={setForm} options={[['empty', 'Empty'], ['half', 'Half'], ['filled', 'Filled']]} />
                <div className={'ctl-hint' + (nudge === 'form' ? ' is-nudge' : '')} data-testid="hint-form">{formHint}</div>
              </section>
              <section className="ctl ctl-inline">
                <div className="ctl-label">Reduce motion</div>
                <Switch on={reduceMotion} onChange={setReduceMotion} />
              </section>
            </div>
          )}
        </section>

        <nav className="jump">
          <div className="jump-head">
            <div className="ctl-label">Jump to</div>
            <button className="restart" onClick={restart} title="Start again from Welcome" data-testid="restart">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>
              Restart
            </button>
          </div>
          <div className="jump-scroll" ref={jumpList}>
            {flows.map((f) => (
              <div key={f.flow} className="flow">
                <button className="flow-head" onClick={() => setOpen((o) => ({ ...o, [f.flow]: !o[f.flow] }))}>
                  <span>{f.flow}</span>
                  <span className="flow-count">{f.items.length}</span>
                  <svg className={'chev' + (open[f.flow] ? ' is-open' : '')} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 6 6 6-6 6" /></svg>
                </button>
                {open[f.flow] && (
                  <ul>
                    {f.items.map((i) => (
                      <li key={i.id}>
                        <button className={'jump-item' + (activeId === i.id ? ' is-active' : '') + (i.state ? ' is-state' : '')} onClick={() => jump(i)} data-testid={`jump-${i.id}`}>
                          <span className="dot" />
                          <span className="jump-label">{i.label}</span>
                          {i.state && <span className="tag">State</span>}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </nav>
      </aside>

      <main className="stage">
        {present ? (
          <button className={'present-exit' + (showExit ? ' is-on' : '')} onClick={exitPresent} data-testid="present-exit" title="Show the panels again (Esc)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /></svg>
            Exit
          </button>
        ) : (
          <button className="present-btn" onClick={enterPresent} data-testid="present" title="Hide the panels and go full screen">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
            Present
          </button>
        )}
        <div className="phone-sizer" style={{ width: 426 * scale, height: 898 * scale }}>
          <div className="phone-wrap" style={{ transform: `scale(${scale})` }}>
            <div className={'phone' + (effective === 'dark' ? ' phone-dark' : '')}>
              <span className="hw hw-action" /><span className="hw hw-vol1" /><span className="hw hw-vol2" /><span className="hw hw-power" />
              <div className="phone-screen" data-testid="phone">
                <PhoneApp
                  nav={nav}
                  setNav={setNav}
                  scheme={scheme}
                  reduceMotion={reduceMotion}
                  network={network}
                  content={content}
                  seed={seed}
                  onEvent={onEvent}
                  appearance={appearance}
                  setAppearance={setAppearance}
                  dataKey={dataKey}
                  version={version}
                  background={background}
                />
                <div className="island" />
              </div>
            </div>
            <div className={'haptic-chip' + (pulse ? ' is-on' : '')} key={pulse ? pulse.at : 'none'}>
              <span className="haptic-wave" />
              {pulse ? haptics[pulse.kind].label : ''}
            </div>
          </div>
        </div>
      </main>

      <aside className="panel panel-right">
        <div className="spec-head">
          <div className="spec-flow">{meta.flow}</div>
          <div className="spec-title">{meta.title}</div>
          <div className="spec-note">{meta.note}</div>
        </div>

        <section className="spec-sec">
          <div className="ctl-label">Components</div>
          <div className="pills">{meta.components.map((x) => <span key={x} className="pill">{x}</span>)}</div>
        </section>

        <section className="spec-sec">
          <div className="ctl-label">Motion</div>
          <ul className="motion-list">
            {meta.motion.map((k) => {
              const m = motion[k];
              const live = lastMotion && lastMotion.key === k && Date.now() - lastMotion.at < 1500;
              return (
                <li key={k} className={live ? 'is-live' : ''}>
                  <div className="m-row"><span className="m-name">{m.label}</span><span className="m-time">{m.duration === 0 ? 'Scroll linked' : `${m.duration || m.inDuration || m.cycle} ms`}</span></div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="spec-sec">
          <div className="ctl-label">Haptics</div>
          {meta.haptics.length ? (
            <div className="pills">{meta.haptics.map((k) => <span key={k} className={'pill pill-haptic' + (hapticLog[0] && hapticLog[0].kind === k && Date.now() - hapticLog[0].at < 1500 ? ' is-live' : '')}>{haptics[k].label}</span>)}</div>
          ) : <div className="muted">None on this screen</div>}
        </section>

        <section className="spec-sec">
          <div className="ctl-label">Tokens in use · {effective}</div>
          <div className="swatches">
            {['bg/color-canvas', 'bg/color-surface-raised', 'bg/color-brand', 'bg/color-brand-subtle', 'text/color-primary', 'bg/color-toast'].map((t) => (
              <div key={t} className="swatch">
                <span className="swatch-chip" style={{ background: resolveColor(effective, background, t) }} />
                <span className="swatch-name">{t.replace('/color-', ' ')}</span>
              </div>
            ))}
          </div>
        </section>

      </aside>
    </div>
  );
}

function Segmented({ value, onChange, options, small }) {
  const idx = options.findIndex(([v]) => v === value);
  // Nothing picked (Form on a screen without fields): the thumb fades out in place instead of sliding off the track.
  return (
    <div className={'seg' + (small ? ' seg-small' : '') + (idx < 0 ? ' is-idle' : '')} style={{ '--n': options.length, '--i': Math.max(idx, 0) }}>
      <span className="seg-thumb" />
      {options.map(([v, label, icon]) => (
        <button key={v} className={'seg-btn' + (v === value ? ' is-on' : '')} onClick={() => onChange(v)} data-testid={`ctl-${v}`} aria-pressed={v === value}>
          {icon === 'sun' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>}
          {icon === 'moon' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>}
          {label}
        </button>
      ))}
    </div>
  );
}

function Switch({ on, onChange }) {
  return (
    <button className={'switch' + (on ? ' is-on' : '')} role="switch" aria-checked={on} onClick={() => onChange(!on)} data-testid="ctl-reduce-motion">
      <span className="switch-knob" />
    </button>
  );
}
