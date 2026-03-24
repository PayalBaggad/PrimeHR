const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const imgMatches = html.match(/<img[^>]+>/g);
console.log(`Found ${imgMatches ? imgMatches.length : 0} images in index.html`);
if (imgMatches) {
    imgMatches.forEach(img => {
        const hasLazy = img.includes('loading="lazy"');
        const hasFetchPri = img.includes('fetchpriority="high"');
        console.log(`Lazy=${hasLazy}, High=${hasFetchPri} | ${img.substring(0, 100)}...`);
    });
}
