// ============================================================
// text.js
// Turns the typed text into letters with positions, and samples
// the ink so flowers know where to grow. Also loads fonts.
// ============================================================

const segmenter = (window.Intl && Intl.Segmenter)
  ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;

// Splits a line into grapheme clusters: one visible letter (or matra group) each.
function segment(line) {
  if (segmenter) return Array.from(segmenter.segment(line), s => ({ ch: s.segment, i: s.index }));
  const out = [];
  let i = 0;
  for (const ch of line) { out.push({ ch, i }); i += ch.length; }
  return out;
}

// Measures every letter in every line, in offscreen coordinates.
// Each glyph gets its left edge (x), centre (cx) and baseline (y).
function layoutGlyphs(lines, family) {
  offCtx.font = `${FONT_WEIGHT} ${FONT_PX}px ${family}`;
  let widest = 0;
  for (const l of lines) widest = Math.max(widest, offCtx.measureText(l).width);
  if (!widest) return null;

  const n = lines.length;
  const k = Math.min(1, (OFF_W * 0.9) / widest, (OFF_H * 0.8) / (n * FONT_PX * LINE_H));
  const px = Math.floor(FONT_PX * k);
  offCtx.font = `${FONT_WEIGHT} ${px}px ${family}`;

  const lineH = px * LINE_H, totalH = n * lineH, top = OFF_H / 2 - totalH / 2;
  const glyphs = [];
  let x0 = Infinity, x1 = -Infinity;
  lines.forEach((line, li) => {
    if (!line) return;
    const w = offCtx.measureText(line).width;
    const startX = OFF_W / 2 - w / 2;
    const base = top + li * lineH + px;
    x0 = Math.min(x0, startX);
    x1 = Math.max(x1, startX + w);
    for (const g of segment(line)) {
      const gx = startX + offCtx.measureText(line.slice(0, g.i)).width;
      const cw = offCtx.measureText(g.ch).width;
      glyphs.push({ ch: g.ch, x: gx, cx: gx + cw / 2, y: base, idx: glyphs.length, line: li });
    }
  });
  if (!glyphs.length) return null;
  return { px, glyphs, bbox: { x0, x1, y0: top, y1: top + totalH } };
}

// Draws the text and samples its ink on a grid. Returns points and an occupancy grid.
function sampleText(lines, family) {
  const L = layoutGlyphs(lines, family);
  if (!L) return null;
  offCtx.clearRect(0, 0, OFF_W, OFF_H);
  offCtx.font = `${FONT_WEIGHT} ${L.px}px ${family}`;
  offCtx.textAlign = 'left';
  offCtx.textBaseline = 'alphabetic';
  offCtx.fillStyle = '#fff';
  for (const g of L.glyphs) offCtx.fillText(g.ch, g.x, g.y);

  const cols = Math.ceil(OFF_W / STEP), rows = Math.ceil(OFF_H / STEP);
  const grid = new Uint8Array(cols * rows);
  const data = offCtx.getImageData(0, 0, OFF_W, OFF_H).data;
  const pts = [];
  for (let y = 0; y < OFF_H; y += STEP) {
    for (let x = 0; x < OFF_W; x += STEP) {
      if (data[((y * OFF_W + x) << 2) + 3] > ALPHA_THRESH) {
        pts.push(x, y);
        grid[(y / STEP) * cols + x / STEP] = 1;
      }
    }
  }
  return { ...L, pts, grid, cols, rows };
}

// A sample point is on the outline if one of its four neighbours is empty.
function isEdge(s, px, py) {
  const gx = px / STEP, gy = py / STEP;
  const at = (x, y) => (x < 0 || y < 0 || x >= s.cols || y >= s.rows) ? 0 : s.grid[y * s.cols + x];
  return !at(gx - 1, gy) || !at(gx + 1, gy) || !at(gx, gy - 1) || !at(gx, gy + 1);
}

async function loadFont(family) {
  try {
    await document.fonts.load(`${FONT_WEIGHT} ${FONT_PX}px ${family}`, FONT_SAMPLE_CHARS);
  } catch (e) {
    console.warn('Font failed to load, using fallback:', family, e);
  }
}

// Re-samples the text when the text or font changes, then re-lays out.
async function refresh() {
  const my = ++refreshId;
  const family = FONTS[state.font];
  await loadFont(family);
  if (my !== refreshId) return;

  input.style.fontFamily = family;
  const lines = state.text.replace(/\r/g, '').split('\n');
  const key = state.font + '|' + lines.join('\n');
  if (key !== sampleKey) {
    sample = lines.some(l => l.trim()) ? sampleText(lines, family) : null;
    sampleKey = key;
  }
  layout();
  ensureLoop();
}

// Grows the text box with its content, up to a third of the screen.
function autosize() {
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, window.innerHeight * 0.34) + 'px';
}
