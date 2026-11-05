// ============================================================
// config.js
// Fixed settings, fonts, colours, flower shapes, looks (presets)
// and default values. Edit this file to change what is available.
// ============================================================

// ---------- Sampling and sizes ----------
const OFF_W = 3200, OFF_H = 1400, FONT_PX = 500, FONT_WEIGHT = 700;
const STEP = 8, ALPHA_THRESH = 80;
const MAX_TEXT_SCALE = 1.6, MAX_BLOOMS = 160, BLOOM_TIME = 2.2, GROW = 0.55, SPRITE = 256;
const BEND_MAX = 0.8;          // angle in radians at the ends of the text when "Curve" is 1
const LINE_H = 1.3, VN = 24, VEIN_GROW = 1.4, EXPORT_FPS = 30;
const BREEZE_R = 170, BREEZE_MAX = 26, FALL_MAX = 40, SHIMMER_PERIOD = 5.5;
const FONT_SAMPLE_CHARS = 'ফুলের বাগান ক্ষ যিষ ঐ';
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const TAU = Math.PI * 2;

function clamp(v, a = 0, b = 1) { return Math.min(b, Math.max(a, v)); }
function easeOut(x) { return 1 - Math.pow(1 - x, 3); }

// ---------- Fonts ----------
const FONTS = {
  'hind': '"Hind Siliguri"', 'noto-sans': '"Noto Sans Bengali"', 'noto-serif': '"Noto Serif Bengali"',
  'baloo': '"Baloo Da 2"', 'anek': '"Anek Bangla"', 'tiro': '"Tiro Bangla"',
  'galada': '"Galada"', 'atma': '"Atma"', 'yantra': '"Yantramanav"',
};
const FONT_LABELS = [
  ['hind', 'Hind Siliguri'], ['noto-sans', 'Noto Sans Bengali'], ['noto-serif', 'Noto Serif Bengali'],
  ['baloo', 'Baloo Da 2'], ['anek', 'Anek Bangla'], ['tiro', 'Tiro Bangla'],
  ['galada', 'Galada'], ['atma', 'Atma'], ['yantra', 'Yantramanav'],
];

// ---------- Flower colours ----------
const PALETTES = {
  pink:     { outer: '#b8124f', mid: '#e0457a', inner: '#ffb8cc', center: '#ffe08a' },
  red:      { outer: '#7d0b25', mid: '#b5183a', inner: '#e8566f', center: '#ffd166' },
  violet:   { outer: '#4f3279', mid: '#7f5fbf', inner: '#c9b6f2', center: '#fff3b0' },
  white:    { outer: '#c7c1d6', mid: '#ebe8f2', inner: '#ffffff', center: '#f2c14e' },
  marigold: { outer: '#d9631a', mid: '#f29b2e', inner: '#ffd76a', center: '#6b3a0a' },
  blush:    { outer: '#d88a98', mid: '#f2b8c2', inner: '#fff2f5', center: '#c9a227' },
};
const PAL_KEYS = Object.keys(PALETTES);
// Warm to cool, used by "By position"
const POS_ORDER = ['marigold', 'red', 'pink', 'blush', 'white', 'violet'];

