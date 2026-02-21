# YouTube Video Downloader - Progress Tracker

## Test Video
**URL:** `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

---

## NPM Packages & Libraries

| # | Package | Type | Status | Notes |
|---|---------|------|--------|-------|
| 1 | `youtubei.js` | Pure JS (InnerTube API) | ⚠️ Partial | Gets video info but download blocked by YouTube (non-2xx) |
| 2 | **`ytdlp-nodejs`** | **yt-dlp wrapper** | **✅ Working** | **Downloaded 7MB Short using chrome cookies.** |
| 3 | `yt-dlp-exec` | yt-dlp wrapper | ⏳ Skipped | Not needed — #2 works |
| 4 | `yt-dlp-wrap` | yt-dlp wrapper | ⏳ Skipped | Not needed — #2 works |
| 5 | `@distube/ytdl-core` | Pure JS (ytdl fork) | ❌ Dead | Archived Aug 2025, no longer maintained |
| 6 | `ytdl-core` | Pure JS | ❌ Dead | Original, unmaintained |

---

## Test Log

### Test 1: `youtubei.js` v16.0.1
- **Result:** ⚠️ Partial
- Fetches video metadata (title, duration) successfully
- Requires custom JS evaluator for URL deciphering (added via `Function` constructor)
- Download fails with "non 2xx status code" — YouTube rejecting the stream request

### Test 2: `ytdlp-nodejs` ✅ WINNER
- **Result:** ✅ Working!
- Auto-downloads and manages `yt-dlp` binary
- Fluent builder API: `.download().filter().quality().type().output().run()`
- Downloaded full video: `Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster).mp4`
- File size: **84.46 MB** | Speed: **5.33 MB/s**

---

## ✅ Final Result
**Working Solution:** `ytdlp-nodejs` (npm package wrapping yt-dlp)
**Main File:** `download.mjs`
