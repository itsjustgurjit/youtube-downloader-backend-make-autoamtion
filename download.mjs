// YouTube Video Downloader - Main Script
// Uses ytdlp-nodejs (yt-dlp wrapper) - the proven working solution
import { YtDlp } from 'ytdlp-nodejs';
import fs from 'fs';

// ======== CONFIGURATION ========
// Change this URL to download a different video
const VIDEO_URL = 'https://www.youtube.com/shorts/Tbz35Mc8pzE';
const OUTPUT_DIR = './downloads';
// ================================

const ytdlp = new YtDlp();

async function getVideoInfo(url) {
    console.log('📋 Fetching video info...');
    const info = await ytdlp.getInfoAsync(url);
    console.log(`📹 Title: ${info.title}`);
    console.log(`⏱️  Duration: ${info.duration}s`);
    console.log(`👤 Uploader: ${info.uploader || 'N/A'}`);
    console.log(`👁️  Views: ${info.view_count || 'N/A'}`);
    return info;
}

async function downloadVideo(url, outputDir = OUTPUT_DIR) {
    // Create output directory
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Get info first
    await getVideoInfo(url);

    console.log('\n⬇️  Starting download...\n');

    const result = await ytdlp
        .download(url)
        .filter('audioandvideo')
        .quality('highest')
        .type('mp4')
        .output(outputDir)
        .on('progress', (p) => {
            process.stdout.write(
                `\r📊 Progress: ${p.percentage_str} | Speed: ${p.speed_str || 'N/A'} | ETA: ${p.eta_str || 'N/A'}   `
            );
        })
        .on('error', (err) => {
            console.error('\n❌ Download error:', err);
        })
        .run();

    console.log(`\n\n✅ Download complete!`);
    console.log(`📁 Saved to: ${result.filePaths.join(', ')}`);

    // Show file sizes
    for (const filePath of result.filePaths) {
        const stats = fs.statSync(filePath);
        console.log(`📦 Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    }

    return result;
}

// Run it
downloadVideo(VIDEO_URL).catch((err) => {
    console.error('❌ Fatal error:', err.message);
    process.exit(1);
});