// ---------- Flower shapes ----------
// Each ring is a set of petals. "round" gives rounder petals.
const FLOWER_TYPES = {
  peony: {
    rings: [
      { n: 7, len: 0.46, wid: 0.19, col: 'outer' },
      { n: 6, len: 0.36, wid: 0.165, col: 'mid', off: 0.5 },
      { n: 5, len: 0.25, wid: 0.12, col: 'inner', off: 0.2 },
    ],
    center: 'disc',
  },
  rose: {
    rings: [
      { n: 5, len: 0.44, wid: 0.2, col: 'outer', round: true },
      { n: 5, len: 0.34, wid: 0.18, col: 'mid', off: 0.5, round: true },
      { n: 4, len: 0.24, wid: 0.16, col: 'inner', off: 0.2, round: true },
      { n: 3, len: 0.13, wid: 0.12, col: 'inner', off: 0.1, round: true },
    ],
    center: 'spiral',
  },
  daisy: {
    rings: [
      { n: 14, len: 0.44, wid: 0.06, col: 'inner' },
      { n: 14, len: 0.38, wid: 0.055, col: 'mid', off: 0.5 },
    ],
    center: 'sun',
  },
  cosmos: {
    rings: [
      { n: 8, len: 0.44, wid: 0.13, col: 'mid' },
      { n: 8, len: 0.3, wid: 0.1, col: 'inner', off: 0.5 },
    ],
    center: 'small',
  },
  marigold: {
    rings: [
      { n: 16, len: 0.42, wid: 0.07, col: 'outer' },
      { n: 12, len: 0.3, wid: 0.09, col: 'mid', off: 0.5 },
    ],
    center: 'dark',
  },
  jasmine: {
    rings: [{ n: 5, len: 0.38, wid: 0.18, col: 'inner', round: true }],
    center: 'small',
  },
};
const TYPE_KEYS = Object.keys(FLOWER_TYPES);

// Leaf colours: [light tip, dark base]
const LEAF_TONES = [
  ['#8fb36a', '#23452a'],
  ['#6f9a4f', '#1d3b22'],
  ['#a6c07a', '#2c5530'],
  ['#c9a34a', '#6b4a17'],
];

// ---------- Vein styles ----------
// w: thickness, tip: how thin the vein gets at its end (fraction of its base width),
// twist: two crossing strands, ribbon: flat band with a highlight, coil: small rings along it.
const VEIN_STYLES = {
  vine:   { label: 'Thin vine',       w: 0.55, tip: 0.08, twist: false, ribbon: false, coil: false },
  stem:   { label: 'Thick stem',      w: 1.0,  tip: 0.25, twist: false, ribbon: false, coil: false },
  rope:   { label: 'Twisted rope',    w: 0.9,  tip: 0.3,  twist: true,  ribbon: false, coil: false },
  ribbon: { label: 'Ribbon',          w: 1.2,  tip: 0.6,  twist: false, ribbon: true,  coil: false },
  wire:   { label: 'Wire with coils', w: 0.35, tip: 0.2,  twist: false, ribbon: false, coil: true  },
};
const VEIN_KEYS = Object.keys(VEIN_STYLES);
const VEIN_STYLE_LABELS = [['mixed', 'Mixed']].concat(VEIN_KEYS.map(k => [k, VEIN_STYLES[k].label]));

