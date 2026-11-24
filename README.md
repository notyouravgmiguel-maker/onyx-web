# Onyx Browser — Official Download Portal & Showcase

Official web landing page and download hub for **Onyx Browser**, the high-performance desktop web browser engineered with Electron 33, BaseWindow multi-view architecture, SQLite persistence, and frosted-glass dashboard.

---

## 🚀 Features Showcase

- **BaseWindow Architecture**: Completely modern WebContentsView layout with zero lag.
- **Frameless Window**: Custom aesthetic window controls tailored directly to the browser design.
- **Local Persistence**: Dual-engine SQLite (native `better-sqlite3` + `sql.js` WASM fallback) for instant history, bookmarks, favicons, and settings.
- **Universal Media Controls**: Tab audio tracking, background session scraping, and unified media dashboard.
- **Integrated Shield**: High-speed ad and tracker blocking engine.
- **Internal Pages**: Glassmorphism dashboard (`browser://newtab`, `browser://settings`, `browser://history`, `browser://bookmarks`, `browser://downloads`, `browser://extensions`).

---

## 📦 Downloads

Installers are published as assets of the latest [GitHub Release](../../releases/latest) (too large for the repo or Pages).
The public site is deployed to GitHub Pages by `.github/workflows/pages.yml` on every push to `main`.

---

## 🌐 Running Locally

Source lives in `src/` (entry: `src/index.html`). The project root holds the **built** site, which WAMP serves at [http://localhost/onyx-web/](http://localhost/onyx-web/).

```bash
npm run dev        # Vite dev server; /downloads is proxied to WAMP
npm run typecheck
npm run build      # typecheck, build to dist/, publish into the project root
```

Never edit the root `index.html` or `assets/index-*` — they are overwritten by `npm run build`.

---

## 📄 License
MIT License
