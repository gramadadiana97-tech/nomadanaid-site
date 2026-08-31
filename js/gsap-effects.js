// Optional GSAP-powered enhancements, layered on top of the vanilla
// IntersectionObserver reveal system in main.js (which still runs regardless).
// Loaded only on pages that opt in; fails silently if GSAP didn't load.

document.addEventListener('DOMContentLoaded', () => {
  if (!window.gsap || !window.ScrollTrigger) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  gsap.registerPlugin(ScrollTrigger);

  // Gentle parallax drift on the small tucked homepage photo: scaled up
  // slightly so it has room to travel inside its clipped frame. Only ever
  // touches transform, never opacity, so it can't fight the .reveal fades.
  document.querySelectorAll('.hero-photo img').forEach((img) => {
    const wrap = img.closest('.hero-photo');
    gsap.set(img, { scale: 1.14, transformOrigin: 'center center' });
    gsap.fromTo(
      img,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });

  // Case study right rail: each image/video reveals independently as it
  // scrolls into view, since the column runs the full length of the page
  // on its own rhythm (not tied to the text column's height).
  document.querySelectorAll('.case-col-images .case-img').forEach((fig) => {
    gsap.from(fig, {
      opacity: 0,
      y: 36,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: fig,
        start: 'top 92%',
      },
    });
  });
});
