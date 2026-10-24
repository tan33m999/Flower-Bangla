// ============================================================
// controls.js
// The control panel: its groups and items, how each item changes
// the state, and the events that start everything.
// To add a control: add a key to DEFAULTS (config.js), then add one
// line to CONTROLS below. Use the helper functions for each type.
// ============================================================

const slider = (key, label, min, max, step, fmt, hint) => ({ type: 'range', key, label, min, max, step, fmt, hint });
const sel = (key, label, options, hint) => ({ type: 'select', key, label, options, hint });
const col = (key, label, hint) => ({ type: 'color', key, label, hint });
const chk = (key, label, hint) => ({ type: 'check', key, label, hint });
const btn = (label, action, hint, id) => ({ type: 'button', label, action, hint, id });
const pct = v => Math.round(v * 100) + '%';
const x2 = v => v.toFixed(2) + '×';
const int = v => String(Math.round(v));
const dec = v => v.toFixed(2);

const CONTROLS = [
  { group: 'Text', items: [
    sel('font', 'Font', FONT_LABELS, 'The Bangla typeface for the letters.'),
    col('textColor', 'Letter colour'),
    chk('textGrad', 'Colour gradient on letters', 'Blends from the letter colour to the end colour.'),
    col('textColor2', 'Gradient end colour'),
    sel('gradDir', 'Gradient direction', [['h', 'Left to right'], ['v', 'Top to bottom']]),
    slider('textOpacity', 'Letter transparency', 0, 1, 0.05, pct, '0% hides the letters, so only flowers show.'),
    slider('textSize', 'Text size', 0.6, 1.4, 0.05, x2),
    slider('bend', 'Curve the text', 0, 1, 0.05, dec,
           'Bends the line into an arc. Each letter turns to follow it, and the flowers follow too.'),
    chk('letterRise', 'Letters rise in one by one', 'Each letter lifts into place during the bloom.'),
  ]},
  { group: 'Layout', items: [
    sel('pattern', 'Arrangement', [
      ['cluster', 'On the letters'], ['edge', 'Along the letter outline'], ['scatter', 'Scattered'],
      ['grid', 'Grid'], ['vine', 'Ring around the text'],
    ], 'Where the flowers are placed.'),
    slider('density', 'How many flowers', 0.5, 2, 0.05, x2, 'More flowers means a richer look, but it runs slower.'),
    slider('size', 'Flower size', 0.5, 1.8, 0.05, x2),
    btn('Shuffle (new random layout)', () => { state.seed = (Math.random() * 1e9) | 0; relayout(); },
        'Keeps your settings and makes a new random arrangement.'),
  ]},
  { group: 'Flowers', items: [
    sel('flower', 'Flower type', [
      ['mixed', 'Mixed'], ['peony', 'Peony'], ['rose', 'Rose'], ['daisy', 'Daisy'],
      ['cosmos', 'Cosmos'], ['marigold', 'Marigold'], ['jasmine', 'Jasmine'],
    ]),
    sel('color', 'Colour', [
      ['mixed', 'Mixed'], ['position', 'By position (warm left, cool right)'], ['pink', 'Pink'],
      ['red', 'Red'], ['violet', 'Violet'], ['white', 'White'], ['marigold', 'Marigold'], ['blush', 'Blush'],
    ]),
    slider('flowerOpacity', 'Flower transparency', 0, 1, 0.05, pct, 'Lower values let the letters and background show through.'),
    sel('layer', 'Place flowers', [
      ['behind', 'Behind the letters'], ['front', 'In front of the letters'], ['both', 'Mixed'],
    ]),
    slider('shadow', 'Shadow under flowers', 0, 1, 0.05, dec),
  ]},
  { group: 'Leaves', open: false, items: [
    slider('leaves', 'Leaves per flower', 0, 4, 1, int),
    sel('leafTone', 'Leaf colour', [
      ['mixed', 'Mixed'], ['0', 'Fresh green'], ['1', 'Deep green'], ['2', 'Light green'], ['3', 'Autumn olive'],
    ]),
    chk('veins', 'Leaf veins', 'Fine lines across each leaf.'),
  ]},
  { group: 'Flower veins (stems)', items: [
    chk('connect', 'Connect flowers with veins', 'Draws growing stems between nearby flowers.'),
    slider('veinDensity', 'Vein density', 0, 1, 0.05, pct,
           'How many veins join the flowers. 0% has no veins, 100% joins each flower to more neighbours.'),
    sel('veinStyle', 'Vein style', VEIN_STYLE_LABELS,
        'Thin vine, thick stem, twisted rope, flat ribbon, or wire with coils. Mixed picks a random style for each vein.'),
    sel('veinDir', 'Growth direction', [
      ['a2b', 'Grow from the first flower'], ['b2a', 'Grow from the second flower'], ['random', 'Random'],
    ], 'Which end the vein starts from, so it looks like it grows out of a flower.'),
    slider('veinWidth', 'Vein thickness', 0, 1, 0.05, dec),
    slider('veinCurve', 'How curvy veins are', 0, 1, 0.05, dec, 'Higher values make a bigger arc between flowers.'),
    slider('veinWobble', 'Wobble', 0, 1, 0.05, dec, 'How much the veins sway when ambient motion is on.'),
    slider('branches', 'Side branches per vein', 0, 2, 1, int),
    chk('tendrils', 'Curly tendrils at tips', 'A small curl at the end of some veins.'),
    chk('veinGradient', 'Colour changes along the vein', 'Blends from the base colour to the tip colour.'),
    col('veinColor', 'Vein base colour'),
    col('veinTipColor', 'Vein tip colour'),
    slider('veinOpacity', 'Vein transparency', 0, 1, 0.05, pct,
           'Lower values let the letters and flowers show through the veins.'),
    chk('leafStems', 'Stems from flowers to each leaf', 'Thin stems that join each leaf to its flower.'),
  ]},
  { group: 'Motion', items: [
    sel('animStyle', 'Bloom animation', ANIM_LABELS,
        'How the flowers open: one after another from the left, outward from the centre, in a spiral, drifting in from outside, or at random.'),
    slider('speed', 'Animation speed', 0.5, 2, 0.1, x2, 'Speeds up or slows down everything, on screen and in the video.'),
    chk('idle', 'Ambient motion', 'Sway, breathing, sparkle and falling petals. Starts after the bloom.'),
    chk('shimmer', 'Light sweep on letters', 'A soft shine that passes over the letters. Turn off to stop it.'),
    slider('sway', 'Sway', 0, 1, 0.05, dec),
    slider('breath', 'Breathing', 0, 1, 0.05, dec),
    chk('breeze', 'Mouse breeze', 'Flowers move away from the cursor.'),
  ]},
  { group: 'Background and effects', items: [
    col('bg', 'Background colour'),
    slider('vignette', 'Dark edges (vignette)', 0, 1, 0.05, pct, 'Darkens the corners to focus on the centre.'),
    slider('grain', 'Paper grain', 0, 1, 0.05, pct, 'A subtle texture, like printed paper.'),
    slider('fall', 'Falling petals', 0, 40, 1, int),
    slider('sparkle', 'Dew sparkle', 0, 1, 0.05, pct),
  ]},
  { group: 'Export', open: false, items: [
    btn('Save PNG', () => saveImage('png'), 'The finished bloom on your background colour.'),
    btn('Save JPG', () => saveImage('jpg'), 'The same image as JPG.'),
    slider('exportHold', 'Video: seconds of motion at the end', 0, 10, 1, int,
           'The video starts at the first bud, then keeps moving for this long.'),
    btn('Record video (MP4 or WebM)', recordVideo, 'Records the bloom from the start, then ambient motion.', 'recBtn'),
  ]},
  { group: 'Save and share', open: false, items: [
    btn('Copy design code', copyDesign, 'A short code that recreates this design.'),
    btn('Load design code', loadDesign, 'Paste a code to restore a design.'),
  ]},
];

