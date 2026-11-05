// ============================================================
// sprites.js
// Flowers, leaves, shadows and small particles are drawn once to
// small canvases, then reused with drawImage. This keeps animation fast.
// To change how a flower looks, edit here.
// ============================================================

function mk() {
  const c = document.createElement('canvas');
  c.width = SPRITE;
  c.height = SPRITE;
  return c;
}

function drawPetal(g, L, Wd, col, inner, round) {
  g.beginPath();
  g.moveTo(0, 0);
  if (round) {
    g.bezierCurveTo(Wd * 1.6, -L * 0.15, Wd * 1.5, -L * 1.1, 0, -L);
    g.bezierCurveTo(-Wd * 1.5, -L * 1.1, -Wd * 1.6, -L * 0.15, 0, 0);
  } else {
    g.bezierCurveTo(Wd * 1.5, -L * 0.2, Wd * 1.2, -L * 0.95, 0, -L);
    g.bezierCurveTo(-Wd * 1.2, -L * 0.95, -Wd * 1.5, -L * 0.2, 0, 0);
  }
  const grad = g.createLinearGradient(0, 0, 0, -L);
  grad.addColorStop(0, inner);
  grad.addColorStop(1, col);
  g.fillStyle = grad;
  g.fill();
  g.strokeStyle = 'rgba(20, 0, 10, 0.25)';
  g.lineWidth = 1.5;
  g.stroke();
}

function dotRing(g, r, count, dotR, color) {
  g.fillStyle = color;
  for (let i = 0; i < count; i++) {
    const a = (TAU * i) / count;
    g.beginPath();
    g.arc(Math.cos(a) * r, Math.sin(a) * r, dotR, 0, TAU);
    g.fill();
  }
}