// ---------- Looks (presets) ----------
// A look sets the font, text style, colours, flowers, veins and motion.
// Every look sets layer to 'both', so a look never leaves flowers stuck behind the letters.
// Settings a look does not name keep their current value.
const PRESETS = {
  custom: {},

  // ----- Classic looks -----
  wedding: { bg: '#fbf6f2', font: 'anek', textColor: '#6b2a3f', textGrad: false, textOpacity: 0.95,
             bend: 0.2, letterRise: true, shimmer: false, flower: 'rose', color: 'blush', pattern: 'cluster',
             density: 0.6, layer: 'both', shadow: 0.2, leafTone: '0', veinStyle: 'vine', veinColor: '#7a8f5a',
             veinTipColor: '#a8bf86', fall: 10, sparkle: 0.5, vignette: 0, grain: 0.15, animStyle: 'sweep' },
  poster: { bg: '#111018', font: 'hind', textColor: '#ffffff', textGrad: true, textColor2: '#ff7aa2', gradDir: 'v',
            textOpacity: 1, bend: 0, letterRise: true, shimmer: true, flower: 'mixed', color: 'mixed',
            pattern: 'edge', density: 0.6, layer: 'both', fall: 0, sparkle: 0, vignette: 0.6, grain: 0.1,
            animStyle: 'wave' },
  minimal: { bg: '#f5f1ea', font: 'noto-sans', textColor: '#2a1d2e', textGrad: false, textOpacity: 1,
             bend: 0, letterRise: false, shimmer: false, flower: 'daisy', color: 'white', pattern: 'edge',
             density: 0.6, layer: 'both', leaves: 0, veins: false, connect: false, fall: 0, sparkle: 0,
             shadow: 0.1, grain: 0, vignette: 0, animStyle: 'sweep' },
  night: { bg: '#06070d', font: 'atma', textColor: '#cfe3ff', textGrad: true, textColor2: '#9d7bff', gradDir: 'h',
           textOpacity: 0.9, bend: 0.25, letterRise: true, shimmer: true, flower: 'jasmine', color: 'violet',
           pattern: 'cluster', density: 0.7, layer: 'both', fall: 20, sparkle: 0.9, vignette: 0.8,
           leafTone: '1', veinStyle: 'vine', veinColor: '#2d5a4a', veinTipColor: '#5f9e88', animStyle: 'drift' },
  spring: { bg: '#0e1a14', font: 'galada', textColor: '#ffe6ef', textGrad: false, textOpacity: 0.95, bend: 0.15,
            letterRise: true, shimmer: true, flower: 'cosmos', color: 'pink', pattern: 'cluster', density: 0.6,
            layer: 'both', fall: 18, sparkle: 0.5, leafTone: '2', veinStyle: 'vine', veinColor: '#4f8a4a',
            veinTipColor: '#8cc27d', animStyle: 'sweep' },
  summer: { bg: '#1a1008', font: 'baloo', textColor: '#fff4d6', textGrad: true, textColor2: '#ffb347', gradDir: 'h',
            textOpacity: 1, textSize: 1.05, bend: 0.3, letterRise: true, shimmer: true, flower: 'marigold',
            color: 'marigold', pattern: 'cluster', density: 0.6, layer: 'both', fall: 6, sparkle: 0.7,
            leafTone: '0', animStyle: 'wave' },
  autumn: { bg: '#1a0d0a', font: 'tiro', textColor: '#f6dcc0', textGrad: false, textOpacity: 0.9, bend: 0.3,
            letterRise: true, shimmer: false, flower: 'peony', color: 'red', pattern: 'cluster', density: 0.6,
            layer: 'both', fall: 25, sparkle: 0.2, leafTone: '3', veinStyle: 'stem', veinColor: '#7a5a2a',
            veinTipColor: '#c09a5a', animStyle: 'spiral' },
  winter: { bg: '#0b1424', font: 'yantra', textColor: '#eaf4ff', textGrad: true, textColor2: '#8fd3ff',
            gradDir: 'v', textOpacity: 1, bend: 0.1, letterRise: true, shimmer: true, flower: 'daisy',
            color: 'white', pattern: 'scatter', density: 0.6, layer: 'both', fall: 30, sparkle: 1,
            leafTone: '1', veinStyle: 'wire', veinColor: '#3a5f6b', veinTipColor: '#8fd3ff', animStyle: 'random' },
  monsoon: { bg: '#0c1116', font: 'anek', textColor: '#c8d8e6', textGrad: false, textOpacity: 0.9, bend: 0.2,
             letterRise: true, shimmer: true, flower: 'cosmos', color: 'violet', pattern: 'cluster', density: 0.7,
             layer: 'both', fall: 35, vignette: 0.8, sparkle: 0.3, leafTone: '1', veinStyle: 'rope',
             veinColor: '#2f4f4a', veinTipColor: '#6fa8a0', animStyle: 'sweep' },
  rose: { bg: '#14080c', font: 'noto-serif', textColor: '#ffd6e0', textGrad: true, textColor2: '#ff5c8a',
          gradDir: 'h', textOpacity: 0.95, bend: 0.35, letterRise: true, shimmer: true, flower: 'rose',
          color: 'red', pattern: 'cluster', density: 0.6, layer: 'both', fall: 8, sparkle: 0.3, vignette: 0.6,
          shadow: 0.5, veinStyle: 'stem', veinColor: '#2f5a2a', veinTipColor: '#6fa860', leafTone: '1',
          animStyle: 'spiral' },
  festival: { bg: '#1a0510', font: 'baloo', textColor: '#ffd166', textGrad: true, textColor2: '#ff4d6d',
              gradDir: 'h', textOpacity: 1, textSize: 1.1, bend: 0.45, letterRise: true, shimmer: true,
              flower: 'marigold', color: 'marigold', pattern: 'scatter', density: 0.55, layer: 'both',
              fall: 30, sparkle: 0.9, leaves: 3, veinStyle: 'ribbon', animStyle: 'random' },
  ink: { bg: '#f4f1ea', font: 'tiro', textColor: '#1d1b22', textGrad: false, textOpacity: 0.85, bend: 0.1,
         letterRise: false, shimmer: false, flower: 'jasmine', color: 'white', pattern: 'cluster',
         density: 0.6, layer: 'both', flowerOpacity: 0.7, grain: 0.35, vignette: 0, fall: 0, sparkle: 0,
         leafTone: '1', veinStyle: 'vine', veinColor: '#4a4a40', veinTipColor: '#7a7a6a', shadow: 0.1,
         animStyle: 'sweep' },
  moonlight: { bg: '#060814', font: 'atma', textColor: '#e7ecff', textGrad: true, textColor2: '#b9c6ff',
               gradDir: 'h', textOpacity: 0.95, bend: 0.2, letterRise: true, shimmer: true, flower: 'cosmos',
               color: 'white', pattern: 'cluster', density: 0.6, layer: 'both', fall: 22, sparkle: 1,
               vignette: 0.85, veinStyle: 'vine', veinColor: '#2c4a6b', veinTipColor: '#7fa6d6', leafTone: '1',
               flowerOpacity: 0.85, animStyle: 'drift' },
  monsoonNight: { bg: '#070b10', font: 'anek', textColor: '#9fd3e6', textGrad: false, textOpacity: 0.9, bend: 0.2,
                  letterRise: true, shimmer: true, flower: 'jasmine', color: 'violet', pattern: 'cluster',
                  density: 0.6, layer: 'both', fall: 40, vignette: 0.9, sparkle: 0.4, leafTone: '1',
                  veinStyle: 'rope', veinColor: '#2f4f4a', veinTipColor: '#6fa8a0', veinWidth: 0.7, branches: 2,
                  tendrils: true, animStyle: 'wave' },

  // ----- New looks -----
  pohela: { bg: '#fff8ee', font: 'hind', textColor: '#b3121f', textGrad: true, textColor2: '#e0a100',
            gradDir: 'h', textOpacity: 0.95, bend: 0.25, letterRise: true, shimmer: true, flower: 'marigold',
            color: 'marigold', pattern: 'cluster', density: 0.6, layer: 'both', shadow: 0.3, fall: 0,
            sparkle: 0.2, vignette: 0, grain: 0.2, leafTone: '1', veinStyle: 'vine', veinColor: '#2e6b3a',
            veinTipColor: '#6fae5c', animStyle: 'sweep' },
  durga: { bg: '#1b0307', font: 'noto-serif', textColor: '#ffd24a', textGrad: true, textColor2: '#ff3b3b',
           gradDir: 'v', textOpacity: 1, textSize: 1.05, bend: 0.35, letterRise: true, shimmer: true,
           flower: 'marigold', color: 'red', pattern: 'vine', density: 0.6, layer: 'both', fall: 12,
           sparkle: 0.8, vignette: 0.7, grain: 0.1, leafTone: '0', veinStyle: 'ribbon', veinColor: '#7a2a1a',
           veinTipColor: '#c9552e', animStyle: 'spiral' },
  tea: { bg: '#0f1d12', font: 'anek', textColor: '#e8f2d8', textGrad: false, textOpacity: 0.95, bend: 0.15,
         letterRise: true, shimmer: false, flower: 'jasmine', color: 'white', pattern: 'scatter', density: 0.6,
         layer: 'both', leaves: 4, leafTone: '1', veinStyle: 'vine', veinColor: '#3d6b30', veinTipColor: '#7fb06a',
         fall: 8, sparkle: 0.4, vignette: 0.5, shadow: 0.4, animStyle: 'sweep' },
  sunset: { bg: '#1e0b1f', font: 'atma', textColor: '#ffb199', textGrad: true, textColor2: '#ffd27f',
            gradDir: 'v', textOpacity: 0.95, bend: 0.3, letterRise: true, shimmer: true, flower: 'peony',
            color: 'blush', pattern: 'cluster', density: 0.6, layer: 'both', fall: 14, sparkle: 0.6,
            vignette: 0.6, leafTone: '3', veinStyle: 'ribbon', veinColor: '#6b3a4a', veinTipColor: '#c87a8a',
            animStyle: 'wave' },
  neon: { bg: '#05030d', font: 'hind', textColor: '#39ffd6', textGrad: true, textColor2: '#ff3cac',
          gradDir: 'h', textOpacity: 1, bend: 0.2, letterRise: true, shimmer: true, flower: 'daisy',
          color: 'violet', pattern: 'edge', density: 0.6, layer: 'both', flowerOpacity: 0.9, shadow: 0.6,
          fall: 15, sparkle: 1, vignette: 0.8, leafTone: '1', veinStyle: 'wire', veinColor: '#00b89c',
          veinTipColor: '#7dfff0', animStyle: 'spiral' },
  vintage: { bg: '#efe3c8', font: 'tiro', textColor: '#4a2e1a', textGrad: false, textOpacity: 0.9, bend: 0.2,
             letterRise: true, shimmer: false, flower: 'rose', color: 'marigold', pattern: 'cluster',
             density: 0.6, layer: 'both', leaves: 2, leafTone: '3', veinStyle: 'vine', veinColor: '#7a5a30',
             veinTipColor: '#b08a50', grain: 0.5, vignette: 0.4, sparkle: 0, fall: 0, shadow: 0.2,
             animStyle: 'sweep' },
  sakura: { bg: '#fdf1f4', font: 'galada', textColor: '#b0456a', textGrad: false, textOpacity: 0.95, bend: 0.25,
            letterRise: true, shimmer: true, flower: 'cosmos', color: 'blush', pattern: 'scatter', density: 0.6,
            layer: 'both', fall: 40, sparkle: 0.3, leafTone: '2', veinStyle: 'vine', veinColor: '#c58aa0',
            veinTipColor: '#e8b8c8', grain: 0.1, shadow: 0.2, vignette: 0, animStyle: 'random' },
  midnight: { bg: '#05081a', font: 'noto-sans', textColor: '#f0e6ff', textGrad: false, textOpacity: 0.95, bend: 0.3,
              letterRise: true, shimmer: true, flower: 'peony', color: 'violet', pattern: 'cluster', density: 0.6,
              layer: 'both', fall: 10, sparkle: 0.5, vignette: 0.9, leafTone: '1', veinStyle: 'vine',
              veinColor: '#2a3a6a', veinTipColor: '#6a80c0', animStyle: 'drift' },
  ember: { bg: '#0d0503', font: 'baloo', textColor: '#ff9a3c', textGrad: true, textColor2: '#ff3d00',
           gradDir: 'v', textOpacity: 1, bend: 0.4, letterRise: true, shimmer: true, flower: 'marigold',
           color: 'marigold', pattern: 'cluster', density: 0.6, layer: 'both', fall: 0, sparkle: 0.6,
           vignette: 0.8, leafTone: '3', veinStyle: 'rope', veinColor: '#5a2a10', veinTipColor: '#d05a20',
           animStyle: 'wave' },
  mono: { bg: '#0a0a0a', font: 'noto-sans', textColor: '#ffffff', textGrad: false, textOpacity: 1, bend: 0,
          letterRise: false, shimmer: false, flower: 'daisy', color: 'white', pattern: 'grid', density: 0.6,
          layer: 'both', leaves: 0, veins: false, connect: false, fall: 0, sparkle: 0, grain: 0.2,
          vignette: 0.3, shadow: 0.4, animStyle: 'sweep' },
};

