// YouTube Video Download API
// POST/GET with a YouTube URL → server downloads it → returns a download link
import express from 'express';
import cors from 'cors';
import { YtDlp } from 'ytdlp-nodejs';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const app = express();
const PORT = 3000;
const ytdlp = new YtDlp();
const DOWNLOADS_DIR = './downloads';

app.use(cors());
app.use(express.json());

// Ensure downloads dir exists
if (!fs.existsSync(DOWNLOADS_DIR)) {
    fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

// Serve downloaded files statically
app.use('/files', express.static(DOWNLOADS_DIR));

// ──────────────────────────────────────────────
// GET /api/info?url=<youtube_url>
// Returns video metadata without downloading
// ──────────────────────────────────────────────
app.get('/api/info', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'Missing "url" query parameter' });

    try {
        console.log(`📋 Info request: ${url}`);
        const info = await ytdlp.getInfoAsync(url);

        res.json({
            success: true,
            title: info.title,
            duration: info.duration,
            thumbnail: info.thumbnail,
            uploader: info.uploader,
            view_count: info.view_count,
            description: info.description,
        });
    } catch (error) {
        console.error('❌ Info error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// ──────────────────────────────────────────────
// GET /api/download?url=<youtube_url>&quality=720p&browser=chrome
// Downloads the video on the server and returns
// a direct download link to the file
// ──────────────────────────────────────────────
app.get('/api/download', async (req, res) => {
    const { url, quality, browser } = req.query;
    if (!url) return res.status(400).json({ error: 'Missing "url" query parameter' });

    try {
        console.log(`📥 Download request: ${url}`);

        // Get info first
        const info = await ytdlp.getInfoAsync(url);
        console.log(`📹 Title: ${info.title}`);

        // Create a unique subfolder per download to avoid collisions
        const downloadId = crypto.randomBytes(8).toString('hex');
        const downloadDir = path.join(DOWNLOADS_DIR, downloadId);
        fs.mkdirSync(downloadDir, { recursive: true });

        // Build the download
        console.log('⬇️  Downloading...');
        let downloadBuilder = ytdlp.download(url);

        // Apply cookies if browser is specified to bypass bot detection
        if (browser) {
            console.log(`🍪 Using cookies from ${browser}...`);
            downloadBuilder = downloadBuilder.cookiesFromBrowser(browser);
        }

        const result = await downloadBuilder
            .filter('audioandvideo')
            .quality(quality || 'highest')
            .type('mp4')
            .output(downloadDir)
            .on('progress', (p) => {
                process.stdout.write(`\r📊 ${p.percentage_str} | ${p.speed_str || ''}`);
            })
            .run();

        // Get the downloaded file path
        const filePath = result.filePaths[0];
        const fileName = path.basename(filePath);
        const stats = fs.statSync(filePath);

        // Build the download URL
        const downloadUrl = `http://localhost:${PORT}/files/${downloadId}/${encodeURIComponent(fileName)}`;

        console.log(`\n✅ Ready: ${fileName} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

        res.json({
            success: true,
            title: info.title,
            duration: info.duration,
            thumbnail: info.thumbnail,
            file: {
                name: fileName,
                size: stats.size,
                size_mb: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
                download_url: downloadUrl,
            },
        });
    } catch (error) {
        console.error('\n❌ Download error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`\n🚀 YouTube Download API running at http://localhost:${PORT}`);
    console.log(`\n📡 Endpoints:`);
    console.log(`   GET /api/info?url=<youtube_url>              → Video metadata`);
    console.log(`   GET /api/download?url=<youtube_url>          → Download & get file link`);
    console.log(`   GET /api/download?url=<url>&quality=720p     → Specify quality\n`);
});
