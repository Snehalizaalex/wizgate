export function initDarkVeil(container, options = {}) {
    const { speed = 0.3 } = options;
    const canvas = document.createElement('canvas');
    canvas.className = 'darkveil-canvas';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = container.clientWidth;
        height = canvas.height = container.clientHeight;
        initParticles();
    }

    function initParticles() {
        particles = [];
        const count = 30;
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * speed * 2,
                vy: (Math.random() - 0.5) * speed * 2,
                radius: Math.random() * 150 + 100
            });
        }
    }

    window.addEventListener('resize', resize);
    resize();

    let raf;
    function animate() {
        ctx.fillStyle = 'rgba(10, 25, 47, 0.05)';
        ctx.fillRect(0, 0, width, height);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < -p.radius) p.x = width + p.radius;
            if (p.x > width + p.radius) p.x = -p.radius;
            if (p.y < -p.radius) p.y = height + p.radius;
            if (p.y > height + p.radius) p.y = -p.radius;

            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
            gradient.addColorStop(0, 'rgba(29, 58, 95, 0.08)');
            gradient.addColorStop(1, 'rgba(10, 25, 47, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        raf = requestAnimationFrame(animate);
    }
    animate();

    return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        if (container.contains(canvas)) container.removeChild(canvas);
    };
}
