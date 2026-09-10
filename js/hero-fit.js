// Homepage "magazine cover" hero: scales each headline line so it fills the
// available width edge-to-edge (short lines get much bigger type than long
// ones — that's the intended dramatic scale contrast), then lets GSAP play
// a mask-reveal on load. Vanilla sizing logic; GSAP only drives motion.

(function () {
  // Below this width the lines are wrapped by CSS instead of fitted here —
  // a single nowrap line of "AND AI VIDEO ... PRODUCER" can't be both
  // unclipped and readable on a phone. See the matching breakpoint in
  // css/style.css.
  var FIT_MIN_VIEWPORT = 768;
  var MAX_PX = 230;
  // sub-pixel rounding headroom so a fitted line never touches the edge
  var SAFETY_PX = 1;

  function fitLine(el, targetWidth) {
    if (!targetWidth) return;
    var base = 100;
    el.style.fontSize = base + 'px';
    // getBoundingClientRect is sub-pixel; scrollWidth is rounded to an
    // integer and can under-report by up to 1px, which scales up to a
    // visibly clipped last letter at display sizes.
    var natural = Math.max(el.getBoundingClientRect().width, el.scrollWidth);
    if (!natural) return;
    // Pure fit-to-width, with only an upper bound. There is deliberately no
    // lower bound: .cover-line clips with overflow:hidden, so forcing a
    // minimum size would silently cut the end off the line.
    var size = Math.min(((targetWidth - SAFETY_PX) / natural) * base, MAX_PX);
    el.style.fontSize = size + 'px';
  }

  function fitAll() {
    var headline = document.querySelector('.cover-headline');
    if (!headline) return;
    var lines = headline.querySelectorAll('.cover-fit');
    var i;

    if (window.innerWidth < FIT_MIN_VIEWPORT) {
      // Hand sizing back to the stylesheet (and clear anything a previous
      // wider-viewport fit left behind on resize/rotate).
      for (i = 0; i < lines.length; i++) {
        lines[i].style.fontSize = '';
      }
      return;
    }

    var target = headline.clientWidth;
    for (i = 0; i < lines.length; i++) {
      fitLine(lines[i], target);
    }
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, wait);
    };
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.querySelector('.cover-headline')) return;

    fitAll();
    if (window.document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fitAll);
    }
    window.addEventListener('resize', debounce(fitAll, 120));

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (window.gsap && !prefersReduced) {
      gsap.from('.cover-fit', {
        yPercent: 108,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.1,
      });
      gsap.from('.cover-media', {
        opacity: 0,
        scale: 0.5,
        duration: 0.7,
        ease: 'back.out(1.7)',
        stagger: 0.12,
        delay: 0.35,
      });
    }
  });
})();
