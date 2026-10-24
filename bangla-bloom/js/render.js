// ============================================================
// render.js
// Draws one frame of the scene and runs the animation loop.
// Layer order: back flowers, letters, veins, front flowers,
// falling petals, then the vignette.
// ============================================================

// Ease-out-back: overshoots a little, so flowers bloom with a natural push.
function growScale(t, delay) {
  const x = clamp((t - delay) / GROW);
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const c1 = 1.70158, c3 = c1 + 1, u = x - 1;
  return 1 + c3 * u * u * u + c1 * u * u;
}

// 0 during the bloom, then ramps up to 1 over about a second.
function ambient(t) {
  return state.idle ? clamp((t - bloomRel) / 1.2) : 0;
}

function blit(g, img, size, sh, fo) {
  const h = size / 2;
  if (sh > 0) {
    g.globalAlpha = sh * fo;
    g.drawImage(shadowOf(img), -h, -h, size, size);
  }
  g.globalAlpha = fo;
  g.drawImage(img, -h, -h, size, size);
}

function drawFlower(g, f, t, amb) {
  // Drift in fades the flower up as it arrives.
  const fo = state.flowerOpacity * (1 - 0.85 * (f.dr || 0));
  if (fo <= 0) return;
  const sway = state.sway * 0.12 * amb * Math.sin(t * 0.9 + f.phase);
  const breathe = 1 + state.breath * 0.035 * amb * Math.sin(t * 1.6 + f.phase);
  const sh = state.shadow * 0.8;

  g.save();
  g.translate(f.px, f.py);
  g.rotate(f.rot + sway);

  // Optional thin stem from the flower centre to each leaf.
  if (state.leafStems) {
    g.fillStyle = state.veinColor;
    for (const lf of f.leaves) {
      const sc = growScale(t, f.delay - 0.05 + lf.k * 0.07);
      if (sc <= 0.01) continue;
      const L = lf.dist * sc, bend = Math.sin(f.phase + lf.k) * L * 0.15;
      for (let i = 0; i < 6; i++) {
        const u = i / 5;
        LSX[i] = bend * Math.sin(u * Math.PI);
        LSY[i] = -L * u;
      }
      g.save();
      g.rotate(lf.angle);
      fillTaper(g, LSX, LSY, 6, f.size * 0.035, f.size * 0.012);
      g.restore();
    }
  }

  // Leaves first, so the flower sits on top of them.
  for (const lf of f.leaves) {
    const sc = growScale(t, f.delay - 0.05 + lf.k * 0.07);
    if (sc <= 0.01) continue;
    g.save();
    g.rotate(lf.angle);
    g.translate(0, -lf.dist * sc);
    g.rotate(lf.tilt);
    g.scale(sc, sc);
    blit(g, lf.sprite, lf.size, sh, fo);
    g.restore();
  }

  g.scale(breathe, breathe);
  const layers = f.spr.layers;
  for (let k = 0; k < layers.length; k++) {
    const L = layers[k];
    const sc = growScale(t, f.delay + 0.1 + L.off);
    if (sc <= 0.01) continue;
    g.save();
    g.scale(sc, sc);
    blit(g, L.img, f.size, k === 0 ? sh : 0, fo);
    g.restore();
  }
  g.restore();

  // Dew sparkle: a small highlight that twinkles now and then.
  const sp = state.sparkle * amb;
  if (sp > 0) {
    const k = Math.pow(Math.max(0, Math.sin(t * 1.7 + f.phase * 2.3)), 14) * sp;
    if (k > 0.02) {
      const r = f.size * 0.09;
      const sx = f.px + Math.cos(f.phase) * f.size * 0.32;
      const sy = f.py + Math.sin(f.phase) * f.size * 0.32;
      g.globalAlpha = Math.min(1, k) * fo;
      g.drawImage(STAR, sx - r, sy - r, r * 2, r * 2);
      g.globalAlpha = 1;
    }
  }
}

// ---------- Curved letters ----------

