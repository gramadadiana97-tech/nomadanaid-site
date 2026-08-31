// Homepage "magazine cover" hero: scales each headline line so it fills the
// available width edge-to-edge (short lines get much bigger type than long
// ones — that's the intended dramatic scale contrast), then lets GSAP play
// a mask-reveal on load. Vanilla sizing logic; GSAP only drives motion.

(function () {
  var MIN_PX = 34;
  var MAX_PX = 230;

  function fitLine(el, targetWidth) {
    if (!targetWidth) return;
    var base = 100;
    el.style.fontSize = base + 'px';
    var natural = el.scrollWidth;
    if (!natural) return;
    var size = (targetWidth / natural) * base;
    size = Math.max(MIN_PX, Math.min(size, MAX_PX));
    el.style.fontSize = size + 'px';
  }

  function fitAll() {
    var headline = document.querySelector('.cover-headline');
    if (!headline) return;
    var target = headline.clientWidth;
    var lines = headline.querySelectorAll('.cover-fit');
    for (var i = 0; i < lines.length; i++) {
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