const ctl = {};   // key -> { el, out, fmt, type }

function relayout() {
  layout();
  ensureLoop();
}

let layoutTimer = null;
function scheduleLayout() {
  clearTimeout(layoutTimer);
  layoutTimer = setTimeout(relayout, 80);
}

// Called after any control changes. Layout keys rebuild, others only redraw.
function onChange(key, immediate) {
  if (key === 'font') { refresh(); return; }
  if (LAYOUT_KEYS.has(key)) {
    if (immediate) relayout();
    else scheduleLayout();
  }
  ensureLoop();
}

function hintEl(text) {
  const h = document.createElement('div');
  h.className = 'hint';
  h.textContent = text;
  return h;
}

function buildItem(it) {
  const wrap = document.createElement('div');
  wrap.className = 'item';

  if (it.type === 'button') {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = tr(it.label);
    if (it.id) b.id = it.id;
    b.addEventListener('click', it.action);
    wrap.appendChild(b);
    if (it.hint) wrap.appendChild(hintEl(tr(it.hint)));
    return wrap;
  }

  let el, out = null;
  if (it.type === 'check') {
    const head = document.createElement('div');
    head.className = 'head';
    const lab = document.createElement('label');
    lab.className = 'check';
    el = document.createElement('input');
    el.type = 'checkbox';
    lab.append(el, tr(it.label));
    head.appendChild(lab);
    wrap.appendChild(head);
    el.addEventListener('change', () => { state[it.key] = el.checked; onChange(it.key, true); });
  } else {
    const head = document.createElement('div');
    head.className = 'head';
    const name = document.createElement('span');
    name.textContent = tr(it.label);
    head.appendChild(name);

    if (it.type === 'range') {
      out = document.createElement('span');
      out.className = 'val';
      head.appendChild(out);
      el = document.createElement('input');
      el.type = 'range';
      el.min = it.min; el.max = it.max; el.step = it.step;
      el.addEventListener('input', () => {
        state[it.key] = parseFloat(el.value);
        out.textContent = it.fmt(state[it.key]);
        onChange(it.key, false);
      });
    } else if (it.type === 'color') {
      el = document.createElement('input');
      el.type = 'color';
      el.addEventListener('input', () => { state[it.key] = el.value; onChange(it.key, true); });
    } else {
      el = document.createElement('select');
      for (const [v, l] of it.options) {
        const o = document.createElement('option');
        o.value = v;
        o.textContent = tr(l);
        el.appendChild(o);
      }
      el.addEventListener('change', () => { state[it.key] = el.value; onChange(it.key, true); });
    }
    wrap.appendChild(head);
    wrap.appendChild(el);
  }
  if (it.hint) wrap.appendChild(hintEl(tr(it.hint)));
  ctl[it.key] = { el, out, fmt: it.fmt || dec, type: it.type };
  return wrap;
}

