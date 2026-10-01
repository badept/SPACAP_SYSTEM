// Preview covers the three adjacent columns and the first five body rows.
let lockedPreviewTrigger = null;

document.querySelectorAll('.roles-preview-trigger').forEach((trigger) => {
            const cell = trigger.closest('td');
            const table = cell.closest('table');
            const wrap = table.parentElement;
            const preview = document.createElement('div');
            preview.id = trigger.getAttribute('aria-controls');
            preview.className = 'roles-table-preview';
            preview.hidden = true;
            preview.setAttribute('role', 'region');
            preview.setAttribute('aria-label', trigger.dataset.previewAlt);
            const previewSources = [trigger.dataset.previewSrc, ...(trigger.dataset.previewGallery || '').split('|').filter(Boolean)];
            if (trigger.dataset.previewCombined === 'true' && previewSources.length > 1) {
                preview.classList.add('roles-table-preview--combined');
                previewSources.slice(0, 2).forEach((src, index) => {
                            const panel = document.createElement('div');
                            panel.className = 'roles-table-preview-panel';
                            const label = document.createElement('strong');
                            label.textContent = (trigger.dataset.previewLabels || 'Web|App').split('|')[index] || '';
                            const image = document.createElement('img');
                            image.src = src;
                            image.alt = `${trigger.dataset.previewAlt} ${label.textContent || `Ảnh ${index + 1}`}.`;
            image.tabIndex = 0;
            image.setAttribute('role', 'button');
            image.setAttribute('aria-label', `${image.alt} Bấm để xem toàn màn hình.`);
            image.title = 'Bấm để xem toàn màn hình';
            if (label.textContent) panel.append(label);
            panel.append(image);
            preview.append(panel);
        });
    } else {
        const image = document.createElement('img');
        image.src = trigger.dataset.previewSrc;
        image.alt = trigger.dataset.previewAlt;
        image.tabIndex = 0;
        image.setAttribute('role', 'button');
        image.setAttribute('aria-label', `${image.alt} Bấm để xem toàn màn hình.`);
        image.title = 'Bấm để xem toàn màn hình';
        preview.append(image);
    }
    document.body.append(preview);
    let hideTimer;

    function position() {
        const rows = table.tBodies[0].rows;
        const first = rows[0].cells[2].getBoundingClientRect();
        const last = rows[Math.min(4, rows.length - 1)].getBoundingClientRect();
        const bounds = wrap.getBoundingClientRect();
        const right = rows[0].cells[4].getBoundingClientRect().right;
        const visibleLeft = Math.max(bounds.left, 8);
        const visibleRight = Math.min(bounds.right, document.documentElement.clientWidth - 8);
        const combined = preview.classList.contains('roles-table-preview--combined');
        const stacked = combined && trigger.dataset.previewCompact !== 'true' && preview.id !== 'interface-system-a-preview';
        const systemS = cell.cellIndex === 2;
        const userSystemS = systemS && trigger.closest('#audience-panel-user') && window.innerWidth >= 1100;
        const userPreviewLeft = cell.getBoundingClientRect().right + 8;
        const tallPreview = stacked || preview.id === 'interface-system-a-preview';
        // Keep the original three-column size for both systems; only S moves to the right.
        const width = userSystemS ? Math.min(900, document.documentElement.clientWidth - userPreviewLeft - 8) : stacked || systemS ? right - first.left - 8 : Math.min(right - first.left - 8, visibleRight - visibleLeft - 8);
        const left = userSystemS ? userPreviewLeft : systemS ? first.right - 80 + 4 : stacked ? first.left + 4 : Math.max(visibleLeft + 4, Math.min(first.left + 4, visibleRight - width - 4));
        const previewHeight = tallPreview ?
            rows[Math.min(6, rows.length - 1)].getBoundingClientRect().bottom - first.top - 8 :
            last.bottom - first.top - 8;
        const frameTop = Math.max(8, bounds.top + 4);
        const frameBottom = Math.min(window.innerHeight - 8, bounds.bottom - 4);
        const headerBottom = table.tHead.getBoundingClientRect().bottom + 4;
        const top = Math.min(Math.max(frameTop, headerBottom), Math.max(frameTop, frameBottom - previewHeight));
        Object.assign(preview.style, {
            left: `${left}px`,
            top: `${top}px`,
            width: `${width}px`,
            height: `${previewHeight}px`,
        });
    }

    function show() {
        if (lockedPreviewTrigger && lockedPreviewTrigger !== trigger) return;
        clearTimeout(hideTimer);
        document.dispatchEvent(new CustomEvent('roles-preview-open', { detail: trigger }));
        position();
        preview.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
    }

    function hide() {
        clearTimeout(hideTimer);
        preview.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
        if (lockedPreviewTrigger === trigger) lockedPreviewTrigger = null;
    }

    function scheduleHide() {
        clearTimeout(hideTimer);
        if (lockedPreviewTrigger === trigger) return;
        hideTimer = setTimeout(() => {
            if (!cell.matches(':hover') && !preview.matches(':hover') && document.activeElement !== trigger) hide();
        }, 150);
    }

    cell.addEventListener('pointerenter', (event) => { if (event.pointerType !== 'touch') show(); });
    cell.addEventListener('pointerleave', scheduleHide);
    preview.addEventListener('pointerenter', () => clearTimeout(hideTimer));
    preview.addEventListener('pointerleave', scheduleHide);
    document.addEventListener('scroll', () => { if (!preview.hidden) position(); }, true);
    window.addEventListener('resize', () => { if (!preview.hidden) position(); });
    trigger.addEventListener('focus', show);
    trigger.addEventListener('blur', scheduleHide);
    trigger.addEventListener('click', () => {
        if (lockedPreviewTrigger && lockedPreviewTrigger !== trigger) {
            document.dispatchEvent(new CustomEvent('roles-preview-switch', { detail: trigger }));
        }
        lockedPreviewTrigger = trigger;
        show();
    });
    document.addEventListener('roles-preview-open', (event) => {
        if (event.detail !== trigger) hide();
    });
    document.addEventListener('roles-preview-switch', (event) => {
        if (event.detail !== trigger) hide();
    });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') hide(); });
    document.addEventListener('pointerdown', (event) => {
        if (event.target instanceof Element && event.target.closest('.roles-image-fullscreen')) return;
        if (event.target instanceof Element && event.target.closest('.roles-preview-trigger')) return;
        if (!cell.contains(event.target) && !preview.contains(event.target)) hide();
    });
    new ResizeObserver(() => { if (!preview.hidden) position(); }).observe(table);
    wrap.addEventListener('scroll', () => { if (!preview.hidden) position(); }, { passive: true });
});

