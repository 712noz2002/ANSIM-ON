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
function toast(msg, ms = 2000) {
  $('span', toastEl).textContent = msg;
  toastEl.classList.toggle('low', current === 'call');
  toastEl.classList.toggle('high', current === 'chat');
  toastEl.classList.remove('on');
  void toastEl.offsetWidth;
  toastEl.classList.add('on');
  clearTimeout(toastT);
  toastT = setTimeout(() => toastEl.classList.remove('on'), ms);
}

/* ---------------------------------------------------------
   Bottom Sheet (공통)
--------------------------------------------------------- */
const bs = $('#bs'), bsBody = $('#bsBody'), bsDim = $('#bsDim');
const Sheet = {
  isOpen: false,
  open(html, onOpen) {
    const wasOpen = this.isOpen;
    bsBody.innerHTML = html;
    hydrateIcons(bsBody);
    bsBody.scrollTop = 0;
    if (wasOpen) { bsBody.classList.remove('swap'); void bsBody.offsetWidth; bsBody.classList.add('swap'); }
    bs.style.transform = '';
    bs.classList.add('open');
    bsDim.classList.add('open');
    this.isOpen = true;
    onOpen && onOpen(bsBody);
  },
  close() {
    bs.classList.remove('open', 'drag');
    bs.style.transform = '';
    bsDim.classList.remove('open');
    this.isOpen = false;
    document.activeElement && document.activeElement.blur && document.activeElement.blur();
  },
};
bsDim.addEventListener('click', () => Sheet.close());
gesture(bs, {
  take: (axis, dx, dy) => axis === 'y' && dy > 0 && bsBody.scrollTop <= 0,
  start: () => bs.classList.add('drag'),
  move: (dx, dy) => { bs.style.transform = `translateY(${Math.max(0, dy)}px)`; },
  end: (dx, dy, vx, vy) => {
    bs.classList.remove('drag');
    if (dy > 90 || vy > 0.6) Sheet.close();
    else bs.style.transform = '';
  },
});

/* ---------------------------------------------------------
   Navigation (tabs + stack)
--------------------------------------------------------- */
const stacks = { home: ['home'], record: ['record'], inquiry: ['inquiry'], together: ['together'] };
let current = 'home';
const nav = $('#nav'), statusbar = $('#statusbar');

function go(id, kind) {
  if (id === current) return;
  const from = $('#s-' + current), to = $('#s-' + id);
  onLeave(current);
  from.classList.remove('in-tab', 'in-push', 'in-back');
  from.classList.add('out');
  setTimeout(() => { if (from.classList.contains('out')) from.classList.remove('active', 'out'); }, 210);
  to.classList.remove('out', 'in-tab', 'in-push', 'in-back');
  to.classList.add('active');
  void to.offsetWidth;
  to.classList.add('in-' + kind);
  to.addEventListener('animationend', () => to.classList.remove('in-' + kind), { once: true });
  current = id;
  chrome();
  onEnter(id);
}
function chrome() {
  $$('button', nav).forEach((b) => b.classList.toggle('on', b.dataset.tab === appState.activeTab));
  nav.classList.toggle('hidden', current === 'call');
  const bar = $('#s-' + current).dataset.bar;
  statusbar.classList.toggle('dark', bar === 'dark');
}
function tab(t) {
  Sheet.close();
  if (t === appState.activeTab) {
    if (stacks[t].length > 1) { stacks[t] = [t]; go(t, 'back'); }
    else { const sc = $('#s-' + t + ' .scroll'); sc && sc.scrollTo({ top: 0, behavior: 'smooth' }); }
    return;
  }
  appState.activeTab = t;
  go(stacks[t][stacks[t].length - 1], 'tab');
}
function push(id) {
  const st = stacks[appState.activeTab];
  st.push(id);
  go(id, 'push');
}
function back() {
  const st = stacks[appState.activeTab];
  if (st.length > 1) { st.pop(); go(st[st.length - 1], 'back'); }
}
function openInInquiry(id) {
  // 다른 탭에서 문의 탭의 하위 화면으로 이동
  appState.activeTab = 'inquiry';
  stacks.inquiry = ['inquiry', id];
  go(id, 'tab');
}

function onEnter(id) {
  if (id === 'status') startStatusDemo();
  if (id === 'call') startCall();
  if (id === 'inquiry') renderStepper();
  if (id === 'chat') setTimeout(scrollChat, 60);
  if (id === 'together') setTimeout(() => $('#spotHint').classList.add('hide'), 3200);
}
function onLeave(id) {
  if (id === 'status') stopStatusDemo();
  if (id === 'call') stopCall();
  if (id === 'together') closeSpot();
  if (id === 'home') hideTip();
}

