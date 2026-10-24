// ============================================================
// export.js
// Saves a still image (PNG or JPG) and records a video (MP4 or WebM).
//
// Video frames are drawn by frame number, not by the clock. Frame n is
// always the animation at time n / fps. If the device is slow, the
// recording takes longer, but no part of the animation is skipped.
// ============================================================

const EXPORT_MAX_SIDE = 1920;   // larger screens are recorded at this size, to keep it smooth

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

// Still image, drawn with the bloom finished. No breeze in exports.
function saveImage(type) {
  if (!sample) return;
  const t = bloomRel + 2.5;
  exp.width = Math.round(W * dpr);
  exp.height = Math.round(H * dpr);
  expCtx.setTransform(exp.width / W, 0, 0, exp.height / H, 0, 0);
  updateFlowers(0, false, t);
  renderScene(expCtx, t, true);
  exp.toBlob(b => download(b, `bangla-bloom.${type}`), type === 'jpg' ? 'image/jpeg' : 'image/png', 0.95);
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

  // Size: keep the longest side within EXPORT_MAX_SIDE, and make both sides even.
  const scale = Math.min(dpr, EXPORT_MAX_SIDE / Math.max(W, H));
  exp.width = Math.round(W * scale) & ~1;
  exp.height = Math.round(H * scale) & ~1;

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

  // Restart the layout so the bloom begins at the first frame.
  layout();
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
}
