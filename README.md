# Feast of Hymns 2026 – "I Will Be Attending" Landing Page

God's House of Refuge · House of Praise · Sun. 25th Oct. 2026 · 5:00pm prompt · 8 Ikot Ebido Street, Uyo

## Open it
Double-click `index.html`. It is a single self-contained file (React 18 loads from cdnjs; the flyer, logo and
title are embedded). Upload it to any host (Vercel, Netlify, Render, GitHub Pages) as-is.

## Folder
- `index.html` – built landing page (React + flyer creator)
- `src/app.jsx` – React source (Nav, Hero, Details, How, Creator, Footer)
- `src/styles.css` – styles (colours taken from the flyer; font: Poppins)
- `assets/` – flyer template PNG, title and logo cut-outs, original flyer
- `tools/make_flyer_template.py` – Python (Pillow) script that draws the flyer template
- `previous-version/` – first plain-HTML version of the site

## Rebuild after editing src/app.jsx or src/styles.css
Run the automated build script:
```bash
python tools/build.py
```
This automatically compiles `src/app.jsx` with esbuild, inlines the latest `src/styles.css`, embeds all base64 assets, and outputs a self-contained production `index.html`.

## Features & Animations
- **Ambient Floating Hymn Particles Canvas**: Gentle golden dust and floating musical notes (♩, ♪, ♫, ♬, 𝄞).
- **Sound Wave / Choral Equalizer Animation**: Live pulsating audio bars next to "PRAISE THAT PREVAILS".
- **Live Countdown Timer**: Real-time ticking countdown to Sunday 25th October 2026, 5:00pm prompt.
- **Glassmorphism Navbar**: Sticky backdrop blur with scroll-progress indicator and mobile menu toggle.
- **Scroll-Reveal Animations in Every Section**: Staggered zoom-in tiles, slide-up steps, and side-slide creator studio (IntersectionObserver, respects reduced-motion).
- **White Section Backgrounds**: Event Details and Flyer Creator use clean white layouts; "How it works" keeps the navy accent band.
- **Interactive Event Details**: Quick "Add to Google Calendar" action and Google Maps venue link.
- **Enhanced Flyer Creator**:
  - Drag-and-drop or file upload with live high-res canvas preview.
  - Interactive multi-touch & pointer dragging, pinch/scroll zoom, rotation, color filters.
  - Confetti celebration upon download.
  - One-click WhatsApp sharing and copy-link buttons.
- **Floating Back-to-Top Button**: Smooth animated navigation.

## Colours
Blue #0a34af · Navy #05165f · Deep #030f45 · Gold #ffc828 / #ffa51e · Red #cd1c1c

