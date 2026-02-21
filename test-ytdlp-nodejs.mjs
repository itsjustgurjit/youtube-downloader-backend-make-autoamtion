// Test 2: ytdlp-nodejs - yt-dlp wrapper with fluent builder API
import { YtDlp } from 'ytdlp-nodejs';
import path from 'path';
import fs from 'fs';

const VIDEO_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const OUTPUT_DIR = './downloads';

async function downloadVideo() {
    try {
        // Create output directory
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }

        console.log('🔧 Initializing ytdlp-nodejs...');
        const ytdlp = new YtDlp();

        // Step 1: Get video info first
        console.log(`📥 Fetching video info for: ${VIDEO_URL}`);
        const info = await ytdlp.getInfoAsync(VIDEO_URL);
        console.log(`📹 Title: ${info.title}`);
        console.log(`⏱️  Duration: ${info.duration}s`);

        // Step 2: Download the video using fluent builder API
        console.log('⬇️  Starting download...');

        const result = await ytdlp
            .download(VIDEO_URL)
            .filter('audioandvideo')
            .quality('highest')
            .type('mp4')
            .output(OUTPUT_DIR)
            .on('progress', (p) => {
                process.stdout.write(`\r📊 Progress: ${p.percentage_str} | Speed: ${p.speed_str || 'N/A'} | ETA: ${p.eta_str || 'N/A'}`);
            })
            .on('error', (err) => {
                console.error('\n❌ Download error:', err);
            })
            .run();

        console.log(`\n✅ Download complete!`);
        console.log(`📁 Files: ${JSON.stringify(result.filePaths)}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('📋 Full error:', error);
        process.exit(1);
    }
}

downloadVideo();
