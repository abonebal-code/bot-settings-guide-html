/* ═══════════════════════════════════════════════════
   lang.js — Arabic / English language manager
   ═══════════════════════════════════════════════════ */
const Lang = (() => {
  let current = localStorage.getItem('lang') || 'ar';

  function get() { return current; }

  function t(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[current] || obj['ar'] || '';
  }

  function toggle() {
    current = current === 'ar' ? 'en' : 'ar';
    localStorage.setItem('lang', current);
    _applyDir();
    _renderAll();
  }

  function _applyDir() {
    document.documentElement.lang = current;
    // لا نغيّر الـ dir لتجنب تحرّك الـ navbar
    // نترك RTL دائماً للموقع العربي
    // document.documentElement.dir = current === 'ar' ? 'rtl' : 'ltr';
  }

  function _renderAll() {
    // Static [data-ar] / [data-en] elements
    document.querySelectorAll('[data-ar]').forEach(el => {
      el.textContent = current === 'ar' ? el.dataset.ar : (el.dataset.en || el.dataset.ar);
    });
    // Placeholders
    document.querySelectorAll('[data-ar-placeholder]').forEach(el => {
      el.placeholder = current === 'ar'
        ? el.dataset.arPlaceholder
        : (el.dataset.enPlaceholder || el.dataset.arPlaceholder);
    });
    // Update lang button — text only, no icon
    _setBtn('lang-btn',    current === 'ar' ? 'EN' : 'عر');
    _setBtn('nb-lang-btn', current === 'ar' ? 'EN' : 'عر');

    // Notify other modules
    if (typeof Typewriter !== 'undefined') Typewriter.restart();
    if (typeof Render    !== 'undefined') Render.all();
  }

  function _setBtn(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function init() {
    _applyDir();
    _bind('lang-btn');
    _bind('nb-lang-btn');
    _renderAll();
  }

  function _bind(id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', toggle);
  }

  return { get, t, init, toggle };
})();