// Enlarge preview images without changing the existing table hover behavior.
(() => {
    let dialog;
    let expandedImage;
    let returnFocus;
    let gallery = [];
    let galleryIndex = 0;
    let secondaryImageOffset = '';

    function updateGalleryImage() {
        const item = gallery[galleryIndex];
        expandedImage.src = item.src;
        expandedImage.alt = item.alt;
        expandedImage.style.top = galleryIndex > 0 ? secondaryImageOffset : '';
    }

    function openImage(image) {
        if (!dialog) {
            dialog = document.createElement('dialog');
            dialog.className = 'roles-image-fullscreen';
            dialog.setAttribute('aria-label', 'Xem ảnh toàn màn hình');
            const close = document.createElement('button');
            close.type = 'button';
            close.className = 'roles-image-fullscreen-close';
            close.textContent = '× Đóng';
            close.setAttribute('aria-label', 'Đóng ảnh toàn màn hình');
            close.autofocus = true;
            close.addEventListener('click', () => dialog.close());
            const previous = document.createElement('button');
            previous.type = 'button';
            previous.className = 'roles-image-fullscreen-nav roles-image-fullscreen-prev';
            previous.textContent = '<';
            previous.setAttribute('aria-label', 'Xem ảnh trước');
            previous.addEventListener('click', () => {
                galleryIndex = (galleryIndex - 1 + gallery.length) % gallery.length;
                updateGalleryImage();
            });
            const next = document.createElement('button');
            next.type = 'button';
            next.className = 'roles-image-fullscreen-nav roles-image-fullscreen-next';
            next.textContent = '>';
            next.setAttribute('aria-label', 'Xem ảnh tiếp theo');
            next.addEventListener('click', () => {
                galleryIndex = (galleryIndex + 1) % gallery.length;
                updateGalleryImage();
            });
            expandedImage = document.createElement('img');
            dialog.append(close, previous, next, expandedImage);
            document.body.append(dialog);
            dialog.addEventListener('wheel', (event) => event.preventDefault(), { passive: false });
            dialog.addEventListener('close', () => {
                if (returnFocus) returnFocus.focus({ preventScroll: true });
            });
        }
        const previewId = image.closest('.roles-table-preview').id;
        const trigger = document.querySelector(`[aria-controls="${CSS.escape(previewId)}"]`);
        returnFocus = trigger;
        secondaryImageOffset = trigger ? trigger.dataset.previewSecondaryOffset || '' : '';
        const sources = trigger ? [trigger.dataset.previewSrc, ...(trigger.dataset.previewGallery || '').split('|').filter(Boolean)] : [image.src];
        gallery = [...new Set(sources)].map((src) => ({ src, alt: trigger ? trigger.dataset.previewAlt : image.alt }));
        galleryIndex = Math.max(0, gallery.findIndex((item) => new URL(item.src, document.baseURI).href === image.src));
        dialog.querySelectorAll('.roles-image-fullscreen-nav').forEach((button) => {
            button.hidden = gallery.length < 2;
        });
        updateGalleryImage();
        if (!dialog.open) dialog.showModal();
    }

    document.addEventListener('click', (event) => {
        if (event.target.matches('.roles-table-preview img')) openImage(event.target);
    });
    document.addEventListener('keydown', (event) => {
        if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.roles-table-preview img')) {
            event.preventDefault();
            openImage(event.target);
        }
    });
})();

