// ============================================================
// designs.js
// Turns the current settings (including the text) into a short code,
// and restores settings from a code.
// ============================================================

function encodeDesign() {
  const json = JSON.stringify(state);
  return btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16))));
}

function decodeDesign(code) {
  const json = decodeURIComponent(
    atob(code.trim()).split('').map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
  );
  return JSON.parse(json);
}

function copyDesign() {
  prompt('Copy this design code and keep it safe:', encodeDesign());
}

function loadDesign() {
  const code = prompt('Paste a design code:');
  if (!code) return;
  try {
    Object.assign(state, DEFAULTS, decodeDesign(code));
    input.value = state.text;
    autosize();
    syncControls();
    refresh();
  } catch (e) {
    alert('That code could not be read.');
  }
}
