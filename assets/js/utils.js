/* ═══════════════════════════════════════════════════
   utils.js — Shared utility functions
   ═══════════════════════════════════════════════════ */
const Utils = (() => {

  /* ── Toast notification ── */
  function toast(msg, color = 'var(--green)') {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.style.color       = color;
    el.style.borderColor = color === 'var(--green)'
      ? 'rgba(87,242,135,.35)'
      : 'rgba(138,43,226,.35)';
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  /* ── Copy to clipboard ── */
  function copy(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = '✅ ' + (Lang.get() === 'ar' ? 'تم' : 'Done');
        btn.classList.add('copied');
        setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('copied'); }, 1800);
      }
      toast('✅ ' + (Lang.get() === 'ar' ? 'تم النسخ!' : 'Copied!'));
    }).catch(() => toast('❌ Failed', 'var(--red)'));
  }

  /* ── Counter animation ── */
  function animateCounter(el, target, suffix = '') {
    const step  = Math.max(1, Math.floor(target / 38));
    let cur = 0;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { clearInterval(t); el.textContent = target + suffix; return; }
      el.textContent = Math.floor(cur) + suffix;
    }, 28);
  }

  /* ── Scroll to section (fullpage) ── */
  function scrollTo(sectionId) {
    if (typeof FullPage !== 'undefined') FullPage.goTo(sectionId);
  }

  /* ── Observe reveal elements ── */
  function observeReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 75);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
  }

  return { toast, copy, animateCounter, scrollTo, observeReveal };
})();
