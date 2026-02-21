// Test 1: youtubei.js - Pure JS YouTube downloader using InnerTube API
// With custom JavaScript evaluator for URL deciphering
import Innertube from 'youtubei.js';
import { Platform } from 'youtubei.js';
import fs from 'fs';
import path from 'path';

const VIDEO_ID = 'dQw4w9WgXcQ';
const OUTPUT_DIR = './downloads';

// Provide custom JS evaluator for deciphering URLs
Platform.shim.eval = async (data, env) => {
    const properties = [];
    if (env.n) {
        properties.push(`n: exportedVars.nFunction("${env.n}")`);
    }
    if (env.sig) {
        properties.push(`sig: exportedVars.sigFunction("${env.sig}")`);
    }
    const code = `${data.output}\nreturn { ${properties.join(', ')} }`;
    return new Function(code)();
};

async function downloadVideo() {
    try {
        console.log('🔧 Initializing InnerTube...');
        const yt = await Innertube.create();

        console.log(`📥 Fetching video info for: ${VIDEO_ID}`);
        const info = await yt.getInfo(VIDEO_ID);

        console.log(`📹 Title: ${info.basic_info.title}`);
        console.log(`⏱️  Duration: ${info.basic_info.duration}s`);

        // Create output directory
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }

        console.log('⬇️  Starting download...');

        // Try to download with best quality
        const stream = await info.download({
            type: 'video+audio', // muxed stream
            quality: 'best',
        });

        const outputPath = path.join(OUTPUT_DIR, `${VIDEO_ID}.mp4`);
        const fileStream = fs.createWriteStream(outputPath);

        let downloaded = 0;
        for await (const chunk of stream) {
            fileStream.write(chunk);
            downloaded += chunk.length;
            process.stdout.write(`\r📊 Downloaded: ${(downloaded / 1024 / 1024).toFixed(2)} MB`);
        }

        fileStream.end();
        console.log(`\n✅ Download complete! Saved to: ${outputPath}`);
        console.log(`📁 File size: ${(downloaded / 1024 / 1024).toFixed(2)} MB`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('📋 Stack:', error.stack);
        process.exit(1);
    }
}

downloadVideo();