// Blends two hex colours. Returns an rgb() string.
function mixHex(a, b, t) {
  const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16);
  const c = sh => Math.round(((A >> sh) & 255) * (1 - t) + ((B >> sh) & 255) * t);
  return `rgb(${c(16)},${c(8)},${c(0)})`;
}

// Colour for one letter. With the gradient on, it depends on where the letter sits.
function glyphColor(p) {
  if (!state.textGrad) return state.textColor;
  const { X0, X1, Y0, Y1 } = geo;
  const u = state.gradDir === 'v'
    ? (p.y - Y0) / Math.max(Y1 - Y0, 1)
    : (p.x - X0) / Math.max(X1 - X0, 1);
  return mixHex(state.textColor, state.textColor2, clamp(u));
}

// Where one letter sits on the curve, and how far it is turned.
function glyphPos(gl) {
  const fx = gl.cx * geo.s + geo.ox;
  const fy = gl.y * geo.s + geo.oy;
  const p = arcPt(fx, fy);
  return { x: p.x, y: p.y, a: arcAng(fx) };
}

// Each letter is drawn at its own point on the arc, turned to match.
// Letters rise into place one by one, then a light sweep passes over.
function drawText(g, t, still) {
  if (!sample || !geo || state.textOpacity <= 0) return;
  const { X0, X1, fpx } = geo;
  g.font = `${FONT_WEIGHT} ${fpx}px ${FONTS[state.font]}`;
  g.textAlign = 'center';
  g.textBaseline = 'alphabetic';

  for (const gl of sample.glyphs) {
    const delay = state.letterRise ? gl.idx * 0.035 + gl.line * 0.12 : 0;
    const e = state.letterRise ? easeOut(clamp((t - delay) / 0.7)) : (t >= 0 ? 1 : 0);
    if (e <= 0) continue;
    const p = glyphPos(gl);
    g.save();
    g.translate(p.x, p.y);
    g.rotate(p.a);
    g.fillStyle = glyphColor(p);
    g.globalAlpha = state.textOpacity * e;
    // Rising letters start a little lower, in the letter's own frame.
    g.fillText(gl.ch, 0, (1 - e) * fpx * 0.35);
    g.restore();
  }

  if (state.shimmer && !still && t > bloomRel) {
    const local = t - bloomRel;
    // Ambient mode repeats the sweep. Otherwise it runs once.
    const ph = state.idle ? (local / SHIMMER_PERIOD) % 1 : clamp(local / 1.6);
    if (ph < 1) {
      const band = fpx * 1.1;
      const sx = X0 - band + ph * (X1 - X0 + band * 2);
      g.globalCompositeOperation = 'lighter';
      g.fillStyle = '#ffffff';
      for (const gl of sample.glyphs) {
        const p = glyphPos(gl);
        const k = 1 - Math.abs(p.x - sx) / band;
        if (k <= 0) continue;
        g.save();
        g.translate(p.x, p.y);
        g.rotate(p.a);
        g.globalAlpha = state.textOpacity * 0.5 * k;
        g.fillText(gl.ch, 0, 0);
        g.restore();
      }
      g.globalCompositeOperation = 'source-over';
    }
  }
  g.globalAlpha = 1;
}

// ---------- Veins ----------

// Shared scratch arrays, so drawing veins does not allocate memory every frame.
const PXs = new Float64Array(VN + 1), PYs = new Float64Array(VN + 1);
const SX = new Float64Array(VN + 1), SY = new Float64Array(VN + 1);
const SX2 = new Float64Array(VN + 1), SY2 = new Float64Array(VN + 1);
const BX = new Float64Array(VN + 1), BY = new Float64Array(VN + 1);
const TX = new Float64Array(20), TY = new Float64Array(20);
const LXs = new Float64Array(VN + 1), LYs = new Float64Array(VN + 1);
const RXs = new Float64Array(VN + 1), RYs = new Float64Array(VN + 1);
const LSX = new Float64Array(6), LSY = new Float64Array(6);

