(() => {
    const view = document.getElementById('staffing-view');
    const frame = view && view.querySelector('.staffing-view-frame');
    const staffingLink = document.querySelector('.site-header-nav a[href="#staffing"]');
    const activationLink = document.querySelector('.site-header-nav a[href="index.html"]');
    const navLinks = document.querySelectorAll('.site-header-nav .site-nav-link');

    if (!view || !frame || !staffingLink || !activationLink) return;

    function syncEmbeddedPage() {
        let wrapperDocument;
        try {
            wrapperDocument = frame.contentDocument;
        } catch {
            return;
        }
        if (!wrapperDocument) return;

        let wrapperStyle = wrapperDocument.getElementById('spacap-staffing-wrapper-style');
        if (!wrapperStyle) {
            wrapperStyle = wrapperDocument.createElement('style');
            wrapperStyle.id = 'spacap-staffing-wrapper-style';
            wrapperStyle.textContent = 'html,body{height:auto!important;min-height:0!important;overflow:visible!important}body{margin:0!important}#website{display:block;width:100%;height:1px;border:0}';
            wrapperDocument.head.append(wrapperStyle);
        }

        const pageFrame = wrapperDocument.getElementById('website');
        if (!pageFrame) return;

        function syncHeights() {
            const pageDocument = pageFrame.contentDocument;
            if (!pageDocument || !pageDocument.documentElement || !pageDocument.body) return;

            let pageStyle = pageDocument.getElementById('spacap-staffing-page-style');
            if (!pageStyle) {
                pageStyle = pageDocument.createElement('style');
                pageStyle.id = 'spacap-staffing-page-style';
                pageStyle.textContent = 'html{scroll-padding-top:0!important}body>header{display:none!important}html,body{height:auto!important;min-height:0!important;overflow:visible!important}body{margin:0!important}';
                pageDocument.head.append(pageStyle);
            }

            const pageHeight = Math.max(pageDocument.documentElement.scrollHeight, pageDocument.body.scrollHeight);
            if (Math.abs(pageFrame.offsetHeight - pageHeight) > 1) pageFrame.style.height = `${pageHeight}px`;
            const wrapperHeight = Math.max(wrapperDocument.documentElement.scrollHeight, wrapperDocument.body.scrollHeight);
            if (Math.abs(frame.offsetHeight - wrapperHeight) > 1) frame.style.height = `${wrapperHeight}px`;
        }

        if (!pageFrame.dataset.spacapResizeBound) {
            pageFrame.dataset.spacapResizeBound = 'true';
            pageFrame.style.removeProperty('height');
            pageFrame.addEventListener('load', syncHeights);
        }
        if (pageFrame.contentDocument && pageFrame.contentDocument.readyState === 'complete') syncHeights();

        if (!wrapperDocument.documentElement.dataset.spacapResizeBound) {
            wrapperDocument.documentElement.dataset.spacapResizeBound = 'true';
            new ResizeObserver(syncHeights).observe(wrapperDocument.body);
            wrapperDocument.defaultView.addEventListener('resize', syncHeights);
        }
    }

    function syncRoute() {
        const isStaffing = window.location.hash.slice(1).split('/')[0] === 'staffing';
        document.body.classList.toggle('is-staffing-route', isStaffing);
        view.hidden = !isStaffing;
        navLinks.forEach((link) => {
            const active = isStaffing ? link === staffingLink : link === activationLink;
            link.classList.toggle('site-nav-link--active', active);
            if (active) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });

        if (isStaffing && !frame.hasAttribute('src')) {
            frame.addEventListener('load', syncEmbeddedPage);
            frame.src = '../Staffing/index.html#staffing';
        } else if (isStaffing) {
            syncEmbeddedPage();
        }
    }

    window.addEventListener('hashchange', syncRoute);
    syncRoute();
})();