/**
 * Ribbon-style Fluid Smoke Effect for PrimeHR
 * High-fidelity wispy filaments with additive blending
 */

class RibbonStrand {
    constructor(x, y, color) {
        this.points = [{ x, y }];
        this.color = color;
        this.life = 1.0;
        this.decay = Math.random() * 0.01 + 0.005;
        this.maxWidth = Math.random() * 15 + 5;

        // Random offsets for curliness
        this.offsetSpeed = Math.random() * 0.02;
        this.offsetPhase = Math.random() * Math.PI * 2;
        this.curlAmount = Math.random() * 2 + 1;
    }

    update(mouseX, mouseY, time) {
        // Move towards mouse with easing
        const lastPoint = this.points[0];
        const dx = mouseX - lastPoint.x;
        const dy = mouseY - lastPoint.y;

        // Add curl/noise
        const cx = Math.sin(time * this.offsetSpeed + this.offsetPhase) * this.curlAmount;
        const cy = Math.cos(time * this.offsetSpeed + this.offsetPhase) * this.curlAmount;

        const newX = lastPoint.x + dx * 0.15 + cx;
        const newY = lastPoint.y + dy * 0.15 + cy;

        this.points.unshift({ x: newX, y: newY });

        if (this.points.length > 50) {
            this.points.pop();
        }

        this.life -= this.decay;
    }

    draw(ctx) {
        if (this.points.length < 2 || this.life <= 0) return;

        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);

        for (let i = 1; i < this.points.length; i++) {
            const opacity = (1 - i / this.points.length) * this.life;
            const width = (1 - i / this.points.length) * this.maxWidth;

            ctx.strokeStyle = this.color.replace('opacity', opacity * 0.4);
            ctx.lineWidth = width;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.lineTo(this.points[i].x, this.points[i].y);
            // We stroke each segment or the whole path with a gradient? 
            // Better to stroke in chunks for gradient effect
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.points[i].x, this.points[i].y);
        }

        ctx.restore();
    }
}

class Shimmer {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 0.5;
        this.life = 1.0;
        this.decay = Math.random() * 0.03 + 0.01;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        this.life -= this.decay;
    }
    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initRibbonEffect() {
    const canvas = document.getElementById('smokeCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const hero = document.getElementById('hero');
    let strands = [];
    let shimmers = [];
    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;

    // Mixed Palette for richness
    const colors = [
        'rgba(138, 43, 226, opacity)', // BlueViolet
        'rgba(153, 50, 204, opacity)', // DarkOrchid
        'rgba(59, 21, 58, opacity)',   // Plum
        'rgba(218, 112, 214, opacity)'  // Orchid
    ];

    function resize() {
        const rect = hero.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }

    window.addEventListener('resize', resize);
    resize();

    // Init strands
    for (let i = 0; i < 6; i++) {
        strands.push(new RibbonStrand(0, 0, colors[i % colors.length]));
    }

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        isMoving = true;

        if (Math.random() > 0.8) {
            shimmers.push(new Shimmer(mouseX, mouseY));
        }
    });

    hero.addEventListener('mouseleave', () => {
        isMoving = false;
    });

    function animate(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        strands.forEach(s => {
            if (isMoving) {
                s.life = 1.0; // Keep alive while moving
            }
            s.update(mouseX, mouseY, time);
            s.draw(ctx);
        });

        for (let i = shimmers.length - 1; i >= 0; i--) {
            shimmers[i].update();
            shimmers[i].draw(ctx);
            if (shimmers[i].life <= 0) shimmers.splice(i, 1);
        }

        requestAnimationFrame(animate);
    }

    animate(0);
}

document.addEventListener('DOMContentLoaded', initRibbonEffect);