function drawCenter(g, style, p) {
  const S = SPRITE;
  if (style === 'disc') {
    const cr = S * 0.085;
    const cg = g.createRadialGradient(0, 0, 0, 0, 0, cr);
    cg.addColorStop(0, p.center);
    cg.addColorStop(1, 'rgba(30, 15, 5, 0.7)');
    g.fillStyle = cg;
    g.beginPath(); g.arc(0, 0, cr, 0, TAU); g.fill();
    dotRing(g, cr * 1.25, 12, S * 0.012, p.center);
  } else if (style === 'spiral') {
    const cr = S * 0.1;
    g.fillStyle = p.mid;
    g.beginPath(); g.arc(0, 0, cr, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(40, 0, 15, 0.35)';
    g.lineWidth = 2;
    for (let k = 1; k <= 3; k++) {
      g.beginPath();
      g.arc(0, 0, (cr * k) / 4, k * 0.9, k * 0.9 + TAU * 0.8);
      g.stroke();
    }
  } else if (style === 'sun') {
    const cr = S * 0.1;
    g.fillStyle = p.center;
    g.beginPath(); g.arc(0, 0, cr, 0, TAU); g.fill();
    dotRing(g, cr * 1.3, 18, S * 0.008, p.center);
  } else if (style === 'dark') {
    const cr = S * 0.06;
    g.fillStyle = '#2a1205';
    g.beginPath(); g.arc(0, 0, cr, 0, TAU); g.fill();
    dotRing(g, cr * 1.4, 10, S * 0.01, p.center);
  } else {
    const cr = S * 0.05;
    g.fillStyle = p.center;
    g.beginPath(); g.arc(0, 0, cr, 0, TAU); g.fill();
  }
}

// One ring of petals, as a single sprite.
function makeRingSprite(ring, p) {
  const c = mk();
  const g = c.getContext('2d');
  g.translate(SPRITE / 2, SPRITE / 2);
  const L = (ring.len * SPRITE) / 2, Wd = (ring.wid * SPRITE) / 2;
  for (let i = 0; i < ring.n; i++) {
    g.save();
    g.rotate((TAU * (i + (ring.off || 0))) / ring.n);
    drawPetal(g, L, Wd, p[ring.col], p.inner, !!ring.round);
    g.restore();
  }
  return c;
}

function makeCenterSprite(style, p) {
  const c = mk();
  const g = c.getContext('2d');
  g.translate(SPRITE / 2, SPRITE / 2);
  drawCenter(g, style, p);
  return c;
}

// Each flower is split into layers (rings plus centre). Inner layers open first.
const flowerCache = new Map();
function getFlowerSprite(typeKey, palKey) {
  const key = typeKey + '|' + palKey;
  let s = flowerCache.get(key);
  if (s) return s;
  const T = FLOWER_TYPES[typeKey], p = PALETTES[palKey];
  const parts = T.rings.map(r => ({ len: r.len, img: makeRingSprite(r, p) }));
  parts.push({ len: 0, img: makeCenterSprite(T.center, p) });
  const inner = [...parts].sort((a, b) => a.len - b.len);
  inner.forEach((pt, k) => { pt.off = k * 0.085; });
  // Outer layer first, so inner layers draw on top.
  s = { layers: [...inner].reverse().map(pt => ({ img: pt.img, off: pt.off })) };
  flowerCache.set(key, s);
  return s;
}

function makeLeafSprite([light, dark], veins) {
  const c = mk();
  const g = c.getContext('2d');
  g.translate(SPRITE / 2, SPRITE / 2);
  const L = SPRITE * 0.9, Wd = SPRITE * 0.2;
  g.beginPath();
  g.moveTo(0, -L / 2);
  g.bezierCurveTo(Wd, -L / 4, Wd, L / 4, 0, L / 2);
  g.bezierCurveTo(-Wd, L / 4, -Wd, -L / 4, 0, -L / 2);
  const grad = g.createLinearGradient(0, -L / 2, 0, L / 2);
  grad.addColorStop(0, light);
  grad.addColorStop(1, dark);
  g.fillStyle = grad;
  g.fill();
  g.strokeStyle = 'rgba(10, 30, 15, 0.5)';
  g.lineWidth = 2;
  g.stroke();

  g.strokeStyle = 'rgba(230, 245, 190, 0.35)';
  g.beginPath();
  g.moveTo(0, -L / 2 + 6);
  g.lineTo(0, L / 2 - 6);
  g.stroke();

  if (veins) {
    g.lineWidth = 1.2;
    g.beginPath();
    for (let i = 1; i <= 4; i++) {
      const y = -L / 2 + (i * L) / 5;
      g.moveTo(0, y); g.lineTo(Wd * 0.55, y - L * 0.12);
      g.moveTo(0, y); g.lineTo(-Wd * 0.55, y - L * 0.12);
    }
    g.stroke();
  }
  return c;
}

const leafCache = new Map();
function getLeafSprite(i, veins) {
  const key = i + '|' + veins;
  let s = leafCache.get(key);
  if (!s) { s = makeLeafSprite(LEAF_TONES[i], veins); leafCache.set(key, s); }
  return s;
}

// Blurred dark copy of a sprite, used as a soft drop shadow.
const shadowCache = new WeakMap();
function shadowOf(img) {
  let s = shadowCache.get(img);
  if (!s) {
    s = mk();
    const g = s.getContext('2d');
    g.shadowColor = 'rgba(8, 2, 10, 0.7)';
    g.shadowBlur = 16;
    g.shadowOffsetX = SPRITE * 2 + 6;
    g.shadowOffsetY = 10;
    g.drawImage(img, -SPRITE * 2, 0);
    shadowCache.set(img, s);
  }
  return s;
}

// Falling petals, dew sparkle and paper grain.
const FALL_SPR = ['#ffb8cc', '#e0457a', '#ffffff', '#f2b8c2'].map(col => {
  const c = mk();
  const g = c.getContext('2d');
  g.translate(SPRITE / 2, SPRITE / 2);
  drawPetal(g, SPRITE * 0.22, SPRITE * 0.1, col, '#fff2f5', true);
  return c;
});

const STAR = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.3, 'rgba(255,240,200,0.6)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  return c;
})();

const NOISE = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const im = g.createImageData(128, 128);
  for (let i = 0; i < im.data.length; i += 4) {
    const v = (Math.random() * 255) | 0;
    im.data[i] = im.data[i + 1] = im.data[i + 2] = v;
    im.data[i + 3] = 255;
  }
  g.putImageData(im, 0, 0);
  return c;
})();

// Falling petals use a fixed seed, so they look the same in every export.
const frng = mulberry32(777);
const fallers = Array.from({ length: FALL_MAX }, () => ({
  x0: frng(), y0: frng(),
  spd: 0.035 + frng() * 0.05,
  ph: frng() * TAU,
  size: 12 + frng() * 12,
  spin: (frng() - 0.5) * 1.6,
  kind: (frng() * FALL_SPR.length) | 0,
}));
