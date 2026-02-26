export function initLightRays(container, options = {}) {
    console.log("LightRays2D: Starting Canvas 2D Version...");

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.appendChild(canvas);

    let width, height;

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

    function animate(t) {
        ctx.clearRect(0, 0, width, height);

        const time = t * 0.001;
        const centerX = width / 2;
        const centerY = -50;

        for (let i = 0; i < 15; i++) {
            const angle = (i / 15) * Math.PI + Math.sin(time * 0.2 + i) * 0.1;
            const length = height * 1.5;

            const grad = ctx.createLinearGradient(centerX, centerY, centerX + Math.cos(angle) * length, centerY + Math.sin(angle) * length);
            grad.addColorStop(0, 'rgba(186, 230, 253, 0.4)');
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + Math.cos(angle - 0.1) * length, centerY + Math.sin(angle - 0.1) * length);
            ctx.lineTo(centerX + Math.cos(angle + 0.1) * length, centerY + Math.sin(angle + 0.1) * length);
            ctx.closePath();

            ctx.fillStyle = grad;
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    return () => {
        window.removeEventListener('resize', resize);
    };
}