// Fills a tapered shape along a polyline, wide at the start and narrow at the end.
function fillTaper(g, xs, ys, n, w0, w1) {
  for (let i = 0; i < n; i++) {
    const a = Math.max(0, i - 1), b = Math.min(n - 1, i + 1);
    const dx = xs[b] - xs[a], dy = ys[b] - ys[a];
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    const w = (w0 + (w1 - w0) * (i / (n - 1))) * 0.5;
    LXs[i] = xs[i] + nx * w; LYs[i] = ys[i] + ny * w;
    RXs[i] = xs[i] - nx * w; RYs[i] = ys[i] - ny * w;
  }
  g.beginPath();
  g.moveTo(LXs[0], LYs[0]);
  for (let i = 1; i < n; i++) g.lineTo(LXs[i], LYs[i]);
  for (let i = n - 1; i >= 0; i--) g.lineTo(RXs[i], RYs[i]);
  g.closePath();
  g.fill();
}

// Writes a line moved sideways from (xs, ys) into (ox, oy). amount(i) is the sideways distance.
function offsetLine(xs, ys, n, ox, oy, amount) {
  for (let i = 0; i < n; i++) {
    const a = Math.max(0, i - 1), b = Math.min(n - 1, i + 1);
    const dx = xs[b] - xs[a], dy = ys[b] - ys[a];
    const len = Math.hypot(dx, dy) || 1;
    const d = amount(i);
    ox[i] = xs[i] - (dy / len) * d;
    oy[i] = ys[i] + (dx / len) * d;
  }
}

