# YouTube Video Downloader API

A robust YouTube video downloader backend and API built with Node.js and `ytdlp-nodejs`.

## Features

- ✅ **High Success Rate**: Uses `yt-dlp` under the hood via `ytdlp-nodejs`.
- 🍪 **Bot Bypass**: Built-in support for browser cookies to bypass "Sign in to confirm you're not a bot" checks.
- 🚀 **Express API**: Ready-to-use API server with video info and download endpoints.
- 📦 **Standalone Script**: Simple script for quick local downloads.

## Installation

```bash
git clone https://github.com/itsjustgurjit/youtube-downloader-backend-make-autoamtion.git
cd youtube-downloader-backend-make-autoamtion
npm install
```

## Usage

### 1. Standalone Downloader
Download a video directly from the terminal:
```bash
node download.mjs
```
*Configure URL and Cookies in `download.mjs`.*

### 2. API Server
Start the server:
```bash
node server.mjs
```

#### API Endpoints
- **Get Video Info**: `GET /api/info?url=<youtube_url>`
- **Download Video**: `GET /api/download?url=<youtube_url>&browser=chrome`
  - *Optional params: `quality=720p`, `browser=chrome` (to bypass bot detection).*

## Bypassing Bot Detection
If YouTube blocks the request, ensure you are logged into YouTube in your browser and pass the browser name:
- **Script**: Set `COOKIES_FROM_BROWSER = 'chrome'` in `download.mjs`.
- **API**: Add `&browser=chrome` to your URL.

## License
MIT
