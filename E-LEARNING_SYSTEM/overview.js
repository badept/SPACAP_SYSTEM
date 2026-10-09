document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('[data-header]');

    if (!header) return;

    const updateHeaderState = () => {
        const scrolled = window.scrollY > 16;
        header.classList.toggle('scrolled', scrolled);
    };

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });

    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });
    }

    const revealItems = document.querySelectorAll('.overview-content .reveal');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (revealItems.length && 'IntersectionObserver' in window && !reducedMotion) {
        document.body.classList.add('has-reveal');
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

        revealItems.forEach((item) => revealObserver.observe(item));
    }
});