// One vein: a curved stem that grows from one flower to the next. Its look
// depends on the vein style. It can have side branches and a curl at the tip.
function drawVein(g, v, t, amb, tip) {
  const p = clamp((t - v.delay) / VEIN_GROW);
  if (p <= 0) return;
  const sty = VEIN_STYLES[v.style];
  const A = flowers[v.a], B = flowers[v.b];
  const ax = A.px, ay = A.py, bx = B.px, by = B.py;
  const dx = bx - ax, dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const bow = v.bowF * len;
  const cx = (ax + bx) / 2 - (dy / len) * bow;
  const cy = (ay + by) / 2 + (dx / len) * bow;
  const n = Math.min(VN + 1, Math.floor(p * VN) + 2);

  for (let i = 0; i < n; i++) {
    const u = i / VN, m = 1 - u;
    PXs[i] = m * m * ax + 2 * m * u * cx + u * u * bx;
    PYs[i] = m * m * ay + 2 * m * u * cy + u * u * by;
  }
  // A slow wobble, so the stem looks alive when ambient motion is on.
  if (amb > 0 && state.veinWobble > 0) {
    for (let i = 1; i < n - 1; i++) {
      const tx = PXs[i + 1] - PXs[i - 1], ty = PYs[i + 1] - PYs[i - 1];
      const tl = Math.hypot(tx, ty) || 1;
      const w = v.w0 + (v.w1 - v.w0) * (i / VN);
      const o = Math.sin(i * 0.9 + v.phase + t * 1.1) * w * state.veinWobble * amb;
      PXs[i] += (-ty / tl) * o;
      PYs[i] += (tx / tl) * o;
    }
  }

  // Colour: a gradient from the base to the tip, or one solid colour.
  if (state.veinGradient) {
    const gr = g.createLinearGradient(ax, ay, PXs[n - 1], PYs[n - 1]);
    gr.addColorStop(0, state.veinColor);
    gr.addColorStop(1, tip);
    g.fillStyle = gr;
  } else {
    g.fillStyle = state.veinColor;
  }

  if (sty.twist) {
    // Two strands that cross each other, like a rope.
    offsetLine(PXs, PYs, n, SX, SY, i => Math.sin(i * 0.9 + v.phase) * v.w0 * 0.45);
    fillTaper(g, SX, SY, n, v.w0 * 0.55, v.w1 * 0.8);
    offsetLine(PXs, PYs, n, SX2, SY2, i => -Math.sin(i * 0.9 + v.phase) * v.w0 * 0.45);
    fillTaper(g, SX2, SY2, n, v.w0 * 0.55, v.w1 * 0.8);
  } else {
    fillTaper(g, PXs, PYs, n, v.w0, v.w1);
  }

  if (sty.ribbon) {
    // A pale line along the middle of the band, so it reads as a ribbon.
    offsetLine(PXs, PYs, n, SX, SY, () => v.w0 * 0.15);
    g.strokeStyle = lighten(state.veinColor, 0.45);
    g.lineWidth = Math.max(0.6, v.w0 * 0.12);
    g.beginPath();
    g.moveTo(SX[0], SY[0]);
    for (let i = 1; i < n; i++) g.lineTo(SX[i], SY[i]);
    g.stroke();
  }

  if (sty.coil) {
    // Small open rings along the wire.
    g.strokeStyle = state.veinColor;
    g.lineWidth = Math.max(0.6, v.w0 * 0.35);
    for (let i = 3; i < n - 1; i += 4) {
      const r = Math.max(2, v.w0 * 2.2);
      g.beginPath();
      g.arc(PXs[i], PYs[i], r, v.phase + i, v.phase + i + TAU * 0.75);
      g.stroke();
    }
  }

  // Side branches, which appear as the main stem passes their start.
  g.fillStyle = state.veinColor;
  for (const br of v.branches) {
    const q = clamp((p - br.t) / 0.3);
    if (q <= 0) continue;
    const u = br.t, m = 1 - u;
    const px = m * m * ax + 2 * m * u * cx + u * u * bx;
    const py = m * m * ay + 2 * m * u * cy + u * u * by;
    let tx = 2 * m * (cx - ax) + 2 * u * (bx - cx);
    let ty = 2 * m * (cy - ay) + 2 * u * (by - cy);
    const tl = Math.hypot(tx, ty) || 1;
    tx /= tl; ty /= tl;
    const a = br.side * br.angle, ca = Math.cos(a), sa = Math.sin(a);
    const dxr = tx * ca - ty * sa, dyr = tx * sa + ty * ca;
    const ex = px + dxr * br.len, ey = py + dyr * br.len;
    const mx = (px + ex) / 2 - dyr * br.len * 0.12;
    const my = (py + ey) / 2 + dxr * br.len * 0.12;
    const k = Math.max(2, Math.floor(q * 8) + 1);
    for (let i = 0; i < k; i++) {
      const uu = i / 8, mm = 1 - uu;
      BX[i] = mm * mm * px + 2 * mm * uu * mx + uu * uu * ex;
      BY[i] = mm * mm * py + 2 * mm * uu * my + uu * uu * ey;
    }
    fillTaper(g, BX, BY, k, v.w0 * 0.5, v.w0 * 0.08);
  }

  // Curled tendril at the tip, after the vein has finished growing.
  if (v.tendril && p >= 1) {
    const q = clamp((t - (v.delay + VEIN_GROW)) / 0.8);
    if (q > 0) {
      const k = Math.max(2, Math.floor(q * 14) + 1);
      const r = v.tendrilR, th = v.tendrilA;
      const ccx = bx + Math.cos(th) * r, ccy = by + Math.sin(th) * r;
      for (let i = 0; i < k; i++) {
        const ang = th + Math.PI + i * 0.55, rad = r * (1 - i / 16);
        TX[i] = ccx + Math.cos(ang) * rad;
        TY[i] = ccy + Math.sin(ang) * rad;
      }
      g.strokeStyle = state.veinColor;
      g.lineWidth = Math.max(0.8, v.w1 * 1.4);
      g.beginPath();
      g.moveTo(TX[0], TY[0]);
      for (let i = 1; i < k; i++) g.lineTo(TX[i], TY[i]);
      g.stroke();
    }
  }
}

// Draws the veins on one side of the letters. front=false: behind the letters.
function drawVeins(g, t, amb, front) {
  if (!state.connect || !veins.length || state.veinOpacity <= 0) return;
  g.save();
  g.lineCap = 'round';
  g.globalAlpha = state.veinOpacity;
  for (const v of veins) {
    if (v.front === front) drawVein(g, v, t, amb, state.veinTipColor);
  }
  g.restore();
}

