/**
 * BlurText.js — Vanilla JS port of the React Bits BlurText component.
 * Uses CSS transitions + IntersectionObserver to animate text in by
 * blurring/unblurring each word or letter with a staggered delay.
 */
export function initBlurText(element, options = {}) {
    if (!element) return;

    const {
        text = element.innerText.trim(),
        delay = 200,
        animateBy = 'words',  // 'words' | 'letters'
        direction = 'top',
        threshold = 0.1,
        rootMargin = '0px',
        stepDuration = 0.35,
        onAnimationComplete,
    } = options;

    // Preserve the element's existing text-align from CSS (don't force center)
    element.innerText = '';
    element.style.display = 'flex';
    element.style.flexWrap = 'wrap';
    element.style.alignItems = 'baseline';
    // Do NOT force justifyContent — let CSS handle it

    const segments = animateBy === 'words' ? text.split(' ') : [...text];
    const totalDuration = stepDuration * 2; // two-step: blur(5px) → blur(0px)
    const yFrom = direction === 'top' ? '-50px' : '50px';

    const spans = segments.map((segment, index) => {
        const span = document.createElement('span');
        span.textContent = segment === '' ? '\u00A0' : segment;
        span.style.cssText = `
            display: inline-block;
            will-change: transform, filter, opacity;
            opacity: 0;
            filter: blur(10px);
            transform: translateY(${yFrom});
            transition:
                opacity ${totalDuration}s cubic-bezier(0.5, 0, 0, 1),
                filter ${totalDuration}s cubic-bezier(0.5, 0, 0, 1),
                transform ${totalDuration}s cubic-bezier(0.5, 0, 0, 1);
            transition-delay: ${(index * delay) / 1000}s;
        `;

        element.appendChild(span);

        // Space between words
        if (animateBy === 'words' && index < segments.length - 1) {
            const space = document.createElement('span');
            space.innerHTML = '&nbsp;';
            space.style.display = 'inline-block';
            element.appendChild(space);
        }

        return span;
    });

    function reveal() {
        spans.forEach((span, i) => {
            span.style.opacity = '1';
            span.style.filter = 'blur(0px)';
            span.style.transform = 'translateY(0)';

            // Fire onAnimationComplete after last word finishes
            if (i === spans.length - 1 && typeof onAnimationComplete === 'function') {
                const lastDelay = ((spans.length - 1) * delay) / 1000 + totalDuration;
                setTimeout(onAnimationComplete, lastDelay * 1000);
            }
        });
    }

    // IntersectionObserver — trigger when element enters viewport
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                reveal();
                observer.unobserve(element);
            }
        },
        { threshold, rootMargin }
    );

    observer.observe(element);

    // Fail-safe: reveal after 1.2s even if observer doesn't fire
    setTimeout(reveal, 1200);
}
