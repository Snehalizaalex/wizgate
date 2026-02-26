export function initThreads(container, options = {}) {
    const {
        color = [0.4, 0.6, 1.0],
        amplitude = 1,
        distance = 0,
        enableMouseInteraction = true
    } = options;

    console.log("Threads2D: Starting Canvas 2D Version...");

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.appendChild(canvas);

    let width, height;
    let mouse = { x: 0, y: 0 };
    let targetMouse = { x: 0, y: 0 };

    function resize() {
        width = container.clientWidth;
        height = container.clientHeight;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        targetMouse.x = e.clientX - rect.left;
        targetMouse.y = e.clientY - rect.top;
    });

    const lines = [];
    const lineCount = 30;

    for (let i = 0; i < lineCount; i++) {
        lines.push({
            y: (i / lineCount) * height,
            speed: 0.001 + Math.random() * 0.002,
            offset: Math.random() * Math.PI * 2,
            amplitude: 20 + Math.random() * 30 * amplitude
        });
    }

    const rgbColor = `rgba(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255}, 0.5)`;

    function animate(t) {
        ctx.clearRect(0, 0, width, height);

        // Smooth mouse
        mouse.x += (targetMouse.x - mouse.x) * 0.05;
        mouse.y += (targetMouse.y - mouse.y) * 0.05;

        ctx.strokeStyle = rgbColor;
        ctx.lineWidth = 1.5;

        lines.forEach((line, i) => {
            ctx.beginPath();
            for (let x = 0; x < width; x += 5) {
                const p = x / width;
                const wave = Math.sin(x * 0.005 + t * line.speed + line.offset) * line.amplitude;
                const mouseEffect = Math.exp(-Math.pow(x - mouse.x, 2) / 20000) * (mouse.y - height / 2) * 0.5;

                const y = line.y + wave + mouseEffect;

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    return () => {
        window.removeEventListener('resize', resize);
    };
}
