// ============================================================
// layout.js
// Decides where flowers, letters and veins go. The text is bent
// along a circle: each point on the flat text is moved onto the arc
// by arcPt(), and each letter is turned by arcAng(). Flowers use the
// same mapping, so they stay on the letters as the text curves.
// ============================================================

// Moves a flat screen point onto the curved text.
// Arc length is kept, so the letters keep their spacing.
function arcPt(x, y) {
  if (!geo || !geo.R) return { x, y };
  const th = (x - geo.CX) / geo.R;
  return {
    x: geo.CX + geo.R * Math.sin(th),
    y: y + geo.R * (1 - Math.cos(th)),
  };
}

// Rotation (radians) of the curved text at flat screen x.
function arcAng(x) {
  return geo && geo.R ? (x - geo.CX) / geo.R : 0;
}

// Picks points at least `spacing` apart, in random order.
function pickAnchors(list, spacing, cap) {
  const n = list.length;
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = (rnd() * (i + 1)) | 0;
    [order[i], order[j]] = [order[j], order[i]];
  }
  const s2 = spacing * spacing;
  const out = [];
  for (const idx of order) {
    if (out.length >= cap) break;
    const p = list[idx];
    let ok = true;
    for (const a of out) {
      const dx = a.x - p.x, dy = a.y - p.y;
      if (dx * dx + dy * dy < s2) { ok = false; break; }
    }
    if (ok) out.push(p);
  }
  return out;
}

