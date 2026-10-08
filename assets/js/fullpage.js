/* ═══════════════════════════════════════════════════
   fullpage.js — Full-page panel navigation system
   ═══════════════════════════════════════════════════ */
const FullPage = (() => {
  const PANELS = ['hero', 'about', 'projects', 'services', 'contact'];
  let current   = 0;
  let animating = false;
  const ANIM_MS = 420;

  // ── init ──────────────────────────────────────────
  function init() {
    _buildDotNav();

    // Show first panel immediately (no animation)
    _applyPanel(0);
    _syncNav('hero');
    _updateDotNav(0);
    _updateArrows();

    // Wheel
    let wheelLock = false;
    window.addEventListener('wheel', e => {
      if (wheelLock) return;
      wheelLock = true;
      setTimeout(() => { wheelLock = false; }, ANIM_MS + 80);
      if (e.deltaY > 20)  _navigate(1);
      if (e.deltaY < -20) _navigate(-1);
    }, { passive: true });

    // Touch
    let ty = 0;
    window.addEventListener('touchstart', e => { ty = e.touches[0].clientY; }, { passive: true });
    window.addEventListener('touchend',   e => {
      const diff = ty - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 50) return;
      diff > 0 ? _navigate(1) : _navigate(-1);
    }, { passive: true });

    // Keyboard
    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); _navigate(1);  }
      if (e.key === 'ArrowUp'   || e.key === 'PageUp'  ) { e.preventDefault(); _navigate(-1); }
    });

    // Arrow buttons
    const up   = document.getElementById('arrow-up');
    const down = document.getElementById('arrow-down');
    if (up)   up.addEventListener('click',   () => _navigate(-1));
    if (down) down.addEventListener('click', () => _navigate(1));
  }

  // ── public: go to specific section by name ────────
  function goTo(sectionId) {
    const idx = PANELS.indexOf(sectionId);
    if (idx === -1) return;
    if (idx === current) return;
    const dir = idx > current ? 'down' : 'up';
    current = idx;
    _animate(idx, dir);
  }

  // ── internal navigate by delta (+1/-1) ───────────
  function _navigate(delta) {
    if (animating) return;
    const next = current + delta;
    if (next < 0 || next >= PANELS.length) return;
    const dir = delta > 0 ? 'down' : 'up';
    current = next;
    _animate(current, dir);
  }

  // ── show panel immediately (no transition) ────────
  function _applyPanel(idx) {
    document.querySelectorAll('.panel').forEach(p => {
      p.classList.remove('active', 'enter-below', 'enter-above');
      p.style.transition = 'none';
    });
    const target = document.querySelector(`.panel[data-panel="${PANELS[idx]}"]`);
    if (!target) return;
    target.classList.add('active');
    target.scrollTop = 0;
    // restore transitions
    requestAnimationFrame(() => {
      document.querySelectorAll('.panel').forEach(p => p.style.transition = '');
    });
    // trigger reveals immediately
    setTimeout(() => {
      target.querySelectorAll('.reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 70);
      });
    }, 50);
  }

  // ── animated transition ───────────────────────────
  function _animate(idx, dir) {
    animating = true;

    // Remove active from all
    document.querySelectorAll('.panel').forEach(p => {
      p.classList.remove('active', 'enter-below', 'enter-above');
    });

    const target = document.querySelector(`.panel[data-panel="${PANELS[idx]}"]`);
    if (!target) { animating = false; return; }

    // Set start position
    target.classList.add(dir === 'down' ? 'enter-below' : 'enter-above');

    // Force reflow
    void target.offsetHeight;

    // Activate
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        target.classList.add('active');
        target.classList.remove('enter-below', 'enter-above');
        target.scrollTop = 0;
      });
    });

    _syncNav(PANELS[idx]);
    _updateDotNav(idx);
    _updateArrows();

    // Progress bar
    const pct = PANELS.length > 1 ? idx / (PANELS.length - 1) : 0;
    const bar = document.getElementById('progress-bar');
    if (bar) bar.style.transform = `scaleX(${pct})`;

    // Reveal elements + unlock
    setTimeout(() => {
      target.querySelectorAll('.reveal:not(.visible)').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 70);
      });
      animating = false;
    }, ANIM_MS);
  }

  // ── helpers ───────────────────────────────────────
  function _buildDotNav() {
    const nav = document.getElementById('dot-nav');
    if (!nav) return;
    nav.innerHTML = '';
    PANELS.forEach((id, i) => {
      const d = document.createElement('div');
      d.className     = 'dot-nav-item';
      d.dataset.label = _label(id);
      d.addEventListener('click', () => goTo(id));
      nav.appendChild(d);
    });
  }

  function _updateDotNav(idx) {
    document.querySelectorAll('.dot-nav-item').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  }

  function _updateArrows() {
    const up   = document.getElementById('arrow-up');
    const down = document.getElementById('arrow-down');
    if (up)   up.disabled   = current === 0;
    if (down) down.disabled = current === PANELS.length - 1;
  }

  function _syncNav(sectionId) {
    document.querySelectorAll('.sb-item[data-section]').forEach(el => {
      el.classList.toggle('active', el.dataset.section === sectionId);
    });
    document.querySelectorAll('.nb-link[data-section]').forEach(el => {
      el.classList.toggle('active', el.dataset.section === sectionId);
    });
  }

  function _label(id) {
    const m = { hero:'الرئيسية', about:'عني', projects:'المشاريع', services:'الخدمات', contact:'التواصل' };
    return m[id] || id;
  }

  return { init, goTo };
})();
