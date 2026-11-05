// ============================================================
// export.js
// Saves a still image (PNG or JPG) and records a video (MP4 or WebM),
// in the shape chosen under "Export shape".
//
// The bloom is laid out again for that shape, so flowers and letters
// fit the frame. Video frames are drawn by frame number, not by the
// clock: a slow device makes the recording take longer, but no part
// of the animation is skipped.
// ============================================================

const EXPORT_MAX_SIDE = 1920;     // longest side of a video
const EXPORT_IMAGE_SIDE = 2560;   // longest side of a still image

function download(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

function setRecBtn(on, pct) {
  const b = $('recBtn');
  if (!b) return;
  b.disabled = on;
  b.textContent = on ? `${tr('Recording…')} ${Math.round(pct || 0)}%` : tr('Record video (MP4 or WebM)');
}

const pause = ms => new Promise(r => setTimeout(r, ms));

// Size of the frame for the chosen shape. Returns CSS size and bitmap scale.
function exportSize(longSide) {
  const shape = state.exportRatio;
  if (shape === 'screen' || !EXPORT_RATIO[shape]) {
    return { w: W, h: H, scale: Math.min(dpr, longSide / Math.max(W, H)) };
  }
  const r = EXPORT_RATIO[shape];
  let w, h;
  if (r >= 1) { w = longSide; h = longSide / r; }
  else { h = longSide; w = longSide * r; }
  return { w: Math.round(w), h: Math.round(h), scale: 1 };
}

// Switches to the export frame: lays out the bloom for it and prepares the export canvas.
// Returns the previous screen size, so endExport can restore it.
function beginExport(longSide) {
  const prev = { W, H };
  const { w, h, scale } = exportSize(longSide);
  exporting = true;
  W = w;
  H = h;
  layout();
  exp.width = Math.round(w * scale) & ~1;     // video encoders want even sizes
  exp.height = Math.round(h * scale) & ~1;
  expCtx.setTransform(exp.width / w, 0, 0, exp.height / h, 0, 0);
  return prev;
}

// Restores the screen size and layout after an export.
function endExport(prev) {
  W = prev.W;
  H = prev.H;
  exporting = false;
  relayout();
}

// Still image, drawn with the bloom finished. No breeze in exports.
function saveImage(type) {
  if (!sample) return;
  const prev = beginExport(EXPORT_IMAGE_SIDE);
  try {
    const t = bloomRel + 2.5;
    updateFlowers(0, false, t);
    renderScene(expCtx, t, true);
    exp.toBlob(b => download(b, `bangla-bloom.${type}`), type === 'jpg' ? 'image/jpeg' : 'image/png', 0.95);
  } finally {
    endExport(prev);
  }
}

// Video: from the first bud, through the bloom, then ambient motion for the hold time.
async function recordVideo() {
  if (recording || !sample) return;
  if (!window.MediaRecorder) {
    alert('Video recording is not supported in this browser. Try Chrome, Edge or Safari.');
    return;
  }
  const mime = ['video/mp4;codecs=avc1.42E01E', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm']
    .find(m => MediaRecorder.isTypeSupported(m));
  if (!mime) { alert('No supported video format was found in this browser.'); return; }

  recording = true;
  setRecBtn(true, 0);
  const prev = beginExport(EXPORT_MAX_SIDE);

  // Capture mode: if the browser supports requestFrame, each frame is sent on purpose.
  // Otherwise the stream runs at the set frame rate.
  const probe = exp.captureStream(0).getVideoTracks()[0];
  const manual = !!(probe && typeof probe.requestFrame === 'function');
  const stream = exp.captureStream(manual ? 0 : EXPORT_FPS);
  const track = stream.getVideoTracks()[0];

  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8000000 });
  const chunks = [];
  rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
  rec.onstop = () => {
    const ext = mime.startsWith('video/mp4') ? 'mp4' : 'webm';
    download(new Blob(chunks, { type: mime.split(';')[0] }), `bangla-bloom.${ext}`);
    recording = false;
    setRecBtn(false);
  };

  try {
    const total = bloomRel + state.exportHold;     // seconds of animation to record
    const frames = Math.ceil((total * EXPORT_FPS) / state.speed);
    const gap = 1000 / EXPORT_FPS;
    const sx = exp.width / W, sy = exp.height / H;

    rec.start();
    for (let i = 0; i <= frames; i++) {
      const tm = (i / EXPORT_FPS) * state.speed;   // animation time for this frame
      expCtx.setTransform(sx, 0, 0, sy, 0, 0);
      updateFlowers(0, false, tm);
      renderScene(expCtx, tm, false);
      if (manual) track.requestFrame();
      if (i % 10 === 0) setRecBtn(true, (i / frames) * 100);
      await pause(gap);   // give the recorder time to take this frame
    }
    rec.stop();
  } finally {
    endExport(prev);
    if (rec.state === 'inactive' && recording) { recording = false; setRecBtn(false); }
  }
}
