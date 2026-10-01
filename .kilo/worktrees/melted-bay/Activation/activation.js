(() => {
  const cards = [...document.querySelectorAll('.activation-capability-card')];
  const captionCards = cards.filter((card) => [0, 4, 5, 6].includes(Number(card.dataset.index)));
  const map = document.querySelector('.activation-map');
  const core = document.querySelector('.activation-core-wrap');
  const dot = document.querySelector('.activation-orbit-dot');
  const blob = document.getElementById('blobPath');
  if (!cards.length || !map || !core || !dot || !blob) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointCount = 72;
  const fullTurn = Math.PI * 2;
  let hoveredCard = null;
  let focusedCard = null;
  let touchedCard = null;
  let activeCard = null;
  let autoCard = null;
  let autoTimer = 0;
  let animationFrame = 0;

  function layoutCards() {
    // Measure the original card sizes so widening captions does not move the orbit.
    captionCards.forEach((card) => card.style.removeProperty('width'));
    // Balance three tilted cards on either side and one below the core.
    // Keep readable stacked cards on phones.
    if (window.matchMedia('(max-width: 600px)').matches) {
      map.style.removeProperty('--core-x');
      map.style.removeProperty('--core-y');
      cards.forEach((card) => {
        card.style.removeProperty('left');
        card.style.removeProperty('top');
      });
      return;
    }
    const circleOrder = [6, 5, 4, 3, 2, 1, 0].map((index) => cards.find((card) => Number(card.dataset.index) === index)).filter(Boolean);
    const angles = [-45, 0, 32, 90, 148, 180, 225].map((degrees) => (degrees * Math.PI) / 180);
    const xs = angles.map(Math.cos);
    const ys = angles.map(Math.sin);
    const minX = Math.min(...xs),
      maxX = Math.max(...xs);
    const minY = Math.min(...ys),
      maxY = Math.max(...ys);
    // Reserve room for both the tilted resting card and its enlarged hover state.
    const cardBounds = cards.map((card) => {
      const style = getComputedStyle(card);
      const scale = Number.parseFloat(style.getPropertyValue('--active-scale')) || 1.12;
      const angle = ((Math.abs(Number.parseFloat(style.getPropertyValue('--rot')) || 0) + 1.6) * Math.PI) / 180;
      const cosine = Math.abs(Math.cos(angle));
      const sine = Math.abs(Math.sin(angle));
      const width = card.offsetWidth,
        height = card.offsetHeight;
      return {
        width: (width * cosine + height * sine) * scale,
        height: (width * sine + height * cosine) * scale,
      };
    });
    const cardWidth = Math.max(...cardBounds.map((bounds) => bounds.width));
    const cardHeight = Math.max(...cardBounds.map((bounds) => bounds.height));
    const inset = 12;
    const radius = Math.max(
      0,
      Math.min((map.clientWidth - cardWidth - inset * 2) / (maxX - minX), (map.clientHeight - cardHeight - inset * 2) / (maxY - minY)),
    );
    const radiusY = Math.max(radius, Math.min(radius * 1.2, (map.clientHeight - cardHeight - inset * 2) / (maxY - minY)));
    const centerX = (map.clientWidth - (maxX + minX) * radius) / 2;
    const centerY = (map.clientHeight - (maxY + minY) * radiusY) / 2;
    map.style.setProperty('--core-x', `${centerX.toFixed(2)}px`);
    map.style.setProperty('--core-y', `${centerY.toFixed(2)}px`);
    circleOrder.forEach((card, index) => {
      card.style.left = `${(centerX + xs[index] * radius).toFixed(2)}px`;
      card.style.top = `${(centerY + ys[index] * radiusY).toFixed(2)}px`;
    });
    captionCards.forEach((card) => {
      const copy = card.querySelector('.activation-capability-description');
      const overflow = copy.scrollWidth - copy.clientWidth;
      if (overflow <= 0) return;
      const extraWidth = Math.ceil(overflow) + 2;
      const direction = Number(card.dataset.index) === 0 ? -1 : 1;
      const style = getComputedStyle(card);
      const rotation =
        (((Number.parseFloat(style.getPropertyValue('--rot')) || 0) + (Number.parseFloat(style.getPropertyValue('--sway-angle')) || 0)) *
          Math.PI) /
        180;
      const shift = (direction * extraWidth) / 2;
      // Extend away from the core while keeping the inner edge in place.
      card.style.width = `${card.offsetWidth + extraWidth}px`;
      card.style.left = `${parseFloat(card.style.left) + Math.cos(rotation) * shift}px`;
      card.style.top = `${parseFloat(card.style.top) + Math.sin(rotation) * shift}px`;
    });
  }

  // Each lobe breathes independently and picks a new location only when fully
  // retracted, so its direction changes without snapping the visible outline.
  const lobes = Array.from({ length: 4 }, (_, index) => ({
    angle: -Math.PI / 2 + (index * fullTurn) / 4,
    phase: [0.42, 0.12, 0.64, 0.83][index],
    duration: 3.4 + Math.random() * 2.2,
    amplitude: 64 + Math.random() * 22,
    width: 0.28 + Math.random() * 0.12,
  }));
  let lastFrameTime = 0;
  let pageActive = true;
  // Blend a separate pull around the outline: rapid hover changes retract the
  // old tip while growing the new one, without restarting the organic motion.
  const pullShape = new Float64Array(pointCount);
  const targetPull = new Float64Array(pointCount);
  let driftTime = 0;

  function resetLobe(lobe) {
    // Space peaks apart while allowing new peaks anywhere around the perimeter.
    for (let attempt = 0; attempt < 24; attempt++) {
      const angle = Math.random() * fullTurn;
      if (
        lobes.every((other) => other === lobe || Math.abs(Math.atan2(Math.sin(angle - other.angle), Math.cos(angle - other.angle))) > 0.85)
      ) {
        lobe.angle = angle;
        break;
      }
    }
    lobe.duration = 3.4 + Math.random() * 2.2;
    lobe.amplitude = 64 + Math.random() * 22;
    lobe.width = 0.28 + Math.random() * 0.12;
  }

  function shapeFor() {
    const sway = Math.sin(driftTime * 0.75) * 0.045;
    return Array.from({ length: pointCount }, (_, index) => {
      const theta = (index / pointCount) * fullTurn;
      let radius = 118 + 5 * Math.sin(theta * 3 + 0.4) + 3 * Math.cos(theta * 5 - 0.7);
      let breathing = 0;
      lobes.forEach((lobe) => {
        const offset = theta - lobe.angle - sway;
        const difference = Math.atan2(Math.sin(offset), Math.cos(offset));
        const pulse = Math.sin(Math.PI * lobe.phase) ** 2;
        breathing += lobe.amplitude * pulse * Math.exp(-((difference / lobe.width) ** 2));
      });
      radius += breathing * (1 - 0.85 * Math.min(1, pullShape[index] / 40)) + pullShape[index];
      return { x: 200 + Math.cos(theta) * radius, y: 200 + Math.sin(theta) * radius };
    });
  }

  function drawShape(points) {
    const middle = (a, b) => `${((a.x + b.x) / 2).toFixed(2)},${((a.y + b.y) / 2).toFixed(2)}`;
    let path = `M${middle(points[points.length - 1], points[0])}`;
    points.forEach((point, index) => {
      path += ` Q${point.x.toFixed(2)},${point.y.toFixed(2)} ${middle(point, points[(index + 1) % points.length])}`;
    });
    blob.setAttribute('d', `${path} Z`);
  }

  function animateBlob(now) {
    const elapsed = lastFrameTime ? Math.min((now - lastFrameTime) / 1000, 0.064) : 0;
    lastFrameTime = now;
    driftTime += elapsed;
    const blend = 1 - Math.exp(-elapsed * 7);
    pullShape.forEach((value, index) => {
      pullShape[index] = value + (targetPull[index] - value) * blend;
    });
    lobes.forEach((lobe) => {
      lobe.phase += elapsed / lobe.duration;
      if (lobe.phase >= 1) {
        lobe.phase -= 1;
        resetLobe(lobe);
      }
    });
    drawShape(shapeFor());
    animationFrame = requestAnimationFrame(animateBlob);
  }

  function syncBlobAnimation() {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    lastFrameTime = 0;
    if (pageActive && !document.hidden && !reducedMotion.matches) {
      animationFrame = requestAnimationFrame(animateBlob);
    }
  }

  function aimAt(card) {
    // Offset positions stay stable while a card rotates and scales.
    const center = { x: core.offsetLeft, y: core.offsetTop };
    if (!card) {
      core.style.setProperty('--pull-x', '0px');
      core.style.setProperty('--pull-y', '0px');
      dot.style.left = `${center.x}px`;
      dot.style.top = `${center.y}px`;
      setPullTarget();
      return;
    }
    const dx = card.offsetLeft - center.x;
    const dy = card.offsetTop - center.y;
    const distance = Math.hypot(dx, dy) || 1;
    const angle = Math.atan2(dy, dx);
    const pull = Math.min(16, core.offsetWidth * 0.045);
    core.style.setProperty('--pull-x', `${Math.cos(angle) * pull}px`);
    core.style.setProperty('--pull-y', `${Math.sin(angle) * pull}px`);
    // Center the foreground droplet on the enlarged card edge.
    const cardStyle = getComputedStyle(card);
    const cardScale = Number.parseFloat(cardStyle.getPropertyValue('--active-scale')) || 1.12;
    const rotation =
      (((Number.parseFloat(cardStyle.getPropertyValue('--rot')) || 0) +
        (Number.parseFloat(cardStyle.getPropertyValue('--sway-angle')) || 0)) *
        Math.PI) /
      180;
    const localX = Math.cos(angle - rotation);
    const localY = Math.sin(angle - rotation);
    const edgeDistance = Math.min(
      (card.offsetWidth * cardScale) / 2 / Math.max(Math.abs(localX), 0.001),
      (card.offsetHeight * cardScale) / 2 / Math.max(Math.abs(localY), 0.001),
    );
    const travel = Math.max(0, distance - edgeDistance);
    dot.style.left = `${center.x + (dx / distance) * travel}px`;
    dot.style.top = `${center.y + (dy / distance) * travel}px`;
    // Convert the distance to the card rim into the SVG's 400-unit coordinate
    // space. Leave a small gap before the foreground droplet.
    const reach = Math.max(160, Math.min(300, ((travel - pull - dot.offsetWidth / 2 - 6) * 400) / core.offsetWidth));
    setPullTarget(angle, reach - 118);
  }

  function setPullTarget(angle = 0, strength = 0) {
    targetPull.forEach((_, index) => {
      const theta = (index / pointCount) * fullTurn;
      const difference = Math.atan2(Math.sin(theta - angle), Math.cos(theta - angle));
      targetPull[index] = strength * Math.exp(-((difference / 0.34) ** 2));
    });
    if (reducedMotion.matches) {
      pullShape.set(targetPull);
      drawShape(shapeFor());
    }
  }

  function scheduleAutoSelection() {
    window.clearTimeout(autoTimer);
    if (!pageActive || document.hidden || reducedMotion.matches || hoveredCard || focusedCard || touchedCard) return;
    autoTimer = window.setTimeout(() => {
      // Screen-space angles increase clockwise. Recompute after responsive
      // layout changes, and continue from the card the user last interacted with.
      const clockwiseAngle = (card) =>
        (Math.atan2(card.offsetTop - core.offsetTop, card.offsetLeft - core.offsetLeft) + Math.PI / 2 + fullTurn) % fullTurn;
      const orderedCards = [...cards].sort((a, b) => clockwiseAngle(a) - clockwiseAngle(b));
      const currentIndex = orderedCards.indexOf(activeCard);
      autoCard = orderedCards[(currentIndex + 1) % orderedCards.length];
      updateActiveCard();
    }, 3000);
  }

  function updateActiveCard() {
    const nextCard = hoveredCard || focusedCard || touchedCard || autoCard;
    if (nextCard !== activeCard) {
      activeCard = nextCard;
      autoCard = nextCard;
      cards.forEach((card) => card.classList.toggle('state-active', card === activeCard));
      map.classList.toggle('state-has-active', Boolean(activeCard));
      aimAt(activeCard);
    }
    // Restart a full three-second interval after manual interaction ends.
    scheduleAutoSelection();
  }

  cards.forEach((card) => {
    card.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'touch') return;
      hoveredCard = card;
      touchedCard = null;
      updateActiveCard();
    });
    card.addEventListener('pointerleave', () => {
      if (hoveredCard === card) hoveredCard = null;
      updateActiveCard();
    });
    card.addEventListener('focus', () => {
      if (card.matches(':focus-visible')) {
        focusedCard = card;
        updateActiveCard();
      }
    });
    card.addEventListener('blur', () => {
      if (focusedCard === card) focusedCard = null;
      updateActiveCard();
    });
    card.addEventListener('click', (event) => {
      touchedCard = event.pointerType === 'touch' && touchedCard !== card ? card : null;
      updateActiveCard();
    });
  });

  document.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.activation-capability-card')) return;
    touchedCard = null;
    focusedCard = null;
    updateActiveCard();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    hoveredCard = focusedCard = touchedCard = autoCard = null;
    if (document.activeElement?.matches('.activation-capability-card')) document.activeElement.blur();
    updateActiveCard();
  });

  // Refit the circle on resize without changing the current card or animation.
  const observer = new ResizeObserver(() => {
    layoutCards();
    if (activeCard) aimAt(activeCard);
    else {
      dot.style.left = `${core.offsetLeft}px`;
      dot.style.top = `${core.offsetTop}px`;
    }
  });
  observer.observe(map);
  document.fonts?.ready.then(() => {
    layoutCards();
    if (activeCard) aimAt(activeCard);
  });
  reducedMotion.addEventListener('change', () => {
    aimAt(activeCard);
    syncBlobAnimation();
    scheduleAutoSelection();
  });
  document.addEventListener('visibilitychange', () => {
    syncBlobAnimation();
    scheduleAutoSelection();
  });
  window.addEventListener('pagehide', () => {
    pageActive = false;
    syncBlobAnimation();
    window.clearTimeout(autoTimer);
  });
  window.addEventListener('pageshow', () => {
    pageActive = true;
    syncBlobAnimation();
    scheduleAutoSelection();
  });
  layoutCards();
  drawShape(shapeFor());
  syncBlobAnimation();
  scheduleAutoSelection();
})();
