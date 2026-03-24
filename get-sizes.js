const fs = require('fs');
const sharp = require('sharp');
async function getSizes() {
    const files = fs.readdirSync('./images').filter(f => f.endsWith('.png'));
    for (const f of files) {
        try {
            const m = await sharp('./images/' + f).metadata();
            console.log(`${f}: ${m.width}x${m.height}`);
        } catch(e) {}
    }
}
getSizes();
