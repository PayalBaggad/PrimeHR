const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createResponsiveImages() {
    // Generate sizes for the hero image
    const heroImg = path.join(__dirname, 'images', 'hero-dashboard.webp');
    if (fs.existsSync(heroImg)) {
        console.log("Processing hero-dashboard...");
        // 800w for tablets
        await sharp(heroImg).resize({ width: 800 }).toFile(path.join(__dirname, 'images', 'hero-dashboard-800w.webp'));
        // 400w for mobile
        await sharp(heroImg).resize({ width: 400 }).toFile(path.join(__dirname, 'images', 'hero-dashboard-400w.webp'));
        console.log("Hero responsive images created.");
    }
}
createResponsiveImages().catch(console.error);
