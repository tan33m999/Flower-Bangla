<div align="center">

# 🌸 Bangla Bloom 🌸

### Turn your Bangla words into botanical art

Flowers, leaves and vines grow over the letters.
Bend the text, choose a look, and save it as an image or a video.

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Open%20Website-e8506e?style=for-the-badge)](https://flower-bangla.vercel.app/)
[![Language](https://img.shields.io/badge/Language-বাংলা%20%7C%20English-3f7a3a?style=for-the-badge)](#-bangla-and-english)
[![Licence](https://img.shields.io/badge/Licence-Add%20yours-8a6fd1?style=for-the-badge)](#-licence)

</div>

---

## ✨ Features

| | Feature | What it does |
|:---:|---|---|
| 🔤 | **Bangla text** | Type your words, press Enter for a new line. Nine Bangla fonts. |
| 🌷 | **Six flower types** | Peony, rose, daisy, cosmos, marigold, jasmine. Six colour palettes each. |
| 🌿 | **Vines and veins** | Flowers joined by growing stems in five styles: vine, stem, rope, ribbon, wire. |
| 🌀 | **Curved text** | Bend the line into an arc. Letters and flowers follow the curve. |
| 🎬 | **Five bloom animations** | Left to right, wave, spiral, drift in, or random sparkle. |
| 🎨 | **24 ready-made looks** | Wedding, Festival, Moonlight, Durga Puja, Pohela Boishakh, Neon garden and more. |
| 💾 | **Save and export** | PNG, JPG, or video (MP4 or WebM). |
| 📐 | **Shapes** | Screen, landscape 16:9, portrait 9:16, square 1:1, post 4:5, classic 4:3, cinema 2.39:1. |
| 🔗 | **Share a design** | Copy a short code and paste it later to restore your design. |
| 🧭 | **Basic and Advanced** | Basic shows the main settings. Advanced shows everything. |

---

## 🚀 How to use it

<table>
<tr>
<td width="50%" valign="top">

### 1️⃣ Type
Write your text in the box at the bottom. Press **Enter** for a new line.

### 2️⃣ Pick a look
Open **Controls** (top right) and choose from **Start from a look**.

### 3️⃣ Adjust
Use **Basic** for the main settings, or switch to **Advanced** for everything.

</td>
<td width="50%" valign="top">

### 4️⃣ Shuffle
Press **Shuffle** for a new arrangement with the same settings.

### 5️⃣ Save
Choose an **Export shape**, then press **Save PNG**, **Save JPG**, or **Record video**.

### 6️⃣ Keep it
Press **Copy design code** and store the code. Paste it later with **Load design code**.

</td>
</tr>
</table>

> 💡 **Tip:** On a slow phone, lower **How many flowers** or turn off **Ambient motion**.

---

## 🛠️ Running it on your computer

No installation needed. You only need a web browser and an internet connection, because fonts load from Google Fonts.

**Option 1: open the file**
Double-click `index.html`. Some browsers may block parts of the page this way.

**Option 2: run a local server** *(most reliable)*

```bash
python3 -m http.server 8000
```

Then open **http://localhost:8000** in your browser.
*(On Windows, use `python -m http.server 8000` if `python3` doesn't work.)*

---

## 🗂️ Project structure

```
bangla-bloom/
├── 📄 index.html        The page: layout and control panel
├── 🎨 css/
│   └── style.css        All styles
└── ⚙️ js/
    ├── config.js        Fonts, colours, flower shapes, looks, defaults
    ├── i18n.js          English and Bangla text
    ├── state.js         Current settings and shared canvases
    ├── text.js          Text layout and fonts
    ├── sprites.js       Flower, leaf and particle drawings
    ├── layout.js        Where flowers, veins and letters go
    ├── render.js        Drawing each frame and the animation loop
    ├── export.js        Saving images and recording video
    ├── designs.js       Design codes
    └── controls.js      Control panel and its events
```

### 🔧 Where to make common changes

| To change... | Edit this file |
|---|---|
| Fonts, colours, flower shapes, looks, starting settings | `js/config.js` |
| Bangla or English wording | `js/i18n.js` |
| How a flower or leaf looks | `js/sprites.js` |
| Where flowers go, vein shape, timing | `js/layout.js` |
| Animation, sway, light sweep | `js/render.js` |
| Image and video saving, shapes | `js/export.js` |
| Control panel groups and items | `js/controls.js` |
| Colours and panel style | `css/style.css` |

<sub>Files load in the order listed in `index.html`. Each file can use what the files above it define.</sub>

---

## 🌐 Bangla and English

The interface starts in **English**. Click the **বাংলা** button at the top left to switch to Bangla. Your choice is remembered on your device.

---

## 🧩 Browser support

| Browser | Page | Video recording |
|---|:---:|:---:|
| Chrome | ✅ | ✅ MP4 or WebM |
| Edge | ✅ | ✅ MP4 or WebM |
| Safari | ✅ | ⚠️ May differ |
| Firefox | ✅ | ⚠️ May differ |

---

## 🙏 Credits

- **Fonts:** [Google Fonts](https://fonts.google.com) (Hind Siliguri, Noto Sans and Noto Serif Bengali, Baloo Da 2, Anek Bangla, Tiro Bangla, Galada, Atma, Yantramanav)
- **Artwork:** every flower and leaf is drawn in code. No photos or external artwork are used.

---

## 📜 Licence

**MIT**

<div align="center">

---

Made with 🌸 and Bangla

</div>
