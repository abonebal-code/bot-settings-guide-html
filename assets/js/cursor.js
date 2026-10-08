/* ═══════════════════════════════════════════════════
   cursor.js — Custom cursor (zero-lag, no RAF)
   ═══════════════════════════════════════════════════ */
const Cursor = (() => {
  const HOVER_TARGETS = [
    'a', 'button', '.btn', '.nb-link', '.nb-btn',
    '.sb-item', '.sb-ctrl-btn', '.sb-toggle',
    '.proj-card', '.service-card', '.contact-card',
    '.skill-badge', '.copy-btn', '.vbtn',
    '.dot-nav-item', '.panel-arrow'
  ].join(',');

  function init() {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    // Show cursor on first move
    let shown = false;

    document.addEventListener('mousemove', e => {
      dot.style.left  = e.clientX + 'px';
      dot.style.top   = e.clientY + 'px';
      ring.style.left = e.clientX + 'px';
      ring.style.top  = e.clientY + 'px';

      if (!shown) {
        dot.classList.add('visible');
        ring.classList.add('visible');
        shown = true;
      }
    }, { passive: true });

    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

    // Hide when leaving window
    document.addEventListener('mouseleave', () => {
      dot.classList.remove('visible');
      ring.classList.remove('visible');
      shown = false;
    });
    document.addEventListener('mouseenter', () => {
      if (shown) {
        dot.classList.add('visible');
        ring.classList.add('visible');
      }
    });

    // Hover detection
    document.addEventListener('mouseover', e => {
      if (e.target.closest(HOVER_TARGETS)) document.body.classList.add('cursor-hover');
    }, { passive: true });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(HOVER_TARGETS)) document.body.classList.remove('cursor-hover');
    }, { passive: true });
  }

  return { init };
})();
