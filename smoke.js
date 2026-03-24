/**
 * Optimized Nebula Web Cursor Effect for PrimeHR
 * GPU-accelerated canvas particle system — pauses when idle
 */

class WebNode {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.baseColor = color;
        this.life = 1.0;
        this.decay = Math.random() * 0.04 + 0.02;
        this.size = Math.random() * 3 + 1.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.vx *= 0.98;
        this.vy *= 0.98;
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(${this.baseColor}, ${this.life})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initNebulaWeb() {
    const canvas = document.getElementById('smokeCanvas');
    if (!canvas) return;

    let ctx = null; // Lazy load context
    const hero = document.getElementById('hero');
    if (!hero) return;

    let nodes = [];
    let animFrameId = null;
    let isHeroVisible = false;
    let isInitialized = false; // Flag to prevent double execution

    const colors = [
        '0, 255, 255',
        '255, 0, 255',
        '65, 105, 225',
        '255, 255, 255'
    ];

    function setupCanvasMemory() {
        if (isInitialized) return;
        isInitialized = true;
        
        ctx = canvas.getContext('2d');
        const rect = hero.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        window.addEventListener('resize', () => {
            const r = hero.getBoundingClientRect();
            canvas.width = r.width;
            canvas.height = r.height;
        }, { passive: true });

        const heroObserver = new IntersectionObserver((entries) => {
            isHeroVisible = entries[0].isIntersecting;
            if (isHeroVisible && nodes.length > 0 && !animFrameId) {
                animFrameId = requestAnimationFrame(animate);
            } else if (!isHeroVisible && animFrameId) {
                cancelAnimationFrame(animFrameId);
                animFrameId = null;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }, { threshold: 0.1 });
        heroObserver.observe(hero);
    }

    let lastMouseMove = 0;
    hero.addEventListener('mousemove', (e) => {
        setupCanvasMemory(); // Initializes canvas/context exactly once on first interaction
        if (!isHeroVisible && isInitialized) isHeroVisible = true; // Force true initially

        // Throttle high-frequency mousemove to max 30 times a second
        const now = performance.now();
        if (now - lastMouseMove < 33) return;
        lastMouseMove = now;

        const rect = hero.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (nodes.length < 120) {
            for (let i = 0; i < 3; i++) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                nodes.push(new WebNode(mouseX, mouseY, color));
            }
        }

        // Start animation loop if not running
        if (!animFrameId) {
            animFrameId = requestAnimationFrame(animate);
        }
    }, { passive: true });

    hero.addEventListener('mouseleave', () => {
        // Let existing particles fade naturally; loop will stop when nodes is empty
    });

    function drawConnections() {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const maxDistSq = 14400;
        const maxDist = 120;

        for (let i = 0; i < nodes.length; i++) {
            const nodeA = nodes[i];
            for (let j = i + 1; j < nodes.length; j++) {
                const nodeB = nodes[j];
                const dx = nodeA.x - nodeB.x;
                const dy = nodeA.y - nodeB.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxDistSq) {
                    const dist = Math.sqrt(distSq);
                    const opacity = (1 - dist / maxDist) * Math.min(nodeA.life, nodeB.life) * 0.6;
                    ctx.strokeStyle = `rgba(${nodeA.baseColor}, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(nodeA.x, nodeA.y);
                    ctx.lineTo(nodeB.x, nodeB.y);
                    ctx.stroke();
                }
            }
        }
        ctx.restore();
    }

    let lastDrawTime = 0;
    function animate(timestamp) {
        // Stop the loop completely and natively clear exactly when empty
        if (nodes.length === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
            lastDrawTime = 0;
            return;
        }

        // Queue next frame immediately
        animFrameId = requestAnimationFrame(animate);

        // Limit frame rate to ~30 FPS to reduce CPU/TBT penalties
        if (!lastDrawTime) lastDrawTime = timestamp;
        const elapsed = timestamp - lastDrawTime;
        if (elapsed < 33) return;

        // Adjust for precision
        lastDrawTime = timestamp - (elapsed % 33);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i];
            node.update();
            node.draw(ctx);
            if (node.life <= 0) nodes.splice(i, 1);
        }

        if (nodes.length > 1) {
            drawConnections();
        }
    }
}

// Execute immediately (script is already deferred by HTML natively)
initNebulaWeb();