// Order and labels for the "Start from a look" menu.
const LOOK_LABELS = [
  ['custom', 'Keep my settings'], ['wedding', 'Wedding'], ['poster', 'Poster'], ['minimal', 'Minimal'],
  ['night', 'Night garden'], ['spring', 'Spring'], ['summer', 'Summer'], ['autumn', 'Autumn'],
  ['winter', 'Winter'], ['monsoon', 'Monsoon'], ['rose', 'Rose garden'], ['festival', 'Festival'],
  ['ink', 'Ink wash'], ['moonlight', 'Moonlight'], ['monsoonNight', 'Monsoon night'],
  ['pohela', 'Pohela Boishakh'], ['durga', 'Durga Puja'], ['tea', 'Tea garden'], ['sunset', 'Sunset'],
  ['neon', 'Neon garden'], ['vintage', 'Vintage paper'], ['sakura', 'Cherry blossom'],
  ['midnight', 'Midnight'], ['ember', 'Ember'], ['mono', 'Black and white'],
];

// ---------- Bloom animations ----------
// How flowers open. Each one decides the order in which flowers bloom.
const ANIM_LABELS = [
  ['sweep', 'Left to right (default)'],
  ['wave', 'Wave from the centre outward'],
  ['spiral', 'Spiral'],
  ['drift', 'Drift in from outside'],
  ['random', 'Random sparkle'],
];