// Điều khiển trạng thái chọn nhóm người sử dụng và panel nội dung tương ứng.
document.querySelectorAll('.roles-audience-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
        const role = tab.dataset.role;

        document.querySelectorAll('.roles-audience-tab').forEach((item) => {
            const selected = item === tab;
            item.classList.toggle('state-selected', selected);
            item.setAttribute('aria-selected', selected);
            item.querySelector('b').textContent = selected ? 'Đang phân tích' : 'Xem phân tích';
        });

        document.querySelectorAll('.roles-audience-panel').forEach((panel) => {
            const visible = panel.id === `audience-panel-${role}`;
            panel.hidden = !visible;
            panel.classList.toggle('state-visible', visible);
        });
    });
});

// Chuyển qua lại giữa hai bảng chức năng bên trong panel Admin.
document.querySelectorAll('.roles-admin-view-tab').forEach((step) => {
    step.addEventListener('click', () => {
        const selectedView = step.dataset.adminView;

        document.querySelectorAll('.roles-admin-view-tab').forEach((item) => {
            const selected = item === step;
            item.classList.toggle('state-selected', selected);
            item.setAttribute('aria-pressed', selected);
        });

        document.querySelectorAll('.roles-admin-view-content').forEach((content) => {
            content.hidden = content.dataset.adminViewContent !== selectedView;
        });
    });
});

// Roll on first view and replay each metric on hover or keyboard focus.
function animateImpact(panel) {
    if (!panel || panel.dataset.animated === 'true') return;
    panel.dataset.animated = 'true';
    panel.querySelectorAll('[data-value]').forEach((metric, index) => animateImpactMetric(metric, index * 100));
}

function animateImpactMetric(metric, delay = 0) {
    if (metric.classList.contains('state-rolling')) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const target = metric.dataset.value;
    metric.textContent = target;
    if (reducedMotion.matches) return;
    const match = target.match(/^([+-]?)(\d+)(.*)$/);
    if (!match) return;
    const [, sign, digits, suffix] = match;
    const total = Number(digits);
    const steps = Math.min(total, 12);
    if (!steps) return;
    const values = Array.from({ length: steps + 1 }, (_, step) => {
        const value = Math.round((total * step) / steps);
        return `${value ? sign : ''}${value}${suffix}`;
    }).reverse();
    const track = document.createElement('span');
    track.className = 'roles-impact-metric-track';
    track.setAttribute('aria-hidden', 'true');
    values.forEach((value) => {
        const row = document.createElement('span');
        row.textContent = value;
        track.appendChild(row);
    });
    metric.setAttribute('aria-label', target);
    metric.classList.add('state-rolling');
    metric.replaceChildren(track);
    const animation = track.animate([{ transform: `translateY(-${steps * 1.2}em)` }, { transform: 'translateY(0em)' }], {
        duration: 3500,
        delay,
        easing: 'cubic-bezier(.16, .62, .25, 1)',
        fill: 'both',
    });
    const finish = () => {
        metric.textContent = target;
        metric.classList.remove('state-rolling');
        animation.cancel();
        reducedMotion.removeEventListener('change', onMotionChange);
    };
    const onMotionChange = () => {
        if (reducedMotion.matches) finish();
    };
    reducedMotion.addEventListener('change', onMotionChange);
    animation.onfinish = finish;
}

document.querySelectorAll('.roles-impact-metrics>div').forEach((tile) => {
    const replay = () => animateImpactMetric(tile.querySelector('[data-value]'));
    tile.addEventListener('pointerenter', (event) => {
        if (event.pointerType !== 'touch') replay();
    });
    tile.addEventListener('focus', replay);
});

document.querySelectorAll('[data-impact-panel]').forEach((panel) => {
    const observer = new IntersectionObserver(
        (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                animateImpact(panel);
                observer.disconnect();
            }
        }, { threshold: 0.2 },
    );
    observer.observe(panel);
});