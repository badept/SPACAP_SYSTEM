const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
const navigationLinks = document.querySelectorAll('.nav-link');

const updateHeader = () => {
    header?.classList.toggle('scrolled', window.scrollY > 24);
};

menuButton?.addEventListener('click', () => {
    const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(willOpen));
    menuButton.setAttribute('aria-label', willOpen ? 'Đóng menu' : 'Mở menu');
    navigation?.classList.toggle('open', willOpen);
});

navigationLinks.forEach((link) => {
    link.addEventListener('click', () => {
        navigationLinks.forEach((item) => item.classList.remove('active'));
        link.classList.add('active');
        menuButton?.setAttribute('aria-expanded', 'false');
        menuButton?.setAttribute('aria-label', 'Mở menu');
        navigation?.classList.remove('open');
    });
});

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
