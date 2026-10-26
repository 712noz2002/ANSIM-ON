/* =========================================================
   안심ON — Interactive Prototype
   ========================================================= */
(() => {
'use strict';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const app = $('#app');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------------------------------------------------------
   Icons (outline, Lucide 계열)
--------------------------------------------------------- */
const DOT = (x, y, r = 1.3) => `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor" stroke="none"/>`;
const PHONE = '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>';
const ICONS = {
  home: '<path d="M3.5 10.2 12 3.5l8.5 6.7V19a2 2 0 0 1-2 2H15v-6.2H9V21H5.5a2 2 0 0 1-2-2z"/>',
  record: '<rect x="5" y="3" width="14" height="18" rx="3.2"/><path d="M9 8.5h6M9 12h6M9 15.5h4"/>',
  chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2.5 21.5z"/>' + DOT(8, 12) + DOT(12, 12) + DOT(16, 12),
  users: '<circle cx="9" cy="8" r="4"/><path d="M2.5 21v-.5A6.5 6.5 0 0 1 9 14h0a6.5 6.5 0 0 1 6.5 6.5v.5"/><path d="M16 3.6a4 4 0 0 1 0 7.8M21.5 21v-.5a6.5 6.5 0 0 0-3.6-5.8"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  grid4: DOT(8.5, 8.5, 2.1) + DOT(15.5, 8.5, 2.1) + DOT(8.5, 15.5, 2.1) + DOT(15.5, 15.5, 2.1),
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
  phone: PHONE,
  chevD: '<path d="m6 9 6 6 6-6"/>', chevU: '<path d="m18 15-6-6-6 6"/>',
  chevR: '<path d="m9 18 6-6-6-6"/>', chevL: '<path d="m15 18-6-6 6-6"/>',
  utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>',
  droplet: '<path d="M12 21.5a6.5 6.5 0 0 0 6.5-6.5c0-1.9-.9-3.6-2.8-5.2S12.4 6 12 3.5c-.4 2.5-1.8 4.7-3.7 6.3S5.5 13.1 5.5 15a6.5 6.5 0 0 0 6.5 6.5z"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  activity: '<path d="M22 12h-4l-3 8L9 4l-3 8H2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
  pill: '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7z"/><path d="m8.5 8.5 7 7"/>',
  micOff: '<path d="M2 2l20 20"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/><path d="M5 10v2a7 7 0 0 0 12 5"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><path d="M12 19v3"/>',
  volume: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  keypad: [7, 12, 17].map((x) => [4, 9.3, 14.6].map((y) => DOT(x, y, 1.5)).join('')).join('') + DOT(12, 20, 1.5),
  hangup: '<path fill="currentColor" stroke="none" d="M2.6 13.6c5.2-4.6 13.6-4.6 18.8 0 .7.6.7 1.6.1 2.3l-1.7 1.8c-.5.5-1.4.6-2 .2l-2.3-1.5c-.4-.3-.7-.8-.7-1.3l-.1-1.9a12.6 12.6 0 0 0-5.4 0l-.1 1.9c0 .5-.3 1-.7 1.3L6.2 17.9c-.6.4-1.5.3-2-.2L2.5 15.9c-.6-.7-.6-1.7.1-2.3z"/>',
  send: '<path d="M3.4 20.4 21.5 12 3.4 3.6l2.3 7.2L14 12l-8.3 1.2z" fill="currentColor" stroke="none"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 21v-.5A6.5 6.5 0 0 1 11 14h2a6.5 6.5 0 0 1 6.5 6.5v.5"/>',
  family: '<circle cx="9" cy="7.5" r="3.5"/><circle cx="15" cy="7.5" r="3.5"/><path d="M3 20v-.5A5.5 5.5 0 0 1 8.5 14H12M12 14h3.5a5.5 5.5 0 0 1 5.5 5.5v.5H5.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
  package: '<path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"/>',
  apple: '<path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z"/><path d="M10 2c1 .5 2 2 2 5"/>',
  dots: DOT(6, 12, 1.6) + DOT(12, 12, 1.6) + DOT(18, 12, 1.6),
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  hospital: '<rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M12 7v6M9 10h6M10 21v-4h4v4"/>',
  up: '<path d="M7 17 17 7M8 7h9v9"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
  book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/>',
  logo: '<path d="M12 2.8a9.2 9.2 0 1 1-4.9 17L3 21l1.25-3.85A9.2 9.2 0 0 1 12 2.8z"/><path d="M8 12.6c1 1.7 2.4 2.5 4 2.5s3-.8 4-2.5"/>',
};
function ic(name, size = 22, sw = 2) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}
function hydrateIcons(root = document) {
  $$('[data-ic]', root).forEach((el) => {
    if (el.dataset.done) return;
    el.innerHTML = ic(el.dataset.ic, +el.dataset.s || 22, +el.dataset.w || 2);
    el.dataset.done = 1;
  });
}

/* ---------------------------------------------------------
   App state
--------------------------------------------------------- */
const appState = {
  activeTab: 'home',
  selectedDate: 22,        // 2026-10-22 (오늘)
  homePeriod: 'today',
  weeklyCategory: 'meal',
  inquiryStatus: 1,        // 0 접수 · 1 병원 확인중 · 2 확인 결과 · 3 다음 계획 · 4 확인 완료
  inquiryGroup: 'mine',
  careFilter: 'all',
  recExpanded: false,
  visit: null,
  chatStage: 0,
  chatStarted: false,
};
const TODAY = 22;
const WD = ['일', '월', '화', '수', '목', '금', '토'];
const wdOf = (d, m = 9) => WD[new Date(2026, m, d).getDay()];

/* ---------------------------------------------------------
   Frame (desktop) / Mobile
--------------------------------------------------------- */
let SCALE = 1;
// 앱은 항상 375 × 812(iPhone X) 캔버스. 화면 크기에 맞춰 비율을 유지한 채 확대/축소한다.
function fit() {
  const vv = window.visualViewport;
  const vw = vv ? vv.width : window.innerWidth;
  const vh = vv ? vv.height : window.innerHeight;
  const framed = vw > 520;
  document.body.classList.toggle('framed', framed);
  SCALE = framed
    ? Math.min(1.5, (vh - 64) / 812, (vw - 64) / 375)
    : Math.min(vw / 375, vh / 812);
  app.style.setProperty('--scale', SCALE);
}
window.addEventListener('resize', fit);
window.addEventListener('orientationchange', () => setTimeout(fit, 250));
window.visualViewport && window.visualViewport.addEventListener('resize', fit);
fit();

/* ---------------------------------------------------------
   Gesture helper (touch + mouse, axis lock)
--------------------------------------------------------- */
function gesture(el, o) {
  let sx, sy, lx, ly, lt, vx, vy, axis, active = false, taken = false;
  const begin = (x, y, target) => {
    if (o.canStart && !o.canStart(target)) return false;
    sx = lx = x; sy = ly = y; lt = performance.now(); vx = vy = 0; axis = null; taken = false; active = true;
    return true;
  };
  const move = (x, y, ev) => {
    if (!active) return;
    const dx = (x - sx) / SCALE, dy = (y - sy) / SCALE;
    const now = performance.now(), dt = Math.max(1, now - lt);
    vx = (x - lx) / SCALE / dt; vy = (y - ly) / SCALE / dt; lx = x; ly = y; lt = now;
    if (!axis) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      taken = o.take ? o.take(axis, dx, dy) : axis === o.axis;
      if (!taken) { active = false; return; }
      o.start && o.start(axis);
    }
    if (ev.cancelable) ev.preventDefault();
    o.move && o.move(dx, dy);
  };
  const finish = () => {
    if (!active) return;
    active = false;
    if (taken) {
      o.end && o.end((lx - sx) / SCALE, (ly - sy) / SCALE, vx, vy);
      el._dragged = true; setTimeout(() => (el._dragged = false), 60);
    }
  };
  if (!o.mouseOnly) {
    el.addEventListener('touchstart', (e) => { if (e.touches.length > 1) { active = false; return; } const t = e.touches[0]; begin(t.clientX, t.clientY, e.target); }, { passive: true });
    el.addEventListener('touchmove', (e) => { const t = e.touches[0]; move(t.clientX, t.clientY, e); }, { passive: false });
    el.addEventListener('touchend', finish);
    el.addEventListener('touchcancel', finish);
  }
  el.addEventListener('mousedown', (e) => {
    if (e.button !== 0 || e.target.closest('input')) return;
    if (!begin(e.clientX, e.clientY, e.target)) return;
    const mm = (ev) => move(ev.clientX, ev.clientY, ev);
    const mu = () => { finish(); window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', mu); };
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseup', mu);
  });
  el.addEventListener('click', (e) => { if (el._dragged) { e.stopPropagation(); e.preventDefault(); } }, true);
}

function longPress(el, ms, cb) {
  let t;
  const start = (e) => { clearTimeout(t); t = setTimeout(() => { el._lp = true; cb(e); setTimeout(() => (el._lp = false), 400); }, ms); };
  const cancel = () => clearTimeout(t);
  el.addEventListener('touchstart', start, { passive: true });
  el.addEventListener('mousedown', start);
  ['touchend', 'touchmove', 'touchcancel', 'mouseup', 'mouseleave'].forEach((n) => el.addEventListener(n, cancel, { passive: true }));
  el.addEventListener('contextmenu', (e) => e.preventDefault());
  el.addEventListener('click', (e) => { if (el._lp) { e.stopPropagation(); e.preventDefault(); } }, true);
}

/* ---------------------------------------------------------
   Toast
--------------------------------------------------------- */
const toastEl = $('#toast');
let toastT;
function toast(msg, ms = 20