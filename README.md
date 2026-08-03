# 📸 Photography Portfolio — Aatmaj Amol Salunke

[![Portfolio](https://img.shields.io/badge/Portfolio-Live-brightgreen)](https://aatmaj28.github.io/PhotographyWebsite/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A cinematic-darkroom photography portfolio — near-black canvas, film grain, warm amber accents — showcasing 50+ curated photographs, with a built-in admin portal for publishing new work straight from the browser.

## 🚀 Live

**[aatmaj28.github.io/PhotographyWebsite](https://aatmaj28.github.io/PhotographyWebsite/)**

## ✨ Features

- **🎞️ Cinematic Darkroom theme** — full-bleed hero slideshow with slow crossfades and Ken Burns drift, animated film grain, elegant serif typography
- **🧱 True masonry gallery** — photos keep their natural aspect ratios; order preserved left-to-right
- **🔍 Full lightbox** — keyboard arrows, touch swipe, photo counter, titles & captions
- **⚡ Fast** — all photos served as optimized JPEGs (full ≈1 MB, thumbnails ≈200 KB) with lazy loading; the grid loads ~8 MB instead of the original ~1.9 GB
- **📱 Fully responsive** — including a proper mobile menu
- **🛠️ Admin portal** (`/admin/`) — drag & drop photos in the browser: they're compressed client-side and published to this repo in a single commit via the GitHub API. Edit titles/captions, reorder, toggle hero-featured, delete — no local tooling needed

## 📂 Project structure

```
├── index.html           # The gallery site
├── css/style.css        # Cinematic Darkroom theme
├── js/main.js           # Gallery engine (masonry, hero, lightbox)
├── gallery.json         # Manifest: photo order, titles, captions, hero flags
├── admin/index.html     # Admin portal (GitHub-token gated)
└── images/
    ├── full/            # ~2000px lightbox/hero versions
    ├── thumbs/          # ~800px grid versions
    └── profile.jpg      # About-section portrait
```

## 🛠️ How the admin portal works

1. Open `/admin/` and paste a **fine-grained GitHub token** (scoped to only this repo, Contents read/write). It's stored only in your browser.
2. Drop photos — each is resized/compressed in the browser (no originals leave your machine at full size), then committed atomically together with an updated `gallery.json`.
3. GitHub Pages redeploys automatically; changes are live in ~1–2 minutes.

## 📧 Contact

**Aatmaj Amol Salunke**
- 📧 [aatmajsalunke@yahoo.com](mailto:aatmajsalunke@yahoo.com)
- 📷 [Instagram](https://www.instagram.com/aatmaj_salunke/)
- 💼 [LinkedIn](https://www.linkedin.com/in/aatmaj-salunke-7106041b0/)
- 🎓 Northeastern University, Boston

---

<p align="center">Made with ❤️ (and a lot of amber light) by Aatmaj Amol Salunke</p>
