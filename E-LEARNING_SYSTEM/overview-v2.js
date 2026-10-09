document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('[data-header]');
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateHeader = () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 16);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    const closeMenu = () => {
        if (nav) nav.classList.remove('is-open');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            let isOpen = false;
            if (nav) isOpen = nav.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });
    }

    if (nav) {
        nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    }
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });

    const revealItems = document.querySelectorAll('.overview-content .reveal');
    if (revealItems.length && 'IntersectionObserver' in window && !reducedMotion) {
        document.body.classList.add('has-reveal');
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

        revealItems.forEach((item) => revealObserver.observe(item));
    }

    if (!reducedMotion) {
        const parallaxItems = document.querySelectorAll('[data-parallax]');
        let ticking = false;
        const updateParallax = () => {
            parallaxItems.forEach((item) => {
                const speed = Number(item.dataset.parallax || 0);
                const rect = item.getBoundingClientRect();
                const offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * speed;
                item.style.setProperty('--parallax-y', `${Math.max(-18, Math.min(18, offset))}px`);
            });
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) requestAnimationFrame(updateParallax);
            ticking = true;
        }, { passive: true });
        updateParallax();

        document.querySelectorAll('[data-tilt]').forEach((card) => {
            card.addEventListener('pointermove', (event) => {
                if (event.pointerType === 'touch') return;
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - .5;
                const y = (event.clientY - rect.top) / rect.height - .5;
                card.style.setProperty('--tilt-x', `${(-y * 2.8).toFixed(2)}deg`);
                card.style.setProperty('--tilt-y', `${(x * 3.2).toFixed(2)}deg`);
            });
            card.addEventListener('pointerleave', () => {
                card.style.setProperty('--tilt-x', '0deg');
                card.style.setProperty('--tilt-y', '0deg');
            });
        });
    }
});