// ---------- Export shapes ----------
// Shape for saved images and videos. 'screen' uses the size of your browser window.
const EXPORT_SHAPES = [
  ['screen', 'Screen size'], ['landscape', 'Landscape (16:9)'], ['portrait', 'Portrait (9:16)'],
  ['square', 'Square (1:1)'], ['post', 'Post (4:5)'], ['classic', 'Classic (4:3)'], ['cinema', 'Cinema (2.39:1)'],
];
// Width divided by height for each shape.
const EXPORT_RATIO = { landscape: 16 / 9, portrait: 9 / 16, square: 1, post: 4 / 5, classic: 4 / 3, cinema: 2.39 };

// ---------- Default values ----------
const DEFAULTS = {
  text: 'অক্ষর বাগান',
  // Text
  font: 'atma', textColor: '#f1ecf7', textGrad: false, textColor2: '#e8506e', gradDir: 'h',
  textOpacity: 0.9, textSize: 1, bend: 0.3, letterRise: true, shimmer: true,
  // Layout
  pattern: 'cluster', density: 0.5, size: 1,
  // Flowers
  flower: 'mixed', color: 'mixed', flowerOpacity: 1, layer: 'both', shadow: 0.35,
  // Leaves
  leaves: 2, leafTone: 'mixed', veins: true,
  // Veins
  connect: true, veinWidth: 0.5, veinCurve: 0.5, branches: 1, tendrils: true, veinColor: '#3f7a3a',
  veinStyle: 'vine', veinDir: 'a2b', veinGradient: true, veinTipColor: '#8cc27d',
  veinWobble: 0.5, leafStems: false, veinDensity: 0.15, veinOpacity: 0.95,
  // Motion
  idle: true, sway: 0.8, breath: 0.8, speed: 1, breeze: true, animStyle: 'sweep',
  // Background and effects
  bg: '#0b0a12', vignette: 0.5, grain: 0.25, fall: 12, sparkle: 0.4,
  // Export
  exportHold: 6, exportRatio: 'screen',
  seed: 12345,
};

// Changes to these keys rebuild the flower layout. Other keys only redraw.
const LAYOUT_KEYS = new Set(['pattern', 'density', 'size', 'flower', 'color', 'layer', 'leaves', 'leafTone',
  'veins', 'connect', 'veinWidth', 'veinCurve', 'branches', 'tendrils', 'bend', 'textSize',
  'veinStyle', 'veinDir', 'animStyle', 'veinDensity']);
