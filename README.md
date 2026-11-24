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

- Direct Executable: [`downloads/Onyx-Browser.exe`](downloads/Onyx-Browser.exe)
- Full Portable ZIP Bundle: [`downloads/Onyx-Browser-win-x64.zip`](downloads/Onyx-Browser-win-x64.zip)

---

## 🌐 Running Locally

### Via WAMP / Apache:
Since this is located under `c:\wamp\www\onyx-web`, if WAMP is running, open:
[http://localhost/onyx-web/](http://localhost/onyx-web/)

### Via Node static server:
```bash
npx serve -l 3000 .
```
Then visit [http://localhost:3000](http://localhost:3000).

---

## 📄 License
MIT License
