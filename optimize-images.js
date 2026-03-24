/**
 * PrimeHR Image Optimizer
 * Converts PNG/JPG images used in HTML to WebP at optimal quality
 * Creates .webp counterparts without deleting originals (for fallback safety)
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const imagesDir = path.join(__dirname, 'images');

// Only optimize images actually referenced in HTML (avoid junk files)
const usedImages = [
    'hero-dashboard.png',
    'logo.png',
    'PrimeHR_logo.png',
    'tally.png',
    'excel.png',
    'bank transactions.png',
    'email.png',
    'fingerprint.png',
    'smartphone.png',
    'emoji-star-eyes.png',
    'emoji-money-face.png',
];

async function optimizeImage(filename) {
    const inputPath = path.join(imagesDir, filename);
    const ext = path.extname(filename);
    const base = path.basename(filename, ext);
    const outputPath = path.join(imagesDir, `${base}.webp`);

    if (!fs.existsSync(inputPath)) {
        console.log(`  SKIP (not found): ${filename}`);
        return;
    }

    try {
        const info = await sharp(inputPath)
            .webp({ quality: 82, effort: 4, smartSubsample: true })
            .toFile(outputPath);

        const origSize = fs.statSync(inputPath).size;
        const saving = ((1 - info.size / origSize) * 100).toFixed(1);
        console.log(`  ✓ ${filename} → ${base}.webp  [${(origSize/1024).toFixed(0)}KB → ${(info.size/1024).toFixed(0)}KB, -${saving}%]`);
    } catch (err) {
        console.error(`  ✗ Error processing ${filename}:`, err.message);
    }
}

async function main() {
    console.log('\nPrimeHR Image Optimizer\n' + '='.repeat(40));
    for (const img of usedImages) {
        await optimizeImage(img);
    }
    console.log('\nDone! Remember to update image src attributes to use .webp files.\n');
}

main();