/* ---------------------------------------------------------
   Count-up
--------------------------------------------------------- */
function countUp(el, to, dur = 800) {
  const t0 = performance.now();
  const step = (t) => {
    const p = Math.min(1, (t - t0) / dur);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* =========================================================
   HOME — 오늘
========================================================= */
function animateToday() {
  const arcs = $$('#todayView .g-arc[data-f]');
  arcs.forEach((a) => { a.style.transition = 'none'; a.style.strokeDashoffset = 101; });
  $$('#todayView .sbar').forEach((b) => b.classList.add('zero'));
  void document.body.offsetWidth;
  requestAnimationFrame(() => {
    arcs.forEach((a, i) => {
      a.style.transition = `stroke-dashoffset 1.1s cubic-bezier(.22,.8,.25,1) ${i * 0.08}s`;
      a.style.strokeDashoffset = 101 - parseFloat(a.dataset.f) * 100;
    });
    $$('#todayView .sbar').forEach((b) => b.classList.remove('zero'));
    countUp($('#careCount'), 6, 900);
    $$('#todayView [data-count]').forEach((el) => countUp(el, +el.dataset.count, 900));
  });
}

const DETAIL = {
  meal: `
    <h3 class="sh-title">오늘의 식사</h3>
    <p class="sh-sub">10월 22일 목요일</p>
    <div class="sh-list">
      <div class="sh-row"><span class="l"><span class="sh-ic">${ic('utensils', 18)}</span>아침 <small style="color:#929BAD;font-weight:500">07:30</small></span><span class="r"><b>80%</b></span></div>
      <div class="sh-row"><span class="l"><span class="sh-ic">${ic('utensils', 18)}</span>점심 <small style="color:#929BAD;font-weight:500">12:30</small></span><span class="r"><b>70%</b></span></div>
      <div class="sh-row"><span class="l"><span class="sh-ic" style="background:#F2F3F6;color:#929BAD">${ic('utensils', 18)}</span>저녁 <small style="color:#929BAD;font-weight:500">18:00</small></span><span class="r">예정</span></div>
    </div>
    <div class="sh-hero"><span>오늘 평균</span><b>75<small>%</small></b></div>
    <button class="btn-line" data-act="goto-record">돌봄 기록에서 보기</button>`,
  rehab: `
    <h3 class="sh-title">오늘의 재활</h3>
    <p class="sh-sub">담당 물리치료사가 기록했어요</p>
    <div class="sh-list">
      <div class="sh-row"><span class="l"><span class="sh-ic">${ic('activity', 18)}</span>보행 보조 운동</span><span class="r"><b>11:20</b></span></div>
    </div>
    <div class="sh-hero"><span>운동 시간</span><b>20<small>분</small></b></div>
    <button class="btn-line" data-act="goto-record">돌봄 기록에서 보기</button>`,
  pos: `
    <h3 class="sh-title">오늘 체위 변경</h3>
    <p class="sh-sub">2시간마다 자세를 바꾸고 피부 상태를 확인해요</p>
    <div class="sh-list">
      ${['08:30', '10:30', '12:30', '14:30'].map((t, i) => `<div class="sh-row"><span class="l"><span class="sh-ic">${ic('refresh', 17)}</span>${t}</span><span class="r">${i === 1 ? '피부 상태 확인' : '자세 변경'}</span></div>`).join('')}
    </div>
    <div class="sh-hero"><span>오늘 총</span><b>4<small>회</small></b></div>`,
};

/* =========================================================
   HOME — 이번 주
========================================================= */
const WEEK_DAYS = [16, 17, 18, 19, 20, 21, 22];
const WEEK = {
  meal: { vals: [69, 78, 80, 79, 77, 94, null], max: 100, hi: [1, 5], unit: '%', tip: '평균 식사량',
    stats: [[72, '%', '평균 식사량', 74], [5, '건', '재활 운동', 50], [21, '건', '위생·생활', 80]],
    note: '지난주보다 3%p 늘었어요 · 7일 모두 기록됨' },
  rehab: { vals: [20, 15, 25, 20, 30, 20, null], max: 30, hi: [1, 4], unit: '분', tip: '재활 운동',
    stats: [[130, '분', '총 운동 시간', 68], [5, '회', '보행 연습', 70], [6, '일', '참여한 날', 86]],
    note: '지난주보다 20분 늘었어요 · 6일 참여' },
  hygiene: { vals: [3, 3, 2, 3, 4, 3, null], max: 4, hi: [2, 4], unit: '건', tip: '위생 관리',
    stats: [[21, '건', '위생·생활', 80], [7, '회', '목욕·세면', 70], [14, '회', '구강 관리', 76]],
    note: '매일 위생 관리가 이어졌어요 · 7일 모두 기록됨' },
  cond: { vals: [82, 85, 70, 88, 86, 90, null], max: 100, hi: [2, 5], unit: '점', tip: '컨디션 지수',
    stats: [[85, '점', '평균 컨디션', 85], [7, '시간', '평균 수면', 72], [0, '건', '특이 증상', 3]],
    note: '일요일 낮잠 후 컨디션이 회복됐어요 · 안정적이에요' },
};
const barH = (v, max) => 30 + (v / max) * 100 * 1.14;
const chart = $('#chart');

function renderWeek(animate = true) {
  const c = WEEK[appState.weeklyCategory];
  hideTip();
  chart.classList.remove('show');
  chart.innerHTML = `
    <div class="dash" style="top:23px"></div><div class="dash" style="top:84px"></div><div class="dash" style="top:144px"></div>
    <div class="cols">${WEEK_DAYS.map((d, i) => {
      const v = c.vals[i], today = v == null, hi = c.hi.includes(i);
      const h = today ? 134 : barH(v, c.max);
      const valBottom = hi ? 32 + h + 6 : 32 + h - 24;
      return `<div class="col${hi ? ' hi' : ''}${today ? ' today' : ''}" data-i="${i}">
        <i class="cap"></i><span class="chg">변화</span>
        <i class="bar" style="height:${h}px;transition-delay:${animate ? i * 0.05 : 0}s"></i>
        ${today ? '' : `<span class="val" style="bottom:${valBottom}px">${v}</span>`}
        <span class="day">${today ? '오늘' : wdOf(d)}</span>
        <button class="hit" data-act="bar" data-i="${i}" aria-label="${d}일"></button>
      </div>`;
    }).join('')}</div>
    <div class="tip" id="tip"></div>`;
  requestAnimationFrame(() => requestAnimationFrame(() => chart.classList.add('show')));

  $('#weekStats').innerHTML = c.stats.map(([v, u, l, w]) =>
    `<div class="stat"><span class="sv"><b data-count="${v}">0</b><small>${u}</small></span><span class="sbar zero"><i style="--w:${w}%"></i></span><span class="sl">${l}</span></div>`).join('');
  requestAnimationFrame(() => {
    $$('#weekStats .sbar').forEach((b) => b.classList.remove('zero'));
    $$('#weekStats [data-count]').forEach((el) => countUp(el, +el.dataset.count, 700));
  });
  $('#weekNote').innerHTML = `<i>${ic('up', 12, 2.8)}</i>${c.note}`;
}

function showTip(i) {
  const c = WEEK[appState.weeklyCategory];
  const tip = $('#tip');
  const col = $(`.col[data-i="${i}"]`, chart);
  $$('.col', chart).forEach((x) => x.classList.toggle('sel', x === col));
  const d = WEEK_DAYS[i], v = c.vals[i];
  const label = `10월 ${d}일 ${wdOf(d)}요일`;
  tip.innerHTML = v == null
    ? `<span>${label}</span><b style="font-size:13px">오늘 기록이 진행 중이에요</b>`
    : `<span>${label}</span>${c.tip} <b>${v}${c.unit}</b>`;
  const h = v == null ? 134 : barH(v, c.max);
  const top = col.classList.contains('hi') ? 0 : 235 - 32 - h - (v == null ? 0 : 0);
  const cx = col.offsetLeft + col.offsetWidth / 2;
  tip.style.top = Math.max(0, top - 2) + 'px';
  // 좌우 화면 밖으로 나가지 않도록 보정
  tip.style.left = cx + 'px';
  tip.classList.add('on');
  const w = tip.offsetWidth, cw = chart.offsetWidth;
  const clamped = Math.min(Math.max(cx, w / 2 - 8), cw - w / 2 + 8);
  tip.style.left = clamped + 'px';
  tip.style.setProperty('--ax', `${50 + ((cx - clamped) / w) * 100}%`);
}
function hideTip() {
  const tip = $('#tip');
  tip && tip.classList.remove('on');
  $$('.col.sel', chart).forEach((x) => x.classList.remove('sel'));
}
chart.addEventListener('click', (e) => { if (!e.target.closest('.hit')) hideTip(); });

function setPeriod(p) {
  if (p === appState.homePeriod) return;
  appState.homePeriod = p;
  $('#periodSeg').classList.toggle('right', p === 'week');
  $$('#periodSeg button').forEach((b) => b.classList.toggle('on', b.dataset.p === p));
  const show = p === 'today' ? $('#todayView') : $('#weekView');
  const hide = p === 'today' ? $('#weekView') : $('#todayView');
  hide.classList.add('fade-out');
  setTimeout(() => {
    hide.classList.add('hidden'); hide.classList.remove('fade-out');
    show.classList.remove('hidden'); show.classList.add('fade-in');
    setTimeout(() => show.classList.remove('fade-in'), 340);
    if (p === 'week') renderWeek(); else animateToday();
  }, 150);
}

/* =========================================================
   기록 — 날짜 / 타임라인
========================================================= */
const SLOT = 57, MIN_DAY = 1;
const track = $('#dateTrack');
const recSheet = $('#recSheet'), recScroll = $('#recScroll'), recContent = $('#recContent');

function buildStrip() {
  let html = '';
  for (let d = MIN_DAY; d <= 25; d++) {
    const fut = d > TODAY;
    html += `<button class="dt${fut ? ' future' : ''}${d === TODAY ? ' today' : ''}" data-act="rec-date" data-d="${d}" style="left:${(d - 1) * SLOT}px">
      <span class="wd">${d === TODAY ? '오늘' : wdOf(d)}</span><span class="num">${d}</span><i class="dot"></i>
      ${fut ? `<span class="lock">${ic('lock', 12, 2.4)}</span>` : ''}
    </button>`;
  }
  track.innerHTML = html;
}
const trackX = (sel) => (3 - (sel - 1)) * SLOT;
function updateStrip() {
  const sel = appState.selectedDate;
  track.style.transform = `translateX(${trackX(sel)}px)`;
  $$('.dt', track).forEach((b) => {
    const d = +b.dataset.d;
    b.classList.toggle('sel', d === sel);
    b.classList.toggle('near', Math.abs(d - sel) === 1 && d <= TODAY);
  });
  $('.strip-arrow.r').disabled = sel >= TODAY;
  $('.strip-arrow.l').disabled = sel <= MIN_DAY;
}

const DAY22 = {
  sum: '오늘도 식사와 위생 관리, 재활 활동이 이어졌어요.',
  items: [
    { t: '07:30', p: '아침', ic: 'utensils', title: '아침 식사', pct: 80, desc: '식사 도움 제공', more: [['시간', '07:30'], ['섭취량', '80%'], ['도움 수준', '식사 도움 제공'], ['특이사항', '없음']] },
    { t: '09:00', p: '오전', ic: 'droplet', title: '오전 위생 관리', desc: '세면 및 구강 관리 완료', more: [['시간', '09:00'], ['내용', '세면 · 구강 관리'], ['피부 상태', '양호'], ['담당', '요양보호사']] },
    { t: '10:30', p: '오전', ic: 'refresh', title: '체위 변경', desc: '자세 변경 · 피부 상태 확인', more: [['시간', '10:30'], ['자세', '좌측 → 바로 누운 자세'], ['피부 상태', '발적 없음'], ['다음 변경', '12:30']] },
    { t: '11:20', p: '오전', ic: 'activity', title: '재활 운동', desc: '보행 보조 운동 20분', more: [['시간', '11:20'], ['운동', '보행 보조 운동'], ['운동 시간', '20분'], ['컨디션', '안정적']] },
    { t: '12:30', p: '점심', ic: 'utensils', title: '점심 식사', pct: 70, desc: '특이사항 없음', more: [['시간', '12:30'], ['섭취량', '70%'], ['도움 수준', '부분 도움'], ['특이사항', '없음']] },
    { t: '15:00', p: '오후', ic: 'sun', title: '휴식 및 컨디션 확인', now: '휴식 및 컨디션 확인 · 안정적이에요', more: [['시간', '15:00'], ['체온', '36.5℃'], ['혈압', '124/78'], ['상태', '병실에서 휴식 중']] },
  ],
};
function recordsFor(d) {
  if (d === TODAY) return DAY22;
  const r = (a, b, k) => a + ((d * 37 + k * 53) % (b - a + 1));
  const b = r(68, 92, 1), l = r(62, 90, 2), dn = r(60, 88, 3), mins = [15, 20, 20, 25][d % 4];
  const sunday = new Date(2026, 9, d).getDay() === 0;
  const items = [
    { t: '07:30', p: '아침', ic: 'utensils', title: '아침 식사', pct: b, desc: b >= 75 ? '식사 도움 제공' : '천천히 드셨어요', more: [['시간', '07:30'], ['섭취량', b + '%'], ['도움 수준', '식사 도움 제공'], ['특이사항', '없음']] },
    { t: '09:00', p: '오전', ic: 'droplet', title: '오전 위생 관리', desc: d % 3 === 0 ? '목욕 및 보습 관리 완료' : '세면 및 구강 관리 완료', more: [['시간', '09:00'], ['내용', d % 3 === 0 ? '목욕 · 보습' : '세면 · 구강 관리'], ['피부 상태', '양호']] },
    { t: '10:30', p: '오전', ic: 'refresh', title: '체위 변경', desc: '자세 변경 · 피부 상태 확인', more: [['시간', '10:30'], ['피부 상태', '발적 없음']] },
    sunday
      ? { t: '11:00', p: '오전', ic: 'users', title: '가족 면회', desc: '가족과 40분 함께했어요', more: [['시간', '11:00'], ['함께한 시간', '40분'], ['장소', '1층 면회실']] }
      : { t: '11:20', p: '오전', ic: 'activity', title: '재활 운동', desc: `보행 보조 운동 ${mins}분`, more: [['시간', '11:20'], ['운동 시간', mins + '분'], ['컨디션', '안정적']] },
    { t: '12:30', p: '점심', ic: 'utensils', title: '점심 식사', pct: l, desc: '특이사항 없음', more: [['시간', '12:30'], ['섭취량', l + '%'], ['특이사항', '없음']] },
    { t: '15:00', p: '오후', ic: 'sun', title: '휴식 및 컨디션 확인', desc: '안정적이에요', more: [['시간', '15:00'], ['체온', '36.' + (d % 5 + 3) + '℃'], ['상태', '안정적']] },
    { t: '18:00', p: '저녁', ic: 'utensils', title: '저녁 식사', pct: dn, desc: dn >= 75 ? '잘 드셨어요' : '특이사항 없음', more: [['시간', '18:00'], ['섭취량', dn + '%'], ['특이사항', '없음']] },
    { t: '20:30', p: '저녁', ic: 'moon', title: '취침 준비', desc: '환복 및 취침 전 위생 관리', more: [['시간', '20:30'], ['내용', '환복 · 구강 관리'], ['수면', '21시 전후 취침']] },
  ];
  return { sum: sunday ? '가족 면회와 함께 편안한 하루를 보내셨어요.' : '식사와 위생 관리, 재활 활동이 모두 기록됐어요.', items };
}
function renderRecord(dir = 0) {
  const d = appState.selectedDate;
  const data = recordsFor(d);
  recContent.innerHTML = `
    <h3 class="rec-title">10월 ${d}일 ${wdOf(d)}요일</h3>
    <p class="rec-sum">${ic('logo', 16, 2.2)}${data.sum}</p>
    <div class="rec-div"></div>
    <div class="tl">${data.items.map((it, i) => `
      <button class="tl-item${it.now ? ' now' : ''}" data-act="tl" data-i="${i}">
        <span class="tl-time"><b>${it.t}</b><span>${it.p}</span></span>
        <span class="tl-ic">${ic(it.ic, 14, 2.2)}</span>
        <span class="tl-main">
          ${it.now ? `<span class="now-card">${it.now}</span>` : `
          <h5>${it.title}<span class="exp">${ic('chevD', 16, 2.2)}</span></h5>
          <span class="tl-desc">${it.pct != null ? `<span class="tl-prog"><i style="width:${it.pct}%"></i></span><span class="tl-pct">${it.pct}%</span>` : ''}<span>${it.desc}</span></span>`}
          <span class="tl-more"><div><div class="tl-card">${it.more.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('')}</div></div></span>
        </span>
      </button>`).join('')}
    </div>`;
  recScroll.scrollTop = 0;
  if (dir) {
    recContent.classList.remove('slide-l', 'slide-r');
    void recContent.offsetWidth;
    recContent.classList.add(dir > 0 ? 'slide-l' : 'slide-r');
  }
}
function selectDate(d, fromSwipe) {
  d = Math.max(MIN_DAY, Math.min(TODAY, d));
  const dir = Math.sign(d - appState.selectedDate);
  appState.selectedDate = d;
  updateStrip();
  if (dir) renderRecord(dir);
}
function futureNudge() {
  const f = $(`.dt[data-d="${TODAY + 1}"]`, track);
  if (f) { f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); }
  toast('아직 오지 않은 날은 볼 수 없어요');
}

// 날짜 좌우 swipe
gesture($('#strip'), {
  axis: 'x',
  canStart: (t) => !t.closest('.strip-arrow'),
  start: () => track.classList.add('drag'),
  move: (dx) => {
    const sel = appState.selectedDate;
    let x = dx;
    if ((sel >= TODAY && dx < 0) || (sel <= MIN_DAY && dx > 0)) x = dx * 0.28; // 경계 저항
    track.style.transform = `translateX(${trackX(sel) + x}px)`;
  },
  end: (dx, dy, vx) => {
    track.classList.remove('drag');
    let steps = Math.round(-dx / SLOT);
    if (steps === 0 && Math.abs(dx) > 28) steps = dx < 0 ? 1 : -1;
    if (steps === 0 && Math.abs(vx) > 0.45) steps = vx < 0 ? 1 : -1;
    const target = appState.selectedDate + steps;
    if (target > TODAY) futureNudge();
    selectDate(target, true);
    updateStrip();
  },
});

// 기록 sheet 상하 swipe
const COLLAPSED_Y = 121;
function setExpanded(v) {
  appState.recExpanded = v;
  recSheet.classList.toggle('expanded', v);
  recSheet.style.transform = '';
  $('#swipeHint').classList.toggle('hide', v);
  if (!v) recScroll.scrollTo({ top: 0 });
}
gesture(recSheet, {
  take: (axis, dx, dy) => {
    if (axis !== 'y') return false;
    if (!appState.recExpanded) return true;
    return dy > 0 && recScroll.scrollTop <= 0;
  },
  start: () => recSheet.classList.add('drag'),
  move: (dx, dy) => {
    const base = appState.recExpanded ? 0 : COLLAPSED_Y;
    let y = base + dy;
    if (y < 0) y = y * 0.25;
    if (y > COLLAPSED_Y) y = COLLAPSED_Y + (y - COLLAPSED_Y) * 0.25;
    recSheet.style.transform = `translateY(${y}px)`;
  },
  end: (dx, dy, vx, vy) => {
    recSheet.classList.remove('drag');
    if (!appState.recExpanded && (dy < -70 || vy < -0.6)) setExpanded(true);
    else if (appState.recExpanded && (dy > 70 || vy > 0.6)) setExpanded(false);
    else recSheet.style.transform = '';
  },
});
gesture($('#swipeHint'), {
  axis: 'y',
  move: (dx, dy) => { if (dy < 0) { recSheet.classList.add('drag'); recSheet.style.transform = `translateY(${Math.max(0, COLLAPSED_Y + dy)}px)`; } },
  end: (dx, dy) => { recSheet.classList.remove('drag'); if (dy < -50) setExpanded(true); else recSheet.style.transform = ''; },
});

function monthSheet() {
  const first = new Date(2026, 9, 1).getDay();
  let cells = WD.map((w) => `<span class="h">${w}</span>`).join('');
  for (let i = 0; i < first; i++) cells += '<span></span>';
  for (let d = 1; d <= 31; d++) {
    cells += `<button data-act="cal-pick" data-d="${d}" class="${d === TODAY ? 'today' : ''}${d === appState.selectedDate ? ' on' : ''}" ${d > TODAY ? 'disabled' : ''}>${d}</button>`;
  }
  Sheet.open(`<h3 class="sh-title">2026년 10월</h3><p class="sh-sub">보고 싶은 날짜를 선택하세요. 오늘 이후는 아직 기록이 없어요.</p><div class="cal">${cells}</div>`);
}

/* =========================================================
   문의
========================================================= */
const FAQ = [
  '최근 식사량이 줄어든 이유가 궁금해요.',
  '면회 때 발견한 멍을 확인하고 싶어요.',
  '오늘 재활은 어떻게 진행됐나요?',
  '최근 잠을 잘 주무시는지 궁금해요.',
];
function renderFaq() {
  $('#faqRow').innerHTML = FAQ.map((q, i) => `
    <button class="faq-card card-tap" data-act="faq" data-i="${i}">
      <b>"${q.replace(/(.{10,13}) /, '$1<br>')}"</b>
      <span>이 내용으로 문의 ${ic('chevR', 16, 2.4)}</span>
    </button>`).join('');
}
// 데스크톱 마우스로도 가로 스크롤 drag
(() => {
  const row = $('#faqRow'); let sl = 0;
  gesture(row, { mouseOnly: true, axis: 'x', start: () => { sl = row.scrollLeft; row.style.scrollSnapType = 'none'; }, move: (dx) => { row.scrollLeft = sl - dx; }, end: () => { row.style.scrollSnapType = ''; } });
})();

const RECENT = [
  { id: 'r1', ic: 'chat', title: '식사량 변화 문의', meta: '10월 18일 · 앱 문의 · 가족 공유', badge: '답변 완료' },
  { id: 'r2', ic: 'phone', title: '개인 물품 사용 관련 문의', meta: '10월 12일 · 전화 문의 · 통화 요약 저장', badge: '답변 완료' },
  { id: 'r3', ic: 'chat', title: '면회 일정 문의', meta: '10월 5일 · 앱 문의', badge: '답변 완료' },
];
function renderRecent(newId) {
  $('#recentList').innerHTML = RECENT.slice(0, 4).map((r) => `
    <button class="ri${r.id === newId ? ' new-row' : ''}" data-act="detail" data-id="${r.id}">
      <span class="ri-ic">${ic(r.ic, 20, 1.9)}</span>
      <span class="ri-t"><b>${r.title}</b><span>${r.meta}</span></span>
      <span class="ri-badge">${r.badge}</span>
    </button>`).join('');
}

const PAST = {
  mine: [
    { id: 'm1', title: '무릎 검사 일정 관련 문의', date: '2026.10.14' },
    { id: 'm2', title: '식사량 관련 문의', date: '2026.09.26' },
    { id: 'm3', title: '멍 자국 관련 문의', date: '2026.09.13' },
    { id: 'm4', title: '피부 관리 관련 문의', date: '2026.08.25' },
    { id: 'm5', title: '물품 구매 문의', date: '2026.08.02' },
  ],
  family: [
    { id: 'f1', title: '복약관리 관련 문의', date: '2026.10.22', isNew: true },
    { id: 'f2', title: '물티슈 관련 문의', date: '2026.10.19', isNew: true },
    { id: 'f3', title: '식품 반입 문의', date: '2026.09.31' },
    { id: 'f4', title: '식사량 관련 문의', date: '2026.08.17' },
    { id: 'f5', title: '물품 구매 문의', date: '2026.07.28' },
  ],
};
const QA = {
  r1: ['식사량 변화 문의', '2026.10.18 · 앱 문의 · 가족 공유', '최근 식사량이 줄었다고 들었는데 괜찮으신가요?', '최근 일주일 평균 식사량은 72%로 지난주보다 3%p 늘었어요. 금요일에는 69%로 다소 적게 드셨지만 이후 회복되었어요.'],
  r2: ['개인 물품 사용 관련 문의', '2026.10.12 · 전화 문의 · 통화 요약 저장', '보내드린 보습 로션을 사용하고 계신지 궁금해요.', '보내주신 로션은 하루 두 번 목욕 후와 취침 전에 사용하고 있어요. 남은 양이 적어지면 미리 안내드릴게요.'],
  r3: ['면회 일정 문의', '2026.10.05 · 앱 문의', '이번 주말 오전 면회가 가능한가요?', '토요일 오전 10시~12시 면회가 가능해요. 앱의 면회 예약에서 시간을 선택해주세요.'],
  m1: ['무릎 검사 일정 관련 문의', '2026.10.14 · 앱 문의', '무릎 검사는 언제 진행되나요?', '10월 20일 오전 정형외과 협진으로 X-ray 검사가 예정되어 있어요. 검사 후 결과를 안내드릴게요.'],
  m2: ['식사량 관련 문의', '2026.09.26 · 앱 문의', '요즘 식사량이 줄어든 것 같아 걱정돼요.', '최근 입맛이 줄어 죽 식단으로 조정했어요. 이후 식사량이 70% 이상으로 회복되었어요.'],
  m3: ['멍 자국 관련 문의', '2026.09.13 · 앱 문의', '손등에 멍 자국이 보였어요.', '수액 처치 부위의 멍으로 확인됐어요. 1주일 안에 자연스럽게 사라질 예정이에요.'],
  m4: ['피부 관리 관련 문의', '2026.08.25 · 전화 문의', '등 쪽 피부가 건조해 보여요.', '보습제를 하루 2회 발라드리고 있고, 체위 변경 때 피부 상태를 함께 확인하고 있어요.'],
  m5: ['물품 구매 문의', '2026.08.02 · 앱 문의', '기저귀를 병원에서 구매할 수 있나요?', '원무과에서 구매 대행이 가능해요. 다음 정산 때 함께 청구됩니다.'],
  f1: ['복약관리 관련 문의', '2026.10.22 · 가족의 문의', '혈압약 복용 시간이 바뀌었나요?', '주치의 처방에 따라 아침 식후로 변경되었어요. 복용 후 혈압도 안정적으로 유지되고 있어요.'],
  f2: ['물티슈 관련 문의', '2026.10.19 · 가족의 문의', '물티슈가 얼마나 남았는지 궁금해요.', '현재 4개 남아 있어요. 2주 정도 사용할 수 있는 양이에요.'],
  f3: ['식품 반입 문의', '2026.09.31 · 가족의 문의', '과일을 가져가도 되나요?', '껍질을 깎아 소분해 오시면 간식 시간에 드실 수 있어요.'],
  f4: ['식사량 관련 문의', '2026.08.17 · 가족의 문의', '점심을 잘 안 드신다고 들었어요.', '점심 메뉴를 부드러운 반찬 위주로 바꾼 뒤 식사량이 늘었어요.'],
  f5: ['물품 구매 문의', '2026.07.28 · 가족의 문의', '여름용 얇은 이불을 준비해야 할까요?', '병실 온도에 맞춰 병원 이불을 교체했어요. 따로 준비하지 않으셔도 괜찮아요.'],
};
function renderPast(swap) {
  const g = appState.inquiryGroup;
  $('#ptabs').classList.toggle('right', g === 'family');
  $$('#ptabs button').forEach((b) => b.classList.toggle('on', b.dataset.g === g));
  const list = $('#pastList');
  list.innerHTML = PAST[g].map((p) => `
    <button class="pi" data-act="detail" data-id="${p.id}">
      <span class="ri-ic">${ic(g === 'mine' ? 'user' : 'family', 22, 1.9)}${p.isNew ? '<i class="nd"></i>' : ''}</span>
      <span style="flex:1;min-width:0"><b>${p.title}</b><span class="d">${p.date}</span></span>
      <span class="chev">${ic('chevR', 22, 2)}</span>
    </button>`).join('');
  const n = PAST.family.filter((p) => p.isNew).length;
  const fb = $('#famBadge'); fb.textContent = n; fb.classList.toggle('zero', !n);
  if (swap) { list.classList.remove('swap'); void list.offsetWidth; list.classList.add('swap'); }
}
function openDetail(id) {
  const q = QA[id]; if (!q) return;
  const isFam = id[0] === 'f';
  const fam = PAST.family.find((p) => p.id === id);
  if (fam && fam.isNew) { fam.isNew = false; renderPast(); }
  $('#detailBody').innerHTML = `
    <div class="dt-head">
      <span class="tag${isFam ? ' fam' : ''}">${isFam ? '가족의 문의' : (q[1].includes('전화') ? '전화 문의' : '나의 문의')}</span>
      <h2>${q[0]}</h2><p>${q[1]}</p>
    </div>
    <div class="vt detail-vt">
      <div class="vt-item"><i class="vt-dot"></i><h5>문의 내용</h5><time>${q[1].split(' · ')[0]}</time><div class="vt-box" style="background:#F5F6FA;color:#3A4255">${q[2]}</div></div>
      <div class="vt-item"><i class="vt-dot"></i><h5>병원 답변</h5><time>담당 간호사</time><div class="vt-box">${q[3]}</div></div>
      <div class="vt-item cur"><i class="vt-dot"></i><h5>확인 완료</h5><time>문의가 완료되었어요</time>
        <div class="vt-done"><span class="lg">${ic('logo', 20, 2.2)}</span>${isFam ? '가족이 남긴 문의도 함께 확인할 수 있어요.' : '해당 문의가 완료되었어요.'}</div></div>
      <button class="add-q blue" data-act="add-q">추가 질문하기</button>
    </div>`;
  if (appState.activeTab !== 'inquiry') openInInquiry('detail'); else push('detail');
}

/* 진행 중 문의 — 스테퍼 */
const STEPS = [
  { t: '문의 접수', d: '2026.10.22 10:20', box: '문의 주제 : 이동 중 멍 확인', type: 'info' },
  { t: '병원 확인중', d: '2026.10.22 12:20', box: '담당 간호사 확인 중 · 오늘 중 답변 예정', type: 'status' },
  { t: '병원 확인 결과', d: '2026.10.22 14:45', box: '오늘 오전 이동 중 침상 변경 과정에서 생긴 멍을 확인했어요. 현재 통증은 없고 상태를 관찰하고 있습니다.', type: 'info' },
  { t: '다음 계획', d: '2026.10.22 14:45', box: '상태 변화가 있으면 추가 안내드리겠습니다.', type: 'info' },
  { t: '확인 완료', d: '2026.10.22 15:20', box: '해당 문의가 완료되었어요.', type: 'done' },
];
function stepIndex() { const s = appState.inquiryStatus; return s <= 0 ? 0 : s === 1 ? 1 : s < 4 ? 2 : 3; }
function renderStepper() {
  const pos = [0, 36, 63, 100], labels = ['접수', '확인 중', '답변', '완료'];
  const cur = stepIndex(), done = appState.inquiryStatus >= 4;
  $('#stepper').innerHTML = `<span class="st-line"><i style="width:${pos[cur]}%"></i></span>` +
    labels.map((l, i) => {
      const cls = done || i < cur ? 'done' : i === cur ? 'cur' : '';
      return `<span class="st-node ${cls}" style="left:calc(11px + (100% - 22px) * ${pos[i] / 100})"><span class="n">${cls === 'done' ? ic('check', 13, 3.2) : ''}</span><em>${l}</em></span>`;
    }).join('');
  $('#progHead').innerHTML = done ? '완료된 문의' : `진행 중인 문의 <i class="num-badge">1</i>`;
  const pill = $('#pastStatus');
  const s = appState.inquiryStatus;
  $('em', pill).textContent = s <= 1 ? '담당 간호사 확인 중 · 오늘 중 답변 예정' : s < 4 ? '병원 확인 결과가 도착했어요' : '확인 완료 · 문의가 완료되었어요';
  pill.classList.toggle('ok', s >= 2);
  $('#pastProgTitle').textContent = s >= 4 ? '최근 완료된 문의가 있어요.' : '진행 중인 문의가 있어요.';
}

function stepHTML(i, isCur, enter) {
  const s = STEPS[i];
  let body;
  if (s.type === 'status') body = `<div class="vt-status"><i></i>${s.box}</div>`;
  else if (s.type === 'done') body = `<div class="vt-done"><span class="lg">${ic('logo', 20, 2.2)}</span>${s.box}</div>`;
  else body = `<div class="vt-box">${s.box}</div>`;
  return `<div class="vt-item${isCur ? ' cur' : ''}${enter ? ' enter' : ''}" data-i="${i}"><i class="vt-dot"></i><h5>${s.t}</h5><time>${s.d}</time>${body}</div>`;
}
function renderStatus(enterIdx = -1) {
  const n = appState.inquiryStatus;
  let html = '';
  for (let i = 0; i <= n; i++) html += stepHTML(i, i === n, i === enterIdx);
  html += `<button class="add-q${n >= 4 ? ' blue' : ''}" data-act="add-q">추가 질문하기</button>`;
  $('#statusList').innerHTML = html;
  $('#demoHint').classList.toggle('hide', n >= 4);
}
let statusTimer = null, statusBusy = false;
async function advanceStatus() {
  if (statusBusy || appState.inquiryStatus >= 4) return;
  statusBusy = true;
  const list = $('#statusList');
  // skeleton loading
  $$('.vt-item.cur', list).forEach((x) => x.classList.remove('cur'));
  const btn = $('.add-q', list);
  const sk = document.createElement('div');
  sk.className = 'vt-item cur enter';
  sk.innerHTML = '<i class="vt-dot"></i><div class="skel s2" style="margin-top:0;width:40%"></div><div class="skel"></div>';
  list.insertBefore(sk, btn);
  scrollStatusEnd();
  await wait(750);
  appState.inquiryStatus++;
  renderStatus(appState.inquiryStatus);
  renderStepper();
  scrollStatusEnd();
  if (appState.inquiryStatus === 2) toast('병원 확인 결과가 도착했어요');
  if (appState.inquiryStatus === 4) toast('문의가 완료되었어요');
  statusBusy = false;
}
function scrollStatusEnd() { const sc = $('#statusScroll'); sc.scrollTo({ top: sc.scrollHeight, behavior: 'smooth' }); }
function startStatusDemo() {
  renderStatus();
  stopStatusDemo();
  if (appState.inquiryStatus >= 4) return;
  const loop = () => {
    statusTimer = setTimeout(async () => {
      if (current !== 'status') return;
      await advanceStatus();
      if (appState.inquiryStatus < 4) loop();
    }, 3600);
  };
  loop();
}
function stopStatusDemo() { clearTimeout(statusTimer); statusTimer = null; }
longPress($('#statusScroll'), 550, () => { stopStatusDemo(); advanceStatus().then(() => { if (current === 'status' && appState.inquiryStatus < 4) startStatusDemoKeep(); }); });
function startStatusDemoKeep() {
  stopStatusDemo();
  statusTimer = setTimeout(async function tick() {
    if (current !== 'status') return;
    await advanceStatus();
    if (appState.inquiryStatus < 4) statusTimer = setTimeout(tick, 3600);
  }, 3600);
}

/* =========================================================
   채팅 문의 (AI)
========================================================= */
const chatList = $('#chatList'), chatBody = $('#chatBody'), chatInput = $('#chatInput'), chatChips = $('#chatChips');
const S1 = '어머니 팔에 멍이 있던데, 어떻게 된 건지 궁금합니다.';
const S2 = '오늘 면회갔다가 봤는데, 저희 어머니 제대로 돌본 거 맞아요?';
const S3 = '정확히는 기억이 안 나는데, 어깨 가까이 있었어요.';
let chatBusy = false;

function scrollChat() { chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: 'smooth' }); }
function addBubble(text, who, extra = '') {
  const b = document.createElement('div');
  b.className = `bubble ${who}`;
  b.innerHTML = text.replace(/</g, '&lt;') + extra;
  chatList.appendChild(b);
  scrollChat();
  return b;
}
function setChips(arr) {
  chatChips.innerHTML = arr.map((q) => `<button class="chip" data-act="chip" data-q="${q}">${q}</button>`).join('');
  chatBody.classList.toggle('has-chips', arr.length > 0);
  setTimeout(scrollChat, 30);
}
async function aiSay(text, extra) {
  const t = document.createElement('div');
  t.className = 'bubble ai typing';
  t.innerHTML = '<i></i><i></i><i></i>';
  chatList.appendChild(t); scrollChat();
  await wait(650 + Math.random() * 250);
  t.remove();
  return addBubble(text, 'ai', extra);
}
function startChatIfNeeded() {
  if (appState.chatStarted) return;
  appState.chatStarted = true;
  const intro = $('#chatIntro');
  intro.classList.add('leave');
  setTimeout(() => intro.remove(), 280);
  addBubble('무엇이 궁금하신가요?\n편하게 말씀해주시면 확인해드릴게요.', 'ai');
}
function replyFor(text) {
  const st = appState.chatStage;
  if (st === 1) { appState.chatStage = 2; return ['멍은 팔의 어느 부위에 있었나요?', [S3]]; }
  if (st === 2) { appState.chatStage = 3; return ['네, 바로 담당자에게 확인할게요.\n오늘 발견된 어깨 근처 멍의 원인과 조치 내용을 확인해 알려드리겠습니다.', [], true]; }
  if (st >= 3) return ['말씀해주신 내용도 담당 간호사에게 함께 전달할게요. 답변이 오면 바로 알려드릴게요.', [], true];
  if (/멍|팔|상처|다치/.test(text)) { appState.chatStage = 1; return ['걱정되셨겠어요. 정확한 상황을 확인해 담당자에게 전달할게요.\n멍은 언제 발견하셨나요?', [S2]]; }
  if (/식사량|줄어/.test(text)) return ['최근 일주일 평균 식사량은 72%로 지난주보다 3%p 늘었어요. 다만 지난 금요일에는 69%로 조금 적게 드셨어요.\n담당 간호사에게 자세한 이유를 확인해드릴까요?', ['네, 확인해주세요', S1]];
  if (/식사/.test(text)) return ['오늘 아침은 80%, 점심은 70% 드셨어요. 식사 도움을 받아 천천히 드셨고 특이사항은 없었어요.', [S1, '오늘 재활은 어떻게 진행됐나요?']];
  if (/재활|운동/.test(text)) return ['오늘 11시 20분에 보행 보조 운동을 20분 진행했어요. 컨디션이 안정적이라 끝까지 잘 따라오셨어요.', [S1, '최근 잠을 잘 주무시는지 궁금해요.']];
  if (/잠|수면/.test(text)) return ['최근 일주일 평균 7시간 주무셨어요. 일요일에는 낮잠을 길게 주무신 뒤 밤에도 편안하게 쉬셨어요.', [S1]];
  if (/변화/.test(text)) return ['오늘은 컨디션이 안정적이에요. 오후 3시 확인에서도 체온 36.5℃, 혈압 124/78로 특이사항이 없었어요.', [S1]];
  if (/의료진|간호사|의사/.test(text)) return ['어떤 내용을 의료진에게 확인하고 싶으신가요? 말씀해주시면 담당 간호사에게 정확히 전달할게요.', [S1]];
  if (/행정|비용|서류/.test(text)) return ['행정 관련 문의는 원무과로 전달돼요. 비용, 서류 발급, 입·퇴원 일정 중 어떤 내용이 궁금하신가요?', ['서류 발급을 요청하고 싶어요', S1]];
  if (/네|확인해|요청/.test(text)) return ['담당 간호사에게 확인 요청을 전달했어요. 답변이 오면 알림으로 알려드릴게요.', [S1]];
  return ['말씀해주신 내용을 담당자에게 전달할게요. 조금 더 자세히 알려주시면 정확하게 확인해드릴 수 있어요.', [S1]];
}
async function sendChat(text) {
  text = (text || '').trim();
  if (!text || chatBusy) return;
  chatBusy = true;
  startChatIfNeeded();
  chatInput.value = '';
  $('#chatForm').classList.remove('prefilled');
  setChips([]);
  addBubble(text, 'me');
  const [answer, chips, done] = replyFor(text);
  await wait(250);
  const extra = done ? '<button class="go-status" data-act="go-status">문의 진행 상황 확인</button>' : '';
  await aiSay(answer, extra);
  if (done && appState.chatStage === 3 && !appState.inquiryCreated) {
    appState.inquiryCreated = true;
    setTimeout(() => toast('문의가 접수되었어요'), 300);
  }
  setChips(chips || []);
  chatBusy = false;
}
$('#chatForm').addEventListener('submit', (e) => { e.preventDefault(); sendChat(chatInput.value); chatInput.blur(); });
function openChat(prefill) {
  if (current !== 'chat') {
    if (appState.activeTab === 'inquiry' && current === 'inquiry') push('chat'); else openInInquiry('chat');
  }
  if (prefill) {
    chatInput.value = prefill;
    const f = $('#chatForm');
    f.classList.remove('prefilled'); void f.offsetWidth; f.classList.add('prefilled');
  }
  if (!appState.chatStarted && !prefill) setChips([]);
}

