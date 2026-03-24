const fs = require('fs');
const CleanCSS = require('clean-css');

// Concat both minified CSS into one
const css1 = fs.readFileSync('styles.css', 'utf8');
const css2 = fs.readFileSync('theme-xanthous-plum.css', 'utf8');
const combined = css1 + '\n\n' + css2;

const output = new CleanCSS({ level: 2 }).minify(combined);
fs.writeFileSync('all.min.css', output.styles);
console.log('Combined all.min.css generated!');
