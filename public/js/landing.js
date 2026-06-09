/**
 * Grand Fleet - Landing Page Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initScrollAnimations();
    initSmoothScroll();
    initActiveNav();
});

/**
 * Header scroll effect
 */
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    const onScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        nav.classList.toggle('open');
        toggle.classList.toggle('active');
    });

    // Close menu on link click
    nav.querySelectorAll('.header__nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            toggle.classList.remove('active');
        });
    });
}

/**
 * Scroll reveal animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.feature-card, .ship-card, .gameplay__step, .hero__stat'
    );

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Active navigation link based on scroll position
 */
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__nav-link');

    if (!sections.length || !navLinks.length) return;

    const onScroll = () => {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
}

// Add revealed class styles dynamically
const style = document.createElement('style');
style.textContent = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);
