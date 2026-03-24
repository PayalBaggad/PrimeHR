/**
 * Build Script for PrimeHR
 * Minifies JS and CSS files to reduce payload size to the absolute minimum.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Install minifiers locally if missing
try {
    require.resolve('uglify-js');
    require.resolve('clean-css');
} catch (e) {
    console.log("Installing minifier dependencies...");
    execSync('npm install clean-css uglify-js --save-dev', { stdio: 'inherit' });
}

const UglifyJS = require('uglify-js');
const CleanCSS = require('clean-css');

const jsFiles = ['script.js', 'smoke.js', 'worker.js'];
const cssFiles = ['styles.css', 'theme-xanthous-plum.css'];

console.log("\nStarting Minification Process...");

// JavaScript Minification
jsFiles.forEach(file => {
    const srcPath = path.join(__dirname, file);
    if (fs.existsSync(srcPath)) {
        const code = fs.readFileSync(srcPath, 'utf8');
        const result = UglifyJS.minify(code, { 
            compress: { passes: 2, drop_console: true },
            // Keep ES modules format intact
            module: file !== 'worker.js' 
        });
        
        if (result.error) {
            console.error(`❌ Error minifying ${file}:`, result.error);
        } else {
            const minPath = path.join(__dirname, file.replace('.js', '.min.js'));
            fs.writeFileSync(minPath, result.code);
            console.log(`✅ Minified ${file} -> ${path.basename(minPath)} (-${((1 - result.code.length / code.length) * 100).toFixed(1)}%)`);
        }
    }
});

// CSS Minification
cssFiles.forEach(file => {
    const srcPath = path.join(__dirname, file);
    if (fs.existsSync(srcPath)) {
        const css = fs.readFileSync(srcPath, 'utf8');
        const output = new CleanCSS({ level: 2 }).minify(css);
        
        if (output.errors.length) {
            console.error(`❌ Error minifying ${file}:`, output.errors);
        } else {
            const minPath = path.join(__dirname, file.replace('.css', '.min.css'));
            fs.writeFileSync(minPath, output.styles);
            console.log(`✅ Minified ${file} -> ${path.basename(minPath)} (-${((1 - output.styles.length / css.length) * 100).toFixed(1)}%)`);
        }
    }
});

console.log("\nDone! To use minified files, update the HTML resource links.\n");
