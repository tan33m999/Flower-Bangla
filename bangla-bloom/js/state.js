// ============================================================
// state.js
// The current settings, the shared canvases, and the seeded random
// number generator. Every other file reads from here.
// ============================================================

const $ = id => document.getElementById(id);

const state = Object.assign({}, DEFAULTS);

const canvas = $('bloomCanvas');
const ctx = canvas.getContext('2d');
const input = $('textInput');

// Offscreen canvas: the text is drawn here and sampled for ink.
const off = document.createElement('canvas');
off.width = OFF_W;
off.height = OFF_H;
const offCtx = off.getContext('2d', { willReadFrequently: true });

// Export buffer for still images and video frames.
const exp = document.createElement('canvas');
const expCtx = exp.getContext('2d');

let W = 0, H = 0, dpr = 1;
function fitCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
}
fitCanvas();

// Seeded random number generator. All layout randomness uses it,
// so Shuffle (which changes the seed) gives a new arrangement.
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
let prng = mulberry32(state.seed);
const rnd = () => prng();
const pick = arr => arr[(rnd() * arr.length) | 0];

// Layout data, rebuilt by layout() and text.js.
let sample = null, sampleKey = '';
let geo = null;
let flowers = [], backs = [], fronts = [], veins = [];

// Timing and animation state.
let waveStart = 0;     // seconds, when the current layout started
let bloomRel = 0;      // seconds from start until the bloom and letters have settled
let running = false;
let frameNo = 0, lastSec = 0;

// Timers and flags.
let refreshId = 0, debounce = null, layoutT = null, resizeTimer = null;
let recording = false;
const mouse = { x: 0, y: 0, on: false, t: 0 };

function lighten(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const m = c => Math.round(c + (255 - c) * k);
  return `rgb(${m((n >> 16) & 255)},${m((n >> 8) & 255)},${m(n & 255)})`;
}