/* =========================================================
   전화 문의 (실시간 통화 요약)
========================================================= */
const SENTENCES = ['어머님은 오늘 점심을 70% 드셨고, ', '오후에는 병실에서 쉬고 계세요. ', '왼쪽 팔의 멍은 담당 간호사가 확인 후 다시 알려드릴게요.'];
let callSec = 0, callTimers = [], callTick = null, typeTimer = null;
function fmt(s) { return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
function startCall() {
  stopCall();
  callSec = 0;
  $('#callTimer').textContent = '00:00';
  $('#summary').innerHTML = '';
  $('#callDone').classList.remove('on');
  $('#wave').classList.remove('muted');
  $$('#s-call .cb').forEach((b) => b.classList.remove('on'));
  callTick = setInterval(() => { callSec++; $('#callTimer').textContent = fmt(callSec); }, 1000);
  SENTENCES.forEach((s, i) => callTimers.push(setTimeout(() => typeSentence(i), 900 + i * 3200)));
}
function typeSentence(i) {
  const sum = $('#summary');
  $$('span[data-i]', sum).forEach((sp) => {
    const k = +sp.dataset.i;
    sp.className = k === i - 1 ? 'prev' : 'old';
  });
  $('.caret', sum) && $('.caret', sum).remove();
  const sp = document.createElement('span');
  sp.dataset.i = i; sp.className = 'cur';
  sum.appendChild(sp);
  const caret = document.createElement('i'); caret.className = 'caret'; sum.appendChild(caret);
  const text = SENTENCES[i]; let n = 0;
  clearInterval(typeTimer);
  typeTimer = setInterval(() => {
    n++; sp.textContent = text.slice(0, n);
    if (n >= text.length) { clearInterval(typeTimer); if (i === SENTENCES.length - 1) setTimeout(() => caret.remove(), 1200); }
  }, 55);
}
function stopCall() {
  clearInterval(callTick); clearInterval(typeTimer);
  callTimers.forEach(clearTimeout); callTimers = [];
}
function endCall() {
  stopCall();
  $('#callDone').classList.add('on');
  RECENT.unshift({ id: 'c' + Date.now(), ic: 'phone', title: '오늘 통화 요약', meta: '10월 22일 · 전화 문의 · 통화 요약 저장', badge: '저장됨' });
  QA[RECENT[0].id] = ['오늘 통화 요약', '2026.10.22 · 전화 문의 · 통화 요약 저장', '오늘 어머니 상태가 궁금해서 전화드렸어요.', SENTENCES.join('')];
  PAST.mine.unshift({ id: RECENT[0].id, title: '통화 문의 · 오늘 상태 확인', date: '2026.10.22' });
  const newId = RECENT[0].id;
  setTimeout(() => {
    back();
    renderRecent(newId);
    renderPast();
    setTimeout(() => toast('통화 내용이 문의 기록에 저장되었어요'), 300);
  }, 2300);
}

/* =========================================================
   함께ON
========================================================= */
const CARE = [
  { id: 'c1', name: '물티슈', q: '4개', date: '11.06 (화)', type: 'item', spot: 'right' },
  { id: 'c2', name: '요거트', q: '6개', date: '11.06 (화)', type: 'food', spot: 'left' },
  { id: 'c3', name: '성인용 기저귀', q: '8개', date: '10.20 (수)', type: 'item', spot: 'right', warn: true },
  { id: 'c4', name: '두유', q: '1박스', date: '10.13 (금)', type: 'food', spot: 'left' },
  { id: 'c5', name: '홍삼 스틱', q: '2박스', date: '09.08 (토)', type: 'food', spot: 'bed' },
  { id: 'c6', name: '치약', q: '3개', date: '09.02 (화)', type: 'item', spot: 'right' },
  { id: 'c7', name: '면봉', q: '1통', date: '08.25 (화)', type: 'item', spot: 'right' },
];
const SPOTS = {
  left: { title: '간식 · 식품', items: [['두유', '1박스', '최근 전달 10월 13일'], ['요거트', '6개', '최근 전달 11월 6일']], pos: { left: 18, top: 50 } },
  bed: { title: '침상 주변', items: [['홍삼 스틱', '2박스', '최근 전달 9월 8일'], ['개인 수건', '3장', '세탁 후 교체 · 10월 21일']], pos: { left: 96, top: 30 } },
  right: { title: '개인 위생용품', items: [['물티슈', '4개', '최근 전달 11월 6일'], ['성인용 기저귀', '8개', '곧 부족해요 · 10월 20일', true]], pos: { right: 14, top: 39 } },
};
function renderCare(swap, newId) {
  const f = appState.careFilter;
  const tabs = $('#tgTabs');
  const idx = ['all', 'item', 'food'].indexOf(f);
  const btn = $$('button', tabs)[idx];
  $('.tg-pill', tabs).style.transform = `translateX(${btn.offsetLeft}px)`;
  $$('button', tabs).forEach((b) => b.classList.toggle('on', b.dataset.f === f));
  const list = $('#careList');
  const rows = CARE.filter((c) => f === 'all' || c.type === f);
  list.innerHTML = rows.map((c) => `
    <button class="cr${c.id === newId ? ' flash' : ''}" data-act="care-row" data-id="${c.id}">
      <i class="cd${c.warn ? ' warn' : ''}"></i><b>${c.name}</b><span class="q">${c.q}</span>
      ${c.isNew ? '<span class="new">NEW</span>' : ''}
      <span class="dd">${c.planned ? '전달 예정' : '전달일'} ${c.date}</span>
    </button>`).join('') || '<p style="padding:30px 0;text-align:center;color:#929BAD;font-size:14px">등록된 항목이 없어요</p>';
  if (swap) { list.classList.remove('swap'); void list.offsetWidth; list.classList.add('swap'); }
}
let openSpot = null;
function showSpot(key) {
  const card = $('#spotCard');
  if (openSpot === key) { closeSpot(); return; }
  openSpot = key;
  const s = SPOTS[key];
  $$('.spot').forEach((b) => b.classList.toggle('on', b.dataset.s === key));
  card.classList.remove('on');
  card.innerHTML = `<h6>${s.title}</h6>` + s.items.map(([n, q, d, w]) => `<div class="sc-item"><b>${n}<em>${q}</em></b><span class="${w ? 'warn' : ''}">${d}</span></div>`).join('');
  card.style.left = card.style.right = '';
  Object.entries(s.pos).forEach(([k, v]) => (card.style[k] = (k === 'top' ? v + '%' : v + 'px')));
  void card.offsetWidth;
  card.classList.add('on');
  $('#spotHint').classList.add('hide');
}
function closeSpot() {
  openSpot = null;
  $('#spotCard').classList.remove('on');
  $$('.spot').forEach((b) => b.classList.remove('on'));
}
$('#room').addEventListener('click', (e) => { if (!e.target.closest('.spot,.spot-card,.add-care')) closeSpot(); });

/* 돌봄 추가 */
const addForm = { type: 'item', name: '', qty: 1, date: 28 };
const DATE_OPTS = [26, 28, 30];
function addTypeSheet() {
  Sheet.open(`
    <h3 class="sh-title">무엇을 추가할까요?</h3>
    <p class="sh-sub">병실로 보낼 물품이나 계획을 함께ON에 남겨요.</p>
    <div class="types">
      <button data-act="add-type" data-t="item"><span>${ic('package', 19)}</span>물품</button>
      <button data-act="add-type" data-t="food"><span>${ic('apple', 19)}</span>식품</button>
      <button data-act="add-type" data-t="visit"><span>${ic('calendar', 19)}</span>면회</button>
      <button data-act="add-type" data-t="etc"><span>${ic('plus', 19)}</span>기타</button>
    </div>`);
}
function addFormSheet(t) {
  Object.assign(addForm, { type: t, name: '', qty: 1, date: 28 });
  const label = t === 'item' ? '물품' : t === 'food' ? '식품' : '내용';
  const sugg = t === 'item' ? ['물티슈', '보습 로션', '양말'] : t === 'food' ? ['바나나', '두유', '카스텔라'] : ['손편지', '사진 액자', '라디오'];
  Sheet.open(`
    <button class="sh-back" data-act="add-care">${ic('chevL', 18, 2.2)}다시 선택</button>
    <h3 class="sh-title">${t === 'etc' ? '기타' : label} 추가</h3>
    <div class="field"><label>${label} 이름</label>
      <input id="addName" type="text" placeholder="예: ${sugg[0]}" maxlength="14" enterkeyhint="done">
      <div class="sugg">${sugg.map((s) => `<button data-act="add-sugg" data-v="${s}">${s}</button>`).join('')}</div>
    </div>
    <div class="field"><label>수량</label>
      <div class="qty"><button data-act="qty" data-d="-1" aria-label="빼기">${ic('minus', 18, 2.4)}</button><b id="qtyVal">1</b><span class="unit">개</span><button data-act="qty" data-d="1" aria-label="더하기">${ic('plus', 18, 2.4)}</button></div>
    </div>
    <div class="field"><label>전달 예정일</label>
      <div class="dates">${DATE_OPTS.map((d) => `<button class="${d === 28 ? 'on' : ''}" data-act="add-date" data-v="${d}">10월 ${d}일</button>`).join('')}</div>
    </div>
    <button class="btn-primary" data-act="add-submit">추가하기</button>`, (body) => {
    const inp = $('#addName', body);
    inp.addEventListener('input', () => { addForm.name = inp.value; inp.classList.remove('err'); });
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') inp.blur(); });
  });
}
function submitAdd() {
  const inp = $('#addName');
  const name = (inp.value || addForm.name).trim();
  if (!name) { inp.classList.remove('err'); void inp.offsetWidth; inp.classList.add('err'); toast('이름을 입력하거나 아래에서 골라주세요'); return; }
  const id = 'n' + Date.now();
  CARE.unshift({ id, name, q: addForm.qty + '개', date: `10.${addForm.date} (${wdOf(addForm.date)})`, type: addForm.type === 'food' ? 'food' : 'item', isNew: true, planned: true });
  Sheet.close();
  if (appState.careFilter !== 'all' && appState.careFilter !== CARE[0].type) appState.careFilter = 'all';
  renderCare(true, id);
  const sc = $('#tgScroll');
  setTimeout(() => sc.scrollTo({ top: $('.tg-sheet').offsetTop - 40, behavior: 'smooth' }), 250);
  toast('돌봄에 추가했어요.');
  setTimeout(() => { const c = CARE.find((x) => x.id === id); if (c) { c.isNew = false; const el = $(`.cr[data-id="${id}"] .new`); el && (el.style.opacity = 0); } }, 6000);
}

/* =========================================================
   Sheets — 홈 상단
========================================================= */
let visitPick = null;
function visitSheet() {
  visitPick = null;
  const times = [10, 11, 14, 15, 16];
  Sheet.open(`
    <h3 class="sh-title">면회 예약</h3>
    <p class="sh-sub">면회는 30분 단위로 진행돼요.</p>
    <div class="visit-date">${ic('calendar', 18)}10월 26일 월요일</div>
    <div class="times">${times.map((h) => `<button data-act="visit-time" data-h="${h}">${h}:00<small>${h < 12 ? '오전' : '오후'}</small></button>`).join('')}</div>
    <button class="btn-primary" id="visitGo" data-act="visit-submit" disabled>면회 예약하기</button>`);
}
const hourKo = (h) => (h < 12 ? `오전 ${h}시` : `오후 ${h === 12 ? 12 : h - 12}시`);
const NOTI = () => [
  { t: '오늘 오전 가족 면회가 있었어요.', s: '오전 10:20 · 32분 함께했어요', act: 'notice', unread: true },
  { t: '오늘 돌봄 기록 6건이 등록되었어요.', s: '마지막 기록 · 오후 3:00', act: 'goto-record', unread: true },
  { t: appState.inquiryStatus >= 2 ? '문의 답변이 도착했어요.' : '문의 답변을 준비하고 있어요.', s: '왼쪽 팔의 멍에 대한 문의', act: 'goto-status', unread: appState.inquiryStatus >= 2 },
  ...(appState.visit ? [{ t: `10월 26일 ${hourKo(appState.visit)} 면회가 예약되었어요.`, s: '면회 예약', act: 'visit', unread: false }] : []),
];
const INFO = {
  patient: `<button class="sh-back" data-act="name-sheet">${ic('chevL', 18, 2.2)}뒤로</button>
    <h3 class="sh-title">환자 정보</h3>
    <div class="sh-list">
      <div class="sh-row"><span class="l">이름</span><span class="r"><b>김영숙</b></span></div>
      <div class="sh-row"><span class="l">병실</span><span class="r"><b>3병동 305호</b></span></div>
      <div class="sh-row"><span class="l">입원일</span><span class="r"><b>2026.03.12</b></span></div>
      <div class="sh-row"><span class="l">담당 간호사</span><span class="r"><b>3병동 간호팀</b></span></div>
    </div>`,
  hospital: `<button class="sh-back" data-act="name-sheet">${ic('chevL', 18, 2.2)}뒤로</button>
    <h3 class="sh-title">안심요양병원</h3>
    <div class="sh-list">
      <div class="sh-row"><span class="l">면회 시간</span><span class="r"><b>10:00 – 17:00</b></span></div>
      <div class="sh-row"><span class="l">3병동 간호실</span><span class="r"><b>내선 305</b></span></div>
      <div class="sh-row"><span class="l">원무과</span><span class="r"><b>평일 09:00 – 18:00</b></span></div>
    </div>
    <button class="btn-primary" data-act="call-from-sheet">병원에 전화하기</button>`,
  guardian: `<h3 class="sh-title">보호자 정보</h3>
    <div class="sh-list">
      <div class="sh-row"><span class="l">관계</span><span class="r"><b>자녀</b></span></div>
      <div class="sh-row"><span class="l">함께하는 가족</span><span class="r"><b>3명</b></span></div>
      <div class="sh-row"><span class="l">문의 공유</span><span class="r"><b>가족 모두에게 공유</b></span></div>
    </div>`,
  contact: `<h3 class="sh-title">병원 연락처</h3>
    <div class="sh-list">
      <div class="sh-row"><span class="l"><span class="sh-ic">${ic('hospital', 18)}</span>3병동 간호실</span><span class="r">내선 305</span></div>
      <div class="sh-row"><span class="l"><span class="sh-ic">${ic('info', 18)}</span>원무과</span><span class="r">평일 09–18시</span></div>
    </div>
    <button class="btn-primary" data-act="call-from-sheet">전화 문의하기</button>`,
  noti: `<h3 class="sh-title">알림 설정</h3>
    <div class="sh-list">
      ${['돌봄 기록 알림', '문의 답변 알림', '가족 활동 알림', '면회 일정 알림'].map((t, i) => `<div class="toggle-row">${t}<button class="tgl${i < 3 ? ' on' : ''}" data-act="toggle" aria-label="${t}"></button></div>`).join('')}
    </div>`,
  guide: `<h3 class="sh-title">앱 이용 안내</h3>
    <div class="sh-list">
      <div class="guide-step"><span class="sh-ic">${ic('home', 18)}</span><div><b>홈</b><span>오늘 / 이번 주를 눌러 돌봄 요약을 바꿔 보고, 숫자와 그래프를 눌러 자세히 보세요.</span></div></div>
      <div class="guide-step"><span class="sh-ic">${ic('record', 18)}</span><div><b>기록</b><span>날짜를 좌우로 밀어 지난 기록을 보고, 위로 올려 하루 돌봄 흐름을 확인해요.</span></div></div>
      <div class="guide-step"><span class="sh-ic">${ic('chat', 18)}</span><div><b>문의</b><span>채팅이나 전화로 문의하면 진행 상황과 통화 요약이 기록으로 남아요.</span></div></div>
      <div class="guide-step"><span class="sh-ic">${ic('users', 18)}</span><div><b>함께ON</b><span>병실 사진의 동그라미를 눌러 물품 위치를 보고, 필요한 돌봄을 추가해요.</span></div></div>
    </div>`,
};

/* =========================================================
   Actions (event delegation)
========================================================= */
const A = {
  tab: (el) => tab(el.dataset.tab),
  back: () => back(),

  avatar: () => Sheet.open(INFO.guide),
  'name-sheet': () => Sheet.open(`
    <div style="display:flex;align-items:center;gap:14px;margin-top:4px">
      <span class="sh-ic" style="width:48px;height:48px;border-radius:16px">${ic('logo', 26, 2.2)}</span>
      <div><h3 class="sh-title">김영숙 님</h3><p class="sh-sub" style="margin-top:2px">안심요양병원 · 3병동 305호</p></div>
    </div>
    <div class="sh-list">
      <button class="sh-row" data-act="info" data-k="patient"><span class="l"><span class="sh-ic">${ic('user', 18)}</span>환자 정보 보기</span><span class="r">${ic('chevR', 18)}</span></button>
      <button class="sh-row" data-act="info" data-k="hospital"><span class="l"><span class="sh-ic">${ic('hospital', 18)}</span>병원 정보 보기</span><span class="r">${ic('chevR', 18)}</span></button>
    </div>`),
  info: (el) => Sheet.open(INFO[el.dataset.k]),
  bell: (el) => {
    el.classList.add('read');
    Sheet.open(`<h3 class="sh-title">알림</h3><div class="sh-list">${NOTI().map((n) => `
      <button class="sh-noti" data-act="${n.act}"><i class="${n.unread ? 'unread' : 'read'}"></i><div><b>${n.t}</b><span>${n.s}</span></div></button>`).join('')}</div>`);
  },
  more: () => Sheet.open(`<h3 class="sh-title">더보기</h3><div class="sh-list">
      <button class="sh-row" data-act="info" data-k="guardian"><span class="l"><span class="sh-ic">${ic('user', 18)}</span>보호자 정보</span><span class="r">${ic('chevR', 18)}</span></button>
      <button class="sh-row" data-act="info" data-k="contact"><span class="l"><span class="sh-ic">${ic('phone', 18)}</span>병원 연락처</span><span class="r">${ic('chevR', 18)}</span></button>
      <button class="sh-row" data-act="info" data-k="noti"><span class="l"><span class="sh-ic">${ic('bell', 18)}</span>알림 설정</span><span class="r">${ic('chevR', 18)}</span></button>
      <button class="sh-row" data-act="info" data-k="guide"><span class="l"><span class="sh-ic">${ic('book', 18)}</span>앱 이용 안내</span><span class="r">${ic('chevR', 18)}</span></button>
    </div>`),
  toggle: (el) => el.classList.toggle('on'),
  visit: () => visitSheet(),
  'visit-time': (el) => {
    visitPick = +el.dataset.h;
    $$('.times button', bsBody).forEach((b) => b.classList.toggle('on', b === el));
    $('#visitGo').disabled = false;
  },
  'visit-submit': () => {
    if (!visitPick) return;
    appState.visit = visitPick;
    Sheet.close();
    setTimeout(() => toast(`10월 26일 ${hourKo(visitPick)}로 면회가 예약되었어요.`), 200);
  },
  ask: () => tab('inquiry'),
  notice: () => Sheet.open(`
    <h3 class="sh-title">오늘의 가족 참여</h3>
    <p class="sh-sub">10월 22일 목요일</p>
    <div class="sh-list">
      <div class="sh-row"><span class="l"><span class="sh-ic" style="background:#FFF3DF;color:#B4761A">${ic('users', 18)}</span>가족 면회</span><span class="r"><b>오전 10:20</b></span></div>
      <div class="sh-row"><span class="l"><span class="sh-ic">${ic('hospital', 18)}</span>장소</span><span class="r"><b>1층 면회실</b></span></div>
    </div>
    <div class="sh-hero"><span>함께한 시간</span><b>32<small>분</small></b></div>
    <button class="btn-line" data-act="visit">다음 면회 예약하기</button>`),
  period: (el) => setPeriod(el.dataset.p),
  stat: (el) => Sheet.open(DETAIL[el.dataset.k]),
  wcat: (el) => {
    if (appState.weeklyCategory === el.dataset.c) return;
    appState.weeklyCategory = el.dataset.c;
    $$('#wcats button').forEach((b) => b.classList.toggle('on', b === el));
    renderWeek();
  },
  bar: (el) => {
    const col = el.closest('.col');
    if (col.classList.contains('sel') && $('#tip').classList.contains('on')) hideTip();
    else showTip(+el.dataset.i);
  },
  'date-open': () => { appState.selectedDate = TODAY; updateStrip(); renderRecord(); tab('record'); },
  'goto-record': () => { Sheet.close(); A['date-open'](); },
  'goto-status': () => { Sheet.close(); openInInquiry('status'); },

  'rec-date': (el) => {
    const d = +el.dataset.d;
    if (d > TODAY) { futureNudge(); return; }
    selectDate(d);
  },
  'rec-prev': () => selectDate(appState.selectedDate - 1),
  'rec-next': () => { if (appState.selectedDate >= TODAY) futureNudge(); else selectDate(appState.selectedDate + 1); },
  'rec-expand': () => setExpanded(true),
  month: () => monthSheet(),
  'cal-pick': (el) => { Sheet.close(); selectDate(+el.dataset.d); },
  tl: (el) => {
    if (!appState.recExpanded) {
      setExpanded(true);
      setTimeout(() => { el.classList.add('open'); }, 260);
      return;
    }
    el.classList.toggle('open');
    if (el.classList.contains('open')) setTimeout(() => {
      const r = el.getBoundingClientRect(), s = recScroll.getBoundingClientRect();
      const overflow = (r.bottom - s.bottom) / SCALE + 90;
      if (overflow > 0) recScroll.scrollBy({ top: overflow, behavior: 'smooth' });
    }, 320);
  },

  call: () => { stacks.inquiry = ['inquiry']; appState.activeTab = 'inquiry'; push('call'); },
  'call-from-sheet': () => { Sheet.close(); appState.activeTab = 'inquiry'; stacks.inquiry = ['inquiry', 'call']; go('call', 'push'); },
  chat: () => openChat(),
  faq: (el) => openChat(FAQ[+el.dataset.i]),
  'prog-detail': () => { if (current === 'past') push('status'); else if (current === 'inquiry') push('status'); else openInInquiry('status'); },
  'all-past': () => push('past'),
  detail: (el) => openDetail(el.dataset.id),
  quick: (el) => sendChat(el.dataset.q),
  chip: (el) => sendChat(el.dataset.q),
  'go-status': () => push('status'),
  'add-q': () => {
    if (stacks.inquiry.includes('chat')) { stacks.inquiry = stacks.inquiry.slice(0, stacks.inquiry.indexOf('chat') + 1); go('chat', 'back'); }
    else push('chat');
    setTimeout(() => chatInput.focus({ preventScroll: true }), 320);
  },
  'past-tab': (el) => { if (appState.inquiryGroup === el.dataset.g) return; appState.inquiryGroup = el.dataset.g; renderPast(true); },

  mute: (el) => { el.classList.toggle('on'); $('#wave').classList.toggle('muted', el.classList.contains('on')); toast(el.classList.contains('on') ? '음소거되었어요' : '음소거를 해제했어요', 1400); },
  speaker: (el) => { el.classList.toggle('on'); toast(el.classList.contains('on') ? '스피커가 켜졌어요' : '스피커가 꺼졌어요', 1400); },
  keypad: () => Sheet.open(`<div class="keypad-out" id="kpOut"></div><div class="keys">${['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => `<button data-act="key" data-k="${k}">${k}</button>`).join('')}</div>`),
  key: (el) => { const o = $('#kpOut'); o.textContent = (o.textContent + el.dataset.k).slice(-14); },
  'end-call': () => endCall(),

  'add-care': () => addTypeSheet(),
  'add-type': (el) => { const t = el.dataset.t; if (t === 'visit') visitSheet(); else addFormSheet(t); },
  'add-sugg': (el) => { const inp = $('#addName'); inp.value = el.dataset.v; addForm.name = el.dataset.v; inp.classList.remove('err'); },
  qty: (el) => { addForm.qty = Math.max(1, Math.min(30, addForm.qty + +el.dataset.d)); $('#qtyVal').textContent = addForm.qty; },
  'add-date': (el) => { addForm.date = +el.dataset.v; $$('.dates button', bsBody).forEach((b) => b.classList.toggle('on', b === el)); },
  'add-submit': () => submitAdd(),
  'care-tab': (el) => { if (appState.careFilter === el.dataset.f) return; appState.careFilter = el.dataset.f; renderCare(true); },
  spot: (el) => showSpot(el.dataset.s),
  'care-row': (el) => {
    const c = CARE.find((x) => x.id === el.dataset.id);
    if (!c || !c.spot) { toast(`${c ? c.name : '항목'} · 전달 예정이에요`); return; }
    $('#tgScroll').scrollTo({ top: 0, behavior: 'smooth' });
    openSpot = null;
    setTimeout(() => showSpot(c.spot), 280);
  },
};
app.addEventListener('click', (e) => {
  const t = e.target.closest('[data-act]');
  if (!t || !app.contains(t) || t.disabled) return;
  const fn = A[t.dataset.act];
  if (fn) fn(t, e);
});
// 데모 리셋: 홈 프로필 아이콘을 길게 누르기
longPress($('.avatar'), 1200, () => Sheet.open(`
  <h3 class="sh-title">처음 상태로 되돌릴까요?</h3>
  <p class="sh-sub">전시 관람객이 바뀔 때 프로토타입을 초기화해요.</p>
  <button class="btn-primary" onclick="location.reload()">초기화하기</button>
  <button class="btn-line" onclick="document.getElementById('bsDim').click()">취소</button>`));

/* =========================================================
   Init
========================================================= */
hydrateIcons();
renderFaq();
renderRecent();
renderPast();
renderStepper();
buildStrip();
updateStrip();
renderRecord();
renderCare();
chrome();

setTimeout(() => {
  $('#splash').classList.add('out');
  animateToday();
  setTimeout(() => $('#splash').remove(), 400);
}, 750);
})();
