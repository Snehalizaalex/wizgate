/**
 * Shuffle.js — Vanilla JS port of React Bits Shuffle text animation.
 * Splits text into characters, wraps each in an overflow:hidden container,
 * and slides them in from a direction with staggered delays.
 * No dependencies — pure CSS transitions + IntersectionObserver.
 */
export function initShuffle(element, options = {}) {
    if (!element) return;

    const {
        shuffleDirection = 'right',
        duration = 0.45,
        stagger = 0.03,
        ease = 'cubic-bezier(0.22, 1, 0.36, 1)', // power3.out equivalent
        threshold = 0.1,
        rootMargin = '-50px',
        triggerOnce = true,
        triggerOnHover = false,
        loop = false,
        loopDelay = 0,
        onShuffleComplete,
    } = options;

    const originalText = element.innerText.trim();
    let played = false;

    // --- Build the split char DOM ---
    function buildDOM() {
        element.innerHTML = '';
        element.style.display = 'flex';
        element.style.flexWrap = 'wrap';
        element.style.alignItems = 'baseline';

        const words = originalText.split(' ');

        words.forEach((word, wi) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.cssText = 'display:inline-flex; white-space:nowrap;';

            [...word].forEach((char, ci) => {
                const totalIndex = words.slice(0, wi).join('').length + wi + ci;

                // Wrapper — clips the character during animation
                const wrapper = document.createElement('span');
                wrapper.style.cssText = `
                    display: inline-block;
                    overflow: hidden;
                    vertical-align: bottom;
                    line-height: 1.2;
                `;

                // Inner span — this is what slides
                const inner = document.createElement('span');
                inner.textContent = char;
                inner.className = 'shuffle-char';
                inner.style.cssText = `
                    display: inline-block;
                    will-change: transform;
                    transition:
                        transform ${duration}s ${ease},
                        opacity ${duration * 0.8}s ${ease};
                    transition-delay: ${(totalIndex * stagger).toFixed(3)}s;
                    ${getFromStyle(shuffleDirection)}
                `;

                wrapper.appendChild(inner);
                wordSpan.appendChild(wrapper);
            });

            element.appendChild(wordSpan);

            // Space between words (except last)
            if (wi < words.length - 1) {
                const space = document.createElement('span');
                space.innerHTML = '&nbsp;';
                space.style.display = 'inline-block';
                element.appendChild(space);
            }
        });
    }

    function getFromStyle(dir) {
        switch (dir) {
            case 'right': return 'transform: translateX(-110%); opacity: 0;';
            case 'left': return 'transform: translateX(110%); opacity: 0;';
            case 'up': return 'transform: translateY(110%); opacity: 0;';
            case 'down': return 'transform: translateY(-110%); opacity: 0;';
            default: return 'transform: translateX(-110%); opacity: 0;';
        }
    }

    function reveal() {
        const chars = element.querySelectorAll('.shuffle-char');
        const lastChar = chars[chars.length - 1];

        chars.forEach(c => {
            c.style.transform = 'translate(0, 0)';
            c.style.opacity = '1';
        });

        // Fire onShuffleComplete after last char finishes
        if (typeof onShuffleComplete === 'function' && lastChar) {
            const lastDelay = parseFloat(lastChar.style.transitionDelay || '0') * 1000;
            const totalMs = (duration * 1000) + lastDelay;
            setTimeout(onShuffleComplete, totalMs);
        }

        // Loop support
        if (loop) {
            const chars2 = element.querySelectorAll('.shuffle-char');
            const loopMs = (duration * 1000) + ((chars2.length - 1) * stagger * 1000) + (loopDelay * 1000) + 300;
            setTimeout(() => {
                buildDOM(); // Reset
                requestAnimationFrame(() => requestAnimationFrame(() => reveal())); // Re-reveal
            }, loopMs);
        }
    }

    // --- Initial build ---
    buildDOM();

    // --- Hover trigger ---
    if (triggerOnHover) {
        element.style.cursor = 'default';
        element.addEventListener('mouseenter', () => {
            buildDOM();
            requestAnimationFrame(() => requestAnimationFrame(() => reveal()));
        });
    }

    // --- IntersectionObserver trigger ---
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting && !played) {
                played = true;
                // Small RAF delay to ensure transitions are registered
                requestAnimationFrame(() => requestAnimationFrame(() => reveal()));
                if (triggerOnce) observer.unobserve(element);
            }
        },
        { threshold, rootMargin }
    );

    observer.observe(element);

    // Failsafe
    setTimeout(() => {
        if (!played) {
            played = true;
            reveal();
        }
    }, 1500);
}