function buildPanel() {
  const body = $('panelBody');
  for (const grp of CONTROLS) {
    const d = document.createElement('details');
    d.className = 'group';
    d.open = grp.open !== false;
    const s = document.createElement('summary');
    s.textContent = tr(grp.group);
    d.appendChild(s);
    const inner = document.createElement('div');
    inner.className = 'gbody';
    for (const it of grp.items) inner.appendChild(buildItem(it));
    d.appendChild(inner);
    body.appendChild(d);
  }
}

// Fills the "Start from a look" menu from LOOK_LABELS in config.js.
function buildLookMenu() {
  const lookEl = $('look');
  const keep = lookEl.value;
  for (const [v, l] of LOOK_LABELS) {
    const o = document.createElement('option');
    o.value = v;
    o.textContent = tr(l);
    lookEl.appendChild(o);
  }
  lookEl.value = keep || 'custom';
}

// Writes the current state into every control on the panel.
function syncControls() {
  for (const key in ctl) {
    const c = ctl[key];
    if (c.type === 'check') c.el.checked = !!state[key];
    else c.el.value = state[key];
    if (c.out) c.out.textContent = c.fmt(state[key]);
  }
}

function applyLook(name) {
  Object.assign(state, PRESETS[name] || {});
  syncControls();
  refresh();
}

// Rebuilds the panel in the current language. Keeps open groups and current values.
function rebuildPanel() {
  const openFlags = [...document.querySelectorAll('details.group')].map(d => d.open);
  $('panelBody').innerHTML = '';
  for (const k in ctl) delete ctl[k];
  buildPanel();
  document.querySelectorAll('details.group').forEach((d, i) => {
    if (openFlags[i] !== undefined) d.open = openFlags[i];
  });
  $('look').innerHTML = '';
  buildLookMenu();
  syncControls();
}

// Updates the fixed text on the page: buttons, labels, and the text box.
function applyLanguage() {
  document.documentElement.lang = uiLang === 'bn' ? 'bn' : 'en';
  document.querySelectorAll('[data-tr]').forEach(el => { el.textContent = tr(el.dataset.tr); });
  input.placeholder = uiLang === 'bn'
    ? 'বাংলা লিখুন... Enter দিয়ে নতুন লাইন'
    : 'Type Bangla... Press Enter for a new line';
  $('langBtn').textContent = uiLang === 'bn' ? 'English' : 'বাংলা';
  rebuildPanel();
}

function setLanguage(lang) {
  uiLang = lang;
  try { localStorage.setItem('bloomLang', lang); } catch (e) { /* storage may be blocked */ }
  applyLanguage();
}

// ---------- Events and start ----------
$('langBtn').addEventListener('click', () => setLanguage(uiLang === 'bn' ? 'en' : 'bn'));
const toggle = $('toggle');
const panel = $('panel');
toggle.addEventListener('click', () => {
  const open = panel.hidden;
  panel.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
});

$('expandAll').addEventListener('click', () => {
  document.querySelectorAll('details.group').forEach(d => { d.open = true; });
});
$('collapseAll').addEventListener('click', () => {
  document.querySelectorAll('details.group').forEach(d => { d.open = false; });
});
$('look').addEventListener('change', e => applyLook(e.target.value));

input.addEventListener('input', () => {
  state.text = input.value;
  autosize();
  clearTimeout(debounce);
  debounce = setTimeout(refresh, 250);
});

window.addEventListener('pointermove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.on = true;
  mouse.t = performance.now();
  if (state.breeze) ensureLoop();
});
window.addEventListener('mouseout', e => {
  if (!e.relatedTarget) mouse.on = false;
});

window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    fitCanvas();
    autosize();
    relayout();
  }, 150);
});

(async function boot() {
  buildPanel();
  buildLookMenu();
  syncControls();
  applyLanguage();
  input.value = state.text;
  autosize();
  await refresh();
})();
