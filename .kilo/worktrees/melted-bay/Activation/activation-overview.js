(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const scrollBehavior = () => (reducedMotion.matches ? 'instant' : 'smooth');

  // Follow the visible tab order from left to right.
  const flow = document.getElementById('activation-flow');
  const flowCards = [...flow.querySelectorAll('[data-step]')];
  let activeStep = 0;
  let flowTimer = 0;
  let flowVisible = true;

  function stopFlow() {
    window.clearTimeout(flowTimer);
    flowTimer = 0;
  }

  function hasKeyboardFocus() {
    return flow.contains(document.activeElement) && document.activeElement.matches(':focus-visible');
  }

  function selectStep(index) {
    activeStep = index;
    flowCards.forEach((card, cardIndex) => {
      const selected = cardIndex === index;
      card.classList.toggle('state-active', selected);
      card.setAttribute('aria-pressed', String(selected));
      const panel = flow.querySelector(`[data-flow-panel="${card.dataset.step}"]`);
      if (panel) {
        panel.hidden = !selected;
        panel.classList.toggle('state-active', selected);
      }
    });
  }

  function scheduleFlow() {
    stopFlow();
    if (reducedMotion.matches || document.hidden || !flowVisible || hasKeyboardFocus()) return;
    flowTimer = window.setTimeout(() => {
      selectStep((activeStep + 1) % flowCards.length);
      scheduleFlow();
    }, 3000);
  }

  flowCards.forEach((card, index) => {
    card.addEventListener('pointerenter', () => {
      selectStep(index);
      scheduleFlow();
    });
    card.addEventListener('focus', () => {
      selectStep(index);
      scheduleFlow();
    });
    card.addEventListener('click', () => {
      selectStep(index);
      scheduleFlow();
    });
  });
  flow.addEventListener('focusout', () => window.setTimeout(scheduleFlow, 0));
  document.addEventListener('visibilitychange', scheduleFlow);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      (entries) => {
        flowVisible = entries[0].isIntersecting;
        scheduleFlow();
      },
      { threshold: 0.1 },
    ).observe(flow);
  }
  selectStep(0);
  scheduleFlow();

  // Let normal document scrolling drive the list while the menu/banner stay pinned.
  // No wheel interception: the page naturally continues to the footer at the last card.
  const catalog = document.getElementById('feature-catalog');
  const featureList = catalog.querySelector('.overview-feature-list');
  const menu = catalog.querySelector('.overview-feature-menu-links');
  const menuLinks = [...menu.querySelectorAll('a[href^="#"]')];
  const articles = [...featureList.querySelectorAll('.overview-feature-card')];
  const sceneQuery = window.matchMedia('(min-width: 1001px) and (min-height: 660px)');
  let sceneEnabled = false;
  let sceneStart = 0;
  let sceneRange = 0;
  let frame = 0;
  let measureFrame = 0;
  let requestedId = '';
  let currentId = '';

  function markCurrent(id) {
    if (currentId === id) return;
    currentId = id;
    menuLinks.forEach((link) => {
      const selected = link.hash === '#' + id;
      link.classList.toggle('state-active', selected);
      if (selected) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (!sceneEnabled && window.innerWidth <= 1000) {
      const link = menuLinks.find((item) => item.hash === '#' + id);
      if (link) {
        const edge = link.offsetLeft - menu.offsetLeft;
        if (edge < menu.scrollLeft || edge + link.offsetWidth > menu.scrollLeft + menu.clientWidth) {
          menu.scrollTo({ left: edge - 10, behavior: scrollBehavior() });
        }
      }
    }
  }

  function updateCatalog() {
    frame = 0;
    let selected = articles[0];
    if (sceneEnabled) {
      const progress = clamp(window.scrollY - sceneStart, 0, sceneRange);
      featureList.scrollTop = progress;
      const readingLine = progress + 84;
      for (const article of articles) {
        if (article.offsetTop <= readingLine) selected = article;
      }
      if (sceneRange > 0 && progress >= sceneRange - 2) selected = articles[articles.length - 1];
    } else {
      const readingLine = window.innerWidth <= 1000 ? 155 : 100;
      for (const article of articles) {
        if (article.getBoundingClientRect().top <= readingLine) selected = article;
      }
    }
    markCurrent(requestedId || selected.id);
  }

  function queueUpdate() {
    if (!frame) frame = window.requestAnimationFrame(updateCatalog);
  }

  function measureCatalog() {
    measureFrame = 0;
    sceneEnabled = sceneQuery.matches;
    catalog.classList.toggle('state-scroll-scene', sceneEnabled);
    if (sceneEnabled) {
      sceneRange = Math.max(0, featureList.scrollHeight - featureList.clientHeight);
      catalog.style.setProperty('--feature-scroll-range', sceneRange + 'px');
      const top = parseFloat(window.getComputedStyle(catalog).getPropertyValue('--scene-top')) || 20;
      sceneStart = catalog.getBoundingClientRect().top + window.scrollY - top;
    } else {
      catalog.style.removeProperty('--feature-scroll-range');
      featureList.scrollTop = 0;
      sceneRange = 0;
    }
    updateCatalog();
  }

  function queueMeasure() {
    if (!measureFrame) measureFrame = window.requestAnimationFrame(measureCatalog);
  }

  function navigateToFeature(id, behavior = scrollBehavior()) {
    const article = articles.find((item) => item.id === id);
    if (!article) return;
    requestedId = id;
    markCurrent(id);
    if (sceneEnabled) {
      window.scrollTo({ top: sceneStart + clamp(article.offsetTop - 12, 0, sceneRange), behavior });
    } else {
      const offset = window.innerWidth <= 1000 ? 128 : 24;
      window.scrollTo({ top: article.getBoundingClientRect().top + window.scrollY - offset, behavior });
    }
  }

  menuLinks.forEach((link) =>
    link.addEventListener('click', (event) => {
      event.preventDefault();
      navigateToFeature(link.hash.slice(1));
      // Hash navigation also works when this page is opened directly from disk.
      try {
        window.history.replaceState(null, '', link.hash);
      } catch (_) {
        /* Keep navigation usable on restricted file URLs. */
      }
    }),
  );

  const clearRequested = () => {
    requestedId = '';
    queueUpdate();
  };
  window.addEventListener('wheel', clearRequested, { passive: true });
  window.addEventListener('touchstart', clearRequested, { passive: true });
  window.addEventListener(
    'pointerdown',
    (event) => {
      if (!menu.contains(event.target)) clearRequested();
    },
    { passive: true },
  );
  window.addEventListener('keydown', (event) => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) clearRequested();
  });
  // An overflow-hidden list can receive keyboard focus; forward its scroll keys to the page.
  featureList.addEventListener('keydown', (event) => {
    if (!sceneEnabled || event.target !== featureList) return;
    const page = featureList.clientHeight * 0.8;
    const deltas = { ArrowDown: 60, ArrowUp: -60, PageDown: page, PageUp: -page, ' ': event.shiftKey ? -page : page };
    if (Object.prototype.hasOwnProperty.call(deltas, event.key)) {
      event.preventDefault();
      window.scrollBy({ top: deltas[event.key], behavior: scrollBehavior() });
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      window.scrollTo({ top: event.key === 'Home' ? sceneStart : sceneStart + sceneRange, behavior: scrollBehavior() });
    }
  });

  window.addEventListener('scroll', queueUpdate, { passive: true });
  window.addEventListener('resize', queueMeasure, { passive: true });
  sceneQuery.addEventListener('change', queueMeasure);
  reducedMotion.addEventListener('change', () => {
    scheduleFlow();
    queueMeasure();
  });
  window.addEventListener('hashchange', () => navigateToFeature(window.location.hash.slice(1)));
  if ('ResizeObserver' in window) {
    const sizeObserver = new ResizeObserver(queueMeasure);
    sizeObserver.observe(document.querySelector('.overview-hero'));
    sizeObserver.observe(catalog.querySelector('.overview-feature-banner'));
    articles.forEach((article) => sizeObserver.observe(article));
  }

  measureCatalog();
  const ready = document.fonts ? document.fonts.ready : Promise.resolve();
  ready.then(() => {
    measureCatalog();
    if (window.location.hash) navigateToFeature(window.location.hash.slice(1), 'instant');
  });

  document.querySelectorAll('[data-open-dialog]').forEach((button) => {
    button.addEventListener('click', () => {
      const dialog = document.getElementById(button.dataset.openDialog);
      if (!dialog) return;
      dialog.showModal();
      document.body.classList.add('state-dialog-open');
    });
  });
  document.querySelectorAll('.overview-dialog').forEach((dialog) => {
    dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)
        dialog.close();
    });
    dialog.addEventListener('close', () => {
      if (!document.querySelector('dialog[open]')) document.body.classList.remove('state-dialog-open');
      queueMeasure();
    });
  });
})();