// Rebuilds flower positions, veins and timing from the current sample and controls.
// The same seed gives the same arrangement, unless Shuffle changes it.
function layout() {
  waveStart = performance.now() / 1000;
  flowers = []; backs = []; fronts = []; veins = [];
  geo = null;
  bloomRel = 0;
  if (!sample) return;

  prng = mulberry32(state.seed);
  const { bbox } = sample;
  const bw = Math.max(bbox.x1 - bbox.x0, 1), bh = Math.max(bbox.y1 - bbox.y0, 1);
  const s = Math.min((W * 0.84) / bw, (H * 0.6) / bh, MAX_TEXT_SCALE) * state.textSize;
  const ox = W / 2 - ((bbox.x0 + bbox.x1) / 2) * s;
  const oy = H / 2 - ((bbox.y0 + bbox.y1) / 2) * s;
  const X0 = bbox.x0 * s + ox, X1 = bbox.x1 * s + ox;
  const Y0 = bbox.y0 * s + oy, Y1 = bbox.y1 * s + oy;
  const CX = (X0 + X1) / 2, CY = (Y0 + Y1) / 2;
  const halfW = Math.max((X1 - X0) / 2, 1);
  // Radius of the arc. The text ends turn by BEND_MAX * bend radians.
  const R = state.bend > 0.001 ? halfW / (state.bend * BEND_MAX) : 0;
  geo = { s, ox, oy, X0, X1, Y0, Y1, CX, CY, halfW, R, fpx: sample.px * s };

  const baseR = clamp(geo.fpx * 0.085, 14, 32) * state.size;
  const spacing = (baseR * 1.5) / state.density;
  const cap = Math.round(MAX_BLOOMS * state.density);
  // Sample point (offscreen coords) to curved screen point.
  const onText = (px, py) => arcPt(px * s + ox, py * s + oy);

  let anchors = [];
  if (state.pattern === 'vine') {
    // The ring is not bent. It goes around the text as a whole.
    const a = (X1 - X0) / 2 + baseR * 2.2;
    const b = (Y1 - Y0) / 2 + baseR * 2.0;
    const P = Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
    const N = Math.max(8, Math.min(cap, Math.round(P / spacing)));
    for (let i = 0; i < N; i++) {
      const th = (TAU * i) / N;
      anchors.push({
        x: CX + a * Math.cos(th),
        y: CY + b * Math.sin(th),
        rot: Math.atan2(b * Math.cos(th), -a * Math.sin(th)) + Math.PI / 2,
      });
    }
  } else if (state.pattern === 'edge') {
    const list = [];
    for (let i = 0; i < sample.pts.length; i += 2) {
      if (isEdge(sample, sample.pts[i], sample.pts[i + 1])) list.push(onText(sample.pts[i], sample.pts[i + 1]));
    }
    anchors = pickAnchors(list, spacing * 0.9, cap);
  } else if (state.pattern === 'scatter') {
    const list = [];
    const n = cap * 8;
    for (let i = 0; i < n; i++) {
      const x = X0 - baseR + rnd() * (X1 - X0 + baseR * 2);
      const y = Y0 - baseR + rnd() * (Y1 - Y0 + baseR * 2);
      list.push(arcPt(x, y));
    }
    anchors = pickAnchors(list, spacing * 1.1, cap);
  } else if (state.pattern === 'grid') {
    const step = spacing * 1.25;
    let row = 0;
    outer: for (let y = Y0; y <= Y1 + step; y += step * 0.87, row++) {
      const shift = (row & 1) ? step / 2 : 0;
      for (let x = X0 - step + shift; x <= X1 + step; x += step) {
        anchors.push(arcPt(
          x + (rnd() - 0.5) * step * 0.15,
          y + (rnd() - 0.5) * step * 0.15,
        ));
        if (anchors.length >= cap) break outer;
      }
    }
  } else {
    // "cluster": flowers on the letter strokes
    const list = new Array(sample.pts.length / 2);
    for (let i = 0; i < sample.pts.length; i += 2) list[i / 2] = onText(sample.pts[i], sample.pts[i + 1]);
    anchors = pickAnchors(list, spacing, cap);
  }
  if (state.pattern !== 'vine') anchors.sort((p, q) => p.x - q.x);

  const count = anchors.length;
  const leafCount = Math.round(state.leaves);
  const leafSet = LEAF_TONES.map((_, i) => getLeafSprite(i, state.veins));

  // When each flower starts to open, as a 0-1 value. Depends on the bloom animation.
  let maxD = 1;
  for (const a of anchors) maxD = Math.max(maxD, Math.hypot(a.x - CX, a.y - CY));
  const timingKey = (a, k) => {
    const d = Math.hypot(a.x - CX, a.y - CY) / maxD;
    switch (state.animStyle) {
      case 'wave': return d;
      case 'spiral': {
        const ang = (Math.atan2(a.y - CY, a.x - CX) + TAU) % TAU / TAU;
        return (ang + d * 1.2) % 1;
      }
      case 'random': return rnd();
      default: return k / count;   // sweep and drift: left to right
    }
  };

  for (let k = 0; k < count; k++) {
    const a = anchors[k];
    const r = baseR * (0.85 + rnd() * 0.3);
    const typeKey = state.flower === 'mixed' ? pick(TYPE_KEYS) : state.flower;
    const u = clamp((a.x - X0) / Math.max(X1 - X0, 1));
    let palKey;
    if (state.color === 'mixed') palKey = pick(PAL_KEYS);
    else if (state.color === 'position') palKey = POS_ORDER[Math.min(POS_ORDER.length - 1, Math.floor(u * POS_ORDER.length))];
    else palKey = state.color;

    const leaves = [];
    for (let i = 0; i < leafCount; i++) {
      leaves.push({
        k: i,
        angle: rnd() * TAU,
        dist: r * (0.55 + rnd() * 0.25),
        tilt: (rnd() - 0.5) * 0.6,
        sprite: state.leafTone === 'mixed' ? pick(leafSet) : leafSet[+state.leafTone],
        size: r * (2.4 + rnd() * 0.6),
      });
    }

    const front = state.layer === 'front' ? true : state.layer === 'behind' ? false : rnd() < 0.5;
    const f = {
      x: a.x + (rnd() - 0.5) * 3,
      y: a.y + (rnd() - 0.5) * 3,
      px: 0, py: 0, ox: 0, oy: 0,
      rot: a.rot !== undefined ? a.rot : rnd() * TAU,
      size: r * 4.4,
      spr: getFlowerSprite(typeKey, palKey),
      leaves,
      front,
      delay: REDUCED ? 0 : timingKey(a, k) * BLOOM_TIME,
      phase: rnd() * TAU,
    };
    f.px = f.x; f.py = f.y;
    flowers.push(f);
    (front ? fronts : backs).push(f);
  }

  // Veins: each flower joins its two nearest neighbours.
  // Density sets how many neighbours each flower joins, and how far away they can be.
  if (state.connect && count > 1 && state.veinDensity > 0) {
    const links = Math.round(1 + state.veinDensity * 2);
    const reach = spacing * (1.6 + state.veinDensity * 1.6), reach2 = reach * reach;
    const seen = new Set();
    for (let i = 0; i < count; i++) {
      const A = flowers[i];
      const near = [];
      for (let j = 0; j < count; j++) {
        if (j === i) continue;
        const dx = flowers[j].x - A.x, dy = flowers[j].y - A.y, d = dx * dx + dy * dy;
        if (d < reach2) near.push({ j, d });
      }
      near.sort((p, q) => p.d - q.d);
      for (const { j } of near.slice(0, links)) {
        const key = i < j ? i + ':' + j : j + ':' + i;
        if (seen.has(key)) continue;
        seen.add(key);
        // Growth direction: from the earlier flower, the later one, or at random.
        const flip = state.veinDir === 'b2a' || (state.veinDir === 'random' && rnd() < 0.5);
        const from = flip ? j : i, to = flip ? i : j;
        const S = flowers[from], E = flowers[to];
        const vs = state.veinStyle === 'mixed' ? pick(VEIN_KEYS) : state.veinStyle;
        const sty = VEIN_STYLES[vs];
        const w0 = baseR * (0.1 + 0.3 * state.veinWidth) * sty.w;
        const v = {
          a: from, b: to, style: vs, front: S.front || E.front,
          bowF: (rnd() - 0.5) * 0.6 * state.veinCurve,
          w0, w1: w0 * sty.tip,
          delay: Math.max(S.delay, E.delay) + 0.12,
          phase: rnd() * TAU,
          branches: [],
          tendril: state.tendrils && rnd() < 0.7,
          tendrilR: baseR * (0.35 + rnd() * 0.25),
          tendrilA: rnd() * TAU,
        };
        for (let b = 0; b < state.branches; b++) {
          v.branches.push({
            t: 0.3 + b * 0.3 + rnd() * 0.08,
            side: rnd() < 0.5 ? -1 : 1,
            angle: 0.6 + rnd() * 0.4,
            len: baseR * (1.6 + rnd() * 1.4),
          });
        }
        veins.push(v);
      }
    }
  }

  // Time until the bloom, the veins and the letters have all settled.
  let lastDelay = 0;
  for (const f of flowers) lastDelay = Math.max(lastDelay, f.delay);
  let textEnd = 0;
  if (state.letterRise) {
    for (const gl of sample.glyphs) textEnd = Math.max(textEnd, gl.idx * 0.035 + gl.line * 0.12 + 0.7);
  }
  bloomRel = Math.max(lastDelay + GROW + 0.3 + (veins.length ? VEIN_GROW + 0.3 : 0), textEnd);
}
