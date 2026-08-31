// NOMADANAID — functional + motion JS
// Motion is restrained on purpose: scroll reveals, a hero reel parallax,
// and a cursor-linked preview on the work list. No decorative/ambient effects.

document.addEventListener('DOMContentLoaded', () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initYear();
  initNavToggle();
  initScrollReveal(prefersReduced);
  initHeroParallax(prefersReduced);
  initWorkPreview(prefersReduced);
  initSpreadInteractions(prefersReduced);
});

function initYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scroll-triggered reveal: elements rise + fade as they enter the viewport,
// staggered within any wrapper marked [data-stagger].
function initScrollReveal(prefersReduced) {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  revealEls.forEach((el) => {
    const group = el.closest('[data-stagger]');
    if (group) {
      const siblings = Array.from(group.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(el);
      el.style.setProperty('--reveal-delay', `${idx * 0.08}s`);
    }
  });

  if (prefersReduced) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  revealEls.forEach((el) => io.observe(el));
}

// Subtle scale/drift on the hero reel tied to scroll position — not a fixed
// autoplaying animation, it only moves in response to the user scrolling.
function initHeroParallax(prefersReduced) {
  const reel = document.querySelector('[data-parallax]');
  if (!reel || prefersReduced) return;

  let ticking = false;

  const update = () => {
    const rect = reel.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1);
    const scale = 1 + progress * 0.08;
    const drift = (progress - 0.5) * -18;
    reel.style.transform = `scale(${scale}) translateY(${drift}px)`;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  update();
}

// Cursor-linked preview on the work list: a small panel follows the pointer
// (eased, not 1:1) and shows a muted preview clip for the hovered project.
// Falls back to a labeled placeholder when no preview clip is set yet.
// Skipped entirely on touch devices and under reduced-motion.
function initWorkPreview(prefersReduced) {
  const rows = document.querySelectorAll('.work-row');
  if (!rows.length || prefersReduced) return;

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canHover) return;

  document.body.classList.add('has-cursor-preview');

  const panel = document.createElement('div');
  panel.className = 'work-preview';
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML =
    '<div class="work-preview-media">' +
    '<video muted loop playsinline></video>' +
    '<span class="work-preview-fallback"></span>' +
    '</div>' +
    '<span class="work-preview-label"></span>';
  document.body.appendChild(panel);

  const video = panel.querySelector('video');
  const fallback = panel.querySelector('.work-preview-fallback');
  const label = panel.querySelector('.work-preview-label');

  let mouseX = 0;
  let mouseY = 0;
  let panelX = 0;
  let panelY = 0;

  const lerp = (a, b, n) => (1 - n) * a + n * b;

  const raf = () => {
    panelX = lerp(panelX, mouseX, 0.16);
    panelY = lerp(panelY, mouseY, 0.16);
    panel.style.transform = `translate(${panelX}px, ${panelY}px)`;
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX + 26;
    mouseY = e.clientY + 26;
  });

  rows.forEach((row) => {
    const src = row.dataset.previewVideo;
    const title = row.dataset.previewLabel || row.querySelector('.work-title')?.textContent.trim() || '';

    row.addEventListener('mouseenter', () => {
      label.textContent = title ? `View — ${title}` : 'View project';

      if (src) {
        video.src = src;
        video.style.display = 'block';
        fallback.style.display = 'none';
        video.play().catch(() => {});
      } else {
        video.removeAttribute('src');
        video.style.display = 'none';
        fallback.style.display = 'flex';
        fallback.textContent = 'Preview coming soon';
      }
      panel.classList.add('is-active');
    });

    row.addEventListener('mouseleave', () => {
      panel.classList.remove('is-active');
      video.pause();
    });
  });
}

// Editorial "spread" work items (homepage): the preview plays inline inside
// the block itself (imagery is already large), plus a small "View" cursor
// pill replaces the pointer while hovering a spread. No floating thumbnail
// panel here — that pattern belongs to the compact list view on work.html.
function initSpreadInteractions(prefersReduced) {
  const spreads = document.querySelectorAll('.spread');
  if (!spreads.length) return;

  spreads.forEach((spread) => {
    const src = spread.dataset.previewVideo;
    const video = spread.querySelector('.spread-video');
    if (!src || !video) return;

    spread.addEventListener('mouseenter', () => {
      video.src = src;
      video.play().catch(() => {});
      video.classList.add('is-visible');
    });
    spread.addEventListener('mouseleave', () => {
      video.classList.remove('is-visible');
      video.pause();
    });
  });

  if (prefersReduced) return;

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canHover) return;

  document.body.classList.add('has-spread-cursor');

  const pill = document.createElement('div');
  pill.className = 'cursor-pill';
  pill.textContent = 'View';
  pill.setAttribute('aria-hidden', 'true');
  document.body.appendChild(pill);

  let mouseX = 0;
  let mouseY = 0;
  let pillX = 0;
  let pillY = 0;

  const lerp = (a, b, n) => (1 - n) * a + n * b;

  const raf = () => {
    pillX = lerp(pillX, mouseX, 0.18);
    pillY = lerp(pillY, mouseY, 0.18);
    pill.style.transform = `translate(${pillX}px, ${pillY}px) translate(-50%, -50%)`;
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  spreads.forEach((spread) => {
    spread.addEventListener('mouseenter', () => pill.classList.add('is-active'));
    spread.addEventListener('mouseleave', () => pill.classList.remove('is-active'));
  });
}
