/**
 * Optimized Nebula Web Cursor Effect for PrimeHR
 * High-performance node-link network with proximity optimization
 */

class WebNode {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        // High velocity as requested, but optimized update logic
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8 - 2;
        this.baseColor = color; // Expecting 'r, g, b' string
        this.life = 1.0;
        this.decay = Math.random() * 0.05 + 0.03;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.vx *= 0.98;
        this.vy *= 0.98;
    }

    draw(ctx) {
        // REMOVED shadowBlur for performance - it's a huge GPU killer
        ctx.fillStyle = `rgba(${this.baseColor}, ${this.life})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initNebulaWeb() {
    const canvas = document.getElementById('smokeCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const hero = document.getElementById('hero');
    let nodes = [];
    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;

    // Palette: Cyan, Magenta, Blue, White (Strips the rgba formatting for optimization)
    const colors = [
        '0, 255, 255',   // Cyan
        '255, 0, 255',   // Magenta
        '65, 105, 225',  // Royal Blue
        '255, 255, 255'  // White
    ];

    function resize() {
        const rect = hero.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }

    window.addEventListener('resize', resize);
    resize();

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        isMoving = true;

        // Balanced spawn rate for performance vs density
        if (nodes.length < 120) {
            for (let i = 0; i < 3; i++) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                nodes.push(new WebNode(mouseX, mouseY, color));
            }
        }
    });

    hero.addEventListener('mouseleave', () => {
        isMoving = false;
    });

    function drawConnections() {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const maxDistSq = 10000; // 100px squared (avoiding Math.sqrt)

        for (let i = 0; i < nodes.length; i++) {
            const nodeA = nodes[i];
            for (let j = i + 1; j < nodes.length; j++) {
                const nodeB = nodes[j];
                const dx = nodeA.x - nodeB.x;
                const dy = nodeA.y - nodeB.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxDistSq) {
                    const dist = Math.sqrt(distSq);
                    const opacity = (1 - dist / 100) * Math.min(nodeA.life, nodeB.life) * 0.4;
                    ctx.strokeStyle = `rgba(${nodeA.baseColor}, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(nodeA.x, nodeA.y);
                    ctx.lineTo(nodeB.x, nodeB.y);
                    ctx.stroke();
                }
            }
        }
        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw nodes
        for (let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i];
            node.update();
            node.draw(ctx);
            if (node.life <= 0) nodes.splice(i, 1);
        }

        // Draw connections only if we have nodes to save CPU
        if (nodes.length > 1) {
            drawConnections();
        }

        requestAnimationFrame(animate);
    }

    animate();
}

document.addEventListener('DOMContentLoaded', initNebulaWeb);