// ---------- Falling petals ----------
function drawFalling(g, t, amb) {
  const n = Math.round(state.fall);
  if (!n || amb <= 0) return;
  for (let i = 0; i < n; i++) {
    const f = fallers[i];
    const y = (((f.y0 + f.spd * t) % 1.1) - 0.05) * H;
    const x = (f.x0 + Math.sin(t * 0.6 + f.ph) * 0.03) * W;
    g.save();
    g.translate(x, y);
    g.rotate(f.ph + t * f.spin);
    g.globalAlpha = amb * 0.85;
    g.drawImage(FALL_SPR[f.kind], -f.size / 2, -f.size / 2, f.size, f.size);
    g.restore();
  }
}

// ---------- Full frame ----------
// The caller sets the transform, so this works for the screen and for exports.
function renderScene(g, t, still) {
  const amb = ambient(t);
  g.globalAlpha = 1;
  g.globalCompositeOperation = 'source-over';

  g.fillStyle = state.bg;
  g.fillRect(0, 0, W, H);

  if (state.grain > 0) {
    g.globalAlpha = state.grain * 0.35;
    g.fillStyle = g.createPattern(NOISE, 'repeat');
    g.fillRect(0, 0, W, H);
    g.globalAlpha = 1;
  }

  if (sample && geo) {
    for (const f of backs) drawFlower(g, f, t, amb);
    drawVeins(g, t, amb, false);
    drawText(g, t, still);
    drawVeins(g, t, amb, true);
    for (const f of fronts) drawFlower(g, f, t, amb);
    drawFalling(g, t, amb);
  }

  if (state.vignette > 0) {
    const gr = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.75);
    gr.addColorStop(0, 'rgba(0,0,0,0)');
    gr.addColorStop(1, `rgba(0,0,0,${state.vignette * 0.75})`);
    g.fillStyle = gr;
    g.fillRect(0, 0, W, H);
  }
  g.globalAlpha = 1;
}

// Moves each flower: away from the cursor (eases back), and for Drift in,
// from outside toward its place. Exports turn the cursor part off.
// t is the animation time in seconds, used by Drift in.
function updateFlowers(dt, interactive, t) {
  const k = 1 - Math.exp(-dt * 10);
  for (const f of flowers) {
    let tx = 0, ty = 0;
    if (interactive && state.breeze && mouse.on) {
      const dx = f.x - mouse.x, dy = f.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < BREEZE_R && d > 0.01) {
        const q = 1 - d / BREEZE_R;
        const m = q * q * BREEZE_MAX;
        tx = (dx / d) * m;
        ty = (dy / d) * m;
      }
    }
    if (!interactive) { f.ox = 0; f.oy = 0; }
    else { f.ox += (tx - f.ox) * k; f.oy += (ty - f.oy) * k; }

    let dX = 0, dY = 0;
    f.dr = 0;
    if (state.animStyle === 'drift' && geo && t !== undefined) {
      f.dr = 1 - easeOut(clamp((t - f.delay) / 0.9));
      if (f.dr > 0) {
        const ux = f.x - geo.CX, uy = f.y - geo.CY, ul = Math.hypot(ux, uy) || 1;
        dX = (ux / ul) * f.dr * f.size * 0.9;
        dY = (uy / ul) * f.dr * f.size * 0.9;
      }
    }
    f.px = f.x + f.ox + dX;
    f.py = f.y + f.oy + dY;
  }
}

// ---------- Animation loop ----------
function tick() {
  const now = performance.now();
  const sec = now / 1000;
  const dt = Math.min(sec - lastSec, 0.05);
  lastSec = sec;
  // Speed scales the animation clock, so every motion runs faster or slower.
  const t = (sec - waveStart) * state.speed;

  updateFlowers(dt, true, t);

  // After the bloom, ambient motion draws at about 30 fps to save battery.
  const skip = t > bloomRel + 2 && state.idle && (frameNo++ & 1) === 1;
  if (!skip) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderScene(ctx, t, false);
  }

  const moving = t < bloomRel + 2.5 || state.idle || (state.breeze && now - mouse.t < 1500);
  if (moving) requestAnimationFrame(tick);
  else running = false;
}

function ensureLoop() {
  if (!running) {
    running = true;
    lastSec = performance.now() / 1000;
    requestAnimationFrame(tick);
  }
}
