import { initThreads } from './Threads2D.js';
import { initDarkVeil } from './DarkVeil.js';
import { initDarkVeil as initDarkVeil2D } from './DarkVeil2D.js';
import { initBlurText } from './BlurText.js';
import { initSplitText } from './SplitText.js';
import { initShuffle } from './Shuffle.js';
import './Threads.css';
import './DarkVeil.css';

// Remove white background from an <img> using Canvas API
const removeWhiteBackground = (imgEl, threshold = 230) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const process = () => {
        canvas.width = imgEl.naturalWidth;
        canvas.height = imgEl.naturalHeight;
        ctx.drawImage(imgEl, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            // If pixel is near-white, make it transparent
            if (r > threshold && g > threshold && b > threshold) {
                // Smooth edge: partial transparency for near-white
                const whiteness = Math.min(r, g, b);
                const alpha = Math.round((255 - whiteness) * (255 / (255 - threshold)));
                data[i + 3] = Math.max(0, alpha);
            }
        }

        ctx.putImageData(imageData, 0, 0);
        imgEl.src = canvas.toDataURL('image/png');
    };

    if (imgEl.complete && imgEl.naturalWidth > 0) {
        process();
    } else {
        imgEl.addEventListener('load', process, { once: true });
    }
};

const hasWebGL = (() => {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) { return false; }
})();

console.log(`%c Wizgate JS: Booting... (WebGL: ${hasWebGL}) `, "background: #0A192F; color: #C5A059; font-weight: bold;");

const initRevealAnimations = () => {
    try {
        const revealElements = document.querySelectorAll('[data-reveal]');
        console.log(`Found ${revealElements.length} elements to reveal.`);

        if (revealElements.length === 0) return;

        document.body.classList.add('js-reveals-enabled');

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
        document.body.classList.add('js-ready');
    } catch (error) {
        console.error("Reveal animation initialization failed:", error);
        document.body.classList.remove('js-reveals-enabled');
    }
};

const initMobileMenu = () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
};

const initScrollHandlers = () => {
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');

        let current = '';
        const scrollPos = window.scrollY;
        sections.forEach(section => {
            if (scrollPos >= section.offsetTop - 250) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (current && link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
};

const initAssessment = () => {
    const assessmentForm = document.getElementById('assessment-form');
    const resultBox = document.getElementById('assessment-result');
    const resultMessage = document.getElementById('result-message');
    const resetBtn = document.getElementById('reset-test');

    if (assessmentForm && resultBox) {
        assessmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = new FormData(assessmentForm);
            let score = 0;
            if (data.get('q1') === 'a') score++;
            if (data.get('q2') === 'b') score++;
            if (data.get('q3') === 'a') score++;

            assessmentForm.classList.add('hidden');
            resultBox.classList.remove('hidden');

            if (score <= 1) resultMessage.innerText = "Beginner - You're just starting! Join our A1 course.";
            else if (score === 2) resultMessage.innerText = "Elementary - Good start! You're ready for intensive A1.";
            else resultMessage.innerText = "Ready for A1-A2 - Great job! You have a solid foundation.";
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            assessmentForm.reset();
            assessmentForm.classList.remove('hidden');
            resultBox.classList.add('hidden');
        });
    }
};

// Section specific animations (removed in favor of global background)

const initGlobalBackground = () => {
    const containers = document.querySelectorAll('.darkveil-container');
    if (containers.length === 0) return;

    containers.forEach(container => {
        if (hasWebGL) {
            try {
                initDarkVeil(container, {
                    hueShift: 0,
                    noiseIntensity: 0.05,
                    scanlineIntensity: 0.08,
                    speed: 0.4,
                    scanlineFrequency: 0.25,
                    warpAmount: 0.2,
                    resolutionScale: 1.0
                });
            } catch (e) {
                console.warn("DarkVeil WebGL failed, falling back to 2D.", e);
                initDarkVeil2D(container, { speed: 0.2 });
            }
        } else {
            initDarkVeil2D(container, { speed: 0.2 });
        }
    });
};

const init = () => {
    console.log("%c Wizgate JS: Initializing... ", "color: #C5A059; font-weight: bold;");

    // Non-blocking background init
    try {
        initGlobalBackground();
    } catch (e) {
        console.warn("Global background failed:", e);
    }

    try {
        initRevealAnimations();
    } catch (e) {
        console.error("Reveal animations failed:", e);
    }

    try {
        initMobileMenu();
    } catch (e) {
        console.error("Mobile menu failed:", e);
    }

    try {
        initScrollHandlers();
    } catch (e) {
        console.error("Scroll handlers failed:", e);
    }

    try {
        initAssessment();
    } catch (e) {
        console.error("Assessment failed:", e);
    }

    const mainHeading = document.querySelector('.main-heading');
    if (mainHeading) {
        try {
            initSplitText(mainHeading, {
                delay: 50,
                duration: 1.25,
                fromY: '40px',
                toY: '0px',
                onLetterAnimationComplete: () => console.log('Hero heading revealed letter by letter!')
            });
        } catch (e) {
            console.warn("Split text failed:", e);
        }
    }

    // Sections now show the global background directly

    // Shuffle animation on hero sub-heading
    const subHeading = document.querySelector('.hero .sub-heading');
    if (subHeading) {
        try {
            initShuffle(subHeading, {
                shuffleDirection: 'right',
                duration: 0.45,
                stagger: 0.03,
                threshold: 0.1,
                triggerOnce: true,
                triggerOnHover: true,
                onShuffleComplete: () => console.log('Sub-heading shuffle complete!')
            });
        } catch (e) {
            console.warn('Shuffle failed:', e);
        }
    }

    // Trigger bottom-up slide
    const studentRevealEl = document.querySelector('.student-reveal');
    if (studentRevealEl) {
        // Bottom-up slide-in: trigger after a short delay on load
        const triggerStudentReveal = () => {
            setTimeout(() => {
                studentRevealEl.classList.add('student-visible');
            }, 400);
        };

        // Use IntersectionObserver so animation also plays when scrolling back to home
        const studentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    studentRevealEl.classList.remove('student-visible');
                    // Tiny reflow to restart animation
                    void studentRevealEl.offsetWidth;
                    studentRevealEl.classList.add('student-visible');
                }
            });
        }, { threshold: 0.2 });

        studentObserver.observe(studentRevealEl);
        triggerStudentReveal();
    }



    console.log("%c Wizgate JS: READY! ", "background: #0A192F; color: #4CAF50; font-weight: bold;");
    document.body.setAttribute('data-js-loaded', 'true');

    // Global Background Diagnostic
    const veilDiag = document.createElement('div');
    veilDiag.style.cssText = "position:fixed;bottom:10px;right:25px;width:10px;height:10px;background:#3B82F6;border-radius:50%;z-index:9999;";
    veilDiag.title = "DarkVeil Global Active";
    document.body.appendChild(veilDiag);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
