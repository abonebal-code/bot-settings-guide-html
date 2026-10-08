/* ═══════════════════════════════════════════════════
   typewriter.js — Animated typewriter for hero titles
   ═══════════════════════════════════════════════════ */
const Typewriter = (() => {
  let idx      = 0;
  let charIdx  = 0;
  let deleting = false;
  let timer    = null;

  function init() { _tick(); }

  function restart() {
    clearTimeout(timer);
    idx = 0; charIdx = 0; deleting = false;
    const el = document.getElementById('tw-text');
    if (el) el.textContent = '';
    _tick();
  }

  function _tick() {
    const titles = PROFILE && PROFILE.titles ? PROFILE.titles[Lang.get()] : [];
    const el     = document.getElementById('tw-text');
    if (!el || !titles || titles.length === 0) return;

    const word = titles[idx % titles.length];

    if (!deleting) {
      el.textContent = word.slice(0, ++charIdx);
      if (charIdx === word.length) {
        deleting = true;
        timer = setTimeout(_tick, 2200);
      } else {
        timer = setTimeout(_tick, 80);
      }
    } else {
      el.textContent = word.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        idx++;
        timer = setTimeout(_tick, 320);
      } else {
        timer = setTimeout(_tick, 42);
      }
    }
  }

  return { init, restart };
})();
