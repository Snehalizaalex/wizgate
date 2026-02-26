/**
 * SplitText.js — Vanilla JS implementation inspired by React Bits SplitText.
 * Animates text character by character using CSS transitions and IntersectionObserver.
 */
export function initSplitText(element, options = {}) {
    if (!element) return;

    const {
        text = element.innerText.trim(),
        delay = 50,
        duration = 1.25,
        fromY = '40px',
        toY = '0px',
        threshold = 0.1,
        rootMargin = '-100px',
        onLetterAnimationComplete,
    } = options;

    element.innerText = '';

    // To prevent words from breaking in the middle, we wrap each word.
    const words = text.split(' ');
    let globalCharIndex = 0;
    const spans = [];

    words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';

        [...word].forEach((char) => {
            const charSpan = document.createElement('span');
            charSpan.textContent = char;
            charSpan.style.display = 'inline-block';
            charSpan.style.willChange = 'transform, opacity';
            charSpan.style.opacity = '0';
            charSpan.style.transform = `translateY(${fromY})`;
            // power3.out ease
            charSpan.style.transition = `
                opacity ${duration}s cubic-bezier(0.215, 0.61, 0.355, 1),
                transform ${duration}s cubic-bezier(0.215, 0.61, 0.355, 1)
            `;
            charSpan.style.transitionDelay = `${(globalCharIndex * delay) / 1000}s`;

            wordSpan.appendChild(charSpan);
            spans.push(charSpan);
            globalCharIndex++;
        });

        // Add space after word (except last word)
        if (wordIndex < words.length - 1) {
            const spaceSpan = document.createElement('span');
            spaceSpan.innerHTML = '&nbsp;';
            spaceSpan.style.display = 'inline-block';
            wordSpan.appendChild(spaceSpan);
            globalCharIndex++; // Count space for delay pacing
        }

        element.appendChild(wordSpan);
    });

    function reveal() {
        spans.forEach((span, i) => {
            span.style.opacity = '1';
            span.style.transform = `translateY(${toY})`;

            // Fire callback after last letter finishes
            if (i === spans.length - 1 && typeof onLetterAnimationComplete === 'function') {
                const totalDelay = ((spans.length - 1) * delay) / 1000 + duration;
                setTimeout(onLetterAnimationComplete, totalDelay * 1000);
            }
        });
    }

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

    // Fail-safe
    setTimeout(reveal, 1500);
